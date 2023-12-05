const OrderController = require("../controllers/order.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.get("/api/order", [authJwt.verifyToken], OrderController.getAllOrder);
  app.post("/api/order", OrderController.createOrder);
  app.get("/api/order/orderById", OrderController.getOrderById);
  app.get("/api/order/init-order", OrderController.initOrder);
  app.get("/api/order/orderDetails", OrderController.getAllOrderDetails);
};
