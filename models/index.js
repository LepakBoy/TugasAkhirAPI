const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// #INIT TABLE TO DB
db.user = require("../models/user.model.js")(sequelize, Sequelize);
// db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.menu = require("../models/menu.model.js")(sequelize, Sequelize);
db.order = require("../models/order.model.js")(sequelize, Sequelize);
db.orderDetail = require("../models/order-detail.model.js")(
  sequelize,
  Sequelize
);
db.criteria = require("../models/criteria.model.js")(sequelize, Sequelize);
db.canteenStatus = require("../models/canteen-status.model.js")(
  sequelize,
  Sequelize
);

db.order.hasMany(db.orderDetail, { as: "orderDetails", foreignKey: "orderId" });
db.orderDetail.belongsTo(db.order, {
  foreignKey: "orderId",
});

// ============= join table between user and role
// db.role.belongsToMany(db.user, {
//   through: "user_roles"
// });
// db.user.belongsToMany(db.role, {
//   through: "user_roles"
// });

db.ROLES = ["user", "admin", "kitchen"];

module.exports = db;
