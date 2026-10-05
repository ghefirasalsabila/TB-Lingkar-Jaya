const swaggerUi = require("swagger-ui-express")
const { brand } = require("../config/brand")

let cachedOpenApiSpec = null
let cachedSwaggerMiddleware = null

function getOpenApiSpec() {
  if (!cachedOpenApiSpec) {
    cachedOpenApiSpec = require("./openapi").openApiSpec
  }

  return cachedOpenApiSpec
}

function getSwaggerMiddleware() {
  if (!cachedSwaggerMiddleware) {
    cachedSwaggerMiddleware = swaggerUi.setup(getOpenApiSpec(), {
      customSiteTitle: `${brand.name} API Docs`,
      explorer: true
    })
  }

  return cachedSwaggerMiddleware
}

function registerApiDocs(app) {
  app.get("/api/openapi.json", (_req, res) => {
    res.json(getOpenApiSpec())
  })

  app.use(
    "/api/docs",
    swaggerUi.serve,
    (req, res, next) => getSwaggerMiddleware()(req, res, next)
  )
}

module.exports = {
  registerApiDocs
}
