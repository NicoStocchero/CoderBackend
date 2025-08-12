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
import { ensureCart } from "./src/middlewares/ensureCart.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import { initializePassport } from "./src/config/passport.config.js";
import sessionsRouter from "./src/routes/sessions.router.js";
import usersRouter from "./src/routes/users.router.js";
import jwt from "jsonwebtoken";
import { TOKEN_COOKIE } from "./src/controller/sessions.controller.js";
import cors from "cors";

dotenv.config();

// Conectar a la base de datos
await connectDB();

const app = express();

// Confiar en proxy en producción (requerido para cookies secure tras proxy)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// CORS (habilitar cookies cross-site cuando haya frontend separado)
const allowedOrigins = (
  process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:3000"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser clients
      return allowedOrigins.includes(origin)
        ? callback(null, true)
        : callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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

// Middleware para asegurar que el carrito exista (sin sesiones, via cookie)
app.use(ensureCart);

// Exponer datos comunes a las vistas a partir de cookies/JWT
app.use((req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET || "devSecretChangeMe";
  const token = req.cookies?.[TOKEN_COOKIE];
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload.user;
      res.locals.user = payload.user;
    } catch {
      // Token inválido/expirado: limpiar cookie para evitar loops
      res.clearCookie(TOKEN_COOKIE);
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  res.locals.cartId = req.cookies?.cartId || null;
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
app.use("/api/users", usersRouter);
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
