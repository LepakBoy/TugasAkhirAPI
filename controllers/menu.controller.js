const db = require("../models");
const Menu = db.menu;

exports.getAllMenu = async (req, res) => {
  const menus = await Menu.findAll();
  res.send({ message: "success", data: menus });

  //   console.log(JSON.stringify(menus, null, 2), "menuss");
};
