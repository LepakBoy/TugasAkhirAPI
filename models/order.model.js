const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("orders", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
    },
    status: {
      type: Sequelize.STRING(12),
    },
    totalQty: {
      type: Sequelize.INTEGER,
    },
    totalPrice: {
      type: Sequelize.INTEGER,
    },
  });

  return Order;
};
