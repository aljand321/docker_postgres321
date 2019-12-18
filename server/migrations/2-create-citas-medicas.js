'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Citas_Medicas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      numero_ficha: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      estado: {
        type: Sequelize.BOOLEAN, 
        allowNull: false, 
        defaultValue: true
      },
      estado_update: {
        type: Sequelize.BOOLEAN, 
        allowNull: false, 
        defaultValue: true
      },
      estado_atendido: {
        type: Sequelize.BOOLEAN
      },
      dia:{
        type: Sequelize.STRING
      },
      fecha:{
        type: Sequelize.STRING
      },
      codigo_p: {
        type: Sequelize.INTEGER,
      },
      turno: {
        type: Sequelize.TEXT
      },
      medico: {
        type: Sequelize.TEXT
      },
      especialidad: {
        type: Sequelize.STRING
      },
      hora: {
        type: Sequelize.TEXT
      },
      saldo_total: {
        type: Sequelize.DOUBLE
      },
      id_especialidad: {
        type: Sequelize.INTEGER
      },
      id_Paciente: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Pacientes',
          key: 'id',
          as: 'id_Paciente',
        }
      },
      id_user: {
        type: Sequelize.INTEGER
      },  
      id_medico: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Citas_Medicas');
  }
};