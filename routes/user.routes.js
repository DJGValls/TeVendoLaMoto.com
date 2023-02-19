const express = require("express");
const router = express.Router();

const User = require("../models/User.model.js");
const Product = require("../models/Product.model.js")
const {isLoggedIn, isCliente, isVendedor} = require("../middlewares/auth-middleware.js")


// GET => renderiza vista de perfil de vendedor
router.get("/perfVendedor" , async(req,res,next)=>{

    const response = await Product.find();
    
    res.render("vendedor/perfil-privado.hbs",{
      allProduct: response
    })
})

// GET => renderiza vista de formulario de update de vendedor
router.get("/perfVendedor/update" ,(req,res,next)=>{
  res.render("vendedor/update-vendedor-form.hbs")
})

// GET => renderiza vista de formulario cliente
router.get("/perfCliente", isLoggedIn, isCliente, (req,res,next)=>{
  res.render("cliente/perfil-privado.hbs")
})

// GET => renderiza vista de formulario de update de cliente
router.get("/perfCliente/update" ,(req,res,next)=>{
  res.render("cliente/update-cliente-form.hbs")
})


  


  module.exports = router;