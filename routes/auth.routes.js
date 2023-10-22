const { verifySignUp } = require("../middleware");
const AUTHcontroller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      // check role existed harus include 3 role(untuk public API)
      verifySignUp.checkRolesExisted,
    ],
    AUTHcontroller.signup
  );

  app.post("/api/auth/signin", AUTHcontroller.signin);
};
