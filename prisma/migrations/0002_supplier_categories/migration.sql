-- CreateTable
CREATE TABLE "supplier_categories" (
    "supplier_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supplier_categories_pkey" PRIMARY KEY ("supplier_id", "category_id")
);

-- Backfill relasi supplier dan kategori dari histori pembelian yang sudah tersimpan.
INSERT INTO "supplier_categories" ("supplier_id", "category_id")
SELECT DISTINCT
    "purchases"."supplier_id",
    "products"."category_id"
FROM "purchases"
INNER JOIN "purchase_items"
    ON "purchase_items"."purchase_id" = "purchases"."id"
INNER JOIN "products"
    ON "products"."id" = "purchase_items"."product_id"
ON CONFLICT ("supplier_id", "category_id") DO NOTHING;

-- CreateIndex
CREATE INDEX "supplier_categories_category_id_idx" ON "supplier_categories"("category_id");

-- AddForeignKey
ALTER TABLE "supplier_categories" ADD CONSTRAINT "supplier_categories_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "supplier_categories" ADD CONSTRAINT "supplier_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
