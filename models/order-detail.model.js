const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const OrderDetail = sequelize.define("orderDetails", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
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
    createdDate: {
      type: Sequelize.DATE,
    },
    updatedDate: {
      type: Sequelize.DATE,
    },
  });

  return OrderDetail;
};
