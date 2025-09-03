/**
 * Middleware de autorización por rol
 * Debe usarse junto con la estrategia `current` (JWT) que setea `req.user`.
 * @param {string[]} rolesPermitidos - Roles autorizados (p.ej., ["admin"]).
 * @returns {Function} - Middleware de autorización
 */
export const authorize = (rolesPermitidos = []) => {
  const normalized = Array.isArray(rolesPermitidos)
    ? rolesPermitidos.map((r) => String(r).toLowerCase())
    : [String(rolesPermitidos).toLowerCase()];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (normalized.length === 0) {
      return next();
    }

    const role = String(req.user.role || "user").toLowerCase();
    if (!normalized.includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return next();
  };
};

export default authorize;
