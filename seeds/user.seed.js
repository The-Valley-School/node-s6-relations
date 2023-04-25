const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { User } = require("../models/User.js");
const { faker } = require("@faker-js/faker");

const userList = [
  {
    firstName: "Fran",
    lastName: "Linde",
    phone: "123123123",
    address: {
      street: "Calle falsa",
      number: 123,
      city: "Ávila",
    },
  },
  { firstName: "Edu", lastName: "Cuadrado" },
  {
    firstName: "Gon",
    lastName: "Fernández",
    phone: "666777888",
    address: {
      street: "Calle Torregalindo",
      number: 1,
      city: "Madrid",
    },
  },
];

// Creamos usuarios adicionales
for (let i = 0; i < 50; i++) {
  const newUser = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phone: faker.phone.number("+34 91 ### ## ##"),
  };
  userList.push(newUser);
}

const run = async () => {
  try {
    await connect();
    console.log("Tenemos conexión");

    // Borrar datos
    await User.collection.drop();
    console.log("Usuarios eliminados");

    // Añadimos usuarios
    const documents = userList.map((user) => new User(user));
    await User.insertMany(documents);
    console.log("Datos guardados correctamente!");
  } catch (error) {
    console.error("ERROR AL CONECTAR CON LA BBDD");
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

run();
