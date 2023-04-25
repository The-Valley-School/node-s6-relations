const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creamos el schema del coche
const carSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    plate: {
      type: String,
      required: false,
    },
    power: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Car = mongoose.model("Car", carSchema);
module.exports = { Car };
