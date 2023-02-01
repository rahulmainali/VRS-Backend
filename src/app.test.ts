import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import app from "./app";


describe("Duplicate registration not allowed", () => {
  describe("give registration details ", () => {
    //should save the username and password to database
    // should return statusCodes.OK
    it ("should return a json object with 409 status code", async () => {
      const response = await request(app).post("/api/user/signup").send({
          firstName: "test",
          lastName: 'testing',
        email: "test@gmail.com",
        password: "rohan123",
      });
      expect(response.status).toBe(409);
    });
  });
});

describe("User login", () => {
  describe("give user details ", () => {
    //should save the username and password to database
    // should return statusCodes.OK
    it ("should return a json object with 200 status code", async () => {
      const response = await request(app).post("/api/user/login").send({
        email: "test@gmail.com",
        password: "rohan123",
      });
      expect(response.status).toBe(200);
    });
  });
});
