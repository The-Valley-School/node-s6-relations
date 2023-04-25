const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Car } = require("../models/Car.js");
const { User } = require("../models/User.js");
const { faker } = require("@faker-js/faker");

const carSeed = async () => {
  try {
    await connect();
    console.log("Tenemos conexión");

    // Borrar datos
    await Car.collection.drop();
    console.log("Coches eliminados");

    // Creamos un dueño
    const user = new User({
      firstName: "Carlos",
      lastName: "Sainz",
    });

    const userDocument = await user.save();

    const carList = [
      { brand: "Lexus", model: "CT200", plate: "M1234YB", power: 105, owner: userDocument.id },
      { brand: "Audi", model: "A1", plate: "B1212XX", power: 120, owner: userDocument.id },
      { brand: "Renault", model: "Zoe", plate: "1234HKW", power: 125, owner: userDocument.id },
    ];

    // Creamos coches adicionales
    for (let i = 0; i < 50; i++) {
      const newCar = {
        brand: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        plate: `M${faker.datatype.number({ min: 1000, max: 9999 })}${faker.random.alpha(2).toUpperCase()}`,
        power: faker.datatype.number({ min: 80, max: 300 }),
      };
      carList.push(newCar);
    }

    // Añadimos usuarios
    const documents = carList.map((user) => new Car(user));
    await Car.insertMany(documents);

    console.log("Datos guardados correctamente!");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

console.log("ANTES");
carSeed(); // ESPERO VER: "Tenemos conexión", "Coches eliminados" y "Datos guardados correctamente!"
console.log("DESPUÉS");
