const express = require("express");
const router = express.Router();

const Product = require("../models/Product.model.js");

//  GET => NOS LLEVA A HOME
router.get("/", async (req, res, next) => {
  try {
    const response = await Product.find();

    res.render("index",{
      allProduct: response
    });
  } catch (error) {
    next(error);
  }
});

const vendedorRoutes = require("./user.routes.js");
router.use("/user", vendedorRoutes);

// RUTAS DE PRODUCTOS
const productsRoutes = require("./product.routes.js");
router.use("/product", productsRoutes);

const authRoutes = require("./auth.routes.js");
router.use("/auth", authRoutes);

module.exports = router;
