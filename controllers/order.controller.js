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
    res.status(200).send({
      message: "success",
      data: { newOrder },
    });
  } catch (error) {
    console.log(error, "error create order");
    res.status(500).send({ message: "error", data: error });
  }
};
async function createOrder() {
  try {
    const existingOrder = await Order.findAll();

    await Order.create(
      {
        userId: "1f66f52e-79b1-4e7d-b254-30d21a7766e7",
        totalPrice: 42000,
        status: "PLACED",
        totalQty: 2,
        orderDetails: [
          {
            menuId: "0145b2b7-6bb3-4962-a6a5-0d755d491b41",
            qty: 2,
            price: 70000,
            createdDate: "2023-12-03 21:53:48.718+07",
          },
          {
            menuId: "7c137334-19fd-4397-bf01-cd8edae91dfb",
            qty: 1,
            price: 50000,
            createdDate: "2023-12-03 21:53:48.718+07",
          },
          {
            menuId: "7c137334-19fd-4397-bf01-cd8edae91dfb",
            qty: 2,
            price: 50000,
            createdDate: "2023-12-03 21:53:48.718+07",
          },
        ],
      },
      {
        include: "orderDetails",
      }
    );
    await Order.create(
      {
        userId: "1f66f52e-79b1-4e7d-b254-30d21a7766e7",
        totalPrice: 33000,
        status: "PLACED",
        totalQty: 3,
        orderDetails: [
          {
            menuId: "2d829c91-208e-40da-bb51-f2a8f4e56c1e",
            qty: 2,
            price: 70000,
            createdDate: "2023-12-03 21:53:48.718+07",
          },
          {
            menuId: "7c137334-19fd-4397-bf01-cd8edae91dfb",
            qty: 4,
            price: 50000,
            createdDate: "2023-12-03 21:53:48.718+07",
          },
          {
            menuId: "38262881-afe1-4b04-9883-db44eff6a9f1",
            qty: 3,
            price: 50000,
            createdDate: "2023-12-03 21:53:48.718+07",
          },
        ],
      },
      {
        include: "orderDetails",
      }
    );
    await Order.create(
      {
        userId: "1f66f52e-79b1-4e7d-b254-30d21a7766e7",
        totalPrice: 59000,
        status: "PLACED",
        totalQty: 4,
        orderDetails: [
          {
            menuId: "38262881-afe1-4b04-9883-db44eff6a9f1",
            qty: 2,
            price: 70000,
            createdDate: "2023-12-01 21:53:48.718+07",
          },
          {
            menuId: "2d829c91-208e-40da-bb51-f2a8f4e56c1e",
            qty: 1,
            price: 50000,
            createdDate: "2023-12-01 21:53:48.718+07",
          },
          {
            menuId: "7c137334-19fd-4397-bf01-cd8edae91dfb",
            qty: 3,
            price: 50000,
            createdDate: "2023-12-01 21:53:48.718+07",
          },
        ],
      },
      {
        include: "orderDetails",
      }
    );
    await Order.create(
      {
        userId: "496f3d79-6f57-4a7b-a3ea-08759eb91523",
        totalPrice: 64000,
        status: "PLACED",
        totalQty: 5,
        orderDetails: [
          {
            menuId: "09350e2e-5466-4b1f-ba15-97251566c6a4",
            qty: 2,
            price: 70000,
            createdDate: "2023-11-25 21:53:48.718+07",
          },
          {
            menuId: "2d829c91-208e-40da-bb51-f2a8f4e56c1e",
            qty: 2,
            price: 50000,
            createdDate: "2023-11-25 21:53:48.718+07",
          },
          {
            menuId: "7c137334-19fd-4397-bf01-cd8edae91dfb",
            qty: 3,
            price: 50000,
            createdDate: "2023-11-25 21:53:48.718+07",
          },
        ],
      },
      {
        include: "orderDetails",
      }
    );
    await Order.create(
      {
        userId: "496f3d79-6f57-4a7b-a3ea-08759eb91523",
        totalPrice: 12000,
        status: "PLACED",
        totalQty: 4,
        orderDetails: [
          {
            menuId: "18d71431-bf4f-4a9e-a981-da31beddd681",
            qty: 5,
            price: 70000,
            createdDate: "2023-12-02 21:53:48.718+07",
          },
          {
            menuId: "2d829c91-208e-40da-bb51-f2a8f4e56c1e",
            qty: 2,
            price: 50000,
            createdDate: "2023-12-02 21:53:48.718+07",
          },
          {
            menuId: "7c137334-19fd-4397-bf01-cd8edae91dfb",
            qty: 1,
            price: 50000,
            createdDate: "2023-12-02 21:53:48.718+07",
          },
        ],
      },
      {
        include: "orderDetails",
      }
    );
    await Order.create(
      {
        userId: "496f3d79-6f57-4a7b-a3ea-08759eb91523",
        totalPrice: 32000,
        status: "PLACED",
        totalQty: 5,
        orderDetails: [
          {
            menuId: "18d71431-bf4f-4a9e-a981-da31beddd681",
            qty: 3,
            price: 70000,
            createdDate: "2023-11-24 21:53:48.718+07",
          },
          {
            menuId: "2d829c91-208e-40da-bb51-f2a8f4e56c1e",
            qty: 2,
            price: 50000,
            createdDate: "2023-11-24 21:53:48.718+07",
          },
          {
            menuId: "7c137334-19fd-4397-bf01-cd8edae91dfb",
            qty: 2,
            price: 50000,
            createdDate: "2023-11-24 21:53:48.718+07",
          },
        ],
      },
      {
        include: "orderDetails",
      }
    );
    await Order.create(
      {
        userId: "f1c36a17-8e23-4aa2-82bd-a889bff48ced",
        totalPrice: 12000,
        status: "PLACED",
        totalQty: 4,
        orderDetails: [
          {
            menuId: "18d71431-bf4f-4a9e-a981-da31beddd681",
            qty: 1,
            price: 70000,
            createdDate: "2023-12-02 21:53:48.718+07",
          },
          {
            menuId: "2d829c91-208e-40da-bb51-f2a8f4e56c1e",
            qty: 2,
            price: 50000,
            createdDate: "2023-12-02 21:53:48.718+07",
          },
          {
            menuId: "7c137334-19fd-4397-bf01-cd8edae91dfb",
            qty: 6,
            price: 50000,
            createdDate: "2023-12-02 21:53:48.718+07",
          },
        ],
      },
      {
        include: "orderDetails",
      }
    );
    await Order.create(
      {
        userId: "f1c36a17-8e23-4aa2-82bd-a889bff48ced",
        totalPrice: 44000,
        status: "PLACED",
        totalQty: 2,
        orderDetails: [
          {
            menuId: "09350e2e-5466-4b1f-ba15-97251566c6a4",
            qty: 3,
            price: 70000,
            createdDate: "2023-12-01 21:53:48.718+07",
          },
          {
            menuId: "2d829c91-208e-40da-bb51-f2a8f4e56c1e",
            qty: 2,
            price: 50000,
            createdDate: "2023-12-01 21:53:48.718+07",
          },
          {
            menuId: "06976623-3c88-42c0-b09a-2469260c1aa9",
            qty: 2,
            price: 50000,
            createdDate: "2023-12-01 21:53:48.718+07",
          },
        ],
      },
      {
        include: "orderDetails",
      }
    );
  } catch (error) {
    console.log(error, "error create order");
  }
}
exports.initOrder = async (req, res) => {
  await createOrder();
  res.status(200).send({ message: "success" });
};
