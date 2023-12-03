const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const OrderDetail = sequelize.define("orderDetails", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    menuId: {
      type: DataTypes.UUID,
      references: {
        model: "menus",
        key: "id",
      },
    },
    qty: {
      type: Sequelize.INTEGER,
    },
    price: {
      type: Sequelize.INTEGER,
    },
  });

  return OrderDetail;
};
