import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/**
 * Configuración de la conexión a MongoDB
 * @returns {Promise} - La promesa de la conexión a MongoDB
 * @throws {Error} - El error de la conexión a MongoDB
 * @returns {void} - La conexión a MongoDB
 */
export const connectDB = async () => {
  try {
    // Validar variables de entorno
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      console.error(
        "❌ Error: MONGO_URI no está definido en las variables de entorno"
      );
      process.exit(1);
    }

    // Conexión a MongoDB con opciones mejoradas
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout de conexión
      socketTimeoutMS: 45000, // Timeout de socket
      family: 4, // IPv4
    });

    console.log("✅ Conectado a MongoDB exitosamente");
    console.log(`📍 Base de datos: ${mongoose.connection.name}`);

    // Manejo de eventos de conexión
    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB desconectado");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Error en MongoDB:", err);
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB reconectado");
    });
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err.message);
    process.exit(1);
  }
};

export default connectDB;
