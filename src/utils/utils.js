import { dirname } from "path";
import { fileURLToPath } from "url";

/**
 * Obtiene el directorio actual
 * @returns {string} - El directorio actual
 */
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
