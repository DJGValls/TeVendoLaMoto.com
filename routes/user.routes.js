const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");

const User = require("../models/User.model.js");
const Product = require("../models/Product.model.js")
const {isLoggedIn, isCliente, isVendedor} = require("../middlewares/auth-middleware.js")



// GET => renderiza vista de perfil de vendedor
router.get("/perfVendedor", isLoggedIn, isVendedor, async(req,res,next)=>{

    const response = await Product.find({vendedor:`${req.session.activeUser._id}`});
        res.render("vendedor/perfil-privado.hbs",{
      allProduct: response
    })
})

// GET => renderiza vista de formulario de update de vendedor
router.get("/perfVendedor/update", isLoggedIn, isVendedor, async(req,res,next)=>{
  
  try {
    const user = await User.findById(req.session.activeUser._id)
  } catch (error) {
    next(error)
  }

  res.render("vendedor/update-vendedor-form.hbs")
})

// GET => renderiza vista de perfil cliente
router.get("/perfCliente/", isLoggedIn, isCliente, async(req,res,next)=>{

  try {
    // const idCliente = await User.findById(req.session.activeUser._id)
    // res.render("cliente/perfil-privado.hbs" , {idCliente})

    const response = await Product.find();
        res.render("cliente/perfil-privado.hbs",{
      allProduct: response
    })
   
    
  } catch (error) {
    next (error)
  }
})

// GET => renderiza vista de formulario de update de cliente
router.get("/perfCliente/update/", isLoggedIn, isCliente, async(req,res,next)=>{
  try {
    
  
    const user = await User.findById(req.session.activeUser._id)

    res.render("cliente/update-cliente-form.hbs" , user)
    
  } catch (error) {
    next (error)
  }
})

//POST => Actualiza datos del cliente en el BD
router.post("/perfCliente/update/", isLoggedIn,isCliente, async(req,res,next)=>{

  
  const {username,email,password}  = req.body
  
  // validación de contraseña

  if (username === "" || email === "" || password === "") {
    res.status(401).render("cliente/update-cliente-form.hbs", {
      errorMessage: "Por favor, Todos los campos deben estar llenos",
    });
    return;
  }

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/;
  if (passwordRegex.test(password) === false) {
    res.render("cliente/update-cliente-form.hbs", {
    errorMessage:
      "La contraseña debe tener minimo 6 caracteres, una mayuscula, una minuscula y un caracter especial",
  });
  }

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);


  try {

    // //validación de usuario existente
    // const foundUser = await User.findOne({ username: username });
    // // console.log(foundUser);
    // if (foundUser !== null) {
    //   res.render("/cliente/update-cliente-form.hbs", {
    //     errorMessage: "el nombre de usuario ya existe",
    //   });
    //   return;
    // }
    // //validacion de email
    // const foundUserEmail = await User.findOne({ email: email });
    // // console.log(foundUserEmail);
    // if (foundUserEmail !== null) {
    //   res.render("/cliente/update-cliente-form.hbs", {
    //     errorMessage: "El correo electronico está en uso",
    //   });
    //   return;
    // }
    
    await User.findByIdAndUpdate(req.session.activeUser._id,{
      username: username,
      email: email,
      password: hashPassword
    })
    res.redirect(`/user/perfCliente`)

  } catch (error) {
    next (error)
  }

})

//POST => Elimina Cliente de la base de datos
router.post("/delete/" , isLoggedIn,isCliente, async (req,res,next)=>{


  try {

    await User.findByIdAndDelete(req.session.activeUser._id)
    req.session.destroy(() => {
      res.redirect("/");
    })  
    
  } catch (error) {
    next (error)
  }

})

//POST => Elimina un usuario de la BD
router.post("/" , isLoggedIn, async (req,res,next)=>{

  try {

    await User.findByIdAndDelete(req.session.activeUser._id)
    req.session.destroy(() => {
      res.redirect("/auth/signup");
    })  
    
  } catch (error) {
    next (error)
  }

})




  module.exports = router;