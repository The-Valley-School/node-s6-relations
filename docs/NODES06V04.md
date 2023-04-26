# VIDEO 04 - Ejemplo relación coche-marca

Ahora que ya tenemos marcas, vamos a relacionarlas con nuestros coches cambiando el campo brand para que sea una relación con la entidad Brand:

```jsx
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creamos el schema del coche
const carSchema = new Schema(
  {
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: false,
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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Car = mongoose.model("Car", carSchema);
module.exports = { Car };
```

Una vez que hagamos esto ya podemos hacer populate de las dos relaciones (owner y brand) dentro de nuestro controlador de Car:

```jsx
.populate(["owner", "brand"]);
```

De esta manera recuperaremos toda la información del coche, incluida la marca y el dueño.

Nuestro fichero car.routes.js quedará de la siguiente manera:

```jsx
const express = require("express");

// Modelos
const { Car } = require("../models/Car.js");

// Router propio de usuarios
const router = express.Router();

// CRUD: READ
// EJEMPLO DE REQ: http://localhost:3000/car?page=1&limit=10
router.get("/", async (req, res) => {
  try {
    // Asi leemos query params
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const cars = await Car.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate(["owner", "brand"]);

    // Num total de elementos
    const totalElements = await Car.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: cars,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

// CRUD: READ
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const car = await Car.findById(id).populate(["owner", "brand"]);
    if (car) {
      res.json(car);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// CRUD: Operación custom, no es CRUD
router.get("/brand/:brand", async (req, res) => {
  const brand = req.params.brand;

  try {
    const car = await Car.find({ brand: new RegExp("^" + brand.toLowerCase(), "i") }).populate(["owner", "brand"]);
    if (car?.length) {
      res.json(car);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Endpoint de creación de usuarios
// CRUD: CREATE
router.post("/", async (req, res) => {
  try {
    const car = new Car(req.body);
    const createdCar = await car.save();
    return res.status(201).json(createdCar);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Para elimnar coches
// CRUD: DELETE
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const carDeleted = await Car.findByIdAndDelete(id);
    if (carDeleted) {
      res.json(carDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// CRUD: UPDATE
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const carUpdated = await Car.findByIdAndUpdate(id, req.body, { new: true });
    if (carUpdated) {
      res.json(carUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = { carRouter: router };
```

Ahora para poder relacionar todas las entidades hemos creado un fichero car-relations.seed.js que se encarga de relacionar los coches con las marcas y los dueños:

```jsx
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
```

Recuerda que puedes consultar todo el código que hemos visto durante la sesión, en el siguiente repositorio git:

<https://github.com/The-Valley-School/node-s6-relations>
