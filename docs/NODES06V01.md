# VIDEO 01 - Relaciones entre entidades y populate

En MongoDB, una referencia es un mecanismo para establecer una relación entre documentos en diferentes colecciones utilizando el valor de un campo de tipo ObjectId. Las referencias permiten que un documento haga referencia a otro documento en una colección diferente a través de un identificador único que se almacena en un campo específico.

Las referencias en MongoDB pueden ser útiles en varias situaciones, por ejemplo:

- Reducción de duplicidad de datos: Al utilizar referencias, se puede evitar la duplicación de datos en múltiples documentos. En lugar de incluir información de usuario en cada documento de publicación, simplemente se puede hacer referencia al documento de usuario correspondiente utilizando su ObjectId.
- Consultas de datos más eficientes: Las referencias permiten realizar consultas eficientes en documentos de diferentes colecciones. Por ejemplo, si queremos buscar todas las publicaciones de un usuario específico, podemos buscar en la colección de "publicaciones" utilizando el ObjectId del usuario correspondiente.
- Flexibilidad en el modelo de datos: Las referencias permiten una mayor flexibilidad en el modelo de datos de la base de datos. Al utilizar referencias, se puede cambiar la estructura de los datos sin tener que actualizar múltiples documentos.

En este video hemos hecho una referencia/relación entre la entidad Car y la entidad User, de manera que si un coche pertenece a una persona, basta con que indiquemos el ID del propietario (owner) dentro de la entidad usuario:

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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Car = mongoose.model("Car", carSchema);
module.exports = { Car };
```

Ahora cuando recuperamos un coche si queremos que además de eso nos traiga la información del owner, debemos indicarle a mongoose que nos rellene ese dato con “populate”:

```jsx
.populate("owner");
```

Nuestro car.routes.js queda de la siguiente manera:

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
      .populate("owner");

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
    const car = await Car.findById(id).populate("owner");
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
    const car = await Car.find({ brand: new RegExp("^" + brand.toLowerCase(), "i") }).populate("owner");
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
