module.exports = app => {
  const records = require("../controllers/record.controller.js");
  const router = require("express").Router();

  router.post("/", records.findAll);

  app.use("/api/records", router);
};