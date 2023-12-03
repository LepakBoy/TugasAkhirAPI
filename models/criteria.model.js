const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Criteria = sequelize.define("criterias", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    timeRequired: {
      type: Sequelize.INTEGER,
    },
    numOfOrder: {
      type: Sequelize.INTEGER,
    },
    price: {
      type: Sequelize.INTEGER,
    },
  });

  return Criteria;
};
