# VIDEO 06 - Ejercicio: completar el CRUD de libros y crear colección de POSTMAN

En este ejercicio debes partir del código de la API de libros que hicimos en la sesión 3, y completar todas las peticiones necesarias para que sea una API con todas las operaciones CRUD.

Es decir, debes tener las siguientes peticiones:

**GET /**

Devolverá la lista de libros paginada por los parámetros page y limit

**GET /id**

Devolverá la info de un libro cuando indiquemos un ID en la ruta

**GET /title/titulo**

Indicado un titulo, esta petición buscará en el API un libro que contenga ese texto

**POST /**

Permitirá crear nuevos libros en el API

**PUT /id**

Indicado un ID, esta petición permitirá modificar los datos de un libro

**DELETE /id**

Indicado un ID, esta petición permitirá eliminar un libro

Además de crear estas peticiones debes crear una colección en Postman con todas ellas y probarlas, cuando hayas terminado añade el .json de la colección a tu repositiorio.

Recuerda que el código que hemos visto durante los vídeos puedes encontrarlo en el siguiente repositorio:

<https://github.com/The-Valley-School/node-s4-complete-crud>
