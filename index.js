// Make express server
const express = require("express");
const app = express();
const cors = require("cors");
const xss = require("xss-clean");
const bodyParser = require("body-parser");
// const port = process.env.PORT || 8080;
const port = 8000;
app.use(cors());
app.use(bodyParser.json());
app.use(xss());

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
const flickrRoutes = require("./routes/Flickr");

app.use("/api", flickrRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
