const db = require("../models");
const Menu = db.menu;

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
