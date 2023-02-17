const express = require("express");
const router = express.Router();

//  GET => NOS LLEVA A HOME
router.get("/", (req, res, next) => {
  res.render("index");
});


const vendedorRoutes = require("./user.routes.js")
router.use("/user", vendedorRoutes)


const productRoutes = require("./product.routes.js")
router.use("/product", productRoutes)





module.exports = router;
