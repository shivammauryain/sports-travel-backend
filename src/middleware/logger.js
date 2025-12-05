const logger = (req, res, next) => {
  const start = Date.now();
  const requestId = req.id || "unknown";

  res.on("finish", () => {
    const duration = Date.now() - start;

    console.log({
      requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      timestamp: new Date().toISOString(),
    });
  });

  next();
};

export default logger;
