import z from "zod";

export function validateBody(schema) {
  return (req, res, next) => {
    const body = req.body;

    const result = schema.safeParse(body);

    if (result.success) {
      next();
    } else {
      res.status(422).json({
        error: z.treeifyError(result.error).properties,
        // error: result.error?.flatten().fieldErrors, //more easy to read
      });
    }
  };
}