const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  // klo ga ada role yang diinput saat register, default role akan "user"
  if (req.body.roles) {
    Role.findAll()
      .then((roles) => {})
      .then(
        User.create({
          username: req.body.username,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8),
          role: req.body.roles,
        }).then(() => {
          res.send({ message: "User registered successfully!" });
        })
      );
  } else {
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: "user",
    }).then(() => {
      res.send({ message: "User registered successfully!" });
    });
  }
};

exports.signin = (req, res) => {
  const { password, email } = req.body;
  User.findOne({
    where: {
      email: email,
    },
  })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "User not found", status: "failed" });
      }

      // const validPassword = bcrypt.compareSync(password, user.password);
      // ########################??????????
      const validPassword = password === user.password;

      if (!validPassword) {
        return res
          .status(404)
          .send({ message: "Invalid password", status: "failed" });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, config.secret, {
        expiresIn: "24h",
      });

      res.status(200).send({
        message: "Success",
        id: user.id,
        userName: user.username,
        role: user.role,
        accesstoken: token,
      });
    })
    .catch((err) => {
      console.log(err, "error login");
      res.status(404).send({ message: "errorr" });
    });
};
