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

test("GET /api/products returns 200", async () => {
  const res = await request(app).get("/api/products");
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.status, "success");
});

test("POST /api/products requires admin auth", async () => {
  const res = await request(app).post("/api/products").send({});
  assert.equal(res.statusCode, 401);
});
