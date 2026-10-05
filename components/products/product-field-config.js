export const PRODUCT_TEXT_FIELDS = [
  {
    field: "name",
    label: "Nama Produk",
    inputProps: {
      placeholder: "Mis. Aqua Proof",
      minLength: 2,
      maxLength: 150,
      required: true,
    },
  },
  {
    field: "sku",
    label: "SKU",
    inputProps: {
      placeholder: "Mis. GHE-CAT-009",
      minLength: 2,
      maxLength: 50,
      required: true,
    },
  },
  {
    field: "unit",
    label: "Satuan",
    inputProps: {
      placeholder: "Mis. pcs, sak, meter, kaleng",
      minLength: 1,
      maxLength: 20,
      required: true,
    },
  },
];

export const PRODUCT_NUMBER_FIELDS = [
  {
    field: "minStock",
    label: "Stok Minimum",
    helperText: "Dipakai sebagai batas restock dasar untuk notifikasi otomatis.",
    inputProps: {
      placeholder: "Mis. 10",
    },
  },
  {
    field: "buyPrice",
    label: "Harga Beli",
    kind: "currency",
    helperText: "Harga beli default akan mengikuti pembelian terakhir yang tersimpan.",
    inputProps: {
      placeholder: "Mis. 220.000",
    },
  },
  {
    field: "sellPrice",
    label: "Harga Jual",
    kind: "currency",
    helperText: "Harga jual default dipakai saat membuat penjualan baru.",
    inputProps: {
      placeholder: "Mis. 270.000",
    },
  },
];
