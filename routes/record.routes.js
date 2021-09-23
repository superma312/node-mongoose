// Initialize express router
const express = require("express");
const { getFilteredRecords } = require("../controllers/record.controller");
const router = express.Router();

router.post("/", getFilteredRecords);

module.exports = router;
