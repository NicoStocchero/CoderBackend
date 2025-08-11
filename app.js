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
import cookieParser from "cookie-parser";
import passport from "passport";
import { initializePassport } from "./src/config/passport.config.js";
import sessionsRouter from "./src/routes/sessions.router.js";

dotenv.config();

// Conectar a la base de datos
await connectDB();

const app = express();

// Configuración de express-session (después de app = express())
app.use(
  session({
    secret: "miSuperClaveSecreta123", // Cambiar en producción
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 }, // 1 hora de sesión
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: "coderbackend",
    }),
  })
);

// Cookies (para JWT)
app.use(cookieParser());

// Middleware básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Inicializar Passport (JWT/local)
initializePassport();
app.use(passport.initialize());

// Middleware para asegurar que el carrito exista
app.use(ensureCart);

// Exponer datos comunes a las vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.cartId = req.session.cartId || null;
  next();
});

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
      formatDate: (isoDate) => {
        try {
          const date = new Date(isoDate);
          return new Intl.DateTimeFormat("es-AR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }).format(date);
        } catch {
          return isoDate;
        }
      },
    },
    partialsDir: ["./src/views/partials"],
  })
);
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas HTTP
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
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
