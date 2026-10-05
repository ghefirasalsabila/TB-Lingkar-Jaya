function notFoundMiddleware(req, res) {
  res.status(404).json({
    message: "Rute tidak ditemukan",
    path: req.originalUrl
  });
}

module.exports = notFoundMiddleware;
