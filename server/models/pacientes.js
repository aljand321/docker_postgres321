'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pacientes = sequelize.define('Pacientes', {
    numeroHistorial: DataTypes.INTEGER,
    nombre: DataTypes.STRING,
    apellidop: DataTypes.STRING,
    apellidom: DataTypes.STRING,
    ci: DataTypes.STRING,
    fechanacimiento: DataTypes.STRING,
    sexo: DataTypes.STRING,
    estadocivil: DataTypes.STRING,
    direccion: DataTypes.STRING,
    zona: DataTypes.STRING,
    telef: DataTypes.INTEGER,
    ocupacion: DataTypes.STRING,
    idiomas: DataTypes.STRING,
    lugranacimiento: DataTypes.STRING,
    departameto: DataTypes.STRING,
    provincia: DataTypes.STRING,
    municipio: DataTypes.STRING,
    id_user:DataTypes.STRING,
    tipoSangre:DataTypes.STRING
  }, {});
  Pacientes.associate = function(models) {
    // associations can be defined here
    Pacientes.hasMany(models.Citas_Medicas, {
      foreignKey: 'id_Paciente',
    });
    Pacientes.hasMany(models.Internaciones, {
      foreignKey: 'id_paciente',
    });
    Pacientes.hasMany(models.responsables, {
      foreignKey: 'id_paciente',
    });
    Pacientes.hasMany(models.antecedentes, {
      foreignKey: 'id_paciente',
    });
    Pacientes.hasMany(models.alergias, {
      foreignKey: 'id_paciente',
    });
    Pacientes.hasMany(models.examen_fisico, {
      foreignKey: 'id_paciente',
    });
  };
  return Pacientes;
};