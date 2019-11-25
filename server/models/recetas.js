'use strict';
module.exports = (sequelize, DataTypes) => {
  const Recetas = sequelize.define('Recetas', {
    id_consulta: DataTypes.INTEGER,
    id_emergencia: DataTypes.INTEGER,
    estado_atendido:DataTypes.BOOLEAN,
    estado:DataTypes.BOOLEAN,
    tipoConsulta: DataTypes.STRING,
    historiaClinica: DataTypes.INTEGER,
    fecha: DataTypes.STRING,
    doctor: DataTypes.TEXT,
    medicamentos: DataTypes.JSON,
    id_medico:DataTypes.INTEGER
  }, {});
  Recetas.associate = function(models) {
    // associations can be defined here
    Recetas.belongsTo(models.Consultas, {
      foreignKey: 'id_consulta',
      onDelete: 'CASCADE'
    });
    Recetas.belongsTo(models.emergencia, {
      foreignKey: 'id_emergencia',
      onDelete: 'CASCADE'
    });

  };
  return Recetas;
};