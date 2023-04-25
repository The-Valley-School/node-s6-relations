# VIDEO 05 - Ejemplo de CRUD con coches

En este vídeo hemos añadido otra API de ejemplo, en este caso hemos partido de la que teníamos de usuarios y hemos hecho las modificaciones necesarias para crear un CRUD de coches.

Hemos creado nuestro modelo en models/Car.js:

```jsx
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
```

Después hemos creado nuestro seed para rellenar los datos mock de coches en seeds/car.seed.js:

```jsx
const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { Car } = require("../models/Car.js");
const { faker } = require("@faker-js/faker");

const carList = [
  { brand: "Lexus", model: "CT200", plate: "M1234YB", power: 105 },
  { brand: "Audi", model: "A1", plate: "B1212XX", power: 120 },
  { brand: "Renault", model: "Zoe", plate: "1234HKW", power: 125 },
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

connect().then(() => {
  console.log("Tenemos conexión");

  // Borrar datos
  Car.collection.drop().then(() => {
    console.log("Coches eliminados");

    // Añadimos usuarios
    const documents = carList.map((user) => new Car(user));
    Car.insertMany(documents)
      .then(() => console.log("Datos guardados correctamente!"))
      .catch((error) => console.error(error))
      .finally(() => mongoose.disconnect());
  });
});
```

Después hemos creado las rutas de coches en routes/car.routes.js:

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
      .skip((page - 1) * limit);

    // LIMIT 10, PAGE 1 -> SKIP = 0
    // LIMIT 10, PAGE 2 -> SKIP = 10
    // LIMIT 10, PAGE 3 -> SKIP = 20
    // ...

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
    const car = await Car.findById(id);
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
    const car = await Car.find({ brand: new RegExp("^" + brand.toLowerCase(), "i") });
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
    const car = new Car({
      brand: req.body.brand,
      model: req.body.model,
      plate: req.body.plate,
      power: req.body.power,
    });

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

Y finalmente hemos modificado el index.js para que utilice ese router también:

```jsx
const express = require("express");
const { userRouter } = require("./routes/user.routes.js");
const { carRouter } = require("./routes/car.routes.js");

// Conexión a la BBDD
const { connect } = require("./db.js");
connect();

// Configuración del server
const PORT = 3000;
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Rutas
const router = express.Router();
router.get("/", (req, res) => {
  res.send("Esta es la home de nuestra API");
});
router.get("*", (req, res) => {
  res.status(404).send("Lo sentimos :( No hemos encontrado la página solicitada.");
});

// Usamos las rutas
server.use("/user", userRouter);
server.use("/car", carRouter);
server.use("/", router);

server.listen(PORT, () => {
  console.log(`Server levantado en el puerto ${PORT}`);
});
```

Recuerda que el código que hemos visto durante los vídeos puedes encontrarlo en el siguiente repositorio:

<https://github.com/The-Valley-School/node-s4-complete-crud>
