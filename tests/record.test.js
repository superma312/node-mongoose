
const dayjs = require("dayjs");
const dbHandler = require("./db-handler");
const Record = require("../models/record.model.js");
const { getRecords } = require("../controllers/record.controller");

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());

describe("getRecords controller", () => {
  it("should get all records with startDate, endDate, minCount, and maxCount", async () => {
    const createdAt = "2021-02-02";
    await Record.create({
      key: "key1",
      createdAt: dayjs(createdAt).toDate(),
      counts: [10],
    });
    const startDate = dayjs("2021-02-01").toDate();
    const endDate = dayjs("2021-02-03").toDate();
    const response = await getRecords(startDate, endDate, 0, 20);
    expect(response.msg).toBe("Success");
    expect(response.records.length).toBe(1);
    expect(dayjs(response.records[0].createdAt).format("YYYY-MM-DD")).toBe(createdAt);
  });

  it("should filter records by startDate and endDate", async () => {
    const createdAt = "2021-02-02";
    await Record.create({
      key: "key2",
      createdAt: dayjs(createdAt).toDate(),
      counts: [30, 20],
    });
    const startDate = dayjs("2021-01-01").toDate();
    const endDate = dayjs("2021-02-01").toDate();
    const response = await getRecords(startDate, endDate, 0, 70);
    expect(response.msg).toBe("Success");
    expect(response.records.length).toBe(0);
  });

  it("should filter records by minCount and maxCount", async () => {
    const createdAt = "2021-02-02";
    await Record.create({
      key: "key2",
      createdAt: dayjs(createdAt).toDate(),
      counts: [30, 20],
    });
    const startDate = dayjs("2021-01-01").toDate();
    const endDate = dayjs("2021-02-03").toDate();
    const response = await getRecords(startDate, endDate, 20, 30);
    expect(response.msg).toBe("Success");
    expect(response.records.length).toBe(0);
  });
});
