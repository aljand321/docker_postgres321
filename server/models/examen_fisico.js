'use strict';
module.exports = (sequelize, DataTypes) => {
  const examen_fisico = sequelize.define('examen_fisico', {
    estado_update: DataTypes.BOOLEAN,
    peso: DataTypes.STRING,
    talla: DataTypes.STRING,
    temperatura: DataTypes.STRING,
    frecuencia_cardiaca: DataTypes.STRING,
    respiracion: DataTypes.STRING,
    presion: DataTypes.STRING,
    saturacion_oxigeno: DataTypes.STRING,
    fecha_revision: DataTypes.STRING,
    otros:DataTypes.TEXT,

    pulso:DataTypes.STRING,
    estado_nutricional:DataTypes.STRING,
    presion_brazo_isquierdo:DataTypes.STRING,
    presion_brazo_derecho:DataTypes.STRING,
    imc:DataTypes.STRING,

    id_paciente: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER
  }, {});
  examen_fisico.associate = function(models) {
    // associations can be defined here
    examen_fisico.belongsTo(models.Pacientes, {
      foreignKey: 'id_paciente',
      onDelete: 'CASCADE'
    });
  };
  return examen_fisico;
};