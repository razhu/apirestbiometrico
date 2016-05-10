# API REST biometrico

El presente proyecto utiliza JSON Web Token (JWT).

## Guia rapida de instalacion de la API en local.

1. Instalar dependencias: `npm install`
2. Configurar la base de datos en  `config/config.json`
3. Crear usuario admin: `sequelize db:seed:all`
4. Iniciar el servidor: `nodemon server.js`

usuario/contrasena: admin

Para mas detalles, léase el archivo `INSTALL.md`

## Servicios

- `http://localhost:8080/api/v1/tokens`. Devuelve un token de autenticacion cuando los datos enviados en la peticion `POST` con el nombre de usuario y contrasena son correctos:
```
{
  "usuario":"admin",
  "contrasena":"admin"
}
```

Las siguientes rutas (endpoints) son protegias. Es decir, debe enviar el token en la cabecera: `x-access-token`

- `http://localhost:8080/api/v1/registros?inicio=2016-05-10`. 

    Petición `GET`. Lista registros realizados mayores o iguales a la fecha especificada. Note el formato de las fechas (año-mes-dia).





Para mas detalles, léase el archivo `doc/API.md`
