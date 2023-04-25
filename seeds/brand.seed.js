const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Brand } = require("../models/Brand.js");

const brandSeed = async () => {
  try {
    // Conexión a BBDD
    await connect();

    // Borramos datos de marcas
    await Brand.collection.drop();

    const brands = [
      { name: "Ford", country: "USA", creationYear: 1900 },
      { name: "Renault", country: "France", creationYear: 1940 },
      { name: "Lexus", country: "Japan", creationYear: 1906 },
    ];

    const documents = brands.map((brand) => new Brand(brand));
    await Brand.insertMany(documents);

    console.log("Marcas creadas correctamente!");
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

brandSeed();
