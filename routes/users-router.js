const userRouter = require("express").Router();
const { getUsers } = require("../controllers/controller");

userRouter.get("/", getUsers);

module.exports = userRouter;
