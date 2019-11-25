'use strict';
module.exports = (sequelize, DataTypes) => {
  const Citas_Medicas = sequelize.define('Citas_Medicas', {
    numero_ficha:DataTypes.INTEGER,
    estado: DataTypes.BOOLEAN,
    codigo_p: DataTypes.INTEGER,
    turno: DataTypes.TEXT,
    medico: DataTypes.TEXT,
    especialidad : DataTypes.STRING,
    hora: DataTypes.TEXT,
    saldo_total:DataTypes.DOUBLE,
    id_especialidad: DataTypes.INTEGER,
    id_Paciente: DataTypes.INTEGER,
    id_user: DataTypes.INTEGER,
    id_medico: DataTypes.INTEGER,
    createdAt:DataTypes.DATE,
    updatedAt:DataTypes.DATE
  }, {});
  Citas_Medicas.associate = function(models) {
    // associations can be defined here
    Citas_Medicas.hasMany(models.Consultas, {
      foreignKey: 'id_cita',
    });
    Citas_Medicas.hasMany(models.emergencia, {
      foreignKey: 'idCita',
    });
    Citas_Medicas.belongsTo(models.Pacientes, {
      foreignKey: 'id_Paciente',
      onDelete: 'CASCADE'
    });
  };
  return Citas_Medicas;
};