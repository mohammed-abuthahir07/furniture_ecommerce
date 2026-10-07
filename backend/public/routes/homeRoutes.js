const express = require("express");

const {
  getHome,
} = require("../controllers/homeController");

const router = express.Router();


// PUBLIC HOME
router.get("/", getHome);


module.exports = router;