const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Canteen = db.canteenStatus

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.canteenStatus = async(req, res) => {
  let errCode = 0;
  let resMessage = "";

const resultStatus = await Canteen.findAll().then((res) => {
  errCode = 200;
  resMessage = "success";
  return JSON.parse(JSON.stringify(res));
})
res.status(errCode).send({ message: resMessage, canteenStatus: resultStatus[0].isOpen });
}

exports.updateCanteenStatus = async (req, res) => {
  let errCode = 0;
  let resMessage = "";

  const currentStatus = await Canteen.findOne().then(async(status) => {
    errCode = 200;
    resMessage = "success";
    console.log(JSON.parse(JSON.stringify(status)).isOpen, "current")
    const current=  JSON.parse(JSON.stringify(status))
    const newStatus = !current.isOpen

    return await Canteen.update({
      isOpen: newStatus
    }, {where: {
      isOpen: current.isOpen
    }}).then((res) => {
      errCode = 200;
      resMessage = "success";
      return JSON.parse(JSON.stringify(res));
    })
    
  })


  res.status(errCode).send({ message: resMessage, currentStatus: currentStatus.isOpen });
} 

exports.updatePassword = async (req, res) => {
  let errCode = 0;
  let resMessage = "";

  const {userId, password} = req.body
  await User.findOne({
    where:{
      id: userId
    }
  }).then(async(user) => {
    if (!user) {
      return res
        .status(404)
        .send({ message: "User not found", status: "failed" });
    }
return await User.update({password: bcrypt.hashSync(password, 8)}, {where: {id: userId}}).then((res ) => {
  errCode = 200;
  resMessage = "success";
  return JSON.parse(JSON.stringify(res))
})    

  }).catch((error) => {
    console.log(error);
    errCode = 404;
    resMessage = "failed";
  
    return error;
  });
  res.status(errCode).send({ message: resMessage });
}

exports.signup = (req, res) => {
  // Save User to Database
  // klo ga ada role yang diinput saat register, default role akan "USER"
  if (req.body.role) {
    // Role.findAll()
    //   .then((roles) => {})
    //   .then(
        User.create({
          username: req.body.username,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8),
          role: req.body.role,
        }).then(() => {
          res.send({ message: "User registered successfully!" });
        })
      // );
  } else {
    User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: "USER",
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
      console.log(user, "ini user")
      if (!user) {
        return res
          .status(404)
          .send({ message: "User not found", status: "failed" });
      }

      const validPassword = bcrypt.compareSync(password, user.password);
      // ########################??????????
      // const validPassword = password === user.password;

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
