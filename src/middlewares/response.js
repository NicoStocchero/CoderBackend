// Middleware global para respuestas personalizadas
export const customResponseMiddleware = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");

  res.success = (message, data, status = 200) => {
    res.status(status).json({ status: "success", message, data });
  };

  res.badRequest = (message, error, status = 400) => {
    res.status(status).json({ status: "bad request", message, error });
  };

  res.unauthorized = (message, error, status = 401) => {
    res.status(status).json({ status: "unauthorized", message, error });
  };

  res.forbidden = (message, error, status = 403) => {
    res.status(status).json({ status: "forbidden", message, error });
  };

  res.notFound = (message, error, status = 404) => {
    res.status(status).json({ status: "not found", message, error });
  };

  res.internalServerError = (message, error, status = 500) => {
    res
      .status(status)
      .json({ status: "internal server error", message, error });
  };

  next();
};
