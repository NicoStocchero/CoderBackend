// app.js
import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "./src/routes/products.router.js";
import cartsRouter from "./src/routes/carts.router.js";
import viewsRouter from "./src/routes/views.router.js";
import { Server } from "socket.io";
import { createServer } from "http";
import ProductManager from "./src/managers/ProductManager.js";

const app = express();

// Middleware básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Configuración de Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas HTTP
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Middleware errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ status: "error", message: "Error interno del servidor" });
});

// Socket.io y server
const httpServer = createServer(app);
const io = new Server(httpServer);

// Inicialización de ProductManager (usa JSON como base de datos)
const productManager = new ProductManager("./src/data/products.json");

io.on("connection", async (socket) => {
  console.log(`Cliente conectado ${socket.id}`);

  // Escucha para agregar un nuevo producto
  socket.on("new-product", async (data) => {
    await productManager.addProduct(data);
    const products = await productManager.getAll();
    io.emit("update-products", products);
  });

  // Escucha para eliminar el último producto
  socket.on("delete-last", async () => {
    const products = await productManager.getAll();
    if (products.length > 0) {
      const lastId = products[products.length - 1].id;
      await productManager.deleteProduct(lastId);
      const updated = await productManager.getAll();
      io.emit("update-products", updated);
    }
  });
});

// Puerto
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
