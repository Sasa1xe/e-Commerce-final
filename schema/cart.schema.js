import z from "zod";

export const cartSchema = z.object({
  id: z.string(),
  userId: z.string(),
  products: [
    {
      id: z.string(),
      name: z.string().min(1),
      description: z.string().min(1),
      price: z.number().positive(),
      image: z.string().optional(),
      quantity: z.number().int(),
    },
  ],
});
