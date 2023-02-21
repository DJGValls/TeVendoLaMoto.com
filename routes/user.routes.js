const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");

const User = require("../models/User.model.js");
const Product = require("../models/Product.model.js")
const {isLoggedIn, isCliente, isVendedor} = require("../middlewares/auth-middleware.js")



// GET => renderiza vista de perfil de vendedor
router.get("/perfVendedor", isLoggedIn, isVendedor, async(req,res,next)=>{

    const response = await Product.find();
        res.render("vendedor/perfil-privado.hbs",{
      allProduct: response
    })
})

// GET => renderiza vista de formulario de update de vendedor
router.get("/perfVendedor/update", isLoggedIn, isVendedor, (req,res,next)=>{
  
  res.render("vendedor/update-vendedor-form.hbs")
})

// GET => renderiza vista de perfil cliente
router.get("/perfCliente/:idCliente", isLoggedIn, isCliente, async(req,res,next)=>{

  try {
    const idCliente = await User.findById(req.params.idCliente)
    res.render("cliente/perfil-privado.hbs" , {idCliente})
   
    
  } catch (error) {
    next (error)
  }
})

// GET => renderiza vista de formulario de update de cliente
router.get("/perfCliente/update/:idUser", isLoggedIn, isCliente, async(req,res,next)=>{
  try {
    
    const user = await User.findById(req.params.idUser)

    res.render("cliente/update-cliente-form.hbs" , user)
    
  } catch (error) {
    next (error)
  }
})

//POST => Actualiza datos del cliente en el BD
router.post("/perfCliente/update/:idUser", isLoggedIn,isCliente, async(req,res,next)=>{

  const {idUser} = req.params
  const {username,email,password}  = req.body
  
  // validación de contraseña
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/;
  if (passwordRegex.test(password) === false) {
    res.render("auth/usuario-signup-form.hbs", {
    errorMessage:
      "La contraseña debe tener minimo 6 caracteres, una mayuscula, una minuscula y un caracter especial",
  });
  }

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);


  try {

    //validación de usuario existente
    const foundUser = await User.findOne({ username: username });
    // console.log(foundUser);
    if (foundUser !== null) {
      res.render("auth/usuario-signup-form.hbs", {
        errorMessage: "el nombre de usuario ya existe",
      });
      return;
    }
    //validacion de email
    const foundUserEmail = await User.findOne({ email: email });
    // console.log(foundUserEmail);
    if (foundUserEmail !== null) {
      res.render("auth/usuario-signup-form.hbs", {
        errorMessage: "El correo electronico está en uso",
      });
      return;
    }
    
    const response =  await User.findByIdAndUpdate(idUser,{
      username: username,
      email: email,
      password: hashPassword
    })
    res.redirect(`/user/perfCliente/${idUser}`)

  } catch (error) {
    next (error)
  }

})

//POST => Elimina Cliente de la base de datos
router.post("/delete/:idCliente" , isLoggedIn,isCliente, async (req,res,next)=>{

  const {idCliente} = req.params

  try {

    await User.findByIdAndDelete(idCliente)
    req.session.destroy(() => {
      res.redirect("/");
    })  
    
  } catch (error) {
    next (error)
  }

})

//POST => Elimina un usuario de la BD
router.post("/:idUser" , isLoggedIn, async (req,res,next)=>{

  const {idUser} = req.params

  try {

    await User.findByIdAndDelete(idUser)
    req.session.destroy(() => {
      res.redirect("/auth/signup");
    })  
    
  } catch (error) {
    next (error)
  }

})




  module.exports = router;