const articlesRouter = require("express").Router();
const { getUsers, getArticles } = require("../controllers/controller");

articlesRouter.get("/", getArticles);

module.exports = articlesRouter;
