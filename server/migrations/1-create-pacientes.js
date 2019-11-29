'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Pacientes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      numeroHistorial: {
        allowNull:false,
        type: Sequelize.INTEGER
      },      
      nombre: {
        allowNull:false,
        type: Sequelize.STRING
      },
      apellidop:  {
        allowNull:false,
        type: Sequelize.STRING
      },
      apellidom:  {
        type: Sequelize.STRING
      },
      ci: {
        allowNull:false,
        type: Sequelize.STRING
      },
      fechanacimiento: {
        allowNull:false,
        type: Sequelize.STRING
      },
      sexo:  {
        allowNull:false,
        type: Sequelize.STRING
      },
      estadocivil:  {
        type: Sequelize.STRING
      },
      direccion:  {
        
        type: Sequelize.STRING
      },
      zona:  {
        
        type: Sequelize.STRING
      },
      telef: {
       
        type: Sequelize.INTEGER
      },
      ocupacion:  {
        
        type: Sequelize.STRING
      },
      idiomas:  {
       
        type: Sequelize.STRING
      },
      lugranacimiento:  {
        
        type: Sequelize.STRING
      },
      departameto: {
        
        type: Sequelize.STRING
      },
      provincia:  {
       
        type: Sequelize.STRING
      },
      municipio: {
       
        type: Sequelize.STRING
      },
      id_user:{
        type:Sequelize.STRING
      },
      tipoSangre:{
        type:Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Pacientes');
  }
};