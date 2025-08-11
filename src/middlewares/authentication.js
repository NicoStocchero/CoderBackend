import passport from "passport";

/**
 * Middleware de autenticación basado en sesión
 * @param {Array} permission - Los roles permitidos
 * @returns {Function} - El middleware de autenticación
 */
export const auth = (permission = []) => {
  return (req, res, next) => {
    if (!Array.isArray(permission)) {
      permission = [permission];
    }
    permission = permission.map((p) => p.toLowerCase());

    if (permission.includes("public")) {
      return next();
    }

    if (!req.session.user) {
      return res.status(401).send({ error: "Authentication required" });
    }

    // Si no hay roles definidos, solo verificar que esté autenticado
    if (!req.session.user.role) {
      return next();
    }

    if (!permission.includes(req.session.user.role)) {
      return res.status(403).send({ error: "Forbidden" });
    }

    return next();
  };
};

/**
 * Middleware de autenticación basado en Passport
 * @param {string} strategy - La estrategia de autenticación
 * @returns {Function} - El middleware de autenticación
 */
export const passportAuth = (strategy) => (req, res, next) => {
  passport.authenticate(strategy, (err, user, info, status) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).send({
        error: info.message ? info.message : info.toString(),
      });
    req.user = user;
    return next();
  })(req, res, next);
};
