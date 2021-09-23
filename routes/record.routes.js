// Initialize express router
const express = require("express");
const router = express.Router();
const joi = require("joi");

// Import record controller
const { getRecordsWithFilters } = require("../controllers/record.controller");
const { APIerror } = require("../helpers/api-response");

const getRecordsSchema = joi.object({
  startDate: joi.date().required(),
  endDate: joi.date().required(),
  minCount: joi.number().integer().required(),
  maxCount: joi.number().integer().required(),
});

router.post("/", async (req, res) => {
  // validate request payload
  const { error } = getRecordsSchema.validate(req.body);

  if (error) {
    return res.send(APIerror(400, `Bad Request: ${error.message}`));
  }

  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const minCount = req.body.minCount;
  const maxCount = req.body.maxCount;

  const response = await getRecordsWithFilters(startDate, endDate, minCount, maxCount);

  res.send(response);
});

module.exports = router;
