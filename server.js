// Import express
const express = require("express");
const cors = require("cors");
// Initialize the app
const app = express();

const connectDb = require("./databases");
// Import routes
let { recordRoute } = require("./routes");
const { APIerror } = require("./helpers/api-response");

app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  connectDb();
}

// Send message for default URL
app.get('/', (req, res) => res.send("Welcome!"));

app.use("/api/records", recordRoute);

app.use((req, res, next) => {
  const error = new Error("Not found API");
  error.status = 404;
  next(error);
});

app.use(function(err, req, res, next) {
  res.send(APIerror(err.status || 500, err.message || "Unknown API Error"));
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
