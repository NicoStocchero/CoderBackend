import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.number().positive(),
    status: z.boolean(),
    stock: z.number().int().nonnegative(),
    category: z.string().min(1),
    thumbnails: z.array(z.string()).default([]),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({ pid: objectId }),
  body: z
    .object({
      title: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      price: z.number().positive().optional(),
      status: z.boolean().optional(),
      stock: z.number().int().nonnegative().optional(),
      category: z.string().min(1).optional(),
      thumbnails: z.array(z.string()).optional(),
    })
    .refine(
      (b) => Object.keys(b).length > 0,
      "At least one field must be provided"
    ),
});

export const getOrDeleteProductSchema = z.object({
  params: z.object({ pid: objectId }),
});
