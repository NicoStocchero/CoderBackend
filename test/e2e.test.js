import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

let server;
let app;
let adminAgent;
let userAgent;
let userCookie;
let createdProductId;
let savedUserEmail;
let savedUserId;

// Models (para preparar datos)
let UserModel;

before(async () => {
  // Forzar secretos en entorno de test si no están definidos
  if (!process.env.JWT_SECRET) process.env.JWT_SECRET = "devSecretChangeMe";
  if (!process.env.RESET_SECRET)
    process.env.RESET_SECRET = "devResetSecretChangeMe";
  const mod = await import("../app.js");
  app = mod.app;
  server = app.listen(0);
  const userMod = await import("../src/models/user.model.js");
  UserModel = userMod.mongooseSchema;
});

after(async () => {
  server && server.close();
});

test("Setup admin, login y crear producto", async () => {
  adminAgent = request.agent(app);
  const adminEmail = "admin@test.com";
  const adminPass = "Admin123!";

  // Upsert admin
  const hashed = bcrypt.hashSync(adminPass, 10);
  await UserModel.deleteOne({ email: adminEmail });
  await UserModel.create({
    first_name: "Admin",
    last_name: "Test",
    email: adminEmail,
    age: 30,
    password: hashed,
    role: "admin",
  });

  // Login admin
  const loginRes = await adminAgent
    .post("/api/sessions/login")
    .send({ email: adminEmail, password: adminPass });
  assert.equal(loginRes.statusCode, 200);

  // Crear producto
  const productRes = await adminAgent.post("/api/products").send({
    title: "Test Product",
    description: "Desc",
    price: 100,
    status: true,
    stock: 5,
    category: "tests",
    thumbnails: [],
  });
  assert.equal(productRes.statusCode, 200);
  createdProductId =
    productRes.body?.data?._id || productRes.body?.data?.id || null;
  assert.ok(createdProductId, "Debe devolver id de producto creado");
});

test("Registrar usuario, crear carrito, agregar producto y comprar", async () => {
  userAgent = request.agent(app);
  const userEmail = `user+${Date.now()}@test.com`;
  const userPass = "User123!";

  // Registrar
  await userAgent.post("/api/sessions/register").send({
    first_name: "User",
    last_name: "Test",
    email: userEmail,
    age: 25,
    password: userPass,
  });

  // Login
  const loginRes = await userAgent
    .post("/api/sessions/login")
    .send({ email: userEmail, password: userPass });
  assert.equal(loginRes.statusCode, 200);
  // Guardar email e id para el test de reset
  savedUserEmail = userEmail;
  savedUserId = loginRes.body?.user?._id;
  const setCookies = loginRes.headers["set-cookie"] || [];
  const raw = setCookies.find((c) => c.toLowerCase().startsWith("token="));
  assert.ok(raw, "Debe setear cookie token");
  const match = raw.match(/token=([^;]+)/i);
  userCookie = match ? `token=${match[1]}` : null;
  assert.ok(userCookie, "Debe parsear token");

  // Crear carrito
  const cartRes = await userAgent.post("/api/carts").set("Cookie", userCookie);
  assert.equal(cartRes.statusCode, 201);
  const cartId = cartRes.body?.data?._id;
  assert.ok(cartId, "Debe devolver cartId");

  // Agregar producto
  const addRes = await userAgent
    .post(`/api/carts/${cartId}/products/${createdProductId}`)
    .set("Cookie", userCookie);
  assert.equal(addRes.statusCode, 200);

  // Comprar
  const purRes = await userAgent
    .post(`/api/carts/${cartId}/purchase`)
    .set("Cookie", userCookie);
  assert.equal(purRes.statusCode, 200);
  assert.ok(purRes.body?.data, "Debe devolver data");
});

test("Forgot + Reset password con token válido", async () => {
  const targetEmail = savedUserEmail;
  const newPass = "User1234!";

  // Obtener uid (de login previo o, como fallback, desde la DB)
  let uid = savedUserId;
  if (!uid) {
    const userDoc = await UserModel.findOne({ email: targetEmail }).lean();
    assert.ok(userDoc, "User debe existir");
    uid = userDoc._id;
  }

  // Generar token manual con RESET_SECRET
  const token = jwt.sign(
    { uid, email: targetEmail },
    process.env.RESET_SECRET || "devResetSecretChangeMe",
    { expiresIn: "1h" }
  );

  // Reset
  const res = await request(app)
    .post("/api/sessions/reset")
    .send({ token, password: newPass });
  // En algunos entornos se retorna 200 o 204 según middlewares; aceptamos 200-204
  assert.ok([200, 204].includes(res.statusCode));

  // Login con la nueva
  const agent = request.agent(app);
  const loginRes = await agent
    .post("/api/sessions/login")
    .send({ email: targetEmail, password: newPass });
  assert.equal(loginRes.statusCode, 200);
});
