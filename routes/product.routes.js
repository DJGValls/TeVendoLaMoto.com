const express = require("express");
const router = express.Router();
// const uploader = require("../middlewares/cloudinary.js")

const Product = require("../models/Product.model.js");



// GET => renderiza la vista del formulario de creacion de un producto
router.get("/create-product", (req, res, next) => {
  res.render("producto/nuevo-producto-form.hbs");
});

// POST => Crea un producto en la DB
router.post("/create-product", async (req, res, next) => {
  const { nombre, precio, descripcion, vendedor, img } = req.body;
  // console.log(req.file.path); //=> NOS MUESTRA LA URL DE LA IMAGEN DE CLOUDINARY

  try {
    const response = await Product.create({
      nombre: nombre,
      precio: precio,
      descripcion: descripcion,
      vendedor: vendedor,
      // img: req.body.ult
    });

    console.log(response);
    res.redirect("/user/perfVendedor");
  } catch (error) {
    next(error);
  }
});

//GET => renderiza una vista del detalle del producto
router.get("/:productId/details", async(req,res,next)=>{
    
    
    try {
        const{ productId } = req.params

        const response = await Product.findById(productId)
        res.render("producto/detalle-producto.hbs", {
            oneProduct: response
        })
        
    } catch (error) {
        next (error)
    }
})
module.exports = router;
