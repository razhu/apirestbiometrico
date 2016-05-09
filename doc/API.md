# API

El servicio web es accesible desde la URL raíz:

```sh
http://test.agetic.gob.bo/banco-union-extractos/api/v1
```
## Respuestas comunes de los servicios web

Para todos los servicios web, los parámetros deben estar codificados en charset UTF-8.

En caso de error de autenticación, error de servicio no encontrado, o error interno del servidor, todos los servicios web devuelven las respuestas siguientes:

* Respuesta en el caso que el usuario o token sean incorrectos:

```
HTTP/1.1 401 Unauthorized

{
  "mensaje":"Token o nombre de usuario inválidos."
}
```

* Respuesta en el caso que el servidor no encuentre el servicio solicitado:

```
HTTP/1.1 404 Not Found
```

* En caso que haya un error interno en el servidor:

```
HTTP/1.1 500 Internal Server Error
```

## SERVICIOS WEB

## Servicio Web: Autenticación de usuarios

Cabecera y ruta:

```sh
Content-Type: application/json
POST /tokens
```
Parámetros de entrada y salida:

| Tipo           | Parámetro    | Descripción                                                                                                                          |
|----------------|--------------|--------------------------------------------------------------------------------------------------------------------------------------|
| Entrada/Salida | `usuario`    | Nombre de usuario. Máximo de 255 caracteres.                                                                                         |
| Entrada        | `contrasena` | Contraseña del usuario. Máximo de 255 caracteres.                                                                                    |
| Salida         | `token`      | Cadena de caracteres temporal utilizado para acceder a los servicios web en lugar de usuario y contraseña. Máximo de 255 caracteres. |

Ejemplo con `curl`:

Autenticación de usuario a través del servicio web para el `usuario=inst119` y `contrasena=12345678` de la siguiente forma:

```sh
curl -H "Content-Type: application/json" -X POST http://test.agetic.gob.bo/banco-union-extractos/api/v1/tokens -d \
'{"usuario":"inst119","contrasena":"123456"}'
```

Respuesta en el caso de que la autenticación de usuario sea correcta:

```
HTTP/1.1 201 Created

{
  "token":"KgeLAtkJLGXwMswx88QZ",
  "usuario":"inst119"
}
```

Respuesta en el caso de que la estructura del JSON sea incorrecta:

```
HTTP/1.1 400 Bad Request

{
  "mensaje":"Problemas en el formato JSON"
}
```

Respuesta en el caso que la petición haya sido rechazada por falta del parámetro `usuario`:

```
HTTP/1.1 400 Bad Request

{
  "mensaje":"Falta el parámetro 'usuario'"
}
```

Respuesta en el caso que la petición haya sido rechazada por falta del parámetro `contrasena`:

```
HTTP/1.1 400 Bad Request

{
  "mensaje":"Falta el parámetro 'contrasena'"
}
```

Respuesta en el caso que el usuario o contraseña sean incorrectos:

```
HTTP/1.1 401 Unauthorized

{
  "mensaje":"Nombre de usuario o contraseña inválidos."
}
```

## Servicio Web: Consulta de depósitos

Este servicio retorna una lista de depósitos dentro de un rango de fechas, con una fecha de inicio y una fecha final.

Cabecera y ruta:

```sh
Content-Type: application/json
x-access-token: token
GET /depositos?inicio=`inicio`&fin=`fin`
```
Parámetros de entrada y salida:

| Tipo           | Parámetro    | Descripción                                                                                                                          |
|----------------|--------------|--------------------------------------------------------------------------------------------------------------------------------------|
| Entrada        | `inicio`      | Fecha de inicio. Formato `año-mes-dia`. Ej. 2015-07-31                                                                                        |
| Entrada        | `fin`        | Fecha de finalización. Formato `año-mes-dia`. Ej. 2015-08-31 
| Entrada         | `token`      | Cadena de caracteres temporal utilizado para acceder a los servicios web en lugar de usuario y contraseña. Máximo de 255 caracteres. |                                                                                   |
| Salida         | `array de objetos json`       | La petición genera un array de depósitos en formato json.

Ejemplo con `curl`:

Consulta de depósitos entre las fechas `incio=2015-07-31` y `fin=2015-08-31` de la siguiente forma:

```sh
curl -H "x-access-token: KgeLAtkJLGXwMswx88QZ" -i "http://test.agetic.gob.bo/banco-union-extractos/api/v1/depositos?inicio=2015-07-31&fin=2015-08-31"

```

Respuesta en el caso de que la petición sea correcta:

```
HTTP/1.1 200 OK

[
    {
        "fechaMovimiento":"2015-07-31T00:00:00.000Z","tipoMovimiento":"C",
        "fecLiteral":"2015-07-31T14:44:05.000Z","numDocumento":54332617,
        "monto":280,
        "detalle":"HORAS: 10:44;DEPOSITANTE: STRATEGIA.COM.BO- DOMINIO PARA RENOVAR;AGENCIA: SUCURSAL SANTA CRUZ; EFECTIVO = 280 BS"
    },
    {...}
]
```
* Respuesta en el caso de que la petición sea incorrecta:

```
HTTP/1.1 400 Bad Request

{
  "mensaje": "Error en la petición. Revise los parámetros"
}
```


## Servicio Web: Consulta de un depósito

Consulta un deposito con número de documento (numDocumento) `:numero`

Cabecera y ruta:

```sh
Content-Type: application/json
x-access-token: token
GET /depositos/:numero
```
Parámetros de entrada y salida:

| Tipo           | Parámetro    | Descripción                                                                                                                          |
|----------------|--------------|--------------------------------------------------------------------------------------------------------------------------------------|
| Entrada        | `numero`      | Número de documento. Tipo `numero entero`.
| Entrada         | `token`      | Cadena de caracteres temporal utilizado para acceder a los servicios web en lugar de usuario y contraseña. Máximo de 255 caracteres. |                                                                                   | 
| Salida         | `objeto json`        | La petición genera un objeto en formato json.
| Salida         | `utilizado`        | La columna `utilizado` cambia a `TRUE`, lo cual significa que el depósito ha sido consultado.

Ejemplo con `curl`:

Consulta de un depósito con número de Documento `:numero = 10098670`.

```sh
curl -H "x-access-token: KgeLAtkJLGXwMswx88QZ" -i "http://test.agetic.gob.bo/banco-union-extractos/api/v1/depositos/10098670"

```

Respuesta en el caso que la solucitud sea correcta:

```
HTTP/1.1 200 OK


{
    "id":563,"fechaMovimiento":"2014-01-31T00:00:00.000Z",
    "fechaAdicion":"2014-01-31T00:00:00.000Z","numDocumento":10098670,
    "descripcion":"DEPOSITO A CUENTA","tipoMovimiento":"C",
    "monto":280,"numMovtoDiario":"524255415","fecLiteral":"2014-01-31T11:51:53.000Z",
    "detalle":"HORAS: 07:51;DEPOSITANTE: DOMINIO.BAG.COM.BO;AGENCIA: SUCURSAL SANTA CRUZ; EFECTIVO = 280 BS",
    "utilizado":true
}
```
* Respuesta en el caso de que `:numero = 0`:

```
HTTP/1.1 400 Bad Request

{
    "mensaje":"Ingrese otro valor diferente de 0"
}
```

* Respuesta en el caso de que `:numero` no exista o tenga mal formato:

```
HTTP/1.1 400 Bad Request

{
  "mensaje": "Error en la petición. Revise el parámetro"
}
```

## Servicio Web: Listar usuarios

Lista usuarios registrados en la base de datos.

Cabecera y ruta:

```sh
Content-Type: application/json
GET /usuarios
x-access-token: token
```
Parámetros de entrada y salida:

| Tipo           | Parámetro    | Descripción                                                                                                                          |
|----------------|--------------|--------------------------------------------------------------------------------------------------------------------------------------|
| Entrada         | `token`      | Cadena de caracteres temporal utilizado para acceder a los servicios web en lugar de usuario y contraseña. Máximo de 255 caracteres. |
| Salida         | `array de usuarios`| Listado de usuarios

Ejemplo con `curl`:

Listado de usuarios.

```sh
curl -H "x-access-token: KgeLAtkJLGXwMswx88QZ" -i "http://test.agetic.gob.bo/banco-union-extractos/api/v1/usuarios"

```

Respuesta en el caso de que la petición sea correcta:

```
HTTP/1.1 200 OK

[
    {
        "id":1,"usuario":"admin","contrasena":"",
        "createdAt":"2016-03-15T19:05:20.821Z",
        "updatedAt":"2016-03-15T19:05:20.821Z"
    },
    {
        "id":2,"usuario":"juanpablo","contrasena":"",
        "createdAt":"2016-03-21T22:30:47.760Z",
        "updatedAt":"2016-03-21T22:30:47.760Z"
    },
    {...}
]

```

## Servicio Web: Crear usuario

Crea un nuevo usuario con nombr de usuario `usuario` y contraseña `contrasena`

Cabecera y ruta:

```sh
Content-Type: application/json
POST /usuarios
x-access-token: token
```
Parámetros de entrada y salida:

| Tipo           | Parámetro    | Descripción                                                                                                                          |
|----------------|--------------|--------------------------------------------------------------------------------------------------------------------------------------|
| Entrada/Salida | `usuario`    | Nombre de usuario. Máximo de 255 caracteres.                                                                                         |
| Entrada/Salida | `contrasena` | Contraseña del usuario. Máximo de 255 caracteres.                                                                                    |
| Entrada         | `token`      | Cadena de caracteres temporal utilizado para acceder a los servicios web en lugar de usuario y contraseña. Máximo de 255 caracteres. |

Ejemplo con `curl`:

Creación de un nuevo usuario con `usuario = test` y `contrasena = test`.

```sh
curl -H "Content-Type: application/json" -H "x-access-token: KgeLAtkJLGXwMswx88QZ" -X POST -d '{"usuario":"test","contrasena":"test"}' http://test.agetic.gob.bo/banco-union-extractos/api/v1/usuarios

```

Respuesta en el caso de que la petición sea correcta:

```
{
    "id":5,"usuario":"test","contrasena":"",
    "updatedAt":"2016-03-23T22:40:07.429Z",
    "createdAt":"2016-03-23T22:40:07.429Z"
}
```

* Respuesta en el caso de que la petición sea incorrecta:

```
HTTP/1.1 400 Bad Request

{
  "mensaje": "Problemas en el formato JSON"
}
```

## Servicio Web: Actualizar un usuario

Actualiza un usuario existente con id `:id`

Cabecera y ruta:

```sh
Content-Type: application/json
PUT /usuarios/:id
x-access-token: token
```
Parámetros de entrada y salida:

| Tipo           | Parámetro    | Descripción                                                                                                                          |
|----------------|--------------|--------------------------------------------------------------------------------------------------------------------------------------|
| Entrada/Salida         | `usuario`    | Nombre de usuario. Máximo de 255 caracteres.                                                                                         |
| Entrada/Salida         | `contrasena` | Contraseña del usuario. Máximo de 255 caracteres.                                                                                    |
| Entrada         | `id`      | El `id` del usuario que se quiere actualizar  |
| Entrada         | `token`      | Cadena de caracteres temporal utilizado para acceder a los servicios web en lugar de usuario y contraseña. Máximo de 255 caracteres. |

Ejemplo con `curl`:

Actualzar un registro en usuarios con `usuario = test` y `contrasena = testcambio` e `id = 5` Se cambiara la contraseña.

```sh
curl -H "Content-Type: application/json" -H "x-access-token: KgeLAtkJLGXwMswx88QZ" -X PUT -d '{"usuario":"test","contrasena":"testcambio"}' http://test.agetic.gob.bo/banco-union-extractos/api/v1/usuarios/5

```

Respuesta en el caso de que la petición sea correcta:

```
{
    "id":5,"usuario":"test","contrasena":"",
    "createdAt":"2016-03-23T22:40:07.429Z",
    "updatedAt":"2016-03-23T22:57:52.787Z"
}
```

## Servicio Web: Eliminar un usuario

Elimina un usuario existente con id `:id`

Cabecera y ruta:

```sh
Content-Type: application/json
DELETE /usuarios/:id
x-access-token: token
```
Parámetros de entrada y salida:

| Tipo           | Parámetro    | Descripción                                                                                                                          |
|----------------|--------------|--------------------------------------------------------------------------------------------------------------------------------------|                                                                                   |
| Entrada         | `id`      | El `id` del usuario que se quiere eliminar  |
| Entrada         | `token`      | Cadena de caracteres temporal utilizado para acceder a los servicios web en lugar de usuario y contraseña. Máximo de 255 caracteres. |

Ejemplo con `curl`:

Eliminar un registro en la tabla `usuarios` con `id = 5`. 

```sh
curl -H "Content-Type: application/json" -H "x-access-token: KgeLAtkJLGXwMswx88QZ" -X DELETE http://test.agetic.gob.bo/banco-union-extractos/api/v1/usuarios/5

```

Respuesta en el caso de que la petición sea correcta:

```
HTTP/1.1 200 OK

{
    "mensaje":"Usuario eliminado"
}
```

* Respuesta en el caso de que la petición sea incorrecta:

```
HTTP/1.1 400 Bad Request

{
    "mensaje": "No existe el usuario. Revise el parámetro"
}
```