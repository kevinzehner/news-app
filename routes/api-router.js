const apiRouter = require("express").Router();
const userRouter = require("./users-router");
const { getAPI } = require("../controllers/controller");
const articlesRouter = require("./articles-router");

apiRouter.get("/", getAPI);

apiRouter.use("/users", userRouter);

apiRouter.use("/articles", articlesRouter);
module.exports = apiRouter;
