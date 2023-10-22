module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("roles", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
  });

  // Role.associate = (models) => {
  //   Role.hasMany(models.user, { foreignKey: "roleId" });
  // };

  return Role;
};
