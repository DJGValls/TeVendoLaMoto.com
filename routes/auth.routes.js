const express = require("express");
const router = express.Router();

const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");

// GET "/auth/signup" 
router.get("/signup", (req, res, next) => {
  res.render("auth/usuario-signup-update-form.hbs");
});

// POST "/auth/signup" 
router.post("/signup", async (req, res, next) => {
  console.log(req.body);
  const { username, email, password, role } = req.body;
  // VALIDACIONES
  // validación de campos completos
  if (username === "" || email === "" || password === "") {
    res.status(401).render("auth/usuario-signup-update-form.hbs", {
      errorMessage: "Por favor, Todos los campos deben estar llenos",
    });
    return;
  }

  // validación de contraseña
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/;
  if (passwordRegex.test(password) === false) {
    res.render("auth/usuario-signup-update-form.hbs", {
      errorMessage:
        "La contraseña debe tener minimo 6 caracteres, una mayuscula, una minuscula y un caracter especial",
    });
    return;
  }

  try {
    //validación de usuario existente
    const foundUser = await User.findOne({ username: username });
    console.log(foundUser);
    if (foundUser !== null) {
      res.render("auth/usuario-signup-update-form.hbs", {
        errorMessage: "el nombre de usuario ya existe",
      });
      return;
    }

    const foundUserEmail = await User.findOne({ email: email });
    console.log(foundUserEmail);
    if (foundUserEmail !== null) {
      res.render("auth/usuario-signup-update-form.hbs", {
        errorMessage: "El correo electronico está en uso",
      });
      return; 
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    // CREAMOS UN USUARIO
    await User.create({
      username: username,
      email: email,
      password: hashPassword,
      role: role,
    });
    
    if (role === "cliente") {
        res.redirect("/cliente/perfil-privado.hbs");
    } else res.redirect("/vendedor/perfil-privado.hbs");

  } catch (err) {
    next(err);
  }
});

module.exports = router;
