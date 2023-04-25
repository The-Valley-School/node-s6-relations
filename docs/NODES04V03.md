# VIDEO 03 - Faker para rellenar el API y GET paginado

En este vídeo hemos visto como podemos rellenar datos fake en nuestra API haciendo uso de la librería faker.

Para instalar la librería en nuestro proyecto debemos ejecutar:

```jsx
npm install @faker-js/faker --save-dev
```

Podéis encontrar la documentación de la librería en:

<https://fakerjs.dev/guide/>

Hemos usado la librería para completar nuestro seed de usuarios y rellenar añadiendo 50 usuarios random:

```jsx
const mongoose = require("mongoose");
const { connect } = require("../db.js");
const { User } = require("../models/User.js");
const { faker } = require("@faker-js/faker");

const userList = [
  { firstName: "Fran", lastName: "Linde", phone: "123123123" },
  { firstName: "Edu", lastName: "Cuadrado" },
  { firstName: "Gon", lastName: "Fernández", phone: "666777888" },
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

connect().then(() => {
  console.log("Tenemos conexión");

  // Borrar datos
  User.collection.drop().then(() => {
    console.log("Usuarios eliminados");

    // Añadimos usuarios
    const documents = userList.map((user) => new User(user));
    User.insertMany(documents)
      .then(() => console.log("Datos guardados correctamente!"))
      .catch((error) => console.error(error))
      .finally(() => mongoose.disconnect());
  });
});
```

Por otro lado, hemos añadido paginado a nuestro listado de usuarios, quedando el método GET de la siguiente manera:

```jsx
// CRUD: READ
// EJEMPLO DE REQ: http://localhost:3000/user?page=1&limit=10
router.get("/", async (req, res) => {
  try {
    // Asi leemos query params
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const users = await User.find()
      .limit(limit)
      .skip((page - 1) * limit);

    // LIMIT 10, PAGE 1 -> SKIP = 0
    // LIMIT 10, PAGE 2 -> SKIP = 10
    // LIMIT 10, PAGE 3 -> SKIP = 20
    // ...

    // Num total de elementos
    const totalElements = await User.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: users,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});
```

Ahora para recuperar los usuarios debemos ir jugando con lo parámetros limit y page:

<http://localhost:3000/user?page=1&limit=10>
