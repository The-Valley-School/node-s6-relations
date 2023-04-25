# VIDEO 02 - Completando el CRUD y 404 para rutas no existente

En este vídeo hemos hablado sobre el concepto de CRUD:

CRUD es un acrónimo que significa Crear (Create), Leer (Read), Actualizar (Update) y Eliminar (Delete). En el contexto de las API (Application Programming Interface), se refiere a las operaciones básicas que pueden realizar las aplicaciones en una base de datos o en cualquier otro sistema de almacenamiento de datos.

En términos generales, una API que implementa las operaciones CRUD permite que los desarrolladores puedan crear, leer, actualizar y eliminar recursos a través de peticiones HTTP. Por ejemplo, una API para un sistema de gestión de inventario podría permitir a los desarrolladores crear nuevos productos, obtener información sobre productos existentes, actualizar la información de un producto y eliminar productos que ya no estén disponibles.

Cada operación CRUD se corresponde con una acción específica que se realiza a través de una petición HTTP:

- Crear (Create): Se utiliza el método POST para enviar datos que serán almacenados en el sistema.
- Leer (Read): Se utiliza el método GET para recuperar información de uno o varios recursos.
- Actualizar (Update): Se utiliza el método PUT o PATCH para modificar la información de un recurso existente.
- Eliminar (Delete): Se utiliza el método DELETE para eliminar un recurso existente.

Tras esto hemos completado nuestro API de usuarios para que tenga todas las operaciones CRUD:

```jsx
const express = require("express");

// Modelos
const { User } = require("../models/User.js");

// Router propio de usuarios
const router = express.Router();

// CRUD: READ
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// CRUD: READ
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

// CRUD: Operación custom, no es CRUD
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
// CRUD: CREATE
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

// Para elimnar usuarios
// CRUD: DELETE
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userDeleted = await User.findByIdAndDelete(id);
    if (userDeleted) {
      res.json(userDeleted);
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
    const userUpdated = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (userUpdated) {
      res.json(userUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = { userRouter: router };
```

Por otro lado hemos modificado nuestro index.js para que todas las rutas que no estén contempladas en el router de usuarios o en el general, nos devuelva un mensaje 404 personalizado:

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
router.get("*", (req, res) => {
  res.status(404).send("Lo sentimos :( No hemos encontrado la página solicitada.");
});

// Usamos las rutas
server.use("/user", userRouter);
server.use("/", router);

server.listen(PORT, () => {
  console.log(`Server levantado en el puerto ${PORT}`);
});
```
