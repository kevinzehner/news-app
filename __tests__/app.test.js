const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endPoints = require("../endpoints.json");

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
        console.log(res);
        expect(res.body.msg).toBe("article does not exist");
      });
  });
  test("should respond with a 400 status code when given an invalid ID", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(400)
      .then((res) => {
        console.log(res);
        expect(res.body.msg).toBe("Bad request");
      });
  });
});
