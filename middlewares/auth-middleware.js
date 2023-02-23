

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
  } else { 
    res.redirect("/auth/login");
  }
};

// verificar si es vendedor
const isVendedor = (req, res, next) => {
  if (req.session.activeUser.role === "Vendedor" && req.session.activeUser.cif !== null && req.session.activeUser.telefono !== null) {
    next(); // next sin argumentos significa continua con las rutas
  } else {
    res.redirect("/auth/login");
  }
};

// si el usuario esta logeado, creamos una variable local (res.locals)
const updateLocals = (req, res, next) => {
  if (req.session.activeUser === undefined) {
    res.locals.isUserActive = false;
  } else{ 
    res.locals.isUserActive = true;
  }

  if (req.session.activeUser !== undefined && req.session.activeUser.role === "Cliente") {
    res.locals.isUserCliente = true;
  } else{ 
    res.locals.isUserCliente = false;
  }

  if (req.session.activeUser !== undefined && req.session.activeUser.role === "Vendedor") {
    res.locals.isUserVendedor= true;
  } else{ 
    res.locals.isUserVendedor = false;
  }


  next();
};

module.exports = {
  isLoggedIn: isLoggedIn,
  isCliente: isCliente,
  isVendedor: isVendedor,
  // isAdmin: isAdmin, //Bonus con un rol de admin con privilegios para todo
  updateLocals: updateLocals,
};
