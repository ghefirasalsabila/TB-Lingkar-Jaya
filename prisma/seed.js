const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../src/utils/hash");

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const prisma = new PrismaClient();
const SEED_PREFIX = "seed-";
const SEED_DATA_DIR = path.join(__dirname, "seed-data");
const CHUNK_SIZE = {
  purchaseItems: 250,
  saleItems: 250,
  stockMovements: 400,
  notifications: 100,
  emailNotificationLogs: 100,
};

function resolveSeedProfile() {
  const normalized = String(process.env.SEED_PROFILE || "dev").trim().toLowerCase();
  return ["prod", "production"].includes(normalized) ? "prod" : "dev";
}

function readSeedJson(profile, fileName) {
  const filePath = path.join(SEED_DATA_DIR, profile, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Seed file tidak ditemukan: ${filePath}`);
  }

  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function chunkArray(items, size) {
  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

async function resolveUserRows(profile) {
  const users = readSeedJson(profile, "users.json");

  return Promise.all(
    users.map(async (user) => ({
      id: user.id,
      name: user.name,
      email: String(user.email).trim().toLowerCase(),
      role: user.role,
      isActive: user.isActive ?? true,
      passwordHash: user.passwordHash || await hashPassword(String(user.password || ""))
    }))
  );
}

function resolveProfileData(profile) {
  return {
    categories: readSeedJson(profile, "categories.json"),
    suppliers: readSeedJson(profile, "suppliers.json"),
    supplierCategories: readSeedJson(profile, "supplierCategories.json"),
    products: readSeedJson(profile, "products.json"),
    purchases: readSeedJson(profile, "purchases.json"),
    purchaseItems: readSeedJson(profile, "purchaseItems.json"),
    sales: readSeedJson(profile, "sales.json"),
    saleItems: readSeedJson(profile, "saleItems.json"),
    stockMovements: readSeedJson(profile, "stockMovements.json"),
    notifications: readSeedJson(profile, "notifications.json"),
    emailNotificationLogs: readSeedJson(profile, "emailNotificationLogs.json")
  };
}

async function clearSeedData(tx) {
  await tx.emailNotificationLog.deleteMany({ where: { id: { startsWith: SEED_PREFIX } } });
  await tx.notification.deleteMany({ where: { id: { startsWith: SEED_PREFIX } } });
  await tx.stockMovement.deleteMany({ where: { id: { startsWith: SEED_PREFIX } } });
  await tx.purchaseItem.deleteMany({ where: { id: { startsWith: SEED_PREFIX } } });
  await tx.saleItem.deleteMany({ where: { id: { startsWith: SEED_PREFIX } } });
  await tx.purchase.deleteMany({ where: { id: { startsWith: SEED_PREFIX } } });
  await tx.sale.deleteMany({ where: { id: { startsWith: SEED_PREFIX } } });
  await tx.supplierCategory.deleteMany({
    where: {
      OR: [
        { supplierId: { startsWith: SEED_PREFIX } },
        { categoryId: { startsWith: SEED_PREFIX } }
      ]
    }
  });
  await tx.product.deleteMany({ where: { id: { startsWith: SEED_PREFIX } } });
  await tx.supplier.deleteMany({ where: { id: { startsWith: SEED_PREFIX } } });
  await tx.category.deleteMany({ where: { id: { startsWith: SEED_PREFIX } } });
  await tx.user.deleteMany({ where: { id: { startsWith: SEED_PREFIX } } });
}

async function insertManyChunked(tx, model, rows, chunkSize) {
  if (!rows.length) {
    return;
  }

  for (const chunk of chunkArray(rows, chunkSize)) {
    await tx[model].createMany({ data: chunk });
  }
}

async function main() {
  const profile = resolveSeedProfile();
  const users = await resolveUserRows(profile);
  const data = resolveProfileData(profile);

  await prisma.$transaction(async (tx) => {
    await clearSeedData(tx);

    await tx.user.createMany({ data: users });
    await tx.category.createMany({ data: data.categories });
    await tx.supplier.createMany({ data: data.suppliers });
    await tx.supplierCategory.createMany({ data: data.supplierCategories });
    await tx.product.createMany({ data: data.products });
    await tx.purchase.createMany({ data: data.purchases });
    await insertManyChunked(tx, "purchaseItem", data.purchaseItems, CHUNK_SIZE.purchaseItems);
    await tx.sale.createMany({ data: data.sales });
    await insertManyChunked(tx, "saleItem", data.saleItems, CHUNK_SIZE.saleItems);
    await insertManyChunked(tx, "stockMovement", data.stockMovements, CHUNK_SIZE.stockMovements);
    await insertManyChunked(tx, "notification", data.notifications, CHUNK_SIZE.notifications);
    await insertManyChunked(tx, "emailNotificationLog", data.emailNotificationLogs, CHUNK_SIZE.emailNotificationLogs);
  }, { timeout: 120000 });

  process.stdout.write(
    [
      `Seed profile: ${profile}`,
      `Users: ${users.length}`,
      `Categories: ${data.categories.length}`,
      `Suppliers: ${data.suppliers.length}`,
      `Supplier categories: ${data.supplierCategories.length}`,
      `Products: ${data.products.length}`,
      `Purchases: ${data.purchases.length}`,
      `Sales: ${data.sales.length}`
    ].join("\n") + "\n"
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    process.stderr.write(`${String(error)}\n`);
    await prisma.$disconnect();
    process.exit(1);
  });
