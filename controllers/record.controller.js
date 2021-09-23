const dayjs = require("dayjs");
const Record = require("../models/record.model.js");

async function getRecords(startDate, endDate, minCount, maxCount) {
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

    return {
      code: 0,
      msg: 'Success',
      records: data,
    };
  } catch (err) {
    return {
      code: 500,
      msg: err.message || "Some error occurred while retrieving records.",
    };
  }
}

module.exports = {
  getRecords,
}
