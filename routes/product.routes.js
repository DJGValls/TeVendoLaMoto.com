const express = require("express");
const router = express.Router();
const uploader = require("../middlewares/cloudinary.js")

const Product = require("../models/Product.model.js");
const FormContact = require("../models/form-contac.model.js")
const {
  isLoggedIn,
  isCliente,
  isVendedor,
} = require("../middlewares/auth-middleware.js");

// GET => renderiza la vista del formulario de creacion de un producto
router.get("/create-product", isLoggedIn, isVendedor, (req, res, next) => {
  res.render("producto/nuevo-producto-form.hbs");
});

// POST => Crea un producto en la DB
router.post("/create-product",uploader.single("img"), isLoggedIn, isVendedor, async (req, res, next) => {
  const { nombre, precio, descripcion, img } = req.body;

  if (nombre === "" || precio === "" || descripcion === "") {
    res.status(401).render("producto/nuevo-producto-form.hbs", {
      errorMessage: "Por favor, Todos los campos deben estar llenos",
    });
    return;
  }

  
  
  
  try {
    // console.log(req.file) // el url de cloudinary
    if (req.file === undefined) {
      res.status(401).render("producto/nuevo-producto-form.hbs", {
        errorMessage: "Por favor, instroduzca una imagen para su producto",
      });
      return;
    }

    await Product.create({
      nombre: nombre,
      precio: precio,
      descripcion: descripcion,
      vendedor: req.session.activeUser._id ,
      img: req.file.path
    });

    
    res.redirect("/user/perfVendedor");
  } catch (error) {
    next(error);
  }
});

//GET => renderiza una vista del detalle del producto
router.get("/:productId/details", isLoggedIn, isCliente, async (req, res, next) => {
  try {
    const { productId } = req.params;

    const response = await Product.findById(productId).populate("vendedor");
    res.render("producto/detalle-producto.hbs", {
      oneProduct: response,
    });
  } catch (error) {
    next(error);
  }
});

//GET => renderiza el formulario para editar el producto
router.get("/:productId/edit", isLoggedIn, isVendedor, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const detailProduct = await Product.findById(productId);
    res.render("producto/edit-producto.hbs", detailProduct);
  } catch (error) {
    next(error);
  }
});

//POST => Actualiza los datos en la base de dato
router.post("/:productId/edit" , isLoggedIn, isVendedor, async(req,res,next)=>{

    const {productId} = req.params
    const {nombre,precio,descripcion} = req.body
    try {
        const response =  await Product.findByIdAndUpdate(productId, {
            nombre: nombre,
            precio: precio,
            descripcion: descripcion
        })

        res.redirect("/user/perfVendedor")

    } catch (error) {
        next(error)
    }

})

//POST => Elimina producto de la base de datos
router.post("/:productId/delete", isLoggedIn, isVendedor, async(req,res,next)=>{

    const {productId} = req.params

    try {
        await Product.findByIdAndDelete(productId)
        res.redirect("/user/perfVendedor")
    } catch (error) {
        next (error)
    }
})

//GET => Renderiza la vista del formulario de contacto
router.get("/:productId/contact" ,isLoggedIn, isCliente, async (req,res,next)=>{

  try {

    const {productId} = req.params
    const product = await Product.findById(productId).populate("vendedor")
    
    res.render("producto/nuevo-contacto-form.hbs", product);
    
  } catch (error) {
    next(error)
  }
 } )
//POST => Crear un mensaje en la BD
router.post("/:productId/contact", isLoggedIn,isCliente, async (req,res,next)=>{
  try {

    const {productId} = req.params
    const {mensaje,estadoPuja} = req.body
    const vendedorProducto = await Product.findById(productId).populate("vendedor")
    
    await FormContact.create({
      cliente: req.session.activeUser._id,
      mensaje: mensaje,
      producto: productId,
      vendedor: vendedorProducto.vendedor._id,
      estadoPuja: estadoPuja
    })
    // console.log(vendedorProducto.vendedor._id)

    res.redirect("/user/perfCliente")
    
  } catch (error) {
    next (error)
  }
})


module.exports = router;
