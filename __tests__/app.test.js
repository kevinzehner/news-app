const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endPoints = require("../endpoints.json");

const sorted = require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("200: Check the returned results keys are correct", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        res.body.topics.rows.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/", () => {
  test("should return a JSON object describing the different endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({ endPoints });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("should return an article object with the correct expected keys", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("should respond with a 404 status code when given a valid ID but doesn't exist", () => {
    return request(app)
      .get("/api/articles/10002220")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("article does not exist");
      });
  });
  test("should respond with a 400 status code when given an invalid ID", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Check the returned results keys are correct", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.articles.length).toBe(13);

        res.body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: should return a results array sorted in decending order by created_at ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articlesArr = res.body.articles;
        expect(articlesArr).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200:returned comments array should hold objects with correct keys", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments.length).toBe(11);
        res.body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("200: should return an array with recent comments first ", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const commentsArr = res.body.comments;
        expect(commentsArr).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("404: should respond with 404 status code if the given id is valid but there are no comments", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });
  test("should respond with a 404 status code when given a valid ID but doesn't exist", () => {
    return request(app)
      .get("/api/articles/10002220/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });
  test("should respond with a 400 status code when given an invalid ID", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: should post a new comment and return the posted comment", () => {
    const testComment = {
      username: "butter_bridge",
      body: "testing a comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(201)
      .then((res) => {
        expect(res.body).toMatchObject({
          comment: {
            article_id: 1,
            author: "butter_bridge",
            body: "testing a comment",
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            votes: 0,
          },
        });
      });
  });

  test("404: should respond with 404 status code if the given id is valid but the article doesn't exist", () => {
    const testComment = {
      username: "butter_bridge",
      body: "testing a comment",
    };
    return request(app)
      .post("/api/articles/1000/comments")
      .send(testComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });

  test("400: should receive an error if username or body are missing ", () => {
    const testComment = {
      body: "testing a comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });

  test("400: should respond with 400 status code if the article id is invalid", () => {
    const testComment = {
      username: "butter_bridge",
      body: "testing a comment",
    };
    return request(app)
      .post("/api/articles/NOTVALID/comments")
      .send(testComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("404: should respond with 404 status code for a non existant username", () => {
    const testComment = {
      username: "doesNotExist",
      body: "testing a comment",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });
});

describe("PATCH /api/articles/1", () => {
  test("200: should update the number of votes and return the article", () => {
    const testUpdate = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(testUpdate)
      .expect(200)
      .then((res) => {
        expect(res.body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 110,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("404: should respond with 404 status code if the given id is valid but the article doesn't exist", () => {
    return request(app)
      .patch("/api/articles/1000")
      .send({ inc_votes: 5 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });

  test("400: should respond with a 400 status code when given an invalid ID", () => {
    return request(app)
      .patch("/api/articles/banana")
      .send({ inc_votes: 5 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("400: should respond with a 400 status code if inc_votes has an invalid value", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "not valid" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});
