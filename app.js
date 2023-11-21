const express = require("express");
const {
  getTopics,
  getAPI,
  getArticleByID,
  getArticles,
} = require("./controllers/controller");

const {
  handlePsqlError,
  handleCustomError,
  handleServerError,
} = require("./errors");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getAPI);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles/", getArticles);

app.use(handlePsqlError);
app.use(handleCustomError);
app.use(handleServerError);

module.exports = app;
