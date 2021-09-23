
const dayjs = require("dayjs");
const request = require("supertest");
const dbHandler = require("./db-handler");
const Record = require("../models/records.model");
const app = require('../server');
const { getRecordsWithFilters } = require("../services/records.service");

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

describe("getRecordsWithFilters service", () => {
  it("should get all records filtered by startDate, endDate, minCount, and maxCount", async () => {
    const createdAt = "2021-02-02";
    await Record.create({
      key: "key1",
      createdAt: dayjs(createdAt).toDate(),
      counts: [10],
    });
    const startDate = dayjs("2021-02-01").toDate();
    const endDate = dayjs("2021-02-03").toDate();
    const response = await getRecordsWithFilters(startDate, endDate, 0, 20);
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
    const response = await getRecordsWithFilters(startDate, endDate, 0, 70);
    expect(response.msg).toBe("Success");
    expect(response.records.length).toBe(0);
  });

  it("should filter records by minCount and maxCount", async () => {
    const createdAt = "2021-02-02";
    await Record.create({
      key: "key3",
      createdAt: dayjs(createdAt).toDate(),
      counts: [30, 20],
    });
    const startDate = dayjs("2021-01-01").toDate();
    const endDate = dayjs("2021-02-03").toDate();
    const response = await getRecordsWithFilters(startDate, endDate, 20, 30);
    expect(response.msg).toBe("Success");
    expect(response.records.length).toBe(0);
  });
});

describe("POST /api/records", () => {
  test("if one of startDate, endDate, minCount, and maxCount is missed, 400 code should be retured.", done => {
    const startDate = dayjs("2021-01-01").toDate();
    const endDate = dayjs("2021-02-03").toDate();
    const data = {
      startDate,
      endDate,
    };

    request(app)
      .post("/api/records")
      .send(data)
      .then(async (response) => {
        expect(response.body.code).toBe(400);
        done();
      });
  });

  test("if startDate or endDate isn't Date, 400 code should be retured.", done => {
    const startDate = dayjs("hello").toDate();
    const endDate = dayjs("2021-02-03").toDate();
    const data = {
      startDate,
      endDate,
      minCount: 0,
      maxCount: 100,
    };

    request(app)
      .post("/api/records")
      .send(data)
      .then(async (response) => {
        expect(response.body.code).toBe(400);
        // "startDate" must be a valid date
        expect(response.body.msg.indexOf('startDate') !== -1).toBeTruthy();
        done();
      });
  });

  test("if minCount or maxCount isn't number, 400 code should be retured.", done => {
    const startDate = dayjs("2021-01-01").toDate();
    const endDate = dayjs("2021-02-03").toDate();
    const data = {
      startDate,
      endDate,
      minCount: 'test',
      maxCount: 100,
    };

    request(app)
      .post("/api/records")
      .send(data)
      .then(async (response) => {
        expect(response.body.code).toBe(400);
        // "minCount" must be a number
        expect(response.body.msg.indexOf('minCount') !== -1).toBeTruthy();
        done();
      });
  });

  test("if the types of startDate, endDate, minCount, and maxCount are correct, success response should be returned with 0 code.", done => {
    const startDate = dayjs("2021-01-01").toDate();
    const endDate = dayjs("2021-02-03").toDate();
    const data = {
      startDate,
      endDate,
      minCount: 0,
      maxCount: 100,
    };

    request(app)
      .post("/api/records")
      .send(data)
      .then(async (response) => {
        expect(response.body.code).toBe(0);
        expect(response.body.msg).toBe("Success");
        done();
      });
  });


  test("If wrong api is called, 404 code should be retured.", done => {
    const startDate = dayjs("2021-01-01").toDate();
    const endDate = dayjs("2021-02-03").toDate();
    const data = {
      startDate,
      endDate,
      minCount: 0,
      maxCount: 100,
    };

    request(app)
      .post("/api/records1")
      .send(data)
      .then(async (response) => {
        expect(response.body.code).toBe(404);
        done();
      });
  });
});
