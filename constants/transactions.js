const TRANSACTION_STATUSES = {
  POSTED: "POSTED",
  VOIDED: "VOIDED"
};

const TRANSACTION_STATUS_VALUES = Object.values(TRANSACTION_STATUSES);

const TRANSACTION_REFERENCE_TYPES = {
  PURCHASE: "PURCHASE",
  SALE: "SALE",
  ADJUSTMENT: "ADJUSTMENT"
};

const STOCK_MOVEMENT_TYPES = {
  IN: "IN",
  OUT: "OUT",
  ADJUSTMENT: "ADJUSTMENT"
};

function isTransactionStatus(value) {
  return TRANSACTION_STATUS_VALUES.includes(String(value || "").toUpperCase());
}

module.exports = {
  TRANSACTION_STATUSES,
  TRANSACTION_REFERENCE_TYPES,
  STOCK_MOVEMENT_TYPES,
  isTransactionStatus
};
