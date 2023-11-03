const db = require("../models");
const Menu = db.menu;

exports.getAllMenu = async (req, res) => {
  const menus = await Menu.findAll()
    .then((menu) => {
      return JSON.parse(JSON.stringify(menu));
      // simulate error handling
      // throw new Error("test");
    })
    .catch((error) => {
      console.log(error, "error get all menu");
      return error;
    });

  res.status(200).send({ message: "success", data: menus });

  //   console.log(JSON.stringify(menus, null, 2), "menuss");
};
