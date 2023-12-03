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
db.sequelize.sync({ alter: true }).then(async () => {
  createUser();
  createMenu();
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome backend application." });
});

// declare all routes here ============
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/menu.routes")(app);
require("./routes/order.routes")(app);

// to allow access into PUBLIC folder
app.use(express.static("public"));
app.use("/images", express.static("images"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// #INIT DATA TO DB
async function createUser() {
  const existingUser = await User.findOne({
    where: { email: "user@user.com" },
  });
  const existingAdmin = await User.findOne({
    where: { email: "admin@admin.com" },
  });
  const existingKitchen = await User.findOne({
    where: { email: "kitchen@kitchen.com" },
  });
  if (!existingUser) {
    User.create({
      role: "USER",
      email: "user@user.com",
      username: "user canteen",
      password: "$2a$08$FGapL7mvz4TecAXCmUdm6u62GXvDnKzmbUkn7Nz83XxJ1bW7fPmfa",
    });
  }
  if (!existingAdmin) {
    User.create({
      role: "ADMIN",
      email: "admin@admin.com",
      username: "admin canteen",
      password: "$2a$08$hvA862YtT.L1FtCHlNMWDORA1KYqMk5A5UHYbpQNivoE0WKL.rC7K",
    });
  }
  if (!existingKitchen) {
    User.create({
      role: "KITCHEN",
      email: "kitchen@kitchen.com",
      username: "kitchen canteen",
      password: "$2a$08$aNW.prAMbGrIYaNPGeY87uMwmGQHR0iu4vQNmNXzxm3OWLz532/yW",
    });
  }
}

function createMenu() {
  const existingMenu = Menu.findAll();
  if (existingMenu.length !== 0) {
    Menu.bulkCreate([
      {
        name: "Nasi goreng surabaya",
        category: "FOOD",
        description:
          "Nasi goreng surabaya dengan saos tiram dan kecap manis, yakin enak tuh?",
        isAvailable: true,
        image: "nasi-goreng-surabaya",
        price: 29000,
      },
      {
        name: "Soto betawi ayam",
        category: "FOOD",
        description:
          "Soto betawi dengan kuah santen dan daging ayam tanpa tulang",
        isAvailable: false,
        image: "soto-betawi-ayam",
        price: 22000,
      },
      {
        name: "Soto betawi daging",
        category: "FOOD",
        description:
          "Soto betawi dengan kuah santen dan daging sapi dan jeroan(?), dilengkapi dengan emping dan kuah dan nasi dan bawang goren dan kuah",
        isAvailable: true,
        image: "soto-betawi-daging",
        price: 25000,
      },
      {
        name: "Capcay ayam lada hitam",
        category: "FOOD",
        description:
          "Nasi dengan lauk sayur capcay dan ayam crispy berbumbu lada hitam",
        isAvailable: true,
        image: "capcay-ayam-ladahitam",
        price: 28000,
      },
      {
        name: "Ikan nila bakar",
        category: "FOOD",
        description: "Ikan nila yang dibakar, mau diapain lagi?",
        isAvailable: false,
        image: "ikan-nila-bakar",
        price: 18000,
      },
      {
        name: "Bubur kacang ijo",
        category: "FOOD",
        description: "Bubur kacang ijo ",
        isAvailable: true,
        image: "kacang-ijo",
        price: 7000,
      },
      {
        name: "ketupat-padang",
        category: "FOOD",
        description: "Ketupat padang kuah santen",
        isAvailable: true,
        image: "ketupat-padang",
        price: 10000,
      },
      {
        name: "Lumpia telor",
        category: "FOOD",
        description: "Lumpia telor dengan daging",
        isAvailable: false,
        image: "lumpia-telor",
        price: 10000,
      },
      {
        name: "Sate ayam",
        category: "FOOD",
        description: "Sate ayam tanpa lemak",
        isAvailable: true,
        image: "sate-ayam",
        price: 22000,
      },
      {
        name: "Roti bakar",
        category: "FOOD",
        description: "Roti bakar rasa cokelat dengan krimer",
        isAvailable: true,
        image: "roti-bakar",
        price: 10000,
      },
      {
        name: "Bakso malang",
        category: "FOOD",
        description: "Bakso malang tapi kebanyakan pangsit nya doang",
        isAvailable: true,
        image: "bakso-malang",
        price: 16000,
      },
      {
        name: "Jus alpukat",
        category: "DRINKS",
        description: "Jus buah alpukat dengan krimer coklat",
        isAvailable: true,
        image: "jus-alpukat",
        price: 16000,
      },
      {
        name: "Es teh tawar",
        category: "DRINKS",
        description: "Es teh tawar tanpa gula dengan es",
        isAvailable: false,
        image: "es-teh-tawar",
        price: 5000,
      },
      {
        name: "Teh tarik",
        category: "DRINKS",
        description: "Teh tarik dingin pake es batu",
        isAvailable: true,
        image: "teh-tarik",
        price: 6000,
      },
      {
        name: "Sambal",
        category: "ADDON",
        description: "",
        isAvailable: true,
        image: "sambal",

        price: 7000,
      },
      {
        name: "Kerupuk",
        category: "ADDON",
        description: "",
        isAvailable: true,
        image: "kerupuk",

        price: 5000,
      },
      {
        name: "Nasi putih",
        category: "ADDON",
        description: "",
        isAvailable: true,
        image: "nasi-putih",

        price: 6000,
      },
    ]);
  }
}
