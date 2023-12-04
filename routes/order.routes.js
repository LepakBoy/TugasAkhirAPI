const OrderController = require("../controllers/order.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.get("/api/order", [authJwt.verifyToken], OrderController.getAllOrder);

  app.get("/api/order-by-id", OrderController.getOrderById);
  app.post("/api/order", OrderController.createOrder);
  app.get("/api/init-order", OrderController.initOrder);
};
