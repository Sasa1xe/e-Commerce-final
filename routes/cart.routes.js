import express from "express";
import { createDB } from "../db.js";
import { validateBody } from "../middleware/validateBody.js";
import { addItemSchema, updateQuantitySchema } from "../schema/cart.schema.js";
import { checkRole } from "../middleware/checkRole.js";

export const cartRouter = express.Router();

const db = createDB();

const getCart = async (userId) => await db.getOne("carts", { userId });

cartRouter.get("/", checkRole("customer"), async (req, res) => {
  const cart = await getCart(req.user.id);

  if (!cart) {
    return res.status(200).json({ data: { id: null, userId: req.user.id, products: [] } });
  }

  res.status(200).json({ data: cart });
});

cartRouter.post("/", validateBody(addItemSchema), checkRole("customer"), async (req, res) => {
  let cart = await getCart(req.user.id);

  if (!cart) {
    cart = await db.create("carts", { userId: req.user.id, products: [req.body] });
    return res.status(201).json({ message: "product added to cart", data: cart });
  }

  const existing = cart.products.find((p) => p.id === req.body.id);
  let products;
  if (existing) {
    products = cart.products.map((p) =>
      p.id === req.body.id ? { ...p, quantity: p.quantity + req.body.quantity } : p
    );
  } else {
    products = [...cart.products, req.body];
  }

  cart = await db.update("carts", cart.id, { products });
  res.status(201).json({ message: "product added to cart", data: cart });
});

cartRouter.patch("/:productId", validateBody(updateQuantitySchema), checkRole("customer"), async (req, res) => {
  const cart = await getCart(req.user.id);
  if (!cart) return res.status(404).json({ error: "cart not found" });

  const exists = cart.products.some((p) => p.id === req.params.productId);
  if (!exists) return res.status(404).json({ error: "product not in cart" });

  const products = cart.products.map((p) =>
    p.id === req.params.productId ? { ...p, quantity: req.body.quantity } : p
  );

  const updated = await db.update("carts", cart.id, { products });
  res.status(200).json({ message: "cart updated", data: updated });
});

cartRouter.delete("/:productId", checkRole("customer"), async (req, res) => {
  const cart = await getCart(req.user.id);
  if (!cart) return res.status(404).json({ error: "cart not found" });

  const products = cart.products.filter((p) => p.id !== req.params.productId);
  await db.update("carts", cart.id, { products });
  res.status(200).json({ message: "product removed from cart" });
});
