// app.js
import express from "express";
import handlebars from "express-handlebars";
import productsRouter from "./src/routes/products.router.js";
import cartsRouter from "./src/routes/carts.router.js";
import viewsRouter from "./src/routes/views.router.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { productModel } from "./src/models/products.model.js";
import dotenv from "dotenv";
import connectDB from "./src/config/database.js";
import session from "express-session";
import { ensureCart } from "./src/middlewares/ensureCart.js";
import MongoStore from "connect-mongo";

dotenv.config();

// Conectar a la base de datos
await connectDB();

const app = express();

// Configuración de express-session (después de app = express())
app.use(
  session({
    secret: "miSuperClaveSecreta123", // Cambiala en producción
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hora de sesión
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: "coderbackend",
    }),
  })
);

// Middleware para asegurar que el carrito exista
app.use(ensureCart);

// Middleware básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Configuración de Handlebars
app.engine(
  "handlebars",
  handlebars.engine({
    helpers: {
      eq: (a, b) => a === b,
      multiply: (a, b) => a * b,
      formatCurrency: (value) => {
        return new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
          minimumFractionDigits: 0,
        }).format(value);
      },
    },
  })
);
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

io.on("connection", async (socket) => {
  console.log(`Cliente conectado ${socket.id}`);

  // Escucha para agregar un nuevo producto
  socket.on("new-product", async (data) => {
    await productModel.create(data);
    const products = await productModel.find().lean();
    io.emit("update-products", products);
  });

  // Escucha para eliminar el último producto
  socket.on("delete-last", async () => {
    const products = await productModel.find().sort({ _id: 1 }).lean();
    if (products.length > 0) {
      const last = products[products.length - 1];
      await productModel.findByIdAndDelete(last._id);
      const updated = await productModel.find().lean();
      io.emit("update-products", updated);
    }
  });
});

// Puerto
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
