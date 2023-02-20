
//! PONER UN MIDDLEWARE QUE COMPRUEBA SI EL VENDEDOR TIENE EN LA BASE DE DATOS CIF Y TELEFONO PARA PODER ACCEDER A LAS RUTAS PRIVADAS COMO LA DE PERFIL


// verificar si está logeado
const isLoggedIn = (req, res, next) => {
  if (req.session.activeUser === undefined) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

// verificar si es cliente
const isCliente = (req, res, next) => {
  if (req.session.activeUser.role === "Cliente") {
    next(); // next sin argumentos significa continua con las rutas
  } else  res.redirect("/auth/login");
};

// verificar si es vendedor
const isVendedor = (req, res, next) => {
  if (req.session.activeUser.role === "Vendedor") {
    next(); // next sin argumentos significa continua con las rutas
  } else res.redirect("/auth/login");
};

// si el usuario esta logeado, creamos una variable local (res.locals)
const updateLocals = (req, res, next) => {
  if (req.session.activeUser === undefined) {
    res.locals.isUserActive = false;
  } else res.locals.isUserActive = true;
  next();
};

module.exports = {
  isLoggedIn: isLoggedIn,
  isCliente: isCliente,
  isVendedor: isVendedor,
  // isAdmin: isAdmin, //Bonus con un rol de admin con privilegios para todo
  updateLocals: updateLocals,
};
