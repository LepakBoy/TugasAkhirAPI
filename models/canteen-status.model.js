const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const CanteenStatus = sequelize.define("canteenStatus", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    isOpen: {
      type: Sequelize.BOOLEAN,
    },
  });
  return CanteenStatus;
};
