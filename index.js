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
const Order = db.order;
const criteria = db.criteria;
// db.sequelize.sync();
// force: true will drop the table if it already exists
db.sequelize.sync({ alter: true }).then(async () => {
  createUser();
  createMenu();
  createCriteria();
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
    User.bulkCreate([
      {
        id: "1f66f52e-79b1-4e7d-b254-30d21a7766e7",
        role: "USER",
        email: "user@user.com",
        username: "user canteen",
        password:
          "$2a$08$FGapL7mvz4TecAXCmUdm6u62GXvDnKzmbUkn7Nz83XxJ1bW7fPmfa",
      },
      {
        id: "496f3d79-6f57-4a7b-a3ea-08759eb91523",
        role: "USER",
        email: "user2@user.com",
        username: "user2 canteen",
        password:
          "$2a$08$FGapL7mvz4TecAXCmUdm6u62GXvDnKzmbUkn7Nz83XxJ1bW7fPmfa",
      },
      {
        id: "f1c36a17-8e23-4aa2-82bd-a889bff48ced",
        role: "USER",
        email: "user3@user.com",
        username: "user3 canteen",
        password:
          "$2a$08$FGapL7mvz4TecAXCmUdm6u62GXvDnKzmbUkn7Nz83XxJ1bW7fPmfa",
      },
    ]);
  }
  if (!existingAdmin) {
    User.create({
      id: "1f66f52e-79b1-4e7d-b254-30d21a7766e8",
      role: "ADMIN",
      email: "admin@admin.com",
      username: "admin canteen",
      password: "$2a$08$hvA862YtT.L1FtCHlNMWDORA1KYqMk5A5UHYbpQNivoE0WKL.rC7K",
    });
  }
  if (!existingKitchen) {
    User.create({
      id: "235d04e2-2f86-4607-91d0-586856dfa211",
      role: "KITCHEN",
      email: "kitchen@kitchen.com",
      username: "kitchen canteen",
      password: "$2a$08$aNW.prAMbGrIYaNPGeY87uMwmGQHR0iu4vQNmNXzxm3OWLz532/yW",
    });
  }
}

async function createMenu() {
  const existingMenu = await Menu.findOne({
    where: { category: "FOOD" },
  });
  if (!existingMenu) {
    Menu.bulkCreate([
      {
        id: "0145b2b7-6bb3-4962-a6a5-0d755d491b41",
        name: "Nasi goreng surabaya",
        category: "FOOD",
        description:
          "Nasi goreng surabaya dengan saos tiram dan kecap manis, yakin enak tuh?",
        isAvailable: true,
        image: "nasi-goreng-surabaya",
        price: 29000,
        servingTime: 15,
      },
      {
        id: "049449c4-288e-4163-b12f-ef1d79463fbc",
        name: "Soto betawi ayam",
        category: "FOOD",
        description:
          "Soto betawi dengan kuah santen dan daging ayam tanpa tulang",
        isAvailable: false,
        image: "soto-betawi-ayam",
        price: 22000,
        servingTime: 5,
      },
      {
        id: "06976623-3c88-42c0-b09a-2469260c1aa9",
        name: "Soto betawi daging",
        category: "FOOD",
        description:
          "Soto betawi dengan kuah santen dan daging sapi dan jeroan(?), dilengkapi dengan emping dan kuah dan nasi dan bawang goren dan kuah",
        isAvailable: true,
        image: "soto-betawi-daging",
        price: 25000,
        servingTime: 7,
      },
      {
        id: "09350e2e-5466-4b1f-ba15-97251566c6a4",
        name: "Capcay ayam lada hitam",
        category: "FOOD",
        description:
          "Nasi dengan lauk sayur capcay dan ayam crispy berbumbu lada hitam",
        isAvailable: true,
        image: "capcay-ayam-ladahitam",
        price: 28000,
        servingTime: 15,
      },
      {
        id: "18d71431-bf4f-4a9e-a981-da31beddd681",
        name: "Ikan nila bakar",
        category: "FOOD",
        description: "Ikan nila yang dibakar, mau diapain lagi?",
        isAvailable: false,
        image: "ikan-nila-bakar",
        price: 18000,
        servingTime: 20,
      },
      {
        id: "1fb6c7fa-2f35-45c6-a3a1-dfc33195d85c",
        name: "Bubur kacang ijo",
        category: "FOOD",
        description: "Bubur kacang ijo ",
        isAvailable: true,
        image: "kacang-ijo",
        price: 7000,
        servingTime: 4,
      },
      {
        id: "2d829c91-208e-40da-bb51-f2a8f4e56c1e",
        name: "ketupat-padang",
        category: "FOOD",
        description: "Ketupat padang kuah santen",
        isAvailable: true,
        image: "ketupat-padang",
        price: 10000,
        servingTime: 7,
      },
      {
        id: "2ea751aa-c3b9-4324-9e02-448ae01fbdcb",
        name: "Lumpia telor",
        category: "FOOD",
        description: "Lumpia telor dengan daging",
        isAvailable: false,
        image: "lumpia-telor",
        price: 10000,
        servingTime: 10,
      },
      {
        id: "38262881-afe1-4b04-9883-db44eff6a9f1",
        name: "Sate ayam",
        category: "FOOD",
        description: "Sate ayam tanpa lemak",
        isAvailable: true,
        image: "sate-ayam",
        price: 22000,
        servingTime: 20,
      },
      {
        id: "5af441e6-c250-4d2c-a260-33b558bbdb3b",
        name: "Roti bakar",
        category: "FOOD",
        description: "Roti bakar rasa cokelat dengan krimer",
        isAvailable: true,
        image: "roti-bakar",
        price: 10000,
        servingTime: 15,
      },
      {
        id: "7c137334-19fd-4397-bf01-cd8edae91dfb",
        name: "Bakso malang",
        category: "FOOD",
        description: "Bakso malang tapi kebanyakan pangsit nya doang",
        isAvailable: true,
        image: "bakso-malang",
        price: 16000,
        servingTime: 8,
      },
      {
        id: "be31683c-73bd-4caa-b5c1-a8111a4bbe29",
        name: "Jus alpukat",
        category: "DRINKS",
        description: "Jus buah alpukat dengan krimer coklat",
        isAvailable: true,
        image: "jus-alpukat",
        price: 16000,
        servingTime: 7,
      },
      {
        id: "c0f6b5e9-5b0e-4b7e-9e9a-9f6b8b8b6b9e",
        name: "Es teh tawar",
        category: "DRINKS",
        description: "Es teh tawar tanpa gula dengan es",
        isAvailable: false,
        image: "es-teh-tawar",
        price: 5000,
        servingTime: 2,
      },
      {
        id: "c1f5d7c7-8f7e-4f1e-9b7a-2d1c0b7d7d1e",
        name: "Teh tarik",
        category: "DRINKS",
        description: "Teh tarik dingin pake es batu",
        isAvailable: true,
        image: "teh-tarik",
        price: 6000,
        servingTime: 4,
      },
      {
        id: "c2f5d7c7-8f7e-4f1e-9b7a-2d1c0b7d7d1e",
        name: "Sambal",
        category: "ADDON",
        description: "",
        isAvailable: true,
        image: "sambal",

        price: 7000,
        servingTime: 1,
      },
      {
        name: "Kerupuk",
        category: "ADDON",
        description: "",
        isAvailable: true,
        image: "kerupuk",

        price: 5000,
        servingTime: 1,
      },
      {
        id: "c3f5d7c7-8f7e-4f1e-9b7a-2d1c0b7d7d1e",
        name: "Nasi putih",
        category: "ADDON",
        description: "",
        isAvailable: true,
        image: "nasi-putih",

        price: 6000,
        servingTime: 1,
      },
    ]);
  }
}
async function createCriteria() {
  const existingCriteria = await criteria.findOne({
    where: { name: "numOfOrder" },
  });
  if (!existingCriteria) {
    criteria.bulkCreate([
      {
        id: "c3f9d7c7-8f7e-4f1e-9b7a-2d1c0b7d7d1e",
        name: "numOfOrder",
        weight: 4,
        remark: "max",
      },
      {
        id: "c3f9d7c7-8f7e-4f1e-9b7a-2d1c0b7d7d2e",
        name: "time",
        weight: 2,
        remark: "min",
      },
      {
        id: "c3f9d7c7-8f7e-4f1e-9b7a-2d1c0b7d7d3e",
        name: "price",
        weight: 4,
        remark: "min",
      },
    ]);
  }
}
