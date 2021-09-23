// Initialize express router
const express = require("express");
const router = express.Router();
const joi = require("joi");

// Import record controller
const { getRecords } = require("../controllers/record.controller");

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
    return res.send({
      code: 400,
      msg: `Bad Request: ${error.message}`,
    });
  }

  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const minCount = req.body.minCount;
  const maxCount = req.body.maxCount;

  const response = await getRecords(startDate, endDate, minCount, maxCount);

  res.send(response);
});

module.exports = router;
