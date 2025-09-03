import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import dotenv from "dotenv";

dotenv.config();

let server;
let app;

before(async () => {
  const mod = await import("../app.js");
  app = mod.app;
  server = app.listen(0);
});

after(async () => {
  server && server.close();
});

test("POST /api/sessions/login should reject invalid credentials", async () => {
  const res = await request(app)
    .post("/api/sessions/login")
    .send({ email: "invalid@example.com", password: "bad" });
  assert.equal(res.statusCode, 401);
});

test("GET /api/sessions/current should require auth", async () => {
  const res = await request(app).get("/api/sessions/current");
  assert.equal(res.statusCode, 401);
});
