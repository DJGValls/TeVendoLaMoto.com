const express = require("express");
const router = express.Router();

const User = require("../models/User.model.js");
const Product = require("../models/Product.model.js")


// GET => renderiza vista de perfil de vendedor
router.get("/perfVendedor" , async(req,res,next)=>{

    const response = await Product.find();
    console.log(response)
    res.render("vendedor/perfil-privado.hbs",{
      allProduct: response
    })
})

// GET "/auth/logout" => cerrar/destruir la sesión del usuario
router.get("/logout", (req, res, next) => {

    req.session.destroy(() => {
      res.redirect("/")
    })
  
})
  


  module.exports = router;