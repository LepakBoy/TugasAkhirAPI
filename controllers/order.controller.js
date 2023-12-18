const db = require("../models");
const Order = db.order;
const OrderDetail = db.orderDetail;
const Canteen = db.canteenStatus
const Menus = db.menu
const OrderDetails = db.orderDetail

exports.getAllOrder = async (req, res) => {
  let errCode = 0;
  let resMessage = "";

const orderDetails = await OrderDetail.findAll().then((details) => {
  if (!details) {
    errCode = 404;
    resMessage = "not found";
    return;
    
  }
  const allOrderDetails = JSON.parse(JSON.stringify(details))
  return allOrderDetails
})

  const orders = await Order.findAll()
    .then((order) => {
      if (!order) {
        errCode = 404;
        resMessage = "not found";
        return;
        
      }
console.log(orderDetails, "cobaaa")
      const allOrder = JSON.parse(JSON.stringify(order))
      const unfinishedOrder = allOrder.filter((x) => {return x.status !== "FINISHED"})

      // for(let i = 0; i < allOrderDetails.length; i++){
      //   unfinishedOrder[i]
      // }

      // console.log(unfinishedOrder, "unfinised")
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

exports.getOrderByUser = async (req, res) => {
  errCode = 0;
  resMessage = "";

  const {userId} = req.params;

  const result = await Order.findAll({where: {userId: userId}}).then((res) => {
    if(!res){
      return res.status(404).send({messages: "Order not found", status: "failed", data: []});
      
    }
    errCode = 200;
    resMessage = "success";
    return JSON.parse(JSON.stringify(res))
  }).catch((error) => {
    console.log(error, "errrppprrr");
    errCode = 404;
    resMessage = "failed";
    return error;
})

res.status(errCode).send({message: resMessage, data: result})
}

exports.updateOrderStatus = async(req, res) => {
  errCode = 0;
  resMessage = "";

  const {id, status} = req.body

  await Order.findOne({where: {id: id}}).then(async(order) => {
    if(!order){
      return res.status(404).send({messages: "Order not found", status: "failed"})
    }

    return await Order.update({status: status},{where: {id: id}}).then((res) => {
      errCode = 200;
      resMessage = "success";
      return JSON.parse(JSON.stringify(res))
    })
  }).catch((error) => {
    console.log(error, "errrppprrr");
    errCode = 404;
    resMessage = "failed";
    return error;
})
res.status(errCode).send({ message: resMessage });

}

exports.createOrder = async (req, res) => {
  const canteentStatus = await Canteen.findAll().then((res) => {
  return JSON.parse(JSON.stringify(res))[0].isOpen
 
  })
  
  try {
    if(!canteentStatus){
      res.status(400).send({
        message: "failed",
        reason: "Canteen is close"
      });
    }else{
      const { orderDetails, userId, status, totalPrice, totalQty } = req.body;
    //  const aa = orderDetails.map(async(x)=> {
    //    await Menus.findOne({where: {id: x.menuId}})
    //   })
    //   console.log(aa, "orderDetals")
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
    }

  } catch (error) {
    console.log(error, "error create order");
    res.status(500).send({ message: "error", data: error });
  }
};
async function generateDummyOrder() {
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
  await generateDummyOrder();
  res.status(200).send({ message: "success" });
};

exports.getAllOrderDetails = async (req, res) => {
  let errCode = 0;
  let resMessage = "";

  console.log("aa")
  const orderDetails = await OrderDetail.findAll()
    .then((orderDetail) => {
      if (!orderDetail) {
        errCode = 404;
        resMessage = "not found";
        return;
      }

      errCode = 200;
      resMessage = "success";
      return JSON.parse(JSON.stringify(orderDetail));
      // simulate error handling
      // throw new Error("test");
    })
    .catch((error) => {
      errCode = 404;
      resMessage = "not found";
      console.log(error, "error get all order detail");
      return error;
    });

  res.status(errCode).send({ resMessage: resMessage, data: orderDetails });
};
