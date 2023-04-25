const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { User } = require("../models/User.js");

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

const userSeed = async () => {
  try {
    await connect();
    console.log("Tenemos conexión");

    // Borrar datos
    await User.collection.drop();
    console.log("Usuarios eliminados");

    // Añadimos usuarios
    const documents = userList.map((user) => new User(user));
    await User.insertMany(documents);
    console.log("Usuarios creados correctamente!");
  } catch (error) {
    console.error("ERROR AL CONECTAR CON LA BBDD");
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

userSeed();
