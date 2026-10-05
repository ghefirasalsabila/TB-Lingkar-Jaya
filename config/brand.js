const fs = require("fs");
const path = require("path");
const brand = require("../../../shared/brand.json");

const brandLogoFilePath = path.resolve(__dirname, "../../../frontend/public/favicon.svg");
let cachedBrandLogoSvg = null;

function getBrandLogoSvg() {
  if (cachedBrandLogoSvg) {
    return cachedBrandLogoSvg;
  }

  cachedBrandLogoSvg = fs.readFileSync(brandLogoFilePath, "utf8");
  return cachedBrandLogoSvg;
}

module.exports = {
  brand,
  getBrandLogoSvg,
};
