import express from "express";
import { createDB } from "../db.js";
  import { validateBody } from "../middleware/validateBody.js";
import { cartSchema } from "../schema/cart.schema.js";
import { checkRole } from "../middleware/checkRole.js";

export const cartRouter = express();

// every cart route needs login + role customer — apply once, covers all below

const db = createDB();

// shared helper — every handler needs "this user's cart", write once, reuse
const getCart = (userId) => db.getOne("carts", { userId });

// GET / — return current user's cart, or empty placeholder if none exists yet
cartRouter.get("/", (req, res) => {
  const cart = getCart(req.user.id);

  if (!cart) {
    return res
      .status(200)
      .json({ data: { id: null, userId: req.user.id, products: [] } });
  }

  res.status(200).json({ data: cart });
});

// POST / — add product to cart (or bump quantity if already in cart)
cartRouter.post("/", validateBody(cartSchema),checkRole("customer"), async (req, res) => {
  let cart = getCart(req.user.id);

  // case 1: no cart yet for this user — create one with this product as first item
  if (!cart) {
    cart = await db.create("carts", {
      userId: req.user.id,
      products: [req.body.products],
    });
    return res
      .status(201)
      .json({ message: "product added to cart", data: { ...cart } });
  }

  // case 2: cart exists — check if this product already in it
  const existing = cart.products.find((p) => p.id === req.body.id);

  let products;
  if (existing) {
    // already in cart — increase quantity on that one item
    products = cart.products.map((p) =>
      p.id === req.body.id
        ? { ...p, quantity: p.quantity + req.body.quantity }
        : p,
    );
  } else {
    // not in cart — append as new item
    products = [...cart.products, req.body];
  }

  // save updated products array back to db
  cart = db.update("carts", cart.id, { products });
  res.status(201).json({ message: "product added to cart", data: cart });
});

// PATCH /:productId — set quantity of one product in cart
cartRouter.patch("/:productId",checkRole("customer") ,(req, res) => {
  const cart = getCart(req.user.id);
  if (!cart) return res.status(404).json({ error: "cart not found" });

  // product must already be in cart to update it
  const exists = cart.products.some((p) => p.id === req.params.productId);
  if (!exists) return res.status(404).json({ error: "product not in cart" });

  // rebuild array, only matching product gets new quantity
  const products = cart.products.map((p) =>
    p.id === req.params.productId ? { ...p, quantity: req.body.quantity } : p,
  );

  const updated = db.update("carts", cart.id, { products });
  res.status(200).json({ message: "cart updated", data: updated });
});

// DELETE /:productId — remove one product from cart
cartRouter.delete("/:productId",checkRole("customer") ,(req, res) => {
  const cart = getCart(req.user.id);
  if (!cart) return res.status(404).json({ error: "cart not found" });

  // rebuild array without the matching product
  const products = cart.products.filter((p) => p.id !== req.params.productId);

  db.update("carts", cart.id, { products });
  res.status(200).json({ message: "product removed from cart" });
});
