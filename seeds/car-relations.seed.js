const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Car } = require("../models/Car.js");
const { Brand } = require("../models/Brand.js");
const { User } = require("../models/User.js");
const { generateRandom } = require("../utils.js");

const carReslationsSeed = async () => {
  try {
    await connect();
    console.log("Tenemos conexión!");

    // Recuperamos usuarios, coches y marcas
    const cars = await Car.find();
    const users = await User.find();
    const brands = await Brand.find();

    // Comprobar que existen coches
    if (!cars.length) {
      console.error("No hay coches para relacionar en la base de datos");
      return;
    }

    if (!users.length) {
      console.error("No hay usuarios para relacionar en la base de datos");
      return;
    }

    if (!brands.length) {
      console.error("No hay marcas para relacionar en la base de datos");
      return;
    }

    for (let i = 0; i < cars.length; i++) {
      const car = cars[i];
      const randomBrand = brands[generateRandom(0, brands.length - 1)];
      const randomUser = users[generateRandom(0, users.length - 1)];
      car.owner = randomUser.id;
      car.brand = randomBrand.id;
      await car.save();
    }

    console.log("Relaciones entre coches-marcas-usuarios creadas correctamente.");
  } catch (error) {
  } finally {
    mongoose.disconnect();
  }
};

carReslationsSeed();
