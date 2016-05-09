# MANUAL DE INSTALACION DE LA API REST. 

Actualizar el repositorio
```sh
sudo apt-get update
sudo apt-get upgrade
```

Instalar nvm
```sh
curl https://raw.githubusercontent.com/creationix/nvm/v0.24.0/install.sh | bash

```
Reiniciar la terminal.

Instalar node
```sh
nvm install 4.4.0
```

Instalar npm
```sh
sudo apt-get install npm
```

Instalar sequelize-cli
```sh
npm install sequelize-cli -g
```

Clonar la aplicacion del repositorio de Gitlab
```sh
git clone https://tuusuario:tucontrasena@gitlab.geo.gob.bo/agetic/banco-union-extractos.git
```

Nota. si obtiene el mensaje: “server certificate verification failed”, hacer: 
```sh
git config  --global http.sslverify false
```

Ingresar al directorio del proyecto
```sh
cd banco-union-extractos 
```

Configurar la base de datos en config/config.json.
```sh
cp config/config.json.sample config/config.json 
```

Instalar paquetes
```sh
npm install 
```

Crear usuario admin. Por defecto el usuario y contrasena son: 'admin'. Si quiere cambiarlos, modifique el archivo 'seeders/20160311145355-addadmin.js'. Luego ejecute
```sh
sequelize db:seed:all 
```

## Configuracion de Supervisord

Instalar Supervisord
```sh
sudo apt-get install supervisor
sudo /etc/init.d/supervisor start
```

Crear el archivo de configuracion
```sh
touch  /etc/supervisor/conf.d/miaplicacionservidor.conf
```

Ejemplo de contenido del archivo miaplicacionservidor.conf. Debe cambiar nombres de ruta con las que corresponden.
```sh
[program:ws-banco-union-extractos]
command=/ruta_absoluta_a_node/node /ruta_absoluta_a_la_aplicacion/server.js  
autostart=true  
autorestart=true  
environment=NODE_ENV=production  
stderr_logfile=/var/log/nodebancounion.err.log  
stdout_logfile=/var/log/nodebancounion.out.log
user=ramiro
```

Para reiniciar supervisord
```sh
sudo /etc/init.d/supervisor restart
```

## Ejecutar tests de integración (con mocha)
Instalar mocha
```sh
apt-get install mocha -g
```
Ejecutar tests
```sh
mocha
```

