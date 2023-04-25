# VIDEO 01 - Refactor y re-estructuración del API

En este vídeo hemos hecho una pequeña re-estructuración de nuestro API: nos hemos llevado todas las rutas de user a un fichero a parte llamado user.routes.js:

```jsx
const express = require("express");

// Modelos
const { User } = require("../models/User.js");

// Router propio de usuarios
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/name/:name", async (req, res) => {
  const name = req.params.name;

  try {
    const user = await User.find({ firstName: new RegExp("^" + name.toLowerCase(), "i") });
    if (user?.length) {
      res.json(user);
    } else {
      res.status(404).json([]);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Endpoint de creación de usuarios
router.post("/", async (req, res) => {
  try {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
    });

    const createdUser = await user.save();
    return res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = { userRouter: router };
```

De esta manera podemos ir creando un fichero para cada ámbito de nuestra API (usuarios, coches, alumnos, edificios… etc)

Hemos modificado todos los endpoints para que trabajen con async / await, de esta manera haremos el API más legible, por ejemplo para el GET de usuarios:

```jsx
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});
```

Para hacer uso de estas rutas del fichero user.routes.js debemos modificar el index.js para que tenga un router principal en la raíz / y el router de usuarios en /user:

```jsx
const express = require("express");
const { userRouter } = require("./routes/user.routes.js");

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

// Usamos las rutas
server.use("/", router);
server.use("/user", userRouter);

server.listen(PORT, () => {
  console.log(`Server levantado en el puerto ${PORT}`);
});
```
