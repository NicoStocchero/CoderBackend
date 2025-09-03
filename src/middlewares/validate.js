import { ZodError } from "zod";

export const validate = (schema) => async (req, res, next) => {
  try {
    const parsed = await schema.parseAsync({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    req.validated = parsed;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        status: "bad request",
        message: "Validation error",
        errors: err.issues,
      });
    }
    next(err);
  }
};

export default validate;
