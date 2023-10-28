module.exports = (sequelize, Sequelize) => {
  const Menu = sequelize.define("menus", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    category: {
      type: Sequelize.STRING,
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
    userId: {
      type: Sequelize.STRING,
      references: {
        model: "users",
        key: "id",
      },
    },
  });

  return Menu;
};
