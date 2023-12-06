const db = require("../models");
const Menu = db.menu;
const Order = db.order;
const OrderDetail = db.orderDetail;

exports.getAllMenu = async (req, res) => {
  let errCode = 0;
  let resMessage = "";

  const menus = await Menu.findAll()
    .then((menu) => {
      if (!menu) {
        errCode = 404;
        resMessage = "not found";
        return;
      }

      errCode = 200;
      resMessage = "success";
      return JSON.parse(JSON.stringify(menu));
      // simulate error handling
      // throw new Error("test");
    })
    .catch((error) => {
      errCode = 404;
      resMessage = "not found";
      console.log(error, "error get all menu");
      return error;
    });

  res.status(errCode).send({ resMessage: resMessage, data: menus });

  //   console.log(JSON.stringify(menus, null, 2), "menuss");
};

exports.updateAvailability = async (req, res) => {
  const { id } = req.body;
  let errCode = 0;
  let resMessage = "";
  const targetMenu = await Menu.findOne({
    where: {
      id: id,
    },
  })
    .then(async (menu) => {
      // ########## handle if menu by id not found (wrong ID) should return empty array ###########

      const specificMenu = JSON.parse(JSON.stringify(menu));
      const newStatus = !specificMenu.isAvailable;

      return await Menu.update(
        { isAvailable: newStatus },
        {
          where: {
            id: id,
          },
        }
      ).then((res) => {
        errCode = 200;
        resMessage = "success";
        return JSON.parse(JSON.stringify(res));
      });
    })
    .catch((error) => {
      console.log(error);
      errCode = 404;
      resMessage = "failed";

      return error;
    });

  res.status(errCode).send({ message: resMessage, data: targetMenu });
};

exports.getMenuById = async (req, res) => {
  errCode = 0;
  resMessage = "";
  const { id } = req.body;
  const targetMenu = await Menu.findAll({
    where: {
      id: id,
    },
  })
    .then((menu) => {
      if (menu.length < 1) {
        errCode = 404;
        resMessage = "not found";
        return [];
      }
      errCode = 200;
      resMessage = "success";
      return JSON.parse(JSON.stringify(menu));
    })
    .catch((error) => {
      errCode = 404;
      resMessage = "not found";
      return error;
    });

  res.status(errCode).send({ message: resMessage, data: targetMenu });
};
exports.getMenuAlgoritma = async (req, res) => {
  try {
    const menus = await Menu.findAll().then((menu) => {
      if (!menu) {
        errCode = 404;
        resMessage = "not found";
        return;
      }

      errCode = 200;
      resMessage = "success";
      return JSON.parse(JSON.stringify(menu));
      // simulate error handling
      // throw new Error("test");
    });
    const criteria = await db.criteria.findAll().then((criteria) => {
      if (!criteria) {
        errCode = 404;
        resMessage = "not found";
        return;
      }

      errCode = 200;
      resMessage = "success";
      return JSON.parse(JSON.stringify(criteria));
      // simulate error handling
      // throw new Error("test");
    });
    const orderDetail = await db.orderDetail.findAll().then((orderDetail) => {
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
    });
    const wTime = [1, 3, 5];
    const wPrice = [1, 3, 4, 5];
    const resultWQuantity = [];
    const resultWTime = [];
    const resultWPrice = [];
    let today = new Date();

    let fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(today.getDate() - 5);
    if (menus.length > 0 && criteria.length > 0) {
      for (let i = 0; i < menus.length; i++) {
        const menu = menus[i];
        const tempMenu = menu;
        const menuId = menu.id;
        const servingTime = menu.servingTime;
        console.log(servingTime, "servingTime");
        const price = menu.price;
        console.log(price, "price");
        let scoreServingTime = wTime[0];
        if (servingTime <= 5) {
          scoreServingTime = wTime[0];
        } else if (servingTime >= 6 && servingTime <= 10) {
          scoreServingTime = wTime[1];
        } else if (servingTime > 10) {
          scoreServingTime = wTime[2];
        }
        let scorePrice = wPrice[0];
        if (price <= 7000) {
          scorePrice = wPrice[0];
        } else if (price >= 8000 && price <= 18000) {
          scorePrice = wPrice[1];
        } else if (price >= 19000 && price <= 25000) {
          scorePrice = wPrice[2];
        } else if (price >= 26000) {
          scorePrice = wPrice[3];
        }

        const count = orderDetail.filter(
          (obj) =>
            obj.menuId === menuId && new Date(obj.createdDate) >= fiveDaysAgo
        ).length;
        const objResultWQuantity = {
          menuId: menuId,
          quantity: count,
        };
        const objResultWTime = {
          menuId: menuId,
          time: scoreServingTime,
        };
        const objResultWPrice = {
          menuId: menuId,
          price: scorePrice,
        };
        resultWQuantity.push(objResultWQuantity);
        resultWTime.push(objResultWTime);
        resultWPrice.push(objResultWPrice);
        if (i === menus.length - 1) {
          const pricesArray = resultWPrice.map((menu) => menu.price);
          const timeArray = resultWTime.map((menu) => menu.time);
          const quantityArray = resultWQuantity.map((menu) => menu.quantity);
          for (let j = 0; j < criteria.length; j++) {
            const criteriaName = criteria[j].criteriaName;
            const criteriaWeight = criteria[j].criteriaWeight;
            const criteriaRemark = criteria[j].criteriaRemark;
            if (criteriaName === "price") {
              const maxPrice = Math.max(...pricesArray);
              const minPrice = Math.min(...pricesArray);
              const resultPrice = resultWPrice.map((menu) => {
                const price = menu.price;
                const priceResult = (price - minPrice) / (maxPrice - minPrice);
                return {
                  menuId: menu.menuId,
                  price: priceResult,
                };
              });
              console.log(resultPrice, "resultPrice");
            } else if (criteriaName === "time") {
              const maxTime = Math.max(...timeArray);
              const minTime = Math.min(...timeArray);
              const resultTime = resultWTime.map((menu) => {
                const time = menu.time;
                const timeResult = (time - minTime) / (maxTime - minTime);
                return {
                  menuId: menu.menuId,
                  time: timeResult,
                };
              });
              console.log(resultTime, "resultTime");
            } else if (criteriaName === "quantity") {
              const maxQuantity = Math.max(...quantityArray);
              const minQuantity = Math.min(...quantityArray);
              const resultQuantity = resultWQuantity.map((menu) => {
                const quantity = menu.quantity;
                const quantityResult =
                  (quantity - minQuantity) / (maxQuantity - minQuantity);
                return {
                  menuId: menu.menuId,
                  quantity: quantityResult,
                };
              });
            }
          }
        }
      }
    }
    console.log(
      resultWQuantity,
      "resultWQuantity",
      resultWTime,
      "resultWTime",
      resultWPrice,
      "resultWPrice"
    );
    return res.status(200).send({ data: orderDetail });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "error" });
  }
};
