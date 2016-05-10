// =================================================================
// obtener los paquetes necesario ========================================
// =================================================================
var express 		= require('express');
var app             = express();
var bodyParser      = require('body-parser');
var morgan          = require('morgan');
var jwt    			= require('jsonwebtoken'); // para crear, firmar, y verificar tokens
var config 			= require('./config/config');
var config2 		= require('./config/config2');
var model 			= require('./models');
var cors            = require('cors');
var bcrypt          = require('bcrypt');
//validador
var validator 	= require('is-my-json-valid');
app.use(cors());
var validate = validator({
  required: true,
  type: 'object',
  properties: {
    checkpresence: {
      required: true,
      type: 'string'
    }
  }
});

// =================================================================
// configuuración ===================================================
// =================================================================
var port = process.env.PORT || 8080; // puerto
// usamos body parser para obtener info de los parametros via POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//
app.set('superSecreto', config2.secret); // variable secreta
// usamos morgan para imprimir logs en development
app.use(morgan('dev'));
// =================================================================
// rutas ==========================================================
// =================================================================
// ruta basica (http://localhost:8080)
app.get('/', function(req, res) {
	res.header('Content-Type', 'application/json');
	res.status(403).json({mensaje:'Token no provisto'});
});
// ---------------------------------------------------------
// obtenemos una instancia de Router para las rutas de la API
// ---------------------------------------------------------
var apiRoutes = express.Router();

// ---------------------------------------------------------
// autenticación (no se requiere middleware pues no es una ruta protegida)
// ---------------------------------------------------------

// http://localhost:8080/api/v1/tokens

apiRoutes.post('/tokens', function(req, res) {
console.log(req.body);
	   
    model.usuario.findOne({
		where: {usuario: req.body.usuario}
	}).then(function(usuario){
        
       if(!validate({checkpresence:req.body.usuario}))
		{
			res.status(400).json({ mensaje: 'Falta el parámetro \'usuario\'' });
		}else if(!validate({checkpresence:req.body.contrasena}))
			{
				res.status(400).json({ mensaje: 'Falta el parámetro \'contrasena\'' });
			}else if (!usuario) {
			res.status(401).json({ mensaje: "Nombre de usuario o contraseña inválidos." });
		} else if (usuario) {
			// verifica si las contraseñas son iguales
			if (!bcrypt.compareSync(req.body.contrasena, usuario.contrasena)) {
				res.status(401).json({ mensaje: "Nombre de usuario o contraseña inválidos." });
			} else {

				// si el usuario y al contraseña son correctas, se crea un token
				var token = jwt.sign({"usuario":usuario.usuario}, app.get('superSecreto'), {
					expiresInMinutes: 1440 // token expira en 24 horas
				});
				res.header('Content-Type', 'application/json');
				res.status(201).json({
					token: token,
					usuario: usuario.usuario
				});

			}
		}else{
			res.status(500).json({mensaje:'error interno'});
		}
	}).catch(function(error){
		console.log(error.stack);
		res.status(500).json({mensaje:error.message});
	});
});
// ---------------------------------------------------------
// middleware que verifica token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {
	// busca un token en la cabecera o para metros de url o los parametros de POST 
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];
	// decode token
	if (token) {// verifica la palabra secreta y el periodo de expiracion del token
		jwt.verify(token, app.get('superSecreto'), function(err, decoded) {
			if (err) {
				return res.status(401).json({mensaje: 'Token o nombre de usuario inválidos.' });
			} else {
				// si todo esta bien, se almacena el token para su uso en otras rutas
				req.decoded = decoded;
				next();
			}
		});
	} else {

		// si no hay token, se muestra un error.
		return res.status(403).send({
			mensaje: 'Token no provisto'
		});
	}
});

// ---------------------------------------------------------
// rutas protegidas
// ---------------------------------------------------------
apiRoutes.get('/', function(req, res) {
	res.json({ mensaje: 'Bienvenido a la API!' });
});

//// Encontrar registros desde una fecha x
apiRoutes.get('/registros', function(req,res){
	model.registro.findAll({
    attributes: ['hora', 'dispositivo', 'id', 'fecha', 'usuario'],
		where:{
            fecha:{
                gte: req.query.inicio
                }
              }
}).then(function(result) {
		var groupedData = groupBy(result, ['fecha', 'usuario']);
        res.json(groupedData);
        
	}).catch(function(error){
		console.log(error);
		res.status(400).json({mensaje: "Error en la petición. Revise los parámetros"});
	});
});
//// FIN Encontrar movimientos según una fecha de inicio y otra fecha final

//Encontrar un movimiento en particular,según el numDocumento
apiRoutes.get('/depositos/:numero', function(req,res){
 model.movimiento.findOne({
  where:{numDocumento: req.params.numero}
 }).then(function(result) {
     
     if(req.params.numero == 0){
         res.status(400).json({ mensaje: 'Ingrese otro valor diferente de 0' });
     }else{
        if (result) {
          var data = req.body;
          data.utilizado = true;
          result.updateAttributes(data).then(function(result) {         
          });
        }
      }  
        console.log(result);
        res.json(result);
 
}).catch(function(error){
  console.log(error);
  res.status(400).json({mensaje: "Error en la petición. Revise el parámetro"});
 });
});
//FIN Encontrar un movimiento en particular,según el numDocumento

// ---------------------------------------------------------
// U S U A R I O S
// ---------------------------------------------------------

//// Listar usuarios
apiRoutes.get('/usuarios', function(req,res){
	model.usuario.findAll({}).then(function(result) {
		console.log(result);
		res.json(result);
	}).catch(function(error){
		console.log(error);
		res.json({mensaje: "error al conectar a la tabla usuarios"});
	});
});

//// Crear usuario
apiRoutes.post('/usuarios', function(req,res){
                model.usuario.findOne({
                                    where:{
                                        usuario: req.body.usuario
                                    }
                                }).then(function(result) {
                                    if(result){      
                                        console.log(result);
                                        res.json({message: "usuario ya existe"});
                                    }else{
                                        model.usuario.create({
                                          usuario: req.body.usuario,
                                          contrasena: bcrypt.hashSync(req.body.contrasena, 10)                                            
                                        })
                                        res.json({message: "usuario creado"});
                                    }
                            }).catch(function(error){
                                        console.log(error);
                                        res.json({mensaje: "error al conectar a la tabla usuarios"});
                                        });
});



//// Actualizar usuario
apiRoutes.put('/usuarios/:id', function(req,res){
	model.usuario.findOne({
      where: {
        id: req.params.id}
}).then(function(result) {
    if(result){
      result.updateAttributes({
        usuario: req.body.usuario,
        contrasena: bcrypt.hashSync(req.body.contrasena, 10)
      }).then(function(result) {
		console.log(result);
		res.json(result);
      });
    }
  }).catch(function(error){
		console.log(error);
		res.json({mensaje: "error al conectar a la tabla usuarios para actualizar usuario"});
	});
});

//// Eliminar usuario
apiRoutes.delete('/usuarios/:id', function(req,res){
	model.usuario.destroy({
      where: {
        id: req.params.id
    }
    }).then(function(result) {
		res.json({mensaje: "Usuario eliminado"});
	}).catch(function(error){
		console.log(error);
		res.status(400).json({mensaje: "No existe el usuario. Revise el parámetro"});
	});
});



// ---------------------------------------------------------
// F I N    U S U A R I O S
// ---------------------------------------------------------

// /api/v1
app.use('/api/v1', apiRoutes);
app.use(function(req, res, next) {
  res.status(404).send('Lo sentimos, no se pudo encontrar el recurso!');
  
});

//// verifica si hay errores en el formato json
app.use(function(err, req, res, next) {

    if (err instanceof SyntaxError) {
      res.status(400).json({mensaje: "Problemas en el formato JSON"});
  } else {
    res.status(500).send('Error interno!');
   console.error(err.stack);
    //next();
  }
});

////////////////////////
/////////////function for nested json

// "keys" is an array of properties to group on.
function groupBy(data, keys) { 

    if (keys.length == 0) return data;

    // The current key to perform the grouping on:
    var key = keys[0];

    // Loop through the data and construct buckets for
    // all of the unique keys:
    var groups = {};
    for (var i = 0; i < data.length; i++)
    {
        var row = data[i];
        var groupValue = row[key];

        if (groups[groupValue] == undefined)
        {
            groups[groupValue] = new Array();
        }

        groups[groupValue].push(row);
    }

    // Remove the first element from the groups array:
    keys.reverse();
    keys.pop()
    keys.reverse();

    // If there are no more keys left, we're done:
    if (keys.length == 0) return groups;

    // Otherwise, handle further groupings:
    for (var group in groups)
    {
        groups[group] = groupBy(groups[group], keys.slice());
    }

    return groups;
}



// =================================================================
// inicar el servidor ================================================
// =================================================================
app.listen(port);
console.log('La magia esta en http://localhost:' + port);
