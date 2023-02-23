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
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const Product = model("Product", productSchema);

module.exports = Product;
