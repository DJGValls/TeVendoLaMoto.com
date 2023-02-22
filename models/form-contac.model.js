const { Schema, model, default: mongoose } = require("mongoose");

const formContactSchema = new Schema(
  {
    // nombre: {
    //   type: String,
    //   trim: true,
    //   required: true,
    // },
    mensaje: {
      type: String,
      require: true
    },
    producto:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
  },
  
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const FormContact = model("Form-Contact", formContactSchema);

module.exports = FormContact;
