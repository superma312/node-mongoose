# Node.js - Express - Mongoose - Jest - REST API

This is a application to fetch mongodb records with some filters using aggregation.
Here is a [demo API](https://getir-node-mongoose.herokuapp.com/api/records).

- Node.js server with Express
- MongoDB connection with Mongoose
- Joi for API request validation
- dayjs for handling dates
- Jest with mongodb-memory-server and supertest for testing

## Installation

Create a .env in root directory and set MONGO_URI variable with your MongoDB URI.

```sh
$ git clone https://github.com/superma312/node-mongoose.git my-project
$ cd my-project
$ npm i
$ npm run dev
```
## Jest testing

```sh
$ npm run test
```
