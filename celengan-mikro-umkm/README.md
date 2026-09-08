# Celengan Mikro UMKM
**Platform Donasi Mikro Non-Tunai untuk Modal Usaha Keluarga Rentan**  
*Mendukung Sustainable Development Goals (SDGs) 1: No Poverty melalui Pemberian Modal Usaha Produktif*

Sistem ini dikembangkan secara ketat mengikuti **Dokumen Requirement & Design (Model Waterfall)**.  
Dapat dijalankan secara **Dual-Mode**:
1. **Langsung melalui file `index.html`** di browser (tanpa perlu web server / backend terpisah).
2. **Melalui server lokal / cloud seperti Railway** menggunakan runtime Node.js/Express native.

---

## 🚀 Cara Menjalankan Aplikasi

### Pilihan 1: Buka Langsung Lewat File `index.html` (Paling Cepat & Praktis)
1. Buka folder `celengan-mikro-umkm`.
2. Klik ganda (double-click) file `index.html` untuk membukanya di browser apa saja (Google Chrome, Edge, Firefox, Safari).
3. Aplikasi akan otomatis beroperasi dalam **File Mode (LocalStorage)** dengan data awal (seed) yang sudah terisi lengkap. Semua fitur pendaftaran, login, pengajuan RT/RW, verifikasi Admin, dan donasi QRIS/Transfer dapat langsung digunakan.

---

### Pilihan 2: Jalankan Melalui Server Lokal (Node.js)
1. Buka terminal (Command Prompt / PowerShell) di dalam folder `celengan-mikro-umkm`.
2. Jalankan perintah:
   ```bash
   node server.js
   ```
   *(atau `npm start`)*
3. Buka browser dan akses alamat:
   ```
   http://localhost:3000
   ```
4. Server berjalan dengan modul native bawaan Node.js tanpa memerlukan instalasi dependensi luar (`node_modules`).

---

### Pilihan 3: Deploy ke Server Cloud Railway
Proyek ini sudah dilengkapi konfigurasi deployment Railway (`railway.json`, `Procfile`, dan `package.json`):
1. Unggah/push folder proyek ini ke repository **GitHub** Anda.
2. Buka dashboard [Railway.app](https://railway.app) dan login.
3. Klik **New Project** &rarr; **Deploy from GitHub repo**.
4. Pilih repository `celengan-mikro-umkm`.
5. Railway akan mendeteksi Node.js secara otomatis dan menjalankan perintah `npm start` (atau `node server.js`).
6. Aplikasi langsung aktif dan dapat diakses publik dengan HTTPS otomatis.

---

## 👥 Akun Demo Bawaan untuk Pengujian

Pada halaman **Masuk (Login)** telah disediakan tombol cepat (autofill) untuk menguji setiap peran:

| Peran (Role) | Email / Username | Password | Deskripsi Hak Akses |
|---|---|---|---|
| **Admin** | `admin@celengan.id` | `admin123` | Memverifikasi (Setujui/Tolak) kelayakan warga binaan & memantau seluruh riwayat donasi. |
| **RT/RW** | `rt01@kelurahan.id` | `rt12345` | Mendaftarkan warga yang butuh modal usaha & memantau progress donasi warga binaan. |
| **Donatur** | `budi@donatur.id` | `donatur123` | Berdonasi mikro via QRIS/Transfer e-Banking & melihat riwayat transparansi penyaluran. |

> *Catatan:* Anda juga dapat mendaftarkan akun baru melalui tab **Registrasi Akun Baru** untuk peran RT/RW atau Donatur.

---

## 📋 Struktur Modul & Use Case Sistem

Sesuai dengan Bagian 1.4 & 2.2 Dokumen Waterfall:

1. **Modul Manajemen Akun**
   - *Use Case 1 (Registrasi Akun):* Pilihan peran RT/RW atau Donatur, validasi data lengkap dan pencegahan email duplikat.
   - *Use Case 2 (Login):* Autentikasi Admin, RT/RW, dan Donatur dengan pengalihan dashboard berbasis peran (role-based redirect).

2. **Modul Pendataan & Verifikasi Warga**
   - *Use Case 3 (Daftar Data Warga):* Pengurus RT/RW mengajukan warga binaan (nama, jenis usaha, target modal, rincian barang non-tunai, dan foto usaha). Status awal: `Pending`.
   - *Use Case 4 (Verifikasi Data):* Admin meninjau data pending dan menentukan kelayakan (`Setujui` &rarr; `Terverifikasi` atau `Tolak` &rarr; `Ditolak`). Notifikasi otomatis dikirim ke RT/RW terkait.

3. **Modul Donasi**
   - *Use Case 6 (Donasi):* Donatur memilih warga terverifikasi, memasukkan nominal mikro (validasi > 0), memilih metode QRIS / Transfer Bank, dan menyelesaikan pembayaran. Sistem memperbarui progres dana secara real-time.

4. **Modul Dashboard & Transparansi**
   - *Use Case 5 (Dashboard Progress Donasi RT/RW):* Menampilkan progres dana warga binaan wilayah, progress bar persentase, nominal terkumpul, dan notifikasi persetujuan Admin.
   - *Use Case 7 (Dashboard Riwayat Donasi Donatur):* Menampilkan riwayat donasi yang pernah diberikan, status penyaluran alat usaha non-tunai, dan progres target warga.
   - *Use Case 8 (Lihat History Donasi Admin):* Audit menyeluruh seluruh aliran transaksi donasi platform terurut dari terbaru ke terlama.

---

## 🧪 Hasil Pengujian (13 Test Cases Waterfall)

Untuk menguji seluruh skenario secara otomatis:
```bash
node test.js
```

| No | Use Case | Skenario Pengujian | Input | Expected Output | Status |
|:--:|---|---|---|---|:--:|
| 1 | Registrasi Akun | Registrasi dengan data lengkap dan valid | Email baru, password, peran (RT/RW) | Akun tersimpan, muncul konfirmasi, redirect ke login | ✅ **Lulus** |
| 2 | Registrasi Akun | Registrasi dengan email yang sudah terdaftar | Email yang sudah ada di sistem | Sistem menolak, menampilkan pesan error | ✅ **Lulus** |
| 3 | Login | Login dengan kredensial benar sesuai peran | Email & password terdaftar | Berhasil masuk, diarahkan ke dashboard sesuai peran | ✅ **Lulus** |
| 4 | Login | Login dengan password salah | Email benar, password salah | Sistem menolak akses, pesan error muncul | ✅ **Lulus** |
| 5 | Daftar Data Warga | RT/RW mendaftarkan warga dengan data lengkap | Nama, jenis usaha, kebutuhan modal, foto usaha | Data tersimpan status Pending, konfirmasi muncul | ✅ **Lulus** |
| 6 | Daftar Data Warga | RT/RW mendaftarkan warga dengan data tidak lengkap | Salah satu field kosong | Data gagal tersimpan, pesan error muncul | ✅ **Lulus** |
| 7 | Verifikasi Data | Admin menyetujui data warga Pending | Data warga berstatus Pending | Status berubah Terverifikasi, notifikasi terkirim ke RT/RW | ✅ **Lulus** |
| 8 | Verifikasi Data | Admin menolak data warga Pending | Data warga berstatus Pending | Status berubah Ditolak, notifikasi terkirim ke RT/RW | ✅ **Lulus** |
| 9 | Donasi | Donatur melakukan donasi dengan nominal valid | Nominal donasi, metode pembayaran (QRIS/transfer) | Transaksi tersimpan, total dana warga bertambah, konfirmasi muncul | ✅ **Lulus** |
| 10 | Donasi | Donatur memasukkan nominal tidak valid (0/negatif) | Nominal = 0 atau negatif | Sistem menolak transaksi, pesan error muncul | ✅ **Lulus** |
| 11 | Dashboard Progress Donasi (RT/RW) | RT/RW membuka dashboard dengan warga terverifikasi | RT/RW login, minimal 1 warga terverifikasi | Progress bar & nominal per warga tampil real-time | ✅ **Lulus** |
| 12 | Dashboard Riwayat Donasi (Donatur) | Donatur membuka riwayat setelah pernah donasi | Donatur login, minimal 1 riwayat donasi | Riwayat & status penyaluran tampil | ✅ **Lulus** |
| 13 | Lihat History Donasi | Admin membuka seluruh history donasi | Admin login | Seluruh transaksi tampil terurut terbaru-terlama | ✅ **Lulus** |

---

## 🛡️ Batasan Sistem & Prinsip Non-Tunai (SDGs 1)
Sesuai Bagian 1.6 Batasan Sistem, platform **hanya menyalurkan dana dalam bentuk non-tunai (pembelian sarana kerja dan bahan baku usaha)**, dan **tidak mencairkan dana tunai** langsung kepada warga binaan guna menjamin bantuan bersifat produktif dan berkesinambungan.
