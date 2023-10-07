const express = require("express");
const router = express.Router();

const { GetFlickrHome, PostFlickrByTag } = require("../controllers/Flickr");

router.get("/flickr", GetFlickrHome);
router.post("/flickr", PostFlickrByTag);


module.exports = router;
