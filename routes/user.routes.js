const express = require("express");
const router = express.Router();

const User = require("../models/User.model.js");



// GET => renderiza vista de perfil de vendedor
router.get("/perfVendedor" , (req,res,next)=>{
    res.render("vendedor/perfil-privado.hbs")
})

// GET "/auth/logout" => cerrar/destruir la sesión del usuario
router.get("/logout", (req, res, next) => {

    req.session.destroy(() => {
      res.redirect("/")
    })
  
})
  


  module.exports = router;