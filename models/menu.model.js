const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Menu = sequelize.define("menus", {
    id: {
      type: DataTypes.UUID,
      // type: Sequelize.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING(255),
    },
    category: {
      type: Sequelize.STRING(64),
    },
    description: {
      type: Sequelize.STRING(255),
    },
    isAvailable: {
      type: Sequelize.BOOLEAN,
    },
    image: {
      type: Sequelize.STRING(255),
    },
    price: {
      type: Sequelize.INTEGER,
    },
    W_price: {
      type: Sequelize.INTEGER,
    },
    W_time: {
      type: Sequelize.INTEGER,
    },
    // userId: {
    //   type: Sequelize.STRING,
    //   references: {
    //     model: "users",
    //     key: "id",
    //   },
    // },
  });

  return Menu;
};
