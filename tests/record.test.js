
const dayjs = require("dayjs");
const request = require("supertest");
const dbHandler = require("./db-handler");
const Record = require("../models/records.model");
const app = require('../server');
const { getFilteredRecords } = require("../services/records.service");

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

describe("getFilteredRecords service", () => {
  it("should get records filtered by startDate, endDate, minCount, and maxCount", async () => {
    const createdAt = "2021-02-03";
    await Record.create({
      key: "key1",
      createdAt: dayjs(createdAt).toDate(),
      counts: [10],
    });
    const startDate = dayjs("2021-02-01").toDate();
    const endDate = dayjs("2021-02-05").toDate();
    const response = await getFilteredRecords({
      startDate,
      endDate,
      minCount: 0,
      maxCount: 20,
    });

    expect(response.msg).toBe("Success");
    expect(response.records.length).toBe(1);
    expect(dayjs(response.records[0].createdAt).format("YYYY-MM-DD")).toBe(createdAt);
  });

  it("should get records filtered by startDate and endDate even if there is no any count one", async () => {
    const createdAt = "2021-02-03";
    await Record.create({
      key: "key2",
      createdAt: dayjs(createdAt).toDate(),
      counts: [30, 20],
    });
    const startDate = dayjs("2021-01-01").toDate();
    const endDate = dayjs("2021-02-01").toDate();
    const response = await getFilteredRecords({
      startDate,
      endDate,
    });

    expect(response.msg).toBe("Success");
    expect(response.records.length).toBe(0);
  });

  it("should get records filtered by minCount and maxCount even if there is no any date one", async () => {
    const createdAt = "2021-02-03";
    await Record.create({
      key: "key3",
      createdAt: dayjs(createdAt).toDate(),
      counts: [30, 20],
    });
    const response = await getFilteredRecords({
      minCount: 10,
      maxCount: 60,
    });

    expect(response.msg).toBe("Success");
    expect(response.records.length).toBe(1);
  });

  it("should get all records even if there is no any filter", async () => {
    const createdAt = "2021-02-03";
    await Record.create({
      key: "key4",
      createdAt: dayjs(createdAt).toDate(),
      counts: [30, 20],
    });
    const response = await getFilteredRecords({});

    expect(response.msg).toBe("Success");
    expect(response.records.length).toBe(1);
  });
});

describe("POST /api/records", () => {
  test("if startDate or endDate isn't Date, 400 code should be retured.", async () => {
    const startDate = dayjs("hello").toDate();
    const endDate = dayjs("2021-02-03").toDate();
    const data = {
      startDate,
      endDate,
      minCount: 0,
      maxCount: 100,
    };

    const response = await request(app)
      .post("/api/records")
      .send(data);

    expect(response.body.code).toBe(400);
    // "startDate" must be a valid date
    expect(response.body.msg.indexOf('startDate') !== -1).toBeTruthy();
  });

  test("if minCount or maxCount isn't number, 400 code should be retured.", async () => {
    const startDate = dayjs("2021-01-01").toDate();
    const endDate = dayjs("2021-02-03").toDate();
    const data = {
      startDate,
      endDate,
      minCount: 'test',
      maxCount: 100,
    };

    const response = await request(app)
      .post("/api/records")
      .send(data);

    expect(response.body.code).toBe(400);
    // "minCount" must be a number
    expect(response.body.msg.indexOf('minCount') !== -1).toBeTruthy();
  });

  test("if the types of startDate, endDate, minCount, and maxCount are correct, success response should be returned with 0 code.", async () => {
    const startDate = dayjs("2021-01-01").toDate();
    const endDate = dayjs("2021-02-03").toDate();
    const data = {
      startDate,
      endDate,
      minCount: 0,
      maxCount: 100,
    };

    const response = await request(app)
      .post("/api/records")
      .send(data);

    expect(response.body.code).toBe(0);
    expect(response.body.msg).toBe("Success");
  });

  test("even if there is no any filter, success response should be retured.", async () => {
    const createdAt = "2021-02-03";
    await Record.create({
      key: "key5",
      createdAt: dayjs(createdAt).toDate(),
      counts: [30, 20],
    });

    const response = await request(app)
      .post("/api/records")
      .send(null);

    expect(response.body.code).toBe(0);
    expect(response.body.msg).toBe("Success");
    expect(response.body.records.length).toBe(1);
  });

  test("if wrong api is called, 404 code should be retured.", async () => {
    const startDate = dayjs("2021-01-01").toDate();
    const endDate = dayjs("2021-02-03").toDate();
    const data = {
      startDate,
      endDate,
      minCount: 0,
      maxCount: 100,
    };

    const response = await request(app)
      .post("/api/records1")
      .send(data);

    expect(response.body.code).toBe(404);
  });
});
