const cors = require("cors");

const express = require("express");
const {
  getTopics,
  getAPI,
  getArticleByID,
  getArticles,
  getComments,
  postComment,
  patchArticleVotes,
  deleteComment,
  getUsers,
} = require("./controllers/controller");

const {
  handlePsqlError,
  handleCustomError,
  handleServerError,
} = require("./errors");

const app = express();

app.use(cors());

app.use(express.json());

const apiRouter = require("./routes/api-router");

app.use("/api", apiRouter);

app.get("/api/topics", getTopics);

app.get("/api", getAPI);

app.get("/api/articles/:article_id", getArticleByID);

app.get("/api/articles/", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteComment);

// app.get("/api/users", getUsers);

app.use(handlePsqlError);
app.use(handleCustomError);
app.use(handleServerError);

module.exports = app;
