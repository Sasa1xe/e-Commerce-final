import express from "express";
import { createDB } from "../db.js";
import { validateBody } from "../middleware/validateBody.js";
import { productSchema } from "../schema/product.schema.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { checkRole } from "../middleware/checkRole.js";

export const productsRouter = express.Router();
const db = createDB();

//get all products
productsRouter.get("/", async (req, res) => {
  const products = await db.getAll("products");

  return res.status(200).json({
    data: products,
  });
});

//get one product by its ID
productsRouter.get("/:id",async (req, res) => {
  const id = req.params.id;
  const product = await db.getById("products", id);

  if (!product) {
    return res.status(404).json({
      error: "product not found",
    });
  }
  return res.status(200).json({ data: product });
});

productsRouter.post(
  "/",
  checkAuth,
  checkRole("merchant"),
  validateBody(productSchema),
  async (req, res) => {
    const created = await db.create("products", req.body);

    return res.status(201).json({
      message: "product created successfully",
      data: created,
    });
  },
);

// Update a Product as a (Merchant)
productsRouter.patch(
  "/:id",
  checkRole("merchant"),
  validateBody(productSchema),
  async (req, res) => {
    const id = req.params.id;
    const product = await db.getById("products", id);

    if (!product) {
      res.status(404).json({
        error: "Product Not Found",
      });
    }

    const newProduct = req.body;
    await db.update("products", id, newProduct);

    res.status(200).json({
      message: "product updated successfully",
      data: newProduct,
    });
  },
);

productsRouter.patch(
  "/:id",
  checkAuth,
  checkRole("merchant"),
  validateBody(productSchema),
  async (req, res) => {
    const id = req.params.id;
    const product = await db.getById("products", id);

    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }

    const updated = await db.update("products", id, req.body);

    return res.status(200).json({
      message: "product updated successfully",
      data: updated,
    });
  }
);

productsRouter.delete(
  "/:id",
  checkAuth,
  checkRole("merchant"),
  async (req, res) => {
    const id = req.params.id;
    const product = await db.getById("products", id);

    if (!product) {
      return res.status(404).json({
        error: "Product Not Found",
      });
    }

    await db.delete("products", id);

    res.status(204).json({
      message: "Product Deleted Successfully",
    });
  },
);
