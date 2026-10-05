const ApiError = require("../utils/api-error");

function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError("Tidak diizinkan", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError("Akses ditolak", 403));
    }

    return next();
  };
}

module.exports = authorize;
