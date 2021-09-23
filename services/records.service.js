const dayjs = require("dayjs");
const { APIerror, APIsuccess } = require("../helpers/api-response");
const records = require("../models/records.model");

const getRecordsWithFilters = async (startDate, endDate, minCount, maxCount) => {
  try {
    const data = await records.aggregate(
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

    return APIsuccess(0, 'Success', data);
  } catch (err) {
    return APIerror(500, err.message || "Some error occurred while retrieving records.");
  }
}

module.exports = {
  getRecordsWithFilters
};
