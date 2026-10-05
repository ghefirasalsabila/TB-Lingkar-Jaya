const prisma = require("../config/db");
const ApiError = require("../utils/api-error");
const { verifyAccessToken } = require("../utils/jwt");
const {
  ensureActiveUser,
  mapAuthenticatedUser
} = require("../modules/auth/auth-helpers");

async function authenticate(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new ApiError("Tidak diizinkan", 401));
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError("Tidak diizinkan", 401));
  }

  try {
    const payload = verifyAccessToken(token);

    const user = await ensureActiveUser(prisma, payload.sub, {
      select: {
        id: true,
        role: true,
        email: true,
        isActive: true
      },
      message: "Tidak diizinkan",
      status: 401
    });

    req.user = mapAuthenticatedUser(user);

    return next();
  } catch {
    return next(new ApiError("Tidak diizinkan", 401));
  }
}

module.exports = authenticate;
