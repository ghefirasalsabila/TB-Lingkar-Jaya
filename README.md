# System Overview

Folder `system/` berisi aplikasi utama untuk Toko Bangunan Lingkar Jaya.

## Struktur

- `backend/`
  - REST API berbasis Express untuk autentikasi, master data, transaksi, dashboard, laporan, notifikasi, dan public data.
- `frontend/`
  - Aplikasi React untuk area admin dan halaman publik toko.
- `shared/`
  - Data bersama seperti identitas brand toko.

## Fitur Utama

- Login owner dan karyawan
- Kelola kategori, supplier, dan barang
- Catat pembelian dan penjualan
- Stok berubah otomatis dari transaksi
- Dashboard operasional
- Laporan dan PDF
- Notifikasi stok menipis
- Halaman publik informasi toko

## Stack

- Frontend: React + Vite
- Backend: Express
- Database: PostgreSQL
