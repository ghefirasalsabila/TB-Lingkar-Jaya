const app = require("../backend/src/app");

function restoreApiPath(req) {
  const requestUrl = new URL(req.url, "https://tblingkarjaya.com");
  const rewrittenPath = requestUrl.searchParams.get("__pathname");

  if (typeof rewrittenPath === "string") {
    requestUrl.searchParams.delete("__pathname");
    const normalizedPath = rewrittenPath.replace(/^\/+/, "");
    requestUrl.pathname = normalizedPath ? `/api/${normalizedPath}` : "/api";
    const search = requestUrl.searchParams.toString();
    req.url = `${requestUrl.pathname}${search ? `?${search}` : ""}`;
  }
}

module.exports = (req, res) => {
  restoreApiPath(req);
  return app(req, res);
};
