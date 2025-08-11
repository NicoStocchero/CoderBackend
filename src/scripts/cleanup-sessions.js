import fs from "fs";
import path from "path";
import { __dirname } from "./utils/utils.js";

const sessionDir = "sessions";
const maxAge = 2 * 60 * 60 * 1000; // 2 horas en milisegundos

function cleanupOldSessions() {
  const files = fs.readdirSync(sessionDir);
  const now = Date.now();
  let cleaned = 0;

  files.forEach((file) => {
    const filePath = path.join(__dirname, sessionDir, file);
    const stats = fs.statSync(filePath);

    if (now - stats.mtime.getTime() > maxAge) {
      fs.unlinkSync(filePath);
      console.log(`Eliminado: ${file}`);
      cleaned++;
    }
  });

  console.log(`✅ Limpieza completada. ${cleaned} archivos eliminados.`);
  console.log(`📊 Archivos restantes: ${files.length - cleaned}`);
}

cleanupOldSessions();
