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
      }
      
  },
  
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const FormContact = model("Form-Contact", formContactSchema);

module.exports = FormContact;
