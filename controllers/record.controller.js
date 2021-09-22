const dayjs = require("dayjs");
const joi = require("joi");
const db = require("../models");

const Record = db.records;

const findAllSchema = joi.object({
  startDate: joi.date().required(),
  endDate: joi.date().required(),
  minCount: joi.number().integer().required(),
  maxCount: joi.number().integer().required(),
});

exports.findAll = async (req, res) => {
  const { error } = findAllSchema.validate(req.body);

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

  try {
    const data = await Record.aggregate(
      [
        {
          $match: {
            createdAt: {
              $gte: dayjs(startDate).toDate(),
              $lte: dayjs(endDate).toDate(),
            }
          }
        },
        {
          $project: {
            _id: 0,
            key: 1,
            createdAt: 1,
            totalCount: {
              $sum: "$counts"  
            },
          }
        },
        {
          $match: {
            totalCount: {
              $gte: Number(minCount),
              $lte: Number(maxCount),
            }
          }
        }
      ]
    );
  
    res.send({
      code: 0,
      msg: 'Success',
      records: data,
    });
  } catch (err) {
    res.send({
      code: 500,
      msg: err.message || "Some error occurred while retrieving records.",
    });
  }
};
