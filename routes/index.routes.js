const express = require("express");
const router = express.Router();

//  GET => NOS LLEVA A HOME
router.get("/", (req, res, next) => {
  res.render("index");
});


const vendedorRoutes = require("./user.routes.js")
router.use("/user", vendedorRoutes)




// RUTAS DE PRODUCTOS
const productsRoutes = require("./product.routes.js")
router.use("/product",productsRoutes) 

const authRoutes = require("./auth.routes.js")
router.use("/auth", authRoutes);

module.exports = router;
