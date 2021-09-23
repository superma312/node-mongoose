// Initialize express router
const express = require("express");
const { getRecordsWithFilters } = require("../controllers/record.controller");
const router = express.Router();

router.post("/", getRecordsWithFilters);

module.exports = router;
