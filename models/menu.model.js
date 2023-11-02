const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Menu = sequelize.define("menus", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    category: {
      type: Sequelize.STRING,
    },
    criteria: {
      type: Sequelize.ARRAY(DataTypes.STRING),
    },
    description: {
      type: Sequelize.STRING,
    },
    isAvailable: {
      type: Sequelize.BOOLEAN,
    },
    image: {
      type: Sequelize.STRING,
    },
    rating: {
      type: Sequelize.STRING,
    },
    price: {
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
