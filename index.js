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
// db.sequelize.sync();
// force: true will drop the table if it already exists
db.sequelize.sync().then(() => {
  console.log("Drop and Resync Database with { force: true }");
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome backend application." });
});

// routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// ============== init data to DB
// function initial() {
//   Role.create({
//     id: 1,
//     name: "user"
//   });

//   Role.create({
//     id: 2,
//     name: "kitchen"
//   });

//   Role.create({
//     id: 3,
//     name: "admin"
//   });
// }
