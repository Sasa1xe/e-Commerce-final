import z from "zod";

export const cartSchema = z.object({
  id: z.string(),
  userId: z.string(),
  products: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1),
      description: z.string().min(1),
      price: z.number().positive(),
      image: z.string().optional(),
      quantity: z.number().int().positive(),
    })
  ),
});

export const addItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  image: z.string().optional(),
  quantity: z.number().int().positive(),
});

export const updateQuantitySchema = z.object({
  quantity: z.number().int().positive(),
});
