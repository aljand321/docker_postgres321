'use strict';
module.exports = (sequelize, DataTypes) => {
  const PapeletaInternacion = sequelize.define('PapeletaInternacion', {
    estado: DataTypes.BOOLEAN,
    estado_update: DataTypes.BOOLEAN,
    tipoConsulta: DataTypes.STRING,
    fechaIngreso: DataTypes.STRING,
    Historial: DataTypes.INTEGER,
    nombreDoctor: DataTypes.TEXT,
    diagnostico: DataTypes.TEXT,
    especialidad: DataTypes.STRING,
    idConsultaMedica: DataTypes.INTEGER,
    idEmergencia: DataTypes.INTEGER,
    id_medico: DataTypes.INTEGER,
    id_especialidad: DataTypes.INTEGER
  }, {});
  PapeletaInternacion.associate = function(models) {
    // associations can be defined here
    PapeletaInternacion.hasMany(models.Internaciones, {
      foreignKey: 'idPinternacion',
    });
    PapeletaInternacion.hasMany(models.traslados, {
      foreignKey: 'id_paleta_internacion',
    });


    PapeletaInternacion.belongsTo(models.Consultas, {
      foreignKey: 'idConsultaMedica',
      onDelete: 'CASCADE'
    });
    PapeletaInternacion.belongsTo(models.emergencia, {
      foreignKey: 'idEmergencia',
      onDelete: 'CASCADE'
    });
  };
  return PapeletaInternacion;
};