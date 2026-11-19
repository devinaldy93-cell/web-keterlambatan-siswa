# Data Keterlambatan Siswa — SMA Negeri 2 Trenggalek

Produk digital berbasis website untuk mencatat keterlambatan siswa secara *real time*, dapat diakses seluruh guru, dan terhubung langsung ke Guru BK melalui WhatsApp atau Gmail.

**Tema Pelatihan:** Solusi Digital untuk Kehidupan Sehari-hari Berbantuan Kecerdasan Artifisial
**Platform:** Produk Berbasis Website (HTML, CSS, JavaScript)
**Alamat web (live):** <https://devinaldy93-cell.github.io/web-keterlambatan-siswa/>

---

## a. Judul & Deskripsi

**Nama produk:** Data Keterlambatan Siswa

**Latar belakang masalah.** Pencatatan siswa terlambat di sekolah sering dilakukan secara manual di buku piket. Akibatnya, data sulit dicari, sulit direkap, dan Guru BK sering terlambat mengetahui siswa yang sudah berulang kali datang terlambat. Keterlambatan yang tidak terpantau bisa berlanjut menjadi kebiasaan.

**Solusi.** Web ini memungkinkan guru piket mencatat keterlambatan siswa dari perangkat mana pun (HP atau laptop). Data langsung tersinkron ke semua guru yang sedang login. Web juga menandai siswa yang sudah terlambat beberapa kali dalam sebulan, lalu mengirim laporan ke Guru BK dalam satu klik melalui WhatsApp atau Gmail.

**Fitur utama:**
- Pencatatan oleh guru piket: nama siswa, kelas, alasan, jam datang, dan catatan.
- Data real-time untuk semua guru yang sudah login.
- Statistik: terlambat hari ini, 7 hari terakhir, bulan ini, dan siswa yang sering terlambat.
- Filter tanggal, kelas, dan pencarian nama, serta unduh CSV.
- Kirim laporan ke Guru BK per siswa atau sebagai rekap, lewat WhatsApp atau Gmail.
- Dapat dipasang ke layar utama HP seperti aplikasi.

**Target pengguna:**
- **Utama:** guru piket, yang mencatat keterlambatan.
- **Kedua:** Guru BK, yang menerima laporan dan menindaklanjuti.
- **Ketiga:** guru lain dan wali kelas, yang dapat melihat data.

---

## b. Teknologi yang Digunakan

| Komponen | Teknologi |
|---|---|
| Struktur halaman | HTML5 |
| Tampilan | CSS3 (layout grid dan flexbox, responsif) |
| Logika aplikasi | JavaScript (ES2020, tanpa framework) |
| Database, login, dan real-time | [Supabase](https://supabase.com) (PostgreSQL, Auth, Realtime), dimuat lewat `supabase-js` v2 dari CDN jsDelivr |
| Keamanan data | Row Level Security (RLS) PostgreSQL |
| Pengiriman pesan | Tautan `wa.me` (WhatsApp) dan Gmail compose |
| Publikasi | GitHub Pages |

---

## c. Pemanfaatan AI (AI Usage Disclosure)

**Alat AI yang digunakan:** Claude (Anthropic), dipakai melalui antarmuka chat.

**Prompt utama yang digunakan:**

1. *"Bantu kami sebagai siswa SMA dengan memposisikan dirimu sebagai web developer, buatkan koding web mulai dari HTML, CSS, dan JavaScript yang berisi tentang web data keterlambatan siswa. Guru BK dapat dihubungi lewat WA atau Gmail. Guru piket memasukkan nama siswa dan kelas secara real time, dan semua guru bisa mengakses web ini."*
2. Permintaan membandingkan Supabase dengan Firebase sebagai database, dari sisi perbedaan fitur, pola data, dan keamanan.
3. Permintaan membuat skrip database Supabase (tabel, RLS, dan real-time) serta mengisi kredensial di `config.js`.
4. Permintaan mengganti input kelas dengan daftar kelas resmi SMAN 2 Trenggalek (27 kelas, urut).
5. Pertanyaan debugging: error PowerShell saat menjalankan `cd` dan `py -m http.server`, serta data yang belum muncul di Mode Demo.

**Penyesuaian dan perbaikan mandiri yang kami lakukan terhadap saran AI:**

- **Pilihan database:** kami membandingkan Supabase dan Firebase, lalu memilih Supabase karena data berbentuk tabel dan rekap lebih mudah dibuat dengan SQL.
- **Daftar kelas:** saran awal AI memakai pola otomatis `X-1` sampai `X-8`. Kami menggantinya dengan daftar kelas resmi SMAN 2 Trenggalek (X-1 s.d. X-9, XI-A s.d. XI-I, XII-A s.d. XII-I) yang ditulis langsung di `config.js`, dan fungsi `configKelas()` di `script.js` kami ubah agar membaca daftar tersebut.
- **Input kelas:** dari kolom teks bebas (`datalist`) menjadi dropdown yang hanya menerima kelas resmi, dengan validasi tambahan sebelum data disimpan.
- **Mode Demo:** kami memakai Mode Demo hanya untuk uji coba. Mode Real-time (Supabase) dipakai untuk penggunaan sebenarnya.
- **Cara menjalankan lokal:** saran awal menggunakan server Python. Karena Python belum terpasang di komputer kami, web dijalankan dengan cara membuka `index.html` langsung dan memakai Mode Demo.
- **Verifikasi:** kami memeriksa sintaks JavaScript dengan `node --check`, memastikan setiap ID elemen di `script.js` ada di `index.html`, dan menguji web di browser (login, menyimpan data, dan status *Real-time aktif*).

Catatan lengkap setiap interaksi ada di [`AI_LOGBOOK.md`](AI_LOGBOOK.md).

---

## d. Panduan Penggunaan

### Untuk pengguna (guru)

1. Buka alamat web: <https://devinaldy93-cell.github.io/web-keterlambatan-siswa/>
2. Masuk dengan akun guru yang diberikan admin.
3. **Guru piket:** isi nama siswa, pilih kelas dari daftar, pilih alasan, lalu klik **Simpan**. Jam datang terisi otomatis.
4. Centang *Langsung buka WhatsApp Guru BK* jika ingin pesan laporan terbuka otomatis setelah menyimpan.
5. **Guru BK:** gunakan tombol periode (Hari ini, 7 hari, Bulan ini, Semua) untuk melihat data. Tombol **WA** dan **Gmail** di setiap baris mengirim laporan per siswa. Tombol *Kirim rekap* mengirim rekap sesuai periode yang dipilih.
6. Di HP, buka menu browser lalu pilih *Tambahkan ke layar utama*.

### Untuk menjalankan sendiri (opsional, bagi pengembang)

1. **Unduh repository** (tombol *Code* > *Download ZIP*) lalu ekstrak.
2. **Buka `index.html`** dengan mengklik dua kali. Jika `SUPABASE_URL` dan `SUPABASE_ANON_KEY` di `config.js` kosong, web berjalan di **Mode Demo** (data tersimpan di browser itu saja).
3. **Isi `config.js`:** nama sekolah, kontak BK (`BK_WA`, `BK_EMAIL`), daftar `KELAS`, dan pilihan `ALASAN`.
4. **Siapkan database Supabase:**
   1. Buat project baru di <https://supabase.com>.
   2. Buka **SQL Editor**, tempel isi `setup-supabase.sql`, lalu klik **Run**.
   3. Buka **Project Settings > API**, lalu salin *Project URL* ke `SUPABASE_URL` dan *publishable key* ke `SUPABASE_ANON_KEY` di `config.js`. Jangan pernah memakai kunci `service_role` di web.
   4. Buka **Authentication > Sign In / Providers > Email**, lalu matikan *Allow new users to sign up* agar hanya akun buatan admin yang bisa masuk.
   5. Buka **Authentication > Users > Add user**, buat akun untuk setiap guru.
5. **Publikasi:** unggah file ke repository GitHub, lalu aktifkan **Settings > Pages** dengan sumber *Deploy from a branch* (branch `main`, folder `/root`).

---

## e. Identitas Pengembang

| | Siswa 1 | Siswa 2 |
|---|---|---|
| Nama lengkap | [NAMA LENGKAP SISWA 1] | [NAMA LENGKAP SISWA 2] |
| Kelas | [KELAS] | [KELAS] |
| Jurusan | [JURUSAN] | [JURUSAN] |
| Asal sekolah | SMA Negeri 2 Trenggalek | SMA Negeri 2 Trenggalek |

---

## Berkas dalam repository

| Berkas | Fungsi |
|---|---|
| `index.html` | Struktur halaman |
| `style.css` | Tampilan responsif |
| `script.js` | Logika aplikasi (data, filter, statistik, pengiriman pesan, CSV) |
| `config.js` | Pengaturan sekolah, kontak BK, daftar kelas, dan kredensial Supabase |
| `setup-supabase.sql` | Skrip pembuat tabel, keamanan RLS, dan real-time |
| `AI_LOGBOOK.md` | Catatan interaksi dengan AI (wajib sesuai pedoman) |
| `README.md` | Dokumentasi produk |
