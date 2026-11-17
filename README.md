# Web Data Keterlambatan Siswa

Web untuk mencatat siswa terlambat oleh **guru piket**, bisa dibuka oleh **semua guru**, dan datanya bisa langsung dikirim ke **Guru BK** lewat **WhatsApp** atau **Gmail**.

## Isi folder

| File | Fungsi |
|---|---|
| `index.html` | Struktur halaman |
| `style.css` | Tampilan (responsif untuk HP dan laptop) |
| `script.js` | Logika aplikasi |
| `config.js` | **Satu-satunya file yang perlu kalian ubah**: nama sekolah, kontak BK, daftar kelas |
| `setup-supabase.sql` | Skrip pembuat database untuk mode real-time |

## Langkah 1 — Coba dulu (Mode Demo)

Buka `index.html` dengan mengklik dua kali. Karena `SUPABASE_URL` di `config.js` masih kosong, web berjalan di **Mode Demo**: data tersimpan di browser itu saja. Cocok untuk mencoba tampilan dan tombol WhatsApp/Gmail.

Kalau ingin membukanya lewat server lokal (PowerShell):

```powershell
cd C:\lokasi\folder\web-keterlambatan
py -m http.server 8000
```

Lalu buka `http://localhost:8000` di browser.

## Langkah 2 — Ubah `config.js`

- `NAMA_SEKOLAH`
- `BK_NAMA`, `BK_WA` (boleh `08xxx` atau `628xxx`), `BK_EMAIL`
- `TINGKAT` dan `JUMLAH_ROMBEL` untuk daftar kelas
- `ALASAN` untuk pilihan alasan terlambat

Kontak BK juga bisa diganti langsung dari web lewat tombol **⚙ Kontak BK** (tersimpan di browser tersebut).

## Langkah 3 — Aktifkan Mode Real-time (supaya semua guru melihat data yang sama)

Mode Demo tidak membagikan data ke guru lain. Untuk itu dipakai database gratis **Supabase**.

1. Daftar di <https://supabase.com> lalu klik **New project** (pilih region terdekat, mis. Singapore).
2. Buka **SQL Editor** > **New query**, tempel seluruh isi `setup-supabase.sql`, klik **Run**.
3. Buka **Project Settings > API**, salin:
   - **Project URL** ke `SUPABASE_URL`
   - **anon / publishable key** ke `SUPABASE_ANON_KEY`
   
   Jangan pernah memakai kunci `service_role` di file web ini.
4. Buka **Authentication > Providers > Email**, matikan **Allow new users to sign up** supaya hanya akun buatan admin yang bisa masuk.
5. Buka **Authentication > Users > Add user > Create new user**, buat satu akun per guru (email + kata sandi), centang *Auto Confirm User*.
6. Muat ulang web. Halaman login akan muncul, dan badge di kanan atas berubah menjadi **Real-time aktif**.

Keamanan data diatur oleh Row Level Security di `setup-supabase.sql`: hanya guru yang sudah login yang bisa melihat dan menambah data, dan hanya pencatat aslinya yang bisa menghapus.

## Langkah 4 — Pasang online supaya semua guru bisa membuka

Pilih salah satu (semuanya gratis):

- **Netlify Drop**: buka <https://app.netlify.com/drop>, seret seluruh folder, selesai. Kalian dapat alamat web.
- **GitHub Pages**: unggah folder ke repository, aktifkan Pages di Settings.
- **Vercel**: impor repository atau seret folder lewat dashboard.

Bagikan alamat webnya ke guru. Di HP bisa dipakai lewat menu *Tambahkan ke layar utama*.

## Cara pakai harian

**Guru piket**
1. Masuk dengan akun guru.
2. Ketik nama siswa (nama yang pernah tercatat muncul sebagai saran, kelas terisi otomatis).
3. Pilih kelas dan alasan. Jam datang terisi otomatis dari jam sekarang.
4. Isi nama guru piket, klik **Simpan**. Data langsung muncul di semua perangkat guru yang sedang membuka web.
5. Centang *Langsung buka WhatsApp Guru BK* kalau ingin pesan laporan terbuka otomatis setelah menyimpan.

**Guru BK / guru lain**
- Lihat data per hari, 7 hari, bulan ini, atau rentang tanggal; saring per kelas atau cari nama.
- Panel **Sering terlambat bulan ini** menandai siswa yang terlambat sebanyak `BATAS_SERING_TERLAMBAT` kali atau lebih.
- **Unduh CSV** untuk dibuka di Excel atau Google Sheets.

## Cara kerja tombol WhatsApp dan Gmail

Tombol **WA** dan **Gmail** membuka WhatsApp / Gmail dengan pesan yang sudah terisi. Guru tinggal menekan *kirim*. Cara ini gratis dan tidak butuh server, tetapi pengirimannya tetap satu klik manual.

Kalau nanti ingin pesan terkirim **otomatis tanpa klik** saat guru piket menyimpan, dibutuhkan layanan tambahan, misalnya WhatsApp gateway berbayar atau Google Apps Script untuk Gmail. Itu bisa ditambahkan sebagai pengembangan berikutnya.

## Catatan penting

- Data nama siswa termasuk data pribadi. Minta izin kepala sekolah / pihak sekolah sebelum dipakai, dan jangan bagikan akun guru ke siswa.
- Mode Demo hanya untuk uji coba. Untuk penggunaan sebenarnya, gunakan Mode Real-time.
- Daftar rekap yang dikirim lewat WhatsApp/Gmail dibatasi 40 baris per pesan; selebihnya dilihat di web.
