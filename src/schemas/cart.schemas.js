import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const cartIdSchema = z.object({
  params: z.object({ cid: objectId }),
});

export const cartProductSchema = z.object({
  params: z.object({
    cid: objectId,
    pid: objectId,
  }),
});

export const updateQuantitySchema = z.object({
  params: z.object({
    cid: objectId,
    pid: objectId,
  }),
  body: z.object({ quantity: z.number().int().positive() }),
});

export const replaceProductsSchema = z.object({
  params: z.object({ cid: objectId }),
  body: z.object({
    products: z.array(
      z.object({
        product: objectId,
        quantity: z.number().int().positive(),
      })
    ),
  }),
});
