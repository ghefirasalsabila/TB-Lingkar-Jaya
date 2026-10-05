function validate(schema, source = "body") {
  return (req, _res, next) => {
    const target = req[source];
    const parsed = schema.safeParse(target);

    if (!parsed.success) {
      return next({
        statusCode: 400,
        message: "Validasi gagal",
        details: parsed.error.flatten()
      });
    }

    req[source] = parsed.data;
    return next();
  };
}

module.exports = validate;
