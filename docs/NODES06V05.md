# VIDEO 05 - Ejercicio: API Rest con relaciones

En este ejercicio debes continuar con el API de libros que dejamos en la sesión anterior. Sobre el código que teníamos debes realizar las siguientes modificaciones.

- Crea un nuevo modelo Autor que almacene la información de un escritor. Debe tener nombre y país.
- Crea un controlador para poder realizar todas las operaciones CRUD de Autores
- Crea un seed que nos permita añadir autores de libros, para que te sea más fácil podemos dejarte el array

```jsx
const authorList = [
  { name: "Gabriel García Márquez", country: "Colombia" },
  { name: "Jane Austen", country: "England" },
  { name: "Leo Tolstoy", country: "Russia" },
  { name: "Virginia Woolf", country: "England" },
  { name: "Ernest Hemingway", country: "United States" },
  { name: "Jorge Luis Borges", country: "Argentina" },
  { name: "Franz Kafka", country: "Czechoslovakia" },
  { name: "Toni Morrison", country: "United States" },
  { name: "Haruki Murakami", country: "Japan" },
  { name: "Chinua Achebe", country: "Nigeria" },
];
```

- Relaciona los libros con autores para que en vez de usar solo un String, utilicen la nueva entidad Author
- Modifica las peticiones de libros para que devuelvan la información de su autor haciendo uso de populate
- Crea un fichero book-relations.seed.js que genere la relaciones entre autores y libros

Recuerda que puedes consultar todo el código que hemos visto durante la sesión, en el siguiente repositorio git:

<https://github.com/The-Valley-School/node-s6-relations>
