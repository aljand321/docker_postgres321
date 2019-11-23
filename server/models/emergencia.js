'use strict';
module.exports = (sequelize, DataTypes) => {
  const emergencia = sequelize.define('emergencia', {
    estado_update: DataTypes.BOOLEAN,
    fechaAtencion: DataTypes.STRING,
    Nhistorial: DataTypes.BIGINT,
    nombreDoctor: DataTypes.TEXT,
    motivoConsulta: DataTypes.TEXT,
    diagnostico: DataTypes.JSON,
    tratamiento: DataTypes.TEXT,
    observaciones: DataTypes.TEXT,
    idCita: DataTypes.INTEGER,
    idDoctor: DataTypes.STRING,
  }, {});
  emergencia.associate = function(models) {
    // associations can be defined here
    emergencia.hasMany(models.Recetas, {
      foreignKey: 'id_emergencia',
    });
    emergencia.hasMany(models.PapeletaInternacion, {
      foreignKey: 'idEmergencia',
    });
    emergencia.belongsTo(models.Citas_Medicas, {
      foreignKey: 'idCita',
      onDelete: 'CASCADE'
    });
  };
  return emergencia;
};