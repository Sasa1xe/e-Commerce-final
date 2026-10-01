import express from "express";
import { createDB } from "../db.js";
import { checkRole } from "../middleware/checkRole.js";

export const ordersRouter = express.Router();

// every order route needs login + role customer
const db = createDB();

// GET / — list only this user's orders (filter out everyone else's)
ordersRouter.get("/", checkRole("customer"), async (req, res) => {
  const orders = (await db.getAll("orders")).filter(
    (o) => o.userId === req.user.id,
  );
  res.status(200).json({ data: orders });
});

// POST /checkout — turn current cart into an order, then empty the cart
ordersRouter.post("/checkout", checkRole("customer"), async (req, res) => {
  const cart = await db.getOne("carts", { userId: req.user.id });

  // nothing to check out — block early
  if (!cart || cart.products.length === 0) {
    return res.status(422).json({ error: "cart is empty" });
  }

  // sum price*quantity across all cart itemxs → order total
  const total = cart.products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  // snapshot cart contents into a new order row
  const order = await db.create("orders", {
    userId: req.user.id,
    products: cart.products,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  // wipe cart now that it's been converted to an order
  await db.update("carts", cart.id, { products: [] });

  res.status(201).json({ message: "order placed successfully", data: order });
});
