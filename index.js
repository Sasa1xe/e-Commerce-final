import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.routes.js";
import { pagesRouter } from "./routes/pages.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { cartRouter } from "./routes/cart.routes.js";
import { checkAuth } from "./middleware/checkAuth.js";
import { ordersRouter } from "./routes/orders.routes.js";

process.loadEnvFile();

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  console.log(new Date().toLocaleString(), req.method, req.url);
  next();
});

//------------Routes---------------
app.use("/auth", authRouter);
app.use("/api/products", checkAuth,productsRouter);
app.use("/api/cart", checkAuth, cartRouter);
app.use("/api/orders", checkAuth, ordersRouter);
app.use(pagesRouter);
//---------------------------------

//HTML Pages
app.use(express.static("pages"));

//------------Error Handler-----------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something Went Wrong" });
});
//------------------------------------

app.listen(3000, () => {
  console.log("listening on port 3000");
});
