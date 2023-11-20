const express = require("express");
const { getTopics } = require("./controllers/controller");

const {
  handlePsqlError,
  handleCustomError,
  handleServerError,
} = require("./errors");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

module.exports = app;
