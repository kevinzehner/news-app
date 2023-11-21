const {
  selectTopics,
  selectArticleByID,
  selectArticles,
  selectComments,
} = require("../models/model");
const { checkExists } = require("../utils");
const endPoints = require("../endpoints.json");

exports.getTopics = (req, res, next) => {
  return selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getAPI = (req, res, next) => {
  res.status(200).send({ endPoints });
};

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  checkExists("articles", "article_id", article_id)
    .then(() => selectComments(article_id))
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
