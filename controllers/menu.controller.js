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

exports.updateMenu = async (req, res) => {
  errCode = 0;
  resMessage = "";

  const { id, name, price, description, servingTime, category } = req.body;
  await Menu.findOne({
    where: {
      id: id,
    },
  })
    .then(async (targetMenu) => {
      if (!targetMenu) {
        return res
          .status(404)
          .send({ messages: "Menu not found", status: "failed" });
      }

      return await Menu.update(
        {
          name: name,
          price: Number(price),
          description: description,
          servingTime: Number(servingTime),
          category: category,
        },
        { where: { id: id } }
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
  res.status(errCode).send({ message: resMessage });
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
const calculateScoreHelper = (
  tempMenu,
  resultWQuantity,
  resultWTime,
  resultWPrice,
  criteria
) => {
  const pricesArray = resultWPrice.map((menu) => menu.price);
  const timeArray = resultWTime.map((menu) => menu.time);
  const quantityArray = resultWQuantity.map((menu) => menu.quantity);
  const indexQuantityArray = [];
  const indexTimeArray = [];
  const indexPriceArray = [];
  for (let i = 0; i < resultWQuantity.length; i++) {
    const indexQuantity = quantityArray[i] / Math.max(...quantityArray);
    indexQuantityArray.push(indexQuantity);
  }
  for (let i = 0; i < resultWTime.length; i++) {
    const indexTime = Math.min(...timeArray) / timeArray[i];
    indexTimeArray.push(parseFloat(indexTime.toFixed(2)));
  }
  for (let i = 0; i < resultWPrice.length; i++) {
    const indexPrice = Math.min(...pricesArray) / pricesArray[i];
    indexPriceArray.push(parseFloat(indexPrice.toFixed(2)));
  }

  return {
    quantity: indexQuantityArray,
    time: indexTimeArray,
    price: indexPriceArray,
  };

  // console.log(
  //   indexQuantityArray,
  //   indexPriceArray,
  //   indexTimeArray,
  //   criteria,
  //   "result"
  // );
};

const criteriaWeightCalc = (scoring, criteria) => {
  const resultQuantityArray = [];
  const resultTimeArray = [];
  const resultPriceArray = [];

  if (
    scoring.quantity.length > 0 &&
    scoring.time.length > 0 &&
    scoring.price.length > 0
  ) {
    for (let i = 0; i < scoring.quantity.length; i++) {
      const quantity = scoring.quantity[i];
      const time = scoring.time[i];
      const price = scoring.price[i];
      const weightQuantity = criteria.filter(
        (obj) => obj.name === "numOfOrder"
      )[0].weight;
      const weightTime = criteria.filter((obj) => obj.name === "time")[0]
        .weight;
      const weightPrice = criteria.filter((obj) => obj.name === "price")[0]
        .weight;
      const resultQuantity = quantity * weightQuantity;
      const resultTime = time * weightTime;
      const resultPrice = price * weightPrice;
      resultQuantityArray.push(resultQuantity);
      resultTimeArray.push(resultTime);
      resultPriceArray.push(resultPrice);
    }
  }
  // console.log(resultQuantityArray, resultTimeArray, resultPriceArray);
  return {
    resultQuantityArray,
    resultTimeArray,
    resultPriceArray,
  };
};

const alternativeWeightCalc = (scoring, menu) => {
  if (
    scoring.resultQuantityArray.length > 0 &&
    scoring.resultTimeArray.length > 0 &&
    scoring.resultPriceArray.length > 0
  ) {
    const result = [];
    for (let i = 0; i < scoring.resultQuantityArray.length; i++) {
      const quantity = scoring.resultQuantityArray[i];
      const time = scoring.resultTimeArray[i];
      const price = scoring.resultPriceArray[i];
      const alternativeScore = quantity + time + price;
      const obj = {
        ...menu[i],
        alternativeScore: alternativeScore,
      };
      result.push(obj);
    }
    return result.sort((a, b) =>
      a.alternativeScore < b.alternativeScore ? 1 : -1
    );
  }
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

        const price = menu.price;

        // ##C2
        let scoreServingTime = wTime[0];
        if (servingTime <= 5) {
          scoreServingTime = wTime[0];
        } else if (servingTime >= 6 && servingTime <= 10) {
          scoreServingTime = wTime[1];
        } else if (servingTime > 10) {
          scoreServingTime = wTime[2];
        }
        // ##C3
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

        // ##C1
        const count = orderDetail.filter(
          (obj) =>
            obj.menuId === menuId && new Date(obj.createdDate) >= fiveDaysAgo
        );

        const sumCount = count.reduce((a, b) => {
          return a + b.qty;
        }, 0);
        // console.log(sumCount, "sum count");
        // console.log(count, "count");
        const objResultWQuantity = {
          menuId: menuId,
          quantity: sumCount,
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
          const scoring = calculateScoreHelper(
            tempMenu,
            resultWQuantity,
            resultWTime,
            resultWPrice,
            criteria
          );
          const criteriaWeight = criteriaWeightCalc(scoring, criteria);
          const resultRecommendationMenu = alternativeWeightCalc(
            criteriaWeight,
            menus
          );
          return res.status(200).send({ data: resultRecommendationMenu });
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "error" });
  }
};
