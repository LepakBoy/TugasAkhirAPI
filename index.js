// Make express server
const express = require("express");
const app = express();
const cors = require("cors");
const xss = require("xss-clean");
const bodyParser = require("body-parser");
// const port = process.env.PORT || 8080;
const port = 8002;
app.use(cors());
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(xss());

// database
const db = require("./models");
const Role = db.role;
const User = db.user;
const Menu = db.menu;
// db.sequelize.sync();
// force: true will drop the table if it already exists
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Database with { force: true }");
  createMany();
  createManyMenus();
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome backend application." });
});

// routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/menu.routes")(app);

// to allow access into PUBLIC folder
app.use(express.static("public"));
app.use("/images", express.static("images"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// #INIT DATA TO DB
function createMany() {
  User.bulkCreate([
    {
      // id: "useradmin1",
      role: "USER",
      email: "user@user.com",
      username: "user canteen",
      password: "user@password",
    },
    {
      // id: "useradmin1",
      role: "ADMIN",
      email: "admin@admin.com",
      username: "admin canteen",
      password: "admin@password",
    },
    {
      // id: "useradmin1",
      role: "KITCHEN",
      email: "kitchen@kitchen.com",
      username: "kitchen canteen",
      password: "kitchen@password",
    },
  ]);
}

function createManyMenus() {
  Menu.bulkCreate([
    {
      name: "Nasi goreng surabaya",
      category: "FOOD",
      description:
        "Nasi goreng surabaya dengan saos tiram dan kecap manis, yakin enak tuh?",
      isAvailable: true,
      image: "",
      rating: "0",
      price: 29000,
    },
    {
      name: "Soto betawi ayam",
      category: "FOOD",
      description:
        "Soto betawi dengan kuah santen dan daging ayam tanpa tulang",
      isAvailable: true,
      image: "",
      rating: "0",
      price: 22000,
    },
    {
      name: "Soto betawi daging",
      category: "FOOD",
      description:
        "Soto betawi dengan kuah santen dan daging sapi dan jeroan(?), dilengkapi dengan emping dan kuah dan nasi dan bawang goren dan kuah",
      isAvailable: true,
      image: "",
      rating: "0",
      price: 25000,
    },
    {
      name: "Capcay ayam lada hitam",
      category: "FOOD",
      description:
        "Nasi dengan lauk sayur capcay dan ayam crispy berbumbu lada hitam",
      isAvailable: true,
      image: "",
      rating: "0",
      price: 28000,
    },
    {
      name: "Ikan nila bakar",
      category: "FOOD",
      description: "Ikan nila yang dibakar, mau diapain lagi?",
      isAvailable: true,
      image: "",
      rating: "0",
      price: 18000,
    },
    {
      name: "Jus alpukat",
      category: "DRINKS",
      description: "Jus buah alpukat dengan krimer coklat",
      isAvailable: true,
      image: "",
      rating: "0",
      price: 16000,
    },
    {
      name: "Es teh tawar",
      category: "DRINKS",
      description: "Es teh tawar tanpa gula dengan es",
      isAvailable: true,
      image: "",
      rating: "0",
      price: 5000,
    },
  ]);
}
