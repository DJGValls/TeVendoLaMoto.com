# TeVendoLaMoto.com

## Descripción
TeVendoLaMoto.com es una plataforma online para la subasta de productos. Tanto si eres un pequeño vendedor que no tiene una plataforma de venta profesional como si eres una gran compañia que quiere desplegar todos sus productos,  TeVendoLaMoto.com es el lugar adecuado para expandir tu negocio. Si lo que buscas es comprar productos también podemos ofrecerte una cuenta de cliente con la que podrás pujar por los productos que más te gusten. Desde TeVendoLaMoto queremos que la experiencia comprador vendedor sea muy personal y directa con un estilo diferente
<br>

## User stories
- Home - En esta pagina encontrarás los productos y un navbar con los enlaces a Login y Registro. Solo si estás registrado como cliente podras acceder al detalle del producto ofertado y iniciar un contacto con ese vendedor
- Registro - En registro dispondrás del formulario para rellenar tus datos con sus validaciones. Si quieres ser solo un usuario comprador registrate como comprador si lo que quieres es ser un usuario vendedor accederas a la segunda parte del registro donde deberas introducir los campos Cif y telefono de tu empresa
- Login - Logeate a tu cuenta tanto de vendedor como de comprador con tu email y contraseña
- Perfil Vendedor - en este perfil el vendedor podrá editar su perfil, cerrar su sesion para salir y agregar productos. Una vez agragado un producto, desde su ficha podrá editar dicho producto y borrarlo, si así lo desea. En su perfil de vendedor también aparecerán todas las pujas que reciba de los compradores. Dichas pujas podrá rechazarlas o aceptarlas
- Editar perfil -  Ya sea comprador o vendedor usted podrá editar sus datos personales en cualquier momento en esta sección, también dispondrá de un boton para eliminar su cuenta personal
- Añadir Producto - En este formulario podrá crear su producto desde cero, no olvide ninguno de los campos o la aplicación no le dejará avanzar
- Tarjeta de Producto - obtendrá todos los datos generados, a traves de un botón podrá editarlo o borrarlo si así lo desea
- Pujas de clientes - Si uno de sus productos recibe una puja por parte de un cliente aparecerá una ficha que mostrará la información de dicha puja. Usted podrá aceptarla o rechazarla. En caso de aceptarla aparecerá como aceptada y al cliente en su perfil le aprecerá el botón de comprar
- Perfil de Cliente -  en este perfil el cliente podrá editar su perfil, cerrar su sesion para salir y crear pujas de sus productos favoritos. Una vez creada la puja, esta aparecerá a la izquierda de su pantalla.
- generar puja - Para generar una puja de un producto le daremos al botón de contactar con el vendedor desde nuestro perfil de cliente. En el formulario de contacto podremos ofertar el dinero que consideremos justo
- Ficha de pujas - En nuestra ficha de pujas tendremos la información como pendiente hasta que el vendedor decida si acepta o rechaza su oferta, si el vendedor rechaza su oferta la puja desaparecerá, si el vendedor la acepta, un mensaje de aceptada aparecerá en su puja junto xcon un botón de comprar. Desde su ficha también podrá eliminar su puja desde el botón de anula puja

## API rutas (back-end)

// GET "/auth/signup" pagina de registro de vendedor/usuario

// GET "/auth/login" pagina de login

// GET "/auth/logout" => cerrar/destruir la sesión del usuario

// GET "/product/create-product" renderiza la vista del formulario de creacion de un producto

// GET "/product/:productId/details" renderiza una vista del detalle del producto

// GET "/product/:productId/edit" renderiza el formulario para editar el producto

// GET "/porduct/:productId/contact" Renderiza la vista del formulario de contacto

// GET "/user/perfVendedor" renderiza vista de perfil de vendedor

// GET "/user/perfVendedor/update" renderiza vista de formulario de update de vendedor

// GET "/user/perfCliente/" renderiza vista de perfil cliente

// GET "/user/perfCliente/update/" renderiza vista de formulario de update de cliente

// POST "/auth/signup" enviar registro de vendedor

// POST "/auth/signup" enviar registro de usuario

// POST "/auth/login" enviar credenciales y crear sesion activa

// POST "/product/create-product" Crea un producto en la DB

// POST "/product/:productId/edit" Actualiza los datos en la base de datos

// POST "/product/:productId/delete" Elimina producto de la base de datos

// POST "/product/:productId/contact" Crear un mensaje en la BD

// POST "/user/perfVendedor/update/" Actualiza datos del vendedor en la BD

// POST "/user/perfCliente/update/" Actualiza datos del cliente en el BD

// POST "/user/delete/" Elimina Users de la base de datos

// POST "/user/:idMensaje/update" Actualizar mensaje de cliente una vez aceptado por vendedor

// POST "/user/:idMensaje/delete" Eliminar Mensajes de la BD


## Modelos

- User.model

const { Schema, model } = require("mongoose");
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: false,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["Cliente", "Vendedor"],
      default: "Cliente"
    },
    cif:{
      type: String,
      trim: true,
      default:undefined
    },
    telefono: {
      type: Number,
      trim: true,
      default:undefined,
    }
  },
  {
    timestamps: true
  }
);
const User = model("User", userSchema);
module.exports = User;

- Product.model

const { Schema, model, default: mongoose } = require("mongoose");
const productSchema = new Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: false,
    },
    precio: {
      type: Number,
      required: true,
      // trim: true
    },
    descripcion: {
      type: String,
      require: true
    },
    vendedor: {
      type:mongoose.Schema.Types.ObjectId,
      ref: "User"
    } ,
    img: String //todo: URL DE CLOUDINARY
  },
  {   
    timestamps: true
  }
);
const Product = model("Product", productSchema);
module.exports = Product;

- form-contact.model

const { Schema, model, default: mongoose } = require("mongoose");
const formContactSchema = new Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    mensaje: {
      type: Number,
      require: true
    },
    producto:
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      estadoPuja: {
        type: String,
        enum: ["Pendiente", "Aceptado"],
        default: "Pendiente"
      },
      valorPuja: {
        type: Boolean,
        default: false
      }      
  },
  {  
    timestamps: true
  }
);
const FormContact = model("Form-Contact", formContactSchema);
module.exports = FormContact;


## Backlog

- Categorias de producto
- Busqueda por categoria
- sistema de carrito de la compra
- plataforma de pagos


## Links

### Git
https://github.com/DJGValls/TeVendoLaMoto.com