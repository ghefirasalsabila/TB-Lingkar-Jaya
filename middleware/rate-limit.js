const ApiError = require("../utils/api-error");

function createRateLimit({
  windowMs,
  max,
  message,
  keyPrefix = "default",
  skip = () => false
}) {
  const hits = new Map();

  function resolveClientKey(req) {
    const forwardedFor = req.headers["x-forwarded-for"];
    const forwarded = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : String(forwardedFor || "").split(",")[0].trim();

    return forwarded || req.ip || req.socket?.remoteAddress || "unknown";
  }

  return (req, _res, next) => {
    if (skip(req)) {
      return next();
    }

    const now = Date.now();
    if (hits.size > 1000) {
      for (const [key, value] of hits.entries()) {
        if (value.resetAt <= now) {
          hits.delete(key);
        }
      }
    }
    const clientKey = `${keyPrefix}:${resolveClientKey(req)}`;
    const current = hits.get(clientKey);

    if (!current || current.resetAt <= now) {
      hits.set(clientKey, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (current.count >= max) {
      return next(new ApiError(message, 429));
    }

    current.count += 1;
    hits.set(clientKey, current);
    return next();
  };
}

module.exports = createRateLimit;
