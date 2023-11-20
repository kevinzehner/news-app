const express = require("express");
const { getTopics, getAPI } = require("./controllers/controller");

const {
  handlePsqlError,
  handleCustomError,
  handleServerError,
} = require("./errors");

const app = express();
app.use(express.json());
app.use(handlePsqlError);
app.use(handleCustomError);
app.use(handleServerError);

app.get("/api/topics", getTopics);

app.get("/api", getAPI);

module.exports = app;
