var port = process.env.PORT || 8080; // used to create, sign, and verify tokens

var should = require('should'),
    supertest = require('supertest');

// var server = supertest.agent('http://localhost:' + port + '/api/v1');
var server = supertest.agent('http://localhost:' + port + '/api/v1');

describe('Tokens:', function () {
  // Respuestas de errores comunes
  console.log("---------------------------inicio-----------------");
  it('debe retornar error en la página principal', function (done) {
    server
    .get('/')
    .expect('Content-Type', /json/)
    .expect(403)
    .end(function (err, res) {
      if (err) {
        throw err;
      }
      //console.log("---------------------------status-----------------");
      //console.log(res.status);
      //console.log("---------------------------body-----------------");
      //console.log(res.body);
      res.status.should.equal(403);
      //should(res).have.property('status', 403);
      res.body.mensaje.should.equal('Token no provisto');
      //should(res).have.property('mensaje', 'Token no provisto');
      done();
    });
  });

  // Al tratar de ingresar a la URL de autenticación
  describe('Autenticación:', function () {
    var tokens_path = '/tokens';
    var body_ok = {
      usuario: 'juanpablo',
      contrasena: 'juanpablo'
    };
    var body_incorrecto = {
      usuario: 'nombre-usuario',
      contrasena: 'inexistente'
    };
    var body_sin_contrasena = {
      usuario: 'juanpablo'
    };
    var body_sin_usuario = {
      contrasena: 'juanpablo'
    };

    // Respuestas ok
    it('debe retornar token de autenticación', function (done) {
      server
      .post(tokens_path)
      .send(body_ok)
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        res.status.should.equal(201);
        res.body.should.have.property('token');
        Object.keys(res.body).length.should.equal(2);
        done();
      });
    });

    // // Respuestas de error
    // it('debe retornar error 400 cuando la estructura JSON sea incorrecto', function (done) {
    //   server
    //   .post(tokens_path)
    //   .send('{"usuario":"juanpablo", "contrasena": "juanpablo}') // Falta última comilla
    //   .expect('Content-Type', /json/)
    //   .expect(400)
    //   .end(function (err, res) {
    //     if (err) {
    //       throw err;
    //     }
    //     res.status.should.equal(400);
    //     res.body.should.have.property('mensaje');
    //     Object.keys(res.body).length.should.equal(1);
    //     res.body.mensaje.should.equal('Problemas en el formato JSON');
    //     done();
    //   });
    // });

    it('debe retornar error 400 por falta del parámetro "usuario"', function (done) {
      server
      .post(tokens_path)
      .send(body_sin_usuario)
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        res.status.should.equal(400);
        res.body.should.have.property('mensaje');
        Object.keys(res.body).length.should.equal(1);
        res.body.mensaje.should.equal('Falta el parámetro \'usuario\'');
        done();
      });
    });

    it('debe retornar error 400 por falta del parámetro "contrasena"', function (done) {
      server
      .post(tokens_path)
      .send(body_sin_contrasena)
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        res.status.should.equal(400);
        res.body.should.have.property('mensaje');
        Object.keys(res.body).length.should.equal(1);
        res.body.mensaje.should.equal('Falta el parámetro \'contrasena\'');
        done();
      });
    });

    it('debe retornar error 401 por usuario y contraseña incorrectos', function (done) {
      server
      .post(tokens_path)
      .send(body_incorrecto)
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        res.status.should.equal(401);
        res.body.should.have.property('mensaje');
        Object.keys(res.body).length.should.equal(1);
        res.body.mensaje.should.equal('Nombre de usuario o contraseña inválidos.');
        done();
      });
    });
  });
});
