"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn(
          "Contents",
          "publishedDate",
          {
            type: Sequelize.DataTypes.STRING
          },
          { transaction: t }
        ),
        queryInterface.changeColumn(
          "Contents",
          "expireDate",
          {
            type: Sequelize.DataTypes.STRING
          },
          { transaction: t }
        )
      ]);
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn(
          "Contents",
          "publishedDate",
          {
            type: Sequelize.DataTypes.DATE
          },
          { transaction: t },
          queryInterface.changeColumn(
            "Contents",
            "expireDate",
            {
              type: Sequelize.DataTypes.DATE
            },
            { transaction: t }
          )
        )
      ]);
    });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
