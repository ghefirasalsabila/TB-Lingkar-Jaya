const { ROLES } = require("../constants/roles")
const { NOTIFICATION_TYPES } = require("../constants/notifications")
const { brand } = require("../config/brand")
const {
  TRANSACTION_STATUSES,
  TRANSACTION_REFERENCE_TYPES,
  STOCK_MOVEMENT_TYPES
} = require("../constants/transactions")

const roleValues = Object.values(ROLES)
const notificationTypeValues = Object.values(NOTIFICATION_TYPES)
const transactionStatusValues = Object.values(TRANSACTION_STATUSES)
const referenceTypeValues = Object.values(TRANSACTION_REFERENCE_TYPES)
const stockMovementTypeValues = Object.values(STOCK_MOVEMENT_TYPES)
const productHealthValues = ["safe", "warning", "critical"]

function ref(name) {
  return { $ref: `#/components/schemas/${name}` }
}

function response(description, schema) {
  return {
    description,
    content: {
      "application/json": {
        schema
      }
    }
  }
}

function envelopeSchema(schema) {
  return {
    type: "object",
    required: ["data"],
    properties: {
      data: schema
    }
  }
}

function paginatedSchema(itemSchema) {
  return {
    type: "object",
    required: ["data", "meta"],
    properties: {
      data: {
        type: "array",
        items: itemSchema
      },
      meta: ref("PaginationMeta")
    }
  }
}

function bearerSecurity() {
  return [{ bearerAuth: [] }]
}

const idSchema = {
  type: "string",
  minLength: 1,
  example: "cmab12cd30000xyz12345abcd"
}

const dateSchema = {
  type: "string",
  format: "date",
  example: "2026-05-05"
}

const dateTimeSchema = {
  type: "string",
  format: "date-time",
  example: "2026-05-05T10:15:30.000Z"
}

const moneySchema = {
  type: "number",
  format: "float",
  example: 125000
}

const healthSchema = {
  type: "string",
  enum: productHealthValues,
  example: "warning"
}

const paginationParameters = {
  Page: {
    name: "page",
    in: "query",
    schema: { type: "integer", minimum: 1, default: 1 },
    description: "Nomor halaman"
  },
  Limit: {
    name: "limit",
    in: "query",
    schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
    description: "Jumlah data per halaman"
  },
  Search: {
    name: "search",
    in: "query",
    schema: { type: "string", minLength: 1 },
    description: "Kata kunci pencarian"
  },
  CategoryIdQuery: {
    name: "categoryId",
    in: "query",
    schema: idSchema,
    description: "Filter produk berdasarkan kategori"
  },
  FromDate: {
    name: "from",
    in: "query",
    schema: dateSchema,
    description: "Tanggal mulai. Harus dipakai bersama `to`."
  },
  ToDate: {
    name: "to",
    in: "query",
    schema: dateSchema,
    description: "Tanggal akhir. Harus dipakai bersama `from`."
  },
  TrendMonth: {
    name: "trendMonth",
    in: "query",
    schema: { type: "integer", minimum: 1, maximum: 12, example: 5 },
    description: "Bulan grafik dasbor bila tidak memakai `from` dan `to`."
  },
  TrendYear: {
    name: "trendYear",
    in: "query",
    schema: { type: "integer", minimum: 2000, maximum: 9999, example: 2026 },
    description: "Tahun grafik dasbor bila tidak memakai `from` dan `to`."
  },
  AllTime: {
    name: "allTime",
    in: "query",
    schema: { type: "boolean", example: true },
    description: "Gunakan seluruh rentang data aktual tanpa mengirim tanggal awal dan akhir manual."
  },
  UnreadOnly: {
    name: "unreadOnly",
    in: "query",
    schema: { type: "boolean", example: true },
    description: "Tampilkan hanya notifikasi yang belum dibaca"
  },
  ReportType: {
    name: "type",
    in: "query",
    schema: {
      type: "string",
      enum: ["summary", "sales", "purchases", "movements"],
      default: "summary"
    },
    description: "Jenis laporan PDF yang akan diekspor"
  },
  EntityId: {
    name: "id",
    in: "path",
    required: true,
    schema: idSchema,
    description: "ID entitas"
  }
}

const components = {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT"
    }
  },
  parameters: paginationParameters,
  responses: {
    ValidationError: response("Request tidak valid", ref("ValidationError")),
    Unauthorized: response("Token tidak ada, tidak valid, atau pengguna tidak aktif", ref("ErrorResponse")),
    Forbidden: response("Role tidak memiliki akses ke endpoint ini", ref("ErrorResponse")),
    NotFound: response("Data tidak ditemukan", ref("ErrorResponse")),
    Conflict: response("Konflik data atau status tidak sesuai", ref("ErrorResponse"))
  },
  schemas: {
    ErrorResponse: {
      type: "object",
      required: ["message"],
      properties: {
        message: {
          type: "string",
          example: "Terjadi kesalahan pada server"
        },
        details: {
          type: "object",
          additionalProperties: true,
          nullable: true
        }
      }
    },
    ValidationError: {
      type: "object",
      required: ["message", "details"],
      properties: {
        message: {
          type: "string",
          example: "Validasi gagal"
        },
        details: {
          type: "object",
          properties: {
            formErrors: {
              type: "array",
              items: { type: "string" }
            },
            fieldErrors: {
              type: "object",
              additionalProperties: {
                type: "array",
                items: { type: "string" }
              }
            }
          }
        }
      }
    },
    PaginationMeta: {
      type: "object",
      required: ["page", "limit", "totalItems", "totalPages", "hasNext", "hasPrev"],
      properties: {
        page: { type: "integer", example: 1 },
        limit: { type: "integer", example: 20 },
        totalItems: { type: "integer", example: 160 },
        totalPages: { type: "integer", example: 8 },
        hasNext: { type: "boolean", example: true },
        hasPrev: { type: "boolean", example: false }
      }
    },
    Role: {
      type: "string",
      enum: roleValues,
      example: ROLES.OWNER
    },
    NotificationType: {
      type: "string",
      enum: notificationTypeValues,
      example: NOTIFICATION_TYPES.LOW_STOCK
    },
    TransactionStatus: {
      type: "string",
      enum: transactionStatusValues,
      example: TRANSACTION_STATUSES.POSTED
    },
    TransactionReferenceType: {
      type: "string",
      enum: referenceTypeValues,
      example: TRANSACTION_REFERENCE_TYPES.SALE
    },
    StockMovementType: {
      type: "string",
      enum: stockMovementTypeValues,
      example: STOCK_MOVEMENT_TYPES.OUT
    },
    User: {
      type: "object",
      required: ["id", "name", "email", "role", "isActive", "createdAt", "updatedAt"],
      properties: {
        id: idSchema,
        name: { type: "string", example: "Owner Ghefira" },
        email: { type: "string", format: "email", example: "owner@ghefira.local" },
        role: ref("Role"),
        isActive: { type: "boolean", example: true },
        pendingEmailChange: {
          allOf: [ref("PendingEmailChangeSummary")],
          nullable: true,
        },
        createdAt: dateTimeSchema,
        updatedAt: dateTimeSchema
      }
    },
    PendingEmailChangeSummary: {
      type: "object",
      required: ["newEmail", "expiresAt"],
      properties: {
        newEmail: { type: "string", format: "email", example: "owner.baru@ghefira.local" },
        expiresAt: dateTimeSchema,
        currentEmailConfirmedAt: { ...dateTimeSchema, nullable: true },
        newEmailConfirmedAt: { ...dateTimeSchema, nullable: true },
      },
    },
    Category: {
      type: "object",
      required: ["id", "name", "isActive", "createdAt", "updatedAt"],
      properties: {
        id: idSchema,
        name: { type: "string", example: "Material" },
        isActive: { type: "boolean", example: true },
        createdAt: dateTimeSchema,
        updatedAt: dateTimeSchema
      }
    },
    SupplierCategorySummary: {
      type: "object",
      required: ["id", "name", "isActive"],
      properties: {
        id: idSchema,
        name: { type: "string", example: "PVC" },
        isActive: { type: "boolean", example: true }
      }
    },
    Supplier: {
      type: "object",
      required: ["id", "name", "categoryIds", "categories", "isActive", "createdAt", "updatedAt"],
      properties: {
        id: idSchema,
        name: { type: "string", example: "CV Pipa Tirta Abadi" },
        phone: { type: "string", nullable: true, example: "081234567890" },
        address: { type: "string", nullable: true, example: "Prabumulih" },
        categoryIds: {
          type: "array",
          items: idSchema,
          example: ["seed-category-pvc"]
        },
        categories: {
          type: "array",
          items: ref("SupplierCategorySummary")
        },
        isActive: { type: "boolean", example: true },
        createdAt: dateTimeSchema,
        updatedAt: dateTimeSchema
      }
    },
    ProductThreshold: {
      type: "object",
      required: ["id", "levelName", "thresholdQty", "isActive"],
      properties: {
        id: idSchema,
        levelName: { type: "string", example: "warning" },
        thresholdQty: { type: "integer", minimum: 0, example: 4 },
        isActive: { type: "boolean", example: true },
        percentage: { type: "integer", example: 50 },
        source: { type: "string", example: "AUTO" }
      }
    },
    Product: {
      type: "object",
      required: [
        "id",
        "categoryId",
        "name",
        "sku",
        "unit",
        "stock",
        "minStock",
        "buyPrice",
        "sellPrice",
        "isActive",
        "thresholds",
        "createdAt",
        "updatedAt"
      ],
      properties: {
        id: idSchema,
        categoryId: idSchema,
        categoryName: { type: "string", nullable: true, example: "Material" },
        name: { type: "string", example: "Batu Bata" },
        sku: { type: "string", example: "GHE-MAT-006" },
        unit: { type: "string", example: "pcs" },
        stock: { type: "integer", minimum: 0, example: 9900 },
        minStock: { type: "integer", minimum: 0, example: 500 },
        buyPrice: moneySchema,
        sellPrice: moneySchema,
        isActive: { type: "boolean", example: true },
        thresholds: {
          type: "array",
          items: ref("ProductThreshold")
        },
        createdAt: dateTimeSchema,
        updatedAt: dateTimeSchema
      }
    },
    PublicProduct: {
      type: "object",
      required: ["id", "name", "sku", "unit", "stock", "sellPrice"],
      properties: {
        id: idSchema,
        name: { type: "string", example: "Batu Bata" },
        sku: { type: "string", example: "GHE-MAT-006" },
        unit: { type: "string", example: "pcs" },
        stock: { type: "integer", example: 9900 },
        sellPrice: moneySchema,
        categoryName: { type: "string", nullable: true, example: "Material" }
      }
    },
    PublicCategory: {
      type: "object",
      required: ["id", "name", "productCount"],
      properties: {
        id: idSchema,
        name: { type: "string", example: "Material" },
        productCount: { type: "integer", minimum: 0, example: 28 }
      }
    },
    PurchaseItem: {
      type: "object",
      required: ["id", "productId", "productName", "productSku", "qty", "buyPrice", "subtotal"],
      properties: {
        id: idSchema,
        productId: idSchema,
        productName: { type: "string", example: "Pipa PVC 3/4\"" },
        productSku: { type: "string", nullable: true, example: "GHE-PVC-010" },
        qty: { type: "integer", minimum: 1, example: 5 },
        buyPrice: moneySchema,
        subtotal: moneySchema
      }
    },
    SaleItem: {
      type: "object",
      required: ["id", "productId", "productName", "productSku", "qty", "sellPrice", "subtotal"],
      properties: {
        id: idSchema,
        productId: idSchema,
        productName: { type: "string", example: "Selang Air" },
        productSku: { type: "string", nullable: true, example: "GHE-GEN-005" },
        qty: { type: "integer", minimum: 1, example: 3 },
        sellPrice: moneySchema,
        subtotal: moneySchema
      }
    },
    Purchase: {
      type: "object",
      required: [
        "id",
        "date",
        "status",
        "totalAmount",
        "createdBy",
        "createdAt",
        "updatedAt",
        "items"
      ],
      properties: {
        id: idSchema,
        supplierId: { ...idSchema, nullable: true },
        supplierName: { type: "string", nullable: true, example: "CV Pipa Tirta Abadi" },
        date: dateTimeSchema,
        status: ref("TransactionStatus"),
        totalAmount: moneySchema,
        createdBy: idSchema,
        voidedBy: { ...idSchema, nullable: true },
        voidedAt: { ...dateTimeSchema, nullable: true },
        voidReason: { type: "string", nullable: true, example: "Input ganda" },
        createdAt: dateTimeSchema,
        updatedAt: dateTimeSchema,
        items: {
          type: "array",
          items: ref("PurchaseItem")
        }
      }
    },
    Sale: {
      type: "object",
      required: [
        "id",
        "date",
        "status",
        "totalAmount",
        "createdBy",
        "createdAt",
        "updatedAt",
        "items"
      ],
      properties: {
        id: idSchema,
        date: dateTimeSchema,
        status: ref("TransactionStatus"),
        totalAmount: moneySchema,
        createdBy: idSchema,
        voidedBy: { ...idSchema, nullable: true },
        voidedAt: { ...dateTimeSchema, nullable: true },
        voidReason: { type: "string", nullable: true, example: "Transaksi salah" },
        createdAt: dateTimeSchema,
        updatedAt: dateTimeSchema,
        items: {
          type: "array",
          items: ref("SaleItem")
        }
      }
    },
    Notification: {
      type: "object",
      required: ["id", "type", "title", "message", "userId", "isRead", "createdAt"],
      properties: {
        id: idSchema,
        type: ref("NotificationType"),
        title: { type: "string", example: "Stok menipis: Batu Bata" },
        message: { type: "string", example: "Stok Batu Bata tersisa 10, ambang 500." },
        userId: idSchema,
        isRead: { type: "boolean", example: false },
        createdAt: dateTimeSchema
      }
    },
    StockMovement: {
      type: "object",
      required: [
        "id",
        "productId",
        "type",
        "qty",
        "beforeStock",
        "afterStock",
        "refType",
        "refId",
        "createdAt"
      ],
      properties: {
        id: idSchema,
        productId: idSchema,
        productName: { type: "string", nullable: true, example: "Batu Bata" },
        productSku: { type: "string", nullable: true, example: "GHE-MAT-006" },
        type: ref("StockMovementType"),
        qty: { type: "integer", example: 50 },
        beforeStock: { type: "integer", example: 9850 },
        afterStock: { type: "integer", example: 9900 },
        refType: ref("TransactionReferenceType"),
        refId: idSchema,
        refLabel: { type: "string", nullable: true, example: "PBL-20260507154322" },
        createdAt: dateTimeSchema
      }
    },
    DashboardCategoryStock: {
      type: "object",
      required: ["label", "value", "health", "lowCount", "totalProducts"],
      properties: {
        label: { type: "string", example: "Material" },
        value: { type: "integer", example: 12000 },
        health: healthSchema,
        lowCount: { type: "integer", example: 3 },
        totalProducts: { type: "integer", example: 25 }
      }
    },
    DashboardProductStock: {
      type: "object",
      required: ["name", "stock", "threshold", "unit", "health", "category"],
      properties: {
        name: { type: "string", example: "Batu Bata" },
        stock: { type: "integer", example: 9900 },
        threshold: { type: "integer", example: 500 },
        unit: { type: "string", example: "pcs" },
        health: healthSchema,
        category: { type: "string", example: "Material" }
      }
    },
    DashboardLowStockProduct: {
      type: "object",
      required: ["id", "categoryId", "categoryName", "name", "sku", "unit", "stock", "minStock", "threshold", "thresholds"],
      properties: {
        id: idSchema,
        categoryId: idSchema,
        categoryName: { type: "string", example: "Material" },
        name: { type: "string", example: "Batu Bata" },
        sku: { type: "string", example: "GHE-MAT-006" },
        unit: { type: "string", example: "pcs" },
        stock: { type: "integer", example: 10 },
        minStock: { type: "integer", example: 500 },
        threshold: { type: "integer", example: 500 },
        thresholds: {
          type: "array",
          items: {
            type: "object",
            required: ["id", "levelName", "thresholdQty", "isActive"],
            properties: {
              id: idSchema,
              levelName: { type: "string", example: "Threshold aktif" },
              thresholdQty: { type: "integer", example: 500 },
              isActive: { type: "boolean", example: true }
            }
          }
        }
      }
    },
    DashboardTopProductTrendPoint: {
      type: "object",
      required: ["date", "qty"],
      properties: {
        date: dateSchema,
        qty: { type: "integer", example: 25 }
      }
    },
    DashboardTopProduct: {
      type: "object",
      required: ["productId", "productName", "qty", "revenue", "stock", "threshold", "health", "trend"],
      properties: {
        productId: idSchema,
        productName: { type: "string", example: "Batu Bata" },
        productSku: { type: "string", nullable: true, example: "GHE-MAT-006" },
        unit: { type: "string", nullable: true, example: "pcs" },
        stock: { type: "integer", example: 9900 },
        threshold: { type: "integer", example: 500 },
        qty: { type: "integer", example: 498 },
        revenue: moneySchema,
        health: healthSchema,
        trend: {
          type: "array",
          items: ref("DashboardTopProductTrendPoint")
        }
      }
    },
    DashboardStockTrendPoint: {
      type: "object",
      required: ["date", "incomingQty", "outgoingQty"],
      properties: {
        date: dateSchema,
        incomingQty: { type: "integer", example: 10 },
        outgoingQty: { type: "integer", example: 6 }
      }
    },
    DashboardMoneyTrendPoint: {
      type: "object",
      required: ["date", "salesAmount", "purchaseAmount"],
      properties: {
        date: dateSchema,
        salesAmount: moneySchema,
        purchaseAmount: moneySchema
      }
    },
    DashboardTopProductChartPoint: {
      type: "object",
      required: ["label", "value"],
      properties: {
        label: { type: "string", example: "Batu Bata" },
        value: { type: "integer", example: 498 }
      }
    },
    DashboardSummary: {
      type: "object",
      required: ["totals", "sales", "purchases", "recentMovements", "lowStockProducts", "topProducts", "chartData", "period"],
      properties: {
        totals: {
          type: "object",
          required: ["totalProducts", "totalSuppliers", "totalStock", "lowStockCount"],
          properties: {
            totalProducts: { type: "integer", example: 160 },
            totalSuppliers: { type: "integer", example: 10 },
            totalStock: { type: "integer", example: 14825 },
            lowStockCount: { type: "integer", example: 43 }
          }
        },
        sales: {
          type: "object",
          required: ["today", "thisMonth"],
          properties: {
            today: moneySchema,
            thisMonth: moneySchema
          }
        },
        purchases: {
          type: "object",
          required: ["today", "thisMonth"],
          properties: {
            today: moneySchema,
            thisMonth: moneySchema
          }
        },
        recentMovements: {
          type: "array",
          items: ref("StockMovement")
        },
        lowStockProducts: {
          type: "array",
          items: ref("DashboardLowStockProduct")
        },
        topProducts: {
          type: "array",
          items: ref("DashboardTopProduct")
        },
        chartData: {
          type: "object",
          required: ["categoryStock", "allProducts", "stockTrend", "moneyTrend", "topProducts"],
          properties: {
            categoryStock: {
              type: "array",
              items: ref("DashboardCategoryStock")
            },
            allProducts: {
              type: "array",
              items: ref("DashboardProductStock")
            },
            stockTrend: {
              type: "array",
              items: ref("DashboardStockTrendPoint")
            },
            moneyTrend: {
              type: "array",
              items: ref("DashboardMoneyTrendPoint")
            },
            topProducts: {
              type: "array",
              items: ref("DashboardTopProductChartPoint")
            }
          }
        },
        period: {
          type: "object",
          required: ["from", "to", "dayCount"],
          properties: {
            from: dateSchema,
            to: dateSchema,
            dayCount: { type: "integer", example: 30 }
          }
        }
      }
    },
    ReportRange: {
      type: "object",
      required: ["from", "to"],
      properties: {
        from: dateTimeSchema,
        to: dateTimeSchema
      }
    },
    TransactionReportTotals: {
      type: "object",
      required: ["transactionCount", "postedTotal"],
      properties: {
        transactionCount: { type: "integer", example: 37 },
        postedTotal: moneySchema
      }
    },
    SalesReportItem: {
      type: "object",
      required: ["id", "date", "status", "totalAmount", "itemCount"],
      properties: {
        id: idSchema,
        date: dateTimeSchema,
        status: ref("TransactionStatus"),
        totalAmount: moneySchema,
        itemCount: { type: "integer", example: 5 }
      }
    },
    PurchasesReportItem: {
      type: "object",
      required: ["id", "date", "supplierId", "status", "totalAmount", "itemCount"],
      properties: {
        id: idSchema,
        date: dateTimeSchema,
        supplierId: idSchema,
        supplierName: { type: "string", nullable: true, example: "CV Pipa Tirta Abadi" },
        status: ref("TransactionStatus"),
        totalAmount: moneySchema,
        itemCount: { type: "integer", example: 4 }
      }
    },
    SalesReportDateGroup: {
      type: "object",
      required: ["id", "date", "totalAmount", "transactionCount", "transactions"],
      properties: {
        id: { type: "string", example: "2026-05-07" },
        date: dateTimeSchema,
        totalAmount: moneySchema,
        transactionCount: { type: "integer", example: 5 },
        transactions: {
          type: "array",
          items: ref("SalesReportItem")
        }
      }
    },
    PurchasesReportDateGroup: {
      type: "object",
      required: ["id", "date", "totalAmount", "transactionCount", "transactions"],
      properties: {
        id: { type: "string", example: "2026-05-07" },
        date: dateTimeSchema,
        totalAmount: moneySchema,
        transactionCount: { type: "integer", example: 4 },
        transactions: {
          type: "array",
          items: ref("PurchasesReportItem")
        }
      }
    },
    StockMovementReportItem: {
      allOf: [ref("StockMovement")]
    },
    StockMovementDateGroup: {
      type: "object",
      required: ["id", "date", "movementCount", "movements"],
      properties: {
        id: { type: "string", example: "2026-05-07" },
        date: dateTimeSchema,
        movementCount: { type: "integer", example: 8 },
        movements: {
          type: "array",
          items: ref("StockMovementReportItem")
        }
      }
    },
    SummaryReport: {
      type: "object",
      required: ["range", "salesTotals", "purchaseTotals", "stockMovementTotals"],
      properties: {
        range: ref("ReportRange"),
        salesTotals: ref("TransactionReportTotals"),
        purchaseTotals: ref("TransactionReportTotals"),
        stockMovementTotals: {
          type: "object",
          required: ["movementCount"],
          properties: {
            movementCount: { type: "integer", example: 143 }
          }
        }
      }
    },
    SalesReportCollection: {
      type: "object",
      required: ["range", "totals", "items"],
      properties: {
        range: ref("ReportRange"),
        totals: ref("TransactionReportTotals"),
        items: {
          type: "array",
          items: ref("SalesReportItem")
        }
      }
    },
    PurchasesReportCollection: {
      type: "object",
      required: ["range", "totals", "items"],
      properties: {
        range: ref("ReportRange"),
        totals: ref("TransactionReportTotals"),
        items: {
          type: "array",
          items: ref("PurchasesReportItem")
        }
      }
    },
    StockMovementsReportCollection: {
      type: "object",
      required: ["range", "totals", "items"],
      properties: {
        range: ref("ReportRange"),
        totals: {
          type: "object",
          required: ["movementCount"],
          properties: {
            movementCount: { type: "integer", example: 143 }
          }
        },
        items: {
          type: "array",
          items: ref("StockMovementReportItem")
        }
      }
    },
    PublicSummary: {
      type: "object",
      required: ["totalProducts", "lowStockProducts", "highlightedProducts"],
      properties: {
        totalProducts: { type: "integer", example: 160 },
        lowStockProducts: { type: "integer", example: 43 },
        highlightedProducts: {
          type: "array",
          items: ref("PublicProduct")
        }
      }
    },
    LoginInput: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: { type: "string", format: "email", example: "owner@ghefira.local" },
        password: { type: "string", minLength: 8, example: "Owner123!" }
      }
    },
    RefreshTokenInput: {
      type: "object",
      required: ["refreshToken"],
      properties: {
        refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
      }
    },
    ForgotPasswordInput: {
      type: "object",
      required: ["email"],
      properties: {
        email: { type: "string", format: "email", example: "owner@ghefira.local" }
      }
    },
    ResetPasswordInput: {
      type: "object",
      required: ["token", "newPassword"],
      properties: {
        token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
        newPassword: { type: "string", minLength: 8, example: "PasswordBaru123!" }
      }
    },
    ChangePasswordInput: {
      type: "object",
      required: ["currentPassword", "newPassword"],
      properties: {
        currentPassword: { type: "string", minLength: 8, example: "Owner123!" },
        newPassword: { type: "string", minLength: 8, example: "Owner456!" }
      }
    },
    EmailChangeRequestInput: {
      type: "object",
      required: ["newEmail", "currentPassword"],
      properties: {
        newEmail: { type: "string", format: "email", example: "owner.baru@ghefira.local" },
        currentPassword: { type: "string", minLength: 8, example: "Owner123!" },
      }
    },
    EmailChangeConfirmInput: {
      type: "object",
      required: ["token"],
      properties: {
        token: { type: "string", example: "0f3e8d..." },
      }
    },
    MessageResult: {
      type: "object",
      required: ["message"],
      properties: {
        message: { type: "string", example: "Operation completed successfully" }
      }
    },
    EmailChangeRequestResult: {
      type: "object",
      required: ["message", "pendingEmailChange"],
      properties: {
        message: { type: "string", example: "Instruksi konfirmasi perubahan email telah dikirim ke email lama dan email baru." },
        pendingEmailChange: ref("PendingEmailChangeSummary"),
      },
    },
    EmailChangeConfirmResult: {
      type: "object",
      required: ["message", "status"],
      properties: {
        message: { type: "string", example: "Email login berhasil diperbarui. Gunakan email baru saat login berikutnya." },
        status: {
          type: "string",
          enum: ["PENDING_CURRENT_EMAIL_CONFIRMATION", "PENDING_NEW_EMAIL_CONFIRMATION", "COMPLETED"],
          example: "COMPLETED",
        },
      },
    },
    AuthResponse: {
      type: "object",
      required: ["token", "refreshToken", "user"],
      properties: {
        token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
        refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
        user: ref("User")
      }
    },
    CategoryCreateInput: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", minLength: 2, maxLength: 100, example: "Material" },
        isActive: { type: "boolean", example: true }
      }
    },
    CategoryUpdateInput: {
      type: "object",
      properties: {
        name: { type: "string", minLength: 2, maxLength: 100, example: "Material" },
        isActive: { type: "boolean", example: false }
      },
      additionalProperties: false
    },
    SupplierCreateInput: {
      type: "object",
      required: ["name", "categoryIds"],
      properties: {
        name: { type: "string", minLength: 2, maxLength: 120, example: "CV Pipa Tirta Abadi" },
        phone: { type: "string", minLength: 6, maxLength: 30, example: "081234567890" },
        address: { type: "string", minLength: 4, maxLength: 255, example: "Jl. Jenderal Sudirman" },
        categoryIds: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          items: idSchema,
          example: ["seed-category-pvc"]
        },
        isActive: { type: "boolean", example: true }
      }
    },
    SupplierUpdateInput: {
      type: "object",
      properties: {
        name: { type: "string", minLength: 2, maxLength: 120, example: "CV Pipa Tirta Abadi" },
        phone: { type: "string", minLength: 6, maxLength: 30, example: "081234567890" },
        address: { type: "string", minLength: 4, maxLength: 255, example: "Jl. Jenderal Sudirman" },
        categoryIds: {
          type: "array",
          minItems: 1,
          uniqueItems: true,
          items: idSchema,
          example: ["seed-category-pvc"]
        },
        isActive: { type: "boolean", example: false }
      },
      additionalProperties: false
    },
    UserCreateInput: {
      type: "object",
      required: ["name", "email", "password"],
      properties: {
        name: { type: "string", minLength: 2, example: "Karyawan Gudang" },
        email: { type: "string", format: "email", example: "employee1@ghefira.local" },
        password: { type: "string", minLength: 8, example: "Employee123!" },
        role: {
          type: "string",
          enum: [ROLES.EMPLOYEE],
          default: ROLES.EMPLOYEE
        },
        isActive: { type: "boolean", example: true }
      }
    },
    UserUpdateInput: {
      type: "object",
      properties: {
        name: { type: "string", minLength: 2, example: "Karyawan Gudang" },
        email: { type: "string", format: "email", example: "employee1@ghefira.local" },
        role: ref("Role"),
        isActive: { type: "boolean", example: true }
      },
      additionalProperties: false
    },
    ProfileUpdateInput: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", minLength: 2, example: "Owner Ghefira" }
      }
    },
    ProductCreateInput: {
      type: "object",
      required: ["categoryId", "name", "sku", "unit", "buyPrice", "sellPrice"],
      properties: {
        categoryId: idSchema,
        name: { type: "string", minLength: 2, maxLength: 150, example: "Batu Bata" },
        sku: { type: "string", minLength: 2, maxLength: 50, example: "GHE-MAT-006" },
        unit: { type: "string", minLength: 1, maxLength: 20, example: "pcs" },
        minStock: { type: "integer", minimum: 0, default: 0, example: 500 },
        buyPrice: moneySchema,
        sellPrice: moneySchema,
        isActive: { type: "boolean", example: true }
      }
    },
    ProductUpdateInput: {
      type: "object",
      properties: {
        categoryId: idSchema,
        name: { type: "string", minLength: 2, maxLength: 150, example: "Batu Bata" },
        sku: { type: "string", minLength: 2, maxLength: 50, example: "GHE-MAT-006" },
        unit: { type: "string", minLength: 1, maxLength: 20, example: "pcs" },
        minStock: { type: "integer", minimum: 0, example: 500 },
        buyPrice: moneySchema,
        sellPrice: moneySchema,
        isActive: { type: "boolean", example: false }
      },
      additionalProperties: false
    },
    PurchaseInputItem: {
      type: "object",
      required: ["productId", "qty", "buyPrice"],
      properties: {
        productId: idSchema,
        qty: { type: "integer", minimum: 1, example: 5 },
        buyPrice: moneySchema
      }
    },
    PurchaseCreateInput: {
      type: "object",
      required: ["supplierId", "items"],
      properties: {
        supplierId: idSchema,
        items: {
          type: "array",
          minItems: 1,
          items: ref("PurchaseInputItem")
        }
      }
    },
    PurchaseUpdateInput: {
      type: "object",
      properties: {
        supplierId: idSchema,
        items: {
          type: "array",
          minItems: 1,
          items: ref("PurchaseInputItem")
        }
      },
      additionalProperties: false
    },
    SaleInputItem: {
      type: "object",
      required: ["productId", "qty", "sellPrice"],
      properties: {
        productId: idSchema,
        qty: { type: "integer", minimum: 1, example: 3 },
        sellPrice: moneySchema
      }
    },
    SaleCreateInput: {
      type: "object",
      required: ["items"],
      properties: {
        items: {
          type: "array",
          minItems: 1,
          items: ref("SaleInputItem")
        }
      }
    },
    SaleUpdateInput: {
      type: "object",
      properties: {
        items: {
          type: "array",
          minItems: 1,
          items: ref("SaleInputItem")
        }
      },
      additionalProperties: false
    },
    VoidTransactionInput: {
      type: "object",
      properties: {
        reason: { type: "string", minLength: 3, maxLength: 255, example: "Input ganda" }
      }
    },
    LowStockScanInput: {
      type: "object",
      properties: {
        productIds: {
          type: "array",
          items: idSchema,
          example: ["cmab12cd30000xyz12345abcd", "cmab12cd30000xyz12345abce"]
        }
      }
    },
    LowStockScanResult: {
      type: "object",
      required: ["scannedProducts", "sentCount"],
      properties: {
        scannedProducts: { type: "integer", example: 160 },
        sentCount: { type: "integer", example: 12 }
      }
    },
    HealthStatus: {
      type: "object",
      required: ["status", "database"],
      properties: {
        status: { type: "string", example: "ok" },
        database: { type: "string", example: "ok" }
      }
    },
    UserResponse: envelopeSchema(ref("User")),
    CategoryResponse: envelopeSchema(ref("Category")),
    SupplierResponse: envelopeSchema(ref("Supplier")),
    SupplierProductsResponse: envelopeSchema({
      type: "array",
      items: ref("Product")
    }),
    ProductResponse: envelopeSchema(ref("Product")),
    PurchaseResponse: envelopeSchema(ref("Purchase")),
    SaleResponse: envelopeSchema(ref("Sale")),
    NotificationResponse: envelopeSchema(ref("Notification")),
    NotificationScanResponse: envelopeSchema(ref("LowStockScanResult")),
    MessageResponse: envelopeSchema(ref("MessageResult")),
    AuthEnvelope: envelopeSchema(ref("AuthResponse")),
    PublicSummaryResponse: envelopeSchema(ref("PublicSummary")),
    DashboardSummaryResponse: envelopeSchema(ref("DashboardSummary")),
    SummaryReportResponse: envelopeSchema(ref("SummaryReport")),
    CategoryListResponse: paginatedSchema(ref("Category")),
    SupplierListResponse: paginatedSchema(ref("Supplier")),
    UserListResponse: paginatedSchema(ref("User")),
    ProductListResponse: paginatedSchema(ref("Product")),
    PurchaseListResponse: paginatedSchema(ref("Purchase")),
    SaleListResponse: paginatedSchema(ref("Sale")),
    NotificationListResponse: paginatedSchema(ref("Notification")),
    PublicProductListResponse: paginatedSchema(ref("PublicProduct")),
    PublicCategoryListResponse: envelopeSchema({
      type: "array",
      items: ref("PublicCategory")
    }),
    SalesReportListResponse: paginatedSchema(ref("SalesReportItem")),
    PurchasesReportListResponse: paginatedSchema(ref("PurchasesReportItem")),
    GroupedSalesReportListResponse: paginatedSchema(ref("SalesReportDateGroup")),
    GroupedPurchasesReportListResponse: paginatedSchema(ref("PurchasesReportDateGroup")),
    GroupedStockMovementsReportListResponse: paginatedSchema(ref("StockMovementDateGroup")),
    StockMovementsReportListResponse: paginatedSchema(ref("StockMovementReportItem"))
  }
}

const paths = {
  "/health": {
    get: {
      tags: ["System"],
      summary: "Health check backend dan database",
      operationId: "getHealth",
      responses: {
        200: response("Backend dan database tersedia", ref("HealthStatus")),
        503: response("Database tidak tersedia", ref("ErrorResponse"))
      }
    }
  },
  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login pengguna internal",
      operationId: "login",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("LoginInput")
          }
        }
      },
      responses: {
        200: response("Login berhasil", ref("AuthEnvelope")),
        400: components.responses.ValidationError,
        401: response("Email atau kata sandi salah", ref("ErrorResponse"))
      }
    }
  },
  "/auth/refresh": {
    post: {
      tags: ["Auth"],
      summary: "Refresh access token",
      operationId: "refreshToken",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("RefreshTokenInput")
          }
        }
      },
      responses: {
        200: response("Token diperbarui", ref("AuthEnvelope")),
        400: components.responses.ValidationError,
        401: response("Refresh token tidak valid atau kedaluwarsa", ref("ErrorResponse"))
      }
    }
  },
  "/auth/forgot-password": {
    post: {
      tags: ["Auth"],
      summary: "Minta reset kata sandi",
      operationId: "forgotPassword",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("ForgotPasswordInput")
          }
        }
      },
      responses: {
        200: response("Permintaan reset diproses", ref("MessageResponse")),
        400: components.responses.ValidationError
      }
    }
  },
  "/auth/reset-password": {
    post: {
      tags: ["Auth"],
      summary: "Reset kata sandi dengan token",
      operationId: "resetPassword",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("ResetPasswordInput")
          }
        }
      },
      responses: {
        200: response("Kata sandi berhasil diatur ulang", ref("MessageResponse")),
        400: response("Token reset tidak valid atau request tidak valid", ref("ErrorResponse"))
      }
    }
  },
  "/auth/change-password": {
    post: {
      tags: ["Auth"],
      summary: "Ganti kata sandi pengguna aktif",
      operationId: "changePassword",
      security: bearerSecurity(),
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("ChangePasswordInput")
          }
        }
      },
      responses: {
        200: response("Kata sandi berhasil diperbarui", ref("MessageResponse")),
        400: response("Request tidak valid atau kata sandi lama salah", ref("ErrorResponse")),
        401: components.responses.Unauthorized
      }
    }
  },
  "/auth/confirm-email-change": {
    post: {
      tags: ["Auth"],
      summary: "Konfirmasi perubahan email login",
      operationId: "confirmEmailChange",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("EmailChangeConfirmInput")
          }
        }
      },
      responses: {
        200: response("Perubahan email diproses", envelopeSchema(ref("EmailChangeConfirmResult"))),
        400: response("Token tidak valid atau sudah kedaluwarsa", ref("ErrorResponse")),
        429: response("Terlalu banyak percobaan autentikasi", ref("ErrorResponse"))
      }
    }
  },
  "/users/me": {
    get: {
      tags: ["Users"],
      summary: "Ambil profil pengguna yang sedang login",
      operationId: "getCurrentUser",
      security: bearerSecurity(),
      responses: {
        200: response("Profil pengguna aktif", ref("UserResponse")),
        401: components.responses.Unauthorized
      }
    },
    patch: {
      tags: ["Users"],
      summary: "Perbarui profil sendiri",
      operationId: "updateCurrentUser",
      security: bearerSecurity(),
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("ProfileUpdateInput")
          }
        }
      },
      responses: {
        200: response("Profil berhasil diperbarui", ref("UserResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized
      }
    }
  },
  "/users/me/email-change-request": {
    post: {
      tags: ["Users"],
      summary: "Ajukan perubahan email login sendiri",
      operationId: "requestCurrentUserEmailChange",
      security: bearerSecurity(),
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("EmailChangeRequestInput")
          }
        }
      },
      responses: {
        200: response("Instruksi konfirmasi email berhasil dikirim", envelopeSchema(ref("EmailChangeRequestResult"))),
        400: response("Request tidak valid atau kata sandi salah", ref("ErrorResponse")),
        401: components.responses.Unauthorized,
        409: response("Email baru sudah digunakan", ref("ErrorResponse"))
      }
    }
  },
  "/users": {
    get: {
      tags: ["Users"],
      summary: "Daftar pengguna",
      description: "Khusus owner.",
      operationId: "listUsers",
      security: bearerSecurity(),
      parameters: [
        { $ref: "#/components/parameters/Page" },
        { $ref: "#/components/parameters/Limit" },
        { $ref: "#/components/parameters/Search" }
      ],
      responses: {
        200: response("Daftar pengguna", ref("UserListResponse")),
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden
      }
    },
    post: {
      tags: ["Users"],
      summary: "Buat akun karyawan",
      description: "Khusus owner. Endpoint ini hanya membuat role EMPLOYEE.",
      operationId: "createUser",
      security: bearerSecurity(),
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("UserCreateInput")
          }
        }
      },
      responses: {
        201: response("Pengguna berhasil dibuat", ref("UserResponse")),
        400: components.responses.ValidationError,
        403: components.responses.Forbidden,
        409: components.responses.Conflict
      }
    }
  },
  "/users/{id}": {
    patch: {
      tags: ["Users"],
      summary: "Perbarui akun pengguna",
      description: "Khusus owner.",
      operationId: "updateUser",
      security: bearerSecurity(),
      parameters: [{ $ref: "#/components/parameters/EntityId" }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("UserUpdateInput")
          }
        }
      },
      responses: {
        200: response("Pengguna berhasil diperbarui", ref("UserResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound,
        409: components.responses.Conflict
      }
    }
  },
  "/users/{id}/deactivate": {
    patch: {
      tags: ["Users"],
      summary: "Nonaktifkan pengguna",
      description: "Khusus owner. Tidak dapat menonaktifkan owner terakhir.",
      operationId: "deactivateUser",
      security: bearerSecurity(),
      parameters: [{ $ref: "#/components/parameters/EntityId" }],
      responses: {
        200: response("Pengguna berhasil dinonaktifkan", ref("UserResponse")),
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound,
        409: components.responses.Conflict
      }
    }
  },
  "/categories": {
    get: {
      tags: ["Categories"],
      summary: "Daftar kategori",
      description: "Owner melihat semua kategori. Employee hanya melihat kategori aktif.",
      operationId: "listCategories",
      security: bearerSecurity(),
      parameters: [
        { $ref: "#/components/parameters/Page" },
        { $ref: "#/components/parameters/Limit" },
        { $ref: "#/components/parameters/Search" }
      ],
      responses: {
        200: response("Daftar kategori", ref("CategoryListResponse")),
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden
      }
    },
    post: {
      tags: ["Categories"],
      summary: "Buat kategori",
      description: "Khusus owner.",
      operationId: "createCategory",
      security: bearerSecurity(),
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("CategoryCreateInput")
          }
        }
      },
      responses: {
        201: response("Kategori berhasil dibuat", ref("CategoryResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        409: components.responses.Conflict
      }
    }
  },
  "/categories/{id}": {
    patch: {
      tags: ["Categories"],
      summary: "Perbarui kategori",
      description: "Khusus owner.",
      operationId: "updateCategory",
      security: bearerSecurity(),
      parameters: [{ $ref: "#/components/parameters/EntityId" }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("CategoryUpdateInput")
          }
        }
      },
      responses: {
        200: response("Kategori berhasil diperbarui", ref("CategoryResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound,
        409: components.responses.Conflict
      }
    },
    delete: {
      tags: ["Categories"],
      summary: "Nonaktifkan kategori",
      description: "Khusus owner. Gagal jika kategori masih dipakai produk aktif.",
      operationId: "deleteCategory",
      security: bearerSecurity(),
      parameters: [{ $ref: "#/components/parameters/EntityId" }],
      responses: {
        200: response("Kategori berhasil dinonaktifkan", ref("CategoryResponse")),
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound,
        409: components.responses.Conflict
      }
    }
  },
  "/suppliers": {
    get: {
      tags: ["Suppliers"],
      summary: "Daftar supplier",
      description: "Owner melihat semua supplier. Employee hanya melihat supplier aktif.",
      operationId: "listSuppliers",
      security: bearerSecurity(),
      parameters: [
        { $ref: "#/components/parameters/Page" },
        { $ref: "#/components/parameters/Limit" },
        { $ref: "#/components/parameters/Search" }
      ],
      responses: {
        200: response("Daftar supplier", ref("SupplierListResponse")),
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden
      }
    },
    post: {
      tags: ["Suppliers"],
      summary: "Buat supplier",
      description: "Khusus owner.",
      operationId: "createSupplier",
      security: bearerSecurity(),
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("SupplierCreateInput")
          }
        }
      },
      responses: {
        201: response("Supplier berhasil dibuat", ref("SupplierResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden
      }
    }
  },
  "/suppliers/{id}": {
    patch: {
      tags: ["Suppliers"],
      summary: "Perbarui supplier",
      description: "Khusus owner.",
      operationId: "updateSupplier",
      security: bearerSecurity(),
      parameters: [{ $ref: "#/components/parameters/EntityId" }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("SupplierUpdateInput")
          }
        }
      },
      responses: {
        200: response("Supplier berhasil diperbarui", ref("SupplierResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound
      }
    },
    delete: {
      tags: ["Suppliers"],
      summary: "Nonaktifkan supplier",
      description: "Khusus owner.",
      operationId: "deleteSupplier",
      security: bearerSecurity(),
      parameters: [{ $ref: "#/components/parameters/EntityId" }],
      responses: {
        200: response("Supplier berhasil dinonaktifkan", ref("SupplierResponse")),
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound
      }
    }
  },
  "/suppliers/{id}/products": {
    get: {
      tags: ["Suppliers"],
      summary: "Daftar produk supplier",
      description: "Mengambil produk aktif berdasarkan kategori produk yang dilayani supplier.",
      operationId: "listSupplierProducts",
      security: bearerSecurity(),
      parameters: [{ $ref: "#/components/parameters/EntityId" }],
      responses: {
        200: response("Daftar produk supplier", ref("SupplierProductsResponse")),
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound
      }
    }
  },
  "/products": {
    get: {
      tags: ["Products"],
      summary: "Daftar produk",
      description: "Owner melihat semua produk. Employee hanya melihat produk aktif.",
      operationId: "listProducts",
      security: bearerSecurity(),
      parameters: [
        { $ref: "#/components/parameters/Page" },
        { $ref: "#/components/parameters/Limit" },
        { $ref: "#/components/parameters/Search" }
      ],
      responses: {
        200: response("Daftar produk", ref("ProductListResponse")),
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden
      }
    },
    post: {
      tags: ["Products"],
      summary: "Buat produk",
      description: "Khusus owner.",
      operationId: "createProduct",
      security: bearerSecurity(),
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("ProductCreateInput")
          }
        }
      },
      responses: {
        201: response("Produk berhasil dibuat", ref("ProductResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound,
        409: components.responses.Conflict
      }
    }
  },
  "/products/{id}": {
    get: {
      tags: ["Products"],
      summary: "Detail produk",
      operationId: "getProductById",
      security: bearerSecurity(),
      parameters: [{ $ref: "#/components/parameters/EntityId" }],
      responses: {
        200: response("Detail produk", ref("ProductResponse")),
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound
      }
    },
    patch: {
      tags: ["Products"],
      summary: "Perbarui produk",
      description: "Khusus owner.",
      operationId: "updateProduct",
      security: bearerSecurity(),
      parameters: [{ $ref: "#/components/parameters/EntityId" }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("ProductUpdateInput")
          }
        }
      },
      responses: {
        200: response("Produk berhasil diperbarui", ref("ProductResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound,
        409: components.responses.Conflict
      }
    },
    delete: {
      tags: ["Products"],
      summary: "Nonaktifkan produk",
      description: "Khusus owner. Soft delete dengan menonaktifkan produk.",
      operationId: "deleteProduct",
      security: bearerSecurity(),
      parameters: [{ $ref: "#/components/parameters/EntityId" }],
      responses: {
        200: response("Produk berhasil dinonaktifkan", ref("ProductResponse")),
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound,
        409: components.responses.Conflict
      }
    }
  },
  "/purchases": {
    get: {
      tags: ["Purchases"],
      summary: "Daftar transaksi pembelian",
      operationId: "listPurchases",
      security: bearerSecurity(),
      parameters: [
        { $ref: "#/components/parameters/Page" },
        { $ref: "#/components/parameters/Limit" },
        { $ref: "#/components/parameters/Search" }
      ],
      responses: {
        200: response("Daftar transaksi pembelian", ref("PurchaseListResponse")),
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden
      }
    },
    post: {
      tags: ["Purchases"],
      summary: "Buat transaksi pembelian",
      description: "Owner dan employee bisa membuat transaksi pembelian.",
      operationId: "createPurchase",
      security: bearerSecurity(),
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("PurchaseCreateInput")
          }
        }
      },
      responses: {
        201: response("Transaksi pembelian berhasil dibuat", ref("PurchaseResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound,
        409: components.responses.Conflict
      }
    }
  },
  "/purchases/{id}": {
    get: {
      tags: ["Purchases"],
      summary: "Detail transaksi pembelian",
      operationId: "getPurchaseById",
      security: bearerSecurity(),
      parameters: [{ $ref: "#/components/parameters/EntityId" }],
      responses: {
        200: response("Detail transaksi pembelian", ref("PurchaseResponse")),
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound
      }
    },
    patch: {
      tags: ["Purchases"],
      summary: "Perbarui transaksi pembelian",
      operationId: "updatePurchase",
      security: bearerSecurity(),
      parameters: [{ $ref: "#/components/parameters/EntityId" }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("PurchaseUpdateInput")
          }
        }
      },
      responses: {
        200: response("Transaksi pembelian berhasil diperbarui", ref("PurchaseResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound,
        409: components.responses.Conflict
      }
    }
  },
  "/purchases/{id}/receipt": {
    get: {
      tags: ["Purchases"],
      summary: "Unduh PDF struk pembelian",
      operationId: "downloadPurchaseReceipt",
      security: bearerSecurity(),
      parameters: [{ $ref: "#/components/parameters/EntityId" }],
      responses: {
        200: {
          description: "File PDF struk pembelian",
          content: {
            "application/pdf": {
              schema: {
                type: "string",
                format: "binary"
              }
            }
          }
        },
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound
      }
    }
  },
  "/purchases/{id}/void": {
    post: {
      tags: ["Purchases"],
      summary: "Void transaksi pembelian",
      description: "Khusus owner.",
      operationId: "voidPurchase",
      security: bearerSecurity(),
      parameters: [{ $ref: "#/components/parameters/EntityId" }],
      requestBody: {
        required: false,
        content: {
          "application/json": {
            schema: ref("VoidTransactionInput")
          }
        }
      },
      responses: {
        200: response("Transaksi pembelian berhasil di-void", ref("PurchaseResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound,
        409: components.responses.Conflict
      }
    }
  },
  "/sales": {
    get: {
      tags: ["Sales"],
      summary: "Daftar transaksi penjualan",
      operationId: "listSales",
      security: bearerSecurity(),
      parameters: [
        { $ref: "#/components/parameters/Page" },
        { $ref: "#/components/parameters/Limit" },
        { $ref: "#/components/parameters/Search" }
      ],
      responses: {
        200: response("Daftar transaksi penjualan", ref("SaleListResponse")),
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden
      }
    },
    post: {
      tags: ["Sales"],
      summary: "Buat transaksi penjualan",
      description: "Owner dan employee bisa membuat transaksi penjualan.",
      operationId: "createSale",
      security: bearerSecurity(),
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("SaleCreateInput")
          }
        }
      },
      responses: {
        201: response("Transaksi penjualan berhasil dibuat", ref("SaleResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound,
        409: components.responses.Conflict
      }
    }
  },
  "/sales/{id}": {
    get: {
      tags: ["Sales"],
      summary: "Detail transaksi penjualan",
      operationId: "getSaleById",
      security: bearerSecurity(),
      parameters: [{ $ref: "#/components/parameters/EntityId" }],
      responses: {
        200: response("Detail transaksi penjualan", ref("SaleResponse")),
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound
      }
    },
    patch: {
      tags: ["Sales"],
      summary: "Perbarui transaksi penjualan",
      operationId: "updateSale",
      security: bearerSecurity(),
      parameters: [{ $ref: "#/components/parameters/EntityId" }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: ref("SaleUpdateInput")
          }
        }
      },
      responses: {
        200: response("Transaksi penjualan berhasil diperbarui", ref("SaleResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound,
        409: components.responses.Conflict
      }
    }
  },
  "/sales/{id}/receipt": {
    get: {
      tags: ["Sales"],
      summary: "Unduh PDF struk penjualan",
      operationId: "downloadSaleReceipt",
      security: bearerSecurity(),
      parameters: [{ $ref: "#/components/parameters/EntityId" }],
      responses: {
        200: {
          description: "File PDF struk penjualan",
          content: {
            "application/pdf": {
              schema: {
                type: "string",
                format: "binary"
              }
            }
          }
        },
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound
      }
    }
  },
  "/sales/{id}/void": {
    post: {
      tags: ["Sales"],
      summary: "Void transaksi penjualan",
      description: "Khusus owner.",
      operationId: "voidSale",
      security: bearerSecurity(),
      parameters: [{ $ref: "#/components/parameters/EntityId" }],
      requestBody: {
        required: false,
        content: {
          "application/json": {
            schema: ref("VoidTransactionInput")
          }
        }
      },
      responses: {
        200: response("Transaksi penjualan berhasil di-void", ref("SaleResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound,
        409: components.responses.Conflict
      }
    }
  },
  "/notifications": {
    get: {
      tags: ["Notifications"],
      summary: "Daftar notifikasi pengguna aktif",
      operationId: "listNotifications",
      security: bearerSecurity(),
      parameters: [
        { $ref: "#/components/parameters/Page" },
        { $ref: "#/components/parameters/Limit" },
        { $ref: "#/components/parameters/Search" },
        { $ref: "#/components/parameters/UnreadOnly" }
      ],
      responses: {
        200: response("Daftar notifikasi", ref("NotificationListResponse")),
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden
      }
    }
  },
  "/notifications/{id}/read": {
    patch: {
      tags: ["Notifications"],
      summary: "Tandai notifikasi sudah dibaca",
      operationId: "markNotificationAsRead",
      security: bearerSecurity(),
      parameters: [{ $ref: "#/components/parameters/EntityId" }],
      responses: {
        200: response("Notifikasi berhasil ditandai dibaca", ref("NotificationResponse")),
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden,
        404: components.responses.NotFound
      }
    }
  },
  "/notifications/low-stock/scan": {
    post: {
      tags: ["Notifications"],
      summary: "Jalankan scan stok menipis",
      description: "Khusus owner. Dapat dibatasi dengan daftar productIds tertentu.",
      operationId: "triggerLowStockScan",
      security: bearerSecurity(),
      requestBody: {
        required: false,
        content: {
          "application/json": {
            schema: ref("LowStockScanInput")
          }
        }
      },
      responses: {
        200: response("Scan stok menipis selesai", ref("NotificationScanResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden
      }
    }
  },
  "/dashboard/summary": {
    get: {
      tags: ["Dashboard"],
      summary: "Ringkasan dasbor",
      description: "Filter global dasbor. Default 30 hari terakhir bila query range tidak diberikan.",
      operationId: "getDashboardSummary",
      security: bearerSecurity(),
      parameters: [
        { $ref: "#/components/parameters/AllTime" },
        { $ref: "#/components/parameters/FromDate" },
        { $ref: "#/components/parameters/ToDate" },
        { $ref: "#/components/parameters/TrendMonth" },
        { $ref: "#/components/parameters/TrendYear" }
      ],
      responses: {
        200: response("Ringkasan dasbor", ref("DashboardSummaryResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden
      }
    }
  },
  "/reports/summary": {
    get: {
      tags: ["Reports"],
      summary: "Ringkasan laporan periode",
      operationId: "getSummaryReport",
      security: bearerSecurity(),
      parameters: [
        { $ref: "#/components/parameters/FromDate" },
        { $ref: "#/components/parameters/ToDate" },
        { $ref: "#/components/parameters/Page" },
        { $ref: "#/components/parameters/Limit" }
      ],
      responses: {
        200: response("Ringkasan laporan", ref("SummaryReportResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden
      }
    }
  },
  "/reports/sales": {
    get: {
      tags: ["Reports"],
      summary: "Daftar laporan penjualan",
      operationId: "getSalesReport",
      security: bearerSecurity(),
      parameters: [
        { $ref: "#/components/parameters/FromDate" },
        { $ref: "#/components/parameters/ToDate" },
        { $ref: "#/components/parameters/Page" },
        { $ref: "#/components/parameters/Limit" }
      ],
      responses: {
        200: response("Laporan penjualan", ref("SalesReportListResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden
      }
    }
  },
  "/reports/sales-by-date": {
    get: {
      tags: ["Reports"],
      summary: "Daftar laporan penjualan teragregasi per tanggal",
      operationId: "getGroupedSalesReport",
      security: bearerSecurity(),
      parameters: [
        { $ref: "#/components/parameters/FromDate" },
        { $ref: "#/components/parameters/ToDate" },
        { $ref: "#/components/parameters/Page" },
        { $ref: "#/components/parameters/Limit" }
      ],
      responses: {
        200: response("Laporan penjualan teragregasi per tanggal", ref("GroupedSalesReportListResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden
      }
    }
  },
  "/reports/purchases": {
    get: {
      tags: ["Reports"],
      summary: "Daftar laporan pembelian",
      operationId: "getPurchasesReport",
      security: bearerSecurity(),
      parameters: [
        { $ref: "#/components/parameters/FromDate" },
        { $ref: "#/components/parameters/ToDate" },
        { $ref: "#/components/parameters/Page" },
        { $ref: "#/components/parameters/Limit" }
      ],
      responses: {
        200: response("Laporan pembelian", ref("PurchasesReportListResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden
      }
    }
  },
  "/reports/purchases-by-date": {
    get: {
      tags: ["Reports"],
      summary: "Daftar laporan pembelian teragregasi per tanggal",
      operationId: "getGroupedPurchasesReport",
      security: bearerSecurity(),
      parameters: [
        { $ref: "#/components/parameters/FromDate" },
        { $ref: "#/components/parameters/ToDate" },
        { $ref: "#/components/parameters/Page" },
        { $ref: "#/components/parameters/Limit" }
      ],
      responses: {
        200: response("Laporan pembelian teragregasi per tanggal", ref("GroupedPurchasesReportListResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden
      }
    }
  },
  "/reports/stock-movements": {
    get: {
      tags: ["Reports"],
      summary: "Daftar laporan pergerakan stok",
      operationId: "getStockMovementsReport",
      security: bearerSecurity(),
      parameters: [
        { $ref: "#/components/parameters/FromDate" },
        { $ref: "#/components/parameters/ToDate" },
        { $ref: "#/components/parameters/Page" },
        { $ref: "#/components/parameters/Limit" }
      ],
      responses: {
        200: response("Laporan pergerakan stok", ref("StockMovementsReportListResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden
      }
    }
  },
  "/reports/stock-movements-by-date": {
    get: {
      tags: ["Reports"],
      summary: "Daftar laporan pergerakan stok teragregasi per tanggal",
      operationId: "getGroupedStockMovementsReport",
      security: bearerSecurity(),
      parameters: [
        { $ref: "#/components/parameters/FromDate" },
        { $ref: "#/components/parameters/ToDate" },
        { $ref: "#/components/parameters/Page" },
        { $ref: "#/components/parameters/Limit" }
      ],
      responses: {
        200: response("Laporan pergerakan stok teragregasi per tanggal", ref("GroupedStockMovementsReportListResponse")),
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden
      }
    }
  },
  "/reports/pdf": {
    get: {
      tags: ["Reports"],
      summary: "Unduh laporan PDF",
      operationId: "downloadReportPdf",
      security: bearerSecurity(),
      parameters: [
        { $ref: "#/components/parameters/FromDate" },
        { $ref: "#/components/parameters/ToDate" },
        { $ref: "#/components/parameters/ReportType" }
      ],
      responses: {
        200: {
          description: "File PDF laporan",
          content: {
            "application/pdf": {
              schema: {
                type: "string",
                format: "binary"
              }
            }
          }
        },
        400: components.responses.ValidationError,
        401: components.responses.Unauthorized,
        403: components.responses.Forbidden
      }
    }
  },
  "/public/categories": {
    get: {
      tags: ["Public"],
      summary: "Daftar kategori publik",
      operationId: "listPublicCategories",
      responses: {
        200: response("Daftar kategori publik", ref("PublicCategoryListResponse"))
      }
    }
  },
  "/public/products": {
    get: {
      tags: ["Public"],
      summary: "Daftar produk publik",
      operationId: "listPublicProducts",
      parameters: [
        { $ref: "#/components/parameters/Page" },
        { $ref: "#/components/parameters/Limit" },
        { $ref: "#/components/parameters/Search" },
        { $ref: "#/components/parameters/CategoryIdQuery" }
      ],
      responses: {
        200: response("Daftar produk publik", ref("PublicProductListResponse")),
        400: components.responses.ValidationError
      }
    }
  },
  "/public/summary": {
    get: {
      tags: ["Public"],
      summary: "Ringkasan halaman publik",
      operationId: "getPublicSummary",
      responses: {
        200: response("Ringkasan publik", ref("PublicSummaryResponse"))
      }
    }
  }
}

const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: `${brand.name} API`,
    version: "1.0.0",
    description: `Dokumentasi OpenAPI untuk backend React + Express ${brand.name}. Endpoint mencakup auth, master data, transaksi, dasbor, laporan, dan endpoint publik.`
  },
  servers: [
    {
      url: "/api",
      description: "Backend API pada origin yang sama"
    }
  ],
  tags: [
    { name: "System", description: "Endpoint kesehatan sistem" },
    { name: "Auth", description: "Autentikasi owner dan employee" },
    { name: "Users", description: "Manajemen user internal" },
    { name: "Categories", description: "Master kategori" },
    { name: "Suppliers", description: "Master supplier" },
    { name: "Products", description: "Master produk dan notifikasi restock otomatis" },
    { name: "Purchases", description: "Transaksi pembelian dan struk PDF" },
    { name: "Sales", description: "Transaksi penjualan dan struk PDF" },
    { name: "Notifications", description: "Notifikasi personal dan scan low stock" },
    { name: "Dashboard", description: "Agregasi data dasbor" },
    { name: "Reports", description: "Laporan JSON dan PDF" },
    { name: "Public", description: "Endpoint publik tanpa autentikasi" }
  ],
  components,
  paths
}

module.exports = {
  openApiSpec
}
