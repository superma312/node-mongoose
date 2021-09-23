const joi = require("joi");
const { APIerror } = require("../helpers/api-response");
const recordService = require("../services/records.service");

const getRecordsSchema = joi.object({
  startDate: joi.date(),
  endDate: joi.date(),
  minCount: joi.number().integer(),
  maxCount: joi.number().integer(),
});

const getFilteredRecords = async (req, res, next) => {
  try {
    // validate request payload
    const { error } = getRecordsSchema.validate(req.body);

    if (error) {
      return res.send(APIerror(400, `Bad Request: ${error.message}`));
    }

    const response = await recordService.getFilteredRecords(req.body);

    res.send(response);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getFilteredRecords
};