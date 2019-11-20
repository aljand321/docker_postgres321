'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('emergencia', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fechaAtencion: {
        type: Sequelize.STRING
      },
      Nhistorial: {
        type: Sequelize.BIGINT
      },
      nombreDoctor: {
        type: Sequelize.TEXT
      },     
      motivoConsulta: {
        type: Sequelize.TEXT
      },
      diagnostico: {
        type: Sequelize.JSON
      },
      tratamiento: {
        type: Sequelize.TEXT
      },
      observaciones: {
        type: Sequelize.TEXT
      },
      idCita: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Citas_Medicas',
          key: 'id',
          as: 'idCita',
        }
      },
      idDoctor: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('emergencia');
  }
};