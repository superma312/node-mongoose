const joi = require("joi");
const { APIerror } = require("../helpers/api-response");
const { getRecordsWithFilters: getRecordsWithFiltersService } = require("../services/records.service");

const getRecordsSchema = joi.object({
  startDate: joi.date().required(),
  endDate: joi.date().required(),
  minCount: joi.number().integer().required(),
  maxCount: joi.number().integer().required(),
});

const getRecordsWithFilters = async (req, res, next) => {
  try {
    // validate request payload
    const { error } = getRecordsSchema.validate(req.body);

    if (error) {
      return res.send(APIerror(400, `Bad Request: ${error.message}`));
    }

    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const minCount = req.body.minCount;
    const maxCount = req.body.maxCount;

    const response = await getRecordsWithFiltersService(startDate, endDate, minCount, maxCount);

    res.send(response);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRecordsWithFilters
};