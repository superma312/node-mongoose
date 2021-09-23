const dayjs = require("dayjs");
const { APIerror, APIsuccess } = require("../helpers/api-response");
const records = require("../models/records.model");

const getFilteredRecords = async (requestBody) => {
  const { startDate, endDate, minCount, maxCount } = requestBody;
  const aggregations = [];

  if (startDate || endDate) {
    aggregations.push({
      $match: {
        createdAt: {
          ...(startDate && { $gte: dayjs(startDate).toDate() }),
          ...(endDate && { $lte: dayjs(endDate).toDate() }),
        },
      }
    });
  }

  aggregations.push({
    $project: {
      _id: 0,
      key: 1,
      createdAt: 1,
      totalCount: {
        $sum: "$counts"  
      },
    }
  });

  if (minCount || maxCount) {
    aggregations.push({
      $match: {
        totalCount: {
          ...(minCount && { $gte: Number(minCount) }),
          ...(maxCount && { $lte: Number(maxCount) }),
        },
      }
    });
  }

  try {
    const data = await records.aggregate(aggregations);

    return APIsuccess(0, 'Success', data);
  } catch (err) {
    return APIerror(500, err.message || "Some error occurred while retrieving records.");
  }
}

module.exports = {
  getFilteredRecords
};
