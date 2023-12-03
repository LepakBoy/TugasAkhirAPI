const db = require("../models");
const Order = db.order;
const OrderDetail = db.orderDetail;

exports.getAllOrder = async (req, res) => {
  let errCode = 0;
  let resMessage = "";

  const orders = await Order.findAll()
    .then((order) => {
      if (!order) {
        errCode = 404;
        resMessage = "not found";
        return;
      }

      errCode = 200;
      resMessage = "success";
      return JSON.parse(JSON.stringify(order));
      // simulate error handling
      // throw new Error("test");
    })
    .catch((error) => {
      errCode = 404;
      resMessage = "not found";
      console.log(error, "error get all order");
      return error;
    });

  res.status(errCode).send({ resMessage: resMessage, data: orders });
};

exports.getOrderById = async (req, res) => {
  errCode = 0;
  resMessage = "";
  const { id } = req.body;
  const targetOrder = await Order.findAll({
    where: {
      id: id,
    },
  })
    .then((order) => {
      if (order.length < 1) {
        errCode = 404;
        resMessage = "not found";
        return [];
      }
      errCode = 200;
      resMessage = "success";
      return JSON.parse(JSON.stringify(order));
    })
    .catch((error) => {
      errCode = 404;
      resMessage = "not found";
      return error;
    });

  res.status(errCode).send({ message: resMessage, data: targetOrder });
};

exports.createOrder = async (req, res) => {
  try {
    const { orderDetails, userId, status, totalPrice, totalQty } = req.body;
    const newOrder = await Order.create(
      {
        userId: userId,
        totalPrice: totalPrice,
        status: status,
        totalQty: totalQty,
        orderDetails: orderDetails,
      },
      {
        include: "orderDetails",
      }
    );

    const newOrderDetails = await OrderDetail.bulkCreate(orderDetails);

    res.status(200).send({
      message: "success",
      data: { newOrder, newOrderDetails },
    });
  } catch (error) {
    console.log(error, "error create order");
    res.status(500).send({ message: "error", data: error });
  }
};
