function isDatabaseUnavailable(error) {
  return (
    error?.code === "P1001"
    || error?.cause?.code === "P1001"
    || String(error?.message || "").includes("Can't reach database server")
    || String(error?.cause?.message || "").includes("Can't reach database server")
  );
}

function errorHandlerMiddleware(error, _req, res, _next) {
  const statusCode = error.statusCode || (isDatabaseUnavailable(error) ? 503 : 500);

  const payload = {
    message: isDatabaseUnavailable(error)
      ? "Database tidak tersedia"
      : (error.message || "Terjadi kesalahan pada server")
  };

  if (error.details) {
    payload.details = error.details;
  }

  res.status(statusCode).json(payload);
}

module.exports = errorHandlerMiddleware;
