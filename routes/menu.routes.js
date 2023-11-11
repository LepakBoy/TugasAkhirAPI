const MenuContoller = require("../controllers/menu.controller");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  app.get("/api/menu", [authJwt.verifyToken], MenuContoller.getAllMenu);

  // app.get("/api/menu", MenuContoller.getAllMenu);

  app.post("/api/update-availabilty", MenuContoller.updateAvailability);

  app.get("/api/menu-by-id", MenuContoller.getMenuById);
};
