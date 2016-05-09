'use strict';
module.exports = function(sequelize, DataTypes) {
  var movimiento = sequelize.define('registro', {

    hora: DataTypes.STRING,
    fecha: DataTypes.STRING,
    usuario: DataTypes.STRING,
    dispositivo: DataTypes.STRING,
    reg_id: DataTypes.INTEGER,
    personal_id: DataTypes.INTEGER

  }, {
    timestamps: false,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return movimiento;
};
