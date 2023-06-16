const request = require("supertest");
const app = require("../app/app.js");
const connection = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/seedData/testData/users.js");

beforeEach(() => seed(testData));

afterAll(() => connection.close());

describe("/api/articles", () => {
  test("GET Status 200 - returns an array of all articles", () => {
    return request(app)
      .get("/api/users/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(4);
        response.body.articles.forEach((article) => {
          expect(typeof article._id).toBe("string");
          expect(typeof article.article_title).toBe("string");
          expect(typeof article.article_category).toBe("string");
          expect(typeof article.article_img).toBe("string");
          expect(typeof article.article_blurb).toBe("string");
          expect(typeof article.article_body).toBe("string");
          expect(typeof article.created_by).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(Array.isArray(article.votes)).toBe(true);
          expect(Array.isArray(article.comments)).toBe(true);
        });
      });
  });
  test("GET Status 200 - QUERY article_category:Quantum Physics - artilce with that category", () => {
    return request(app)
      .get("/api/users/articles?article_category=Quantum Physics")
      .expect(200)
      .then((response) => {
        response.body.articles.forEach((article) => {
          expect(typeof article.article_title).toBe("string");
          expect(article.article_category).toBe("Quantum Physics");
          expect(typeof article.article_img).toBe("string");
          expect(typeof article.article_blurb).toBe("string");
          expect(typeof article.article_body).toBe("string");
          expect(typeof article.created_by).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(Array.isArray(article.votes)).toBe(true);
          expect(Array.isArray(article.comments)).toBe(true);
        });
      });
  });

  test("GET Status 200 - QUERY author:CadenGG - artilce with that author", () => {
    return request(app)
      .get("/api/users/articles?author=CadenGG")
      .expect(200)
      .then((response) => {
        response.body.articles.forEach((article) => {
          expect(typeof article.article_title).toBe("string");
          expect(typeof article.article_category).toBe("string");
          expect(typeof article.article_img).toBe("string");
          expect(typeof article.article_blurb).toBe("string");
          expect(typeof article.article_body).toBe("string");
          expect(article.created_by).toBe("CadenGG");
          expect(typeof article.created_at).toBe("string");
          expect(Array.isArray(article.votes)).toBe(true);
          expect(Array.isArray(article.comments)).toBe(true);
        });
      });
  });

  test("GET Status 200 - QUERY article_date:2023 - should return all articles in that year", () => {
    return request(app)
      .get("/api/users/articles?article_date=2023")
      .expect(200)
      .then((response) => {
        response.body.articles.forEach((article) => {
          expect(typeof article.article_title).toBe("string");
          expect(typeof article.article_category).toBe("string");
          expect(typeof article.article_img).toBe("string");
          expect(typeof article.article_blurb).toBe("string");
          expect(typeof article.article_body).toBe("string");
          expect(typeof article.created_by).toBe("string");
          expect(article.created_at.slice(0, 4)).toBe("2023");
          expect(Array.isArray(article.votes)).toBe(true);
          expect(Array.isArray(article.comments)).toBe(true);
        });
      });
  });
  test("GET Status 200 - QUERY article_date:2022 - should return all articles in that year (empty array)", () => {
    return request(app)
      .get("/api/users/articles?article_date=2022")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(0);
      });
  });
  test("GET Status 200 - QUERY article_votes=0 - should return all the artilces with 0 votes", () => {
    return request(app)
      .get("/api/users/articles?article_votes=0")
      .expect(200)
      .then((response) => {
        response.body.articles.forEach((article) => {
          expect(article.total_votes).toBe(0);
        });
      });
  });
  test("GET Status 200 - QUERY article_votes=>-1 - should return all the artilces with greater than -1 votes ", () => {
    return request(app)
      .get("/api/users/articles?article_votes=>-1")
      .expect(200)
      .then((response) => {
        response.body.articles.forEach((article) => {
          expect(article.total_votes).toBeGreaterThan(-1);
        });
      });
  });

  test("GET Status 200 - QUERY article_votes=<1 - should return all the artilces with less than 1 votes ", () => {
    return request(app)
      .get("/api/users/articles?article_votes=<1")
      .expect(200)
      .then((response) => {
        response.body.articles.forEach((article) => {
          expect(article.total_votes).toBeLessThan(1);
        });
      });
  });

  test("sorts articles by votes and defaults to descending", () => {
    return request(app)
      .get("/api/users/articles?sortBy=total_votes")
      .expect(200)
      .then((res) => {
        const total_votesArr = res.body.articles.map(
          (article) => article.total_votes
        );
        expect(total_votesArr).toBeSorted({
          descending: true,
        });
      });
  });
  test("sorts articles by votes and works with ascending", () => {
    return request(app)
      .get("/api/users/articles?sortBy=total_votes&order=asc")
      .expect(200)
      .then((res) => {
        const total_votesArr = res.body.articles.map(
          (article) => article.total_votes
        );
        expect(total_votesArr).toBeSorted({
          descending: false,
        });
      });
  });
  test("sorts articles by date and works with ascending", () => {
    return request(app)
      .get("/api/users/articles?sortBy=date&order=asc")
      .expect(200)
      .then((res) => {
        const dateArr = res.body.articles.map((article) => article.created_at);
        expect(dateArr).toBeSorted({
          descending: false,
        });
      });
  });
  test("sorts articles by date and defaults to descending", () => {
    return request(app)
      .get("/api/users/articles?sortBy=date")
      .expect(200)
      .then((res) => {
        const dateArr = res.body.articles.map((article) => article.created_at);
        expect(dateArr).toBeSorted({
          descending: true,
        });
      });
  });
  test("can have multiple queries on the article", () => {
    return request(app)
      .get("/api/users/articles?article_date=2023&article_votes=0")
      .expect(200)
      .then((response) => {
        response.body.articles.forEach((article) => {
          expect(typeof article.article_title).toBe("string");
          expect(typeof article.article_category).toBe("string");
          expect(typeof article.article_img).toBe("string");
          expect(typeof article.article_blurb).toBe("string");
          expect(typeof article.article_body).toBe("string");
          expect(typeof article.created_by).toBe("string");
          expect(article.created_at.slice(0, 4)).toBe("2023");
          expect(article.total_votes).toBe(0);
          expect(Array.isArray(article.comments)).toBe(true);
        });
      });
  });
});
