const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Criteria = sequelize.define("criterias", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING(64),
    },
    weight: {
      type: Sequelize.INTEGER,
    },
    remark: {
      type: Sequelize.STRING(255),
    },
  });

  return Criteria;
};
