const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("200: Get successful status code", () => {
    return request(app).get("/api/topics").expect(200);
  });

  test("200: Check returned result is an array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        console.log(res.body);
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
  test("200: Check the returned results keys are correct", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        res.body.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
