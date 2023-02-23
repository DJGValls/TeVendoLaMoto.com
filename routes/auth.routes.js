const express = require("express");
const router = express.Router();

const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");
const {
  isLoggedIn,
  isCliente,
  isVendedor,
} = require("../middlewares/auth-middleware.js");

// GET "/auth/signup" pagina de registro de vendedor
router.get(
  "/signup/vendedor/",
  isLoggedIn,
  
  async (req, res, next) => {
    try {
      const foundVendedor = await User.findById(req.session.activeUser._id);
      res.render("auth/vendedor-signup-form.hbs", {
        userVendedor: foundVendedor,
      });
    } catch (error) {
      next(error);
    }
  }


);


// POST "/auth/signup" enviar registro de vendedor
router.post(
  "/signup/vendedor/",
  isLoggedIn,
  
  async (req, res, next) => {
    // console.log(req.body);
    const { cif, telefono } = req.body;

    // VALIDACIONES

    // validación de campos completos
    if (cif === "" || telefono === "") {
      res.status(401).render("auth/vendedor-signup-form.hbs", {
        errorMessage: "Por favor, Todos los campos deben estar llenos",
      });
      return;
    }  

    // Validacion CIF
    const CIF_REGEX = /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/;
    if (CIF_REGEX.test(cif) === false) {
      res.status(401).render("auth/vendedor-signup-form.hbs", {
      errorMessage:
      "El cif debe tener minimo 8 caracteres y el primero de ellos debe ser una letra",
    });
      return;
    }
 
    //Validacion Teléfono
    const TLF_REGEX = /\+?(\s*\d{0,2})()\1[1234567890]{0,2}\2[1234567890 .-]{9,13}/;
    if(TLF_REGEX.test(telefono) === false){
      res.status(401).render("auth/vendedor-signup-form.hbs", {
        errorMessage: "El teléfono debe tener 9 números."
      });
      return;
    }

    try {
      // validacion de cif existente
      const foundUserCif = await User.findOne({ cif: cif });
      if (foundUserCif !== null) {
        res.render("auth/vendedor-signup-form.hbs", {
          errorMessage: "Cif ya existe",
        });
        return;
      }

      // CREAMOS UN USUARIO con un Update
      await User.findByIdAndUpdate(req.session.activeUser._id, {
        cif,
        telefono,
      });
    
      res.redirect("/user/perfVendedor")

    } catch (err) {
      next(err);
    }
  }
);

// GET "/auth/signup" pagina de registro de usuario
router.get("/signup", (req, res, next) => {
  res.render("auth/usuario-signup-form.hbs");
});

// POST "/auth/signup" enviar registro de usuario
router.post("/signup", async (req, res, next) => {
  // console.log(req.body);
  const { username, email, password, role } = req.body;
  // VALIDACIONES
  // validación de campos completos
  if (username === "" || email === "" || password === "") {
    res.status(401).render("auth/usuario-signup-form.hbs", {
      errorMessage: "Por favor, Todos los campos deben estar llenos",
    });
    
    return;
  }

  // validación de contraseña
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/;
  if (passwordRegex.test(password) === false) {
    res.render("auth/usuario-signup-form.hbs", {
      errorMessage:
        "La contraseña debe tener minimo 6 caracteres, una mayuscula, una minuscula y un caracter especial",
    });
    return;
  }

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
    //encriptacion de password
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    // CREAMOS UN USUARIO
    await User.create({
      username: username,
      email: email,
      password: hashPassword,
      role: role,
    });

    const foundTypeUser = await User.findOne({ email });
    console.log(foundTypeUser);
    if (foundTypeUser.role === "Vendedor") {
      req.session.activeUser = foundTypeUser;
      req.session.save(() => {
        res.redirect(`/auth/signup/vendedor`);
      });
    } else {
      req.session.activeUser = foundTypeUser;
      req.session.save(() => {
        res.redirect(`/user/perfCliente`);
      });
    }
      
      
  } catch (err) {
    next(err);
  }
});

// GET "/auth/login" pagina de login
router.get("/login", (req, res, next) => {
  res.render("auth/login-form.hbs");
});

// POST "/auth/login" enviar credenciales y crear sesion activa
router.post("/login", async (req, res, next) => {
  // console.log(req.body);
  const { email, password } = req.body;

  // validaciones
  // validacion campos completos
  if (email === "" || password === "") {
    res.render("auth/login-form.hbs", {
      errorMessage: "Todos los campos deben estar llenos",
    });
    return;
  }

  try {
    // validacion usuario existe en la DB
    const foundUser = await User.findOne({ email: email });
    if (foundUser === null) {
      res.render("auth/login-form.hbs", {
        errorMessage: "Usuario no registrado con ese correo electronico",
      });
      return;
    }

    // validacion contraseña
    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );
    // console.log("isPasswordCorrect", isPasswordCorrect);
    if (isPasswordCorrect === false) {
      res.render("auth/login-form.hbs", {
        errorMessage: "Contraseña incorrecta, vuelva a intentarlo",
      });
      return;
    }
    // activar una sesión
    req.session.activeUser = foundUser; // crea la sesión en la BD y envía la cookie (copia de sesión encriptada) al usuario
    // automaticamente, en TODAS las rutas vamos a tener accedo a req.session.activeUser => siempre nos dará el usuario que hace la llamada
    req.session.save(() => {
      // espera a que se haya creado la sesión en la DB correctamente y luego...
      if (foundUser.role === "Cliente") {
        res.redirect(`/user/perfCliente/`);
      } else res.redirect(`/user/perfVendedor/`);
    });
  } catch (err) {
    next(err);
  }
});

// GET "/auth/logout" => cerrar/destruir la sesión del usuario
router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
