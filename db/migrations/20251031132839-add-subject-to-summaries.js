'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Summaries', 'subject', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Untitled Summary'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Summaries', 'subject');
  }
};