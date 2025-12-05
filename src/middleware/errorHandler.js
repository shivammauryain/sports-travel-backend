import env from "../config/env.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  // Structured error logging
  console.error({
    type: "ERROR",
    requestId: req.id || "unknown",
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message,
    stack: env.NODE_ENV === "production" ? undefined : err.stack,
    timestamp: new Date().toISOString(),
  });

  // Avoid sending headers twice
  if (res.headersSent) {
    return next(err);
  }

  const responseBody = {
    success: false,
    message,
  };

  if (env.NODE_ENV !== "production") {
    responseBody.stack = err.stack;
  }

  res.status(statusCode).json(responseBody);
};

export default errorHandler;
