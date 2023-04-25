const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Car } = require("../models/Car.js");
const { faker } = require("@faker-js/faker");

const carSeed = async () => {
  try {
    await connect();
    console.log("Tenemos conexión");

    // Borrar datos
    await Car.collection.drop();
    console.log("Coches eliminados");

    const carList = [
      { model: "CT200", plate: "M1234YB", power: 105 },
      { model: "A1", plate: "B1212XX", power: 120 },
      { model: "Zoe", plate: "1234HKW", power: 125 },
    ];

    // Creamos coches adicionales
    for (let i = 0; i < 50; i++) {
      const newCar = {
        model: faker.vehicle.model(),
        plate: `M${faker.datatype.number({ min: 1000, max: 9999 })}${faker.random.alpha(2).toUpperCase()}`,
        power: faker.datatype.number({ min: 80, max: 300 }),
      };
      carList.push(newCar);
    }

    // Añadimos usuarios
    const documents = carList.map((car) => new Car(car));
    await Car.insertMany(documents);

    console.log("Coches creados correctamente!");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

carSeed();
