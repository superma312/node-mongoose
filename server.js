// Import express
const express = require("express");
const cors = require("cors");
// Initialize the app
const app = express();

const connectDb = require("./config/db");
// Import routes
let { record } = require("./routes");

app.use(cors());
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

connectDb();

// Send message for default URL
app.get('/', (req, res) => res.send("Welcome!"));

app.use("/api/records", record);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
