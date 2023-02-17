const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


// //RUTAS DE USUARIO
// const usersRoutes = require("./user.routes.js")
// router.use("/user",usersRoutes) 

//RUTAS DE PRODUCTOS
// const productsRoutes = require("./product.routes.js")
// router.use("/product",productsRoutes) 

const authRoutes = require("./auth.routes.js")
router.use("/auth", authRoutes);

module.exports = router;
