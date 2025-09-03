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

test("POST /api/carts requires authentication", async () => {
  const res = await request(app).post("/api/carts");
  assert.equal(res.statusCode, 401);
  assert.match(res.text || "", /Unauthorized|error|authentication/i);
});

test("POST /api/carts/:cid/purchase requires authentication", async () => {
  const res = await request(app).post("/api/carts/123/purchase");
  assert.equal(res.statusCode, 401);
  assert.match(res.text || "", /Unauthorized|error|authentication/i);
});
