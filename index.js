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

// declare all routes here ============
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
      role: "USER",
      email: "user@user.com",
      username: "user canteen",
      password: "user@password",
    },
    {
      role: "ADMIN",
      email: "admin@admin.com",
      username: "admin canteen",
      password: "admin@password",
    },
    {
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
      id: "FD-001",
      name: "Nasi goreng surabaya",
      category: "FOOD",
      description:
        "Nasi goreng surabaya dengan saos tiram dan kecap manis, yakin enak tuh?",
      isAvailable: true,
      image: "nasi-goreng-surabaya",
      rating: "0",
      price: 29000,
    },
    {
      id: "FD-002",
      name: "Soto betawi ayam",
      category: "FOOD",
      description:
        "Soto betawi dengan kuah santen dan daging ayam tanpa tulang",
      isAvailable: false,
      image: "soto-betawi-ayam",
      rating: "0",
      price: 22000,
    },
    {
      id: "FD-003",
      name: "Soto betawi daging",
      category: "FOOD",
      description:
        "Soto betawi dengan kuah santen dan daging sapi dan jeroan(?), dilengkapi dengan emping dan kuah dan nasi dan bawang goren dan kuah",
      isAvailable: true,
      image: "soto-betawi-daging",
      rating: "0",
      price: 25000,
    },
    {
      id: "FD-004",
      name: "Capcay ayam lada hitam",
      category: "FOOD",
      description:
        "Nasi dengan lauk sayur capcay dan ayam crispy berbumbu lada hitam",
      isAvailable: true,
      image: "capcay-ayam-ladahitam",
      rating: "0",
      price: 28000,
    },
    {
      id: "FD-005",
      name: "Ikan nila bakar",
      category: "FOOD",
      description: "Ikan nila yang dibakar, mau diapain lagi?",
      isAvailable: false,
      image: "ikan-nila-bakar",
      rating: "0",
      price: 18000,
    },
    {
      id: "FD-006",
      name: "Bubur kacang ijo",
      category: "FOOD",
      description: "Bubur kacang ijo ",
      isAvailable: true,
      image: "kacang-ijo",
      rating: "0",
      price: 7000,
    },
    {
      id: "FD-007",
      name: "ketupat-padang",
      category: "FOOD",
      description: "Ketupat padang kuah santen",
      isAvailable: true,
      image: "ketupat-padang",
      rating: "0",
      price: 10000,
    },
    {
      id: "FD-008",
      name: "Lumpia telor",
      category: "FOOD",
      description: "Lumpia telor dengan daging",
      isAvailable: false,
      image: "lumpia-telor",
      rating: "0",
      price: 10000,
    },
    {
      id: "FD-009",
      name: "Sate ayam",
      category: "FOOD",
      description: "Sate ayam tanpa lemak",
      isAvailable: true,
      image: "sate-ayam",
      rating: "0",
      price: 22000,
    },
    {
      id: "FD-010",
      name: "Roti bakar",
      category: "FOOD",
      description: "Roti bakar rasa cokelat dengan krimer",
      isAvailable: true,
      image: "roti-bakar",
      rating: "0",
      price: 10000,
    },
    {
      id: "FD-011",
      name: "Bakso malang",
      category: "FOOD",
      description: "Bakso malang tapi kebanyakan pangsit nya doang",
      isAvailable: true,
      image: "bakso-malang",
      rating: "0",
      price: 16000,
    },
    {
      id: "DK-001",
      name: "Jus alpukat",
      category: "DRINKS",
      description: "Jus buah alpukat dengan krimer coklat",
      isAvailable: true,
      image: "jus-alpukat",
      rating: "0",
      price: 16000,
    },
    {
      id: "DK-002",
      name: "Es teh tawar",
      category: "DRINKS",
      description: "Es teh tawar tanpa gula dengan es",
      isAvailable: false,
      image: "es-teh-tawar",
      rating: "0",
      price: 5000,
    },
    {
      id: "DK-003",
      name: "Teh tarik",
      category: "DRINKS",
      description: "Teh tarik dingin pake es batu",
      isAvailable: true,
      image: "teh-tarik",
      rating: "0",
      price: 6000,
    },
    {
      id: "AO-001",
      name: "Sambal",
      category: "ADDON",
      description: "",
      isAvailable: true,
      image: "sambal",
      rating: "0",
      price: 7000,
    },
    {
      id: "AO-002",
      name: "Kerupuk",
      category: "ADDON",
      description: "",
      isAvailable: true,
      image: "kerupuk",
      rating: "0",
      price: 5000,
    },
    {
      id: "AO-003",
      name: "Nasi putih",
      category: "ADDON",
      description: "",
      isAvailable: true,
      image: "nasi-putih",
      rating: "0",
      price: 6000,
    },
  ]);
}
