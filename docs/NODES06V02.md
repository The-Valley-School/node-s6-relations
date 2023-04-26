# VIDEO 02 - Calculo al vuelo de propiedad relacionada

Ahora que ya tenemos relacionados los coches con su dueño, es posible que nos interese recuperar los coches que tiene un usuario.

Para hacer esto vamos a añadir un parámetro en el la ruta que se llame includeCars, el cual hará que realizamos una segunda query a la base de datos:

```jsx
// CRUD: READ
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (user) {
      const temporalUser = user.toObject();
      const includeCars = req.query.includeCars === "true";
      if (includeCars) {
        const cars = await Car.find({ owner: id });
        temporalUser.cars = cars;
      }

      res.json(temporalUser);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
```

Para poder añadir los coches al usuario vamos a convertir primero el usuario a objeto con el método toObject()
