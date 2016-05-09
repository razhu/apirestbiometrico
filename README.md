# API REST biometrico

El presente proyecto utiliza JSON Web Token (JWT) para implementar el sistema de autenticacion y consulta basado en tokens para el servicio web entre el Banco Union y Adsib.

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

- `http://test.agetic.gob.bo/banco-union-extractos/api/v1/depositos?inicio=2015-03-28&fin=2015-03-31`. 

    Petición `GET`. Lista depositos realizados en un rango de fechas. Note el formato de las fechas (año-mes-dia).


- `http://test.agetic.gob.bo/banco-union-extractos/api/v1/depositos/:numero`. 

    Petición `GET`. Lista un deposito en particular, según el número de documento (numDocumento).




Para mas detalles, léase el archivo `doc/API.md`
