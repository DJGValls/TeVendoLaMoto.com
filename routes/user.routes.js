const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");

const User = require("../models/User.model.js");
const Product = require("../models/Product.model.js");
const {
  isLoggedIn,
  isCliente,
  isVendedor,
} = require("../middlewares/auth-middleware.js");
const FormContact = require("../models/form-contac.model.js");

// GET => renderiza vista de perfil de vendedor
router.get("/perfVendedor", isLoggedIn, isVendedor, async (req, res, next) => {
  
  const mensaje = await FormContact.find({
    vendedor: `${req.session.activeUser._id}`,
  }).populate("vendedor").populate("producto");
  // console.log(mensaje);

  const response = await Product.find({
    vendedor: `${req.session.activeUser._id}`,
  });
  // console.log(response);
  res.render("vendedor/perfil-privado.hbs", {
    allProduct: response,
    todosLosMensajes: mensaje,
  });
});

// GET => renderiza vista de formulario de update de vendedor
router.get(
  "/perfVendedor/update",
  isLoggedIn,
  isVendedor,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.session.activeUser._id);
      res.render("vendedor/update-vendedor-form.hbs", user);
    } catch (error) {
      next(error);
    }
  }
);

// POST => Actualiza datos del vendedor en la BD
router.post(
  "/perfVendedor/update/",
  isLoggedIn,
  isVendedor,
  async (req, res, next) => {
    const { username, email, password, cif, telefono } = req.body;

    if (
      username === "" ||
      email === "" ||
      password === "" ||
      cif === "" ||
      telefono === ""
    ) {
      res.status(401).render("vendedor/update-vendedor-form.hbs", {
        errorMessage: "Por favor, Todos los campos deben estar llenos",
      });
      return;
    }

    // validación de contraseña
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/;
    if (passwordRegex.test(password) === false) {
      res.render("vendedor/update-vendedor-form.hbs", {
        errorMessage:
          "La contraseña debe tener minimo 6 caracteres, una mayuscula, una minuscula y un caracter especial",
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    // Validacion CIF
    const CIF_REGEX = /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/;
    if (CIF_REGEX.test(cif) === false) {
      res.status(401).render("vendedor/update-vendedor-form.hbs", {
        errorMessage:
          "El cif debe tener minimo 8 caracteres y el primero de ellos debe ser una letra",
      });
      return;
    }
    //Validacion Teléfono
    const TLF_REGEX =
      /\+?(\s*\d{0,2})()\1[1234567890]{0,2}\2[1234567890 .-]{9,13}/;
    if (TLF_REGEX.test(telefono) === false) {
      res.status(401).render("vendedor/update-vendedor-form.hbs", {
        errorMessage: "El teléfono debe tener 9 números.",
      });
      return;
    }
    try {
      await User.findByIdAndUpdate(req.session.activeUser._id, {
        username: username,
        email: email,
        password: hashPassword,
        cif: cif,
        telefono: telefono,
      });
      res.redirect(`/user/perfVendedor`);
    } catch (error) {
      next(error);
    }
  }
);

// GET => renderiza vista de perfil cliente
router.get("/perfCliente/", isLoggedIn, isCliente, async (req, res, next) => {
  // const estadoPuja =  "Aceptado"
  
  try {
    const mensajes = await FormContact.find({
      cliente: `${req.session.activeUser._id}`,
    }).populate("producto");

    const response = await Product.find();
    const valorPuja = JSON.stringify(mensajes).includes("Aceptado")
    // console.log(mensajes);
    
    res.render("cliente/perfil-privado.hbs", {
      allProduct: response,
      todosLosMensajes: mensajes,
      valorPuja: valorPuja
    });

  } catch (error) {
    next(error);
  }
});

// GET => renderiza vista de formulario de update de cliente
router.get(
  "/perfCliente/update/",
  isLoggedIn,
  isCliente,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.session.activeUser._id);

      res.render("cliente/update-cliente-form.hbs", user);
    } catch (error) {
      next(error);
    }
  }
);

//POST => Actualiza datos del cliente en el BD
router.post(
  "/perfCliente/update/",
  isLoggedIn,
  isCliente,
  async (req, res, next) => {
    const { username, email, password } = req.body;

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
      
      await User.findByIdAndUpdate(req.session.activeUser._id, {
        username: username,
        email: email,
        password: hashPassword,
      });
      res.redirect(`/user/perfCliente`);
    } catch (error) {
      next(error);
    }
  }
);

//POST => Elimina Users de la base de datos
router.post("/delete/", isLoggedIn, async (req, res, next) => {
  try {
    if (req.session.activeUser.role === "Vendedor") {
      await Product.deleteMany({ vendedor: req.session.activeUser._id });
    }

    await User.findByIdAndDelete(req.session.activeUser._id);
    req.session.destroy(() => {
      res.redirect("/");
    });
  } catch (error) {
    next(error);
  }
});


//POST => Actualizar mensaje de cliente una vez aceptado por vendedor
router.post("/:idMensaje/update", isLoggedIn,isVendedor, async(req,res,next)=>{
  
  const {idMensaje} = req.params
  const estadoPuja =  "Aceptado"
  // let pujaAceptada;
  try {
    if(estadoPuja.includes("Aceptado")){
      pujaAceptada = "Aceptado"
    }else{
      pujaAceptada = "Pendiente"
    }
    const prueba=  await FormContact.findByIdAndUpdate(idMensaje, {
      estadoPuja: pujaAceptada
    })
    res.redirect("/user/perfVendedor")

    // console.log(prueba)

  } catch (error) {
    next (error)
  }
});

//POST => Eliminar Mensajes de la BD
router.post("/:idMensaje/delete", isLoggedIn, async (req, res, next) => {
  const {idMensaje} = req.params
  try {
    
    if (req.session.activeUser.role === "Cliente") {
      await FormContact.findByIdAndDelete(idMensaje);
      res.redirect("/user/perfCliente")
    }else{
      await FormContact.findByIdAndDelete(idMensaje);
      res.redirect("/user/perfVendedor")
    }


  } catch (error) {
    next(error);
  }
});




module.exports = router;
