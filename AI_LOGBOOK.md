# AI Logbook — Data Keterlambatan Siswa

Tim: [NAMA SISWA 1] & [NAMA SISWA 2] · SMA Negeri 2 Trenggalek
Alat AI: Claude (Anthropic)

Logbook ini mencatat interaksi dengan AI selama mengembangkan produk, sesuai Pedoman Teknis Pelatihan TIK Bagi Siswa Tahun 2026. Setiap entri memuat kolom **Validasi & Modifikasi Mandiri**, yaitu perubahan yang kami lakukan terhadap saran AI.

> Catatan untuk tim: bagian bertanda `[...]` wajib diisi atau diperiksa ulang oleh kalian sebelum dikumpulkan. Tahap 4 harus dijawab dengan kata-kata kalian sendiri.

---

## Tahap 1 — Eksplorasi Ide & Perancangan Solusi

### Entri 1.1 — 16 November 2026
- **Prompt (ringkas):** Meminta dibuatkan web pendataan keterlambatan siswa dengan HTML, CSS, dan JavaScript. Guru piket memasukkan nama dan kelas secara real time, guru BK dihubungi lewat WA atau Gmail, dan semua guru bisa mengakses web.
- **Saran AI (ringkas):** Rancangan dua mode data (Mode Demo di browser dan Mode Real-time dengan database), daftar fitur (form, statistik, tabel, filter, rekap WA/Gmail, unduh CSV), serta rencana file `index.html`, `style.css`, `script.js`, dan `config.js`.
- **Validasi & Modifikasi Mandiri:** [Tulis apa yang kalian setujui, tolak, atau ubah dari rancangan awal. Contoh: fitur mana yang kalian pertahankan, dan mengapa.]

### Entri 1.2 — 17 November 2026
- **Prompt (ringkas):** Meminta perbandingan database Supabase dan Firebase, dari sisi perbedaan, pola data, dan keamanan untuk aplikasi ini.
- **Saran AI (ringkas):** Tabel perbandingan (SQL dan NoSQL, real-time, Row Level Security dan Security Rules, setup, dan paket gratis). Ditambahkan catatan bahwa perhitungan biaya Firebase dihitung per dokumen yang dibaca.
- **Validasi & Modifikasi Mandiri:** Kami memutuskan memakai **Supabase**. Alasan kami: data berbentuk tabel sehingga rekap dan filter lebih mudah dibuat dengan SQL, dan kode yang sudah dirancang tidak perlu ditulis ulang. [Periksa dan tambahkan alasan kalian sendiri.]

---

## Tahap 2 — Penyusunan Kerangka Kode (Scaffolding)

### Entri 2.1 — 16 November 2026
- **Prompt (ringkas):** Permintaan membuat kerangka halaman HTML dan CSS, termasuk halaman login, form guru piket, tabel data, filter, dan modal kontak BK.
- **Saran AI (ringkas):** `index.html` dengan struktur berbagian (header, login, statistik, form, tabel, dan modal), `style.css` yang responsif untuk HP dan laptop, serta `config.js` sebagai satu-satunya file pengaturan.
- **Validasi & Modifikasi Mandiri:** Kami memeriksa setiap `id` elemen di HTML agar cocok dengan yang dipakai di JavaScript. [Tulis perubahan tampilan yang kalian lakukan, jika ada.]

### Entri 2.2 — 16 November 2026
- **Prompt (ringkas):** Permintaan membuat logika `script.js` dengan Mode Demo (`localStorage`) dan Mode Real-time (Supabase), termasuk form, filter, statistik, kirim WA/Gmail, dan ekspor CSV.
- **Saran AI (ringkas):** Lapisan data yang memisahkan Mode Demo dan Supabase, fungsi `renderAll()`, pesan WhatsApp dan Gmail yang dibentuk otomatis, serta pencegahan *formula injection* pada CSV.
- **Validasi & Modifikasi Mandiri:** Kami memeriksa sintaks dengan `node --check`. [Tulis bagian kode yang kalian pahami dan yang kalian ubah.]

### Entri 2.3 — 16 November 2026
- **Prompt (ringkas):** Permintaan skrip database untuk Supabase: tabel, Row Level Security, dan real-time.
- **Saran AI (ringkas):** Tabel `keterlambatan`, aturan RLS (guru yang sudah login boleh melihat dan mencatat, hanya pencatat asli yang boleh menghapus), dan pendaftaran tabel ke `supabase_realtime`.
- **Validasi & Modifikasi Mandiri:** Kami menjalankan skrip ini di Supabase dan memastikan tabel serta aturannya terbentuk. [Jelaskan dengan kata kalian mengapa `created_by = auth.uid()` dipakai.]

---

## Tahap 3 — Pemecahan Masalah & Penanganan Galat (Debugging)

### Entri 3.1 — 16 November 2026
- **Prompt (ringkas):** Pesan error PowerShell: `cd C:\lokasi\folder\web-keterlambatan` tidak ditemukan dan `py` tidak dikenali.
- **Saran AI (ringkas):** Path di contoh hanya ilustrasi dan harus diganti dengan folder asli. `py` tidak dikenali karena Python belum terpasang atau belum masuk PATH. Web bisa dijalankan dengan membuka `index.html` langsung tanpa server.
- **Validasi & Modifikasi Mandiri:** Kami memilih membuka `index.html` langsung dan memakai Mode Demo, karena belum memasang Python. [Tulis cara yang kalian pakai untuk memperbaiki error ini.]

### Entri 3.2 — 16 November 2026
- **Prompt (ringkas):** Tombol unduh menampilkan pesan *"This file type can't be downloaded"*.
- **Saran AI (ringkas):** Gunakan tombol *Download all*, atau minta isi file ditampilkan langsung di chat.
- **Validasi & Modifikasi Mandiri:** [Tulis cara yang kalian pakai untuk mendapatkan keenam file, dan cara memastikan semuanya berada dalam satu folder.]

### Entri 3.3 — 16 November 2026
- **Prompt (ringkas):** Data yang dicatat belum muncul di tampilan, dan kami menanyakan apakah itu karena database belum disiapkan.
- **Saran AI (ringkas):** Mode Demo menyimpan data hanya di browser tempat data dicatat. Data tidak akan terlihat di browser atau perangkat lain. Solusinya adalah mengaktifkan Mode Real-time dengan Supabase.
- **Validasi & Modifikasi Mandiri:** Kami memahami bahwa `SUPABASE_URL` dan `SUPABASE_ANON_KEY` harus diisi untuk mengaktifkan Mode Real-time. [Tulis apa yang kalian periksa sebelum menyimpulkan penyebabnya.]

### Entri 3.4 — 17 November 2026
- **Prompt (ringkas):** Menanyakan apakah database bisa dibuat langsung lewat koneksi Supabase.
- **Saran AI (ringkas):** Ternyata belum ada project di akun. AI meminta persetujuan sebelum membuat project baru, dengan nama, organisasi, dan region yang akan digunakan.
- **Validasi & Modifikasi Mandiri:** Kami menyetujui pembuatan project dengan region `ap-southeast-1` (Singapura). Setelah project aktif, skrip database dijalankan dan kredensial diisi di `config.js`. [Tambahkan jika ada hal lain yang kalian periksa.]

### Entri 3.5 — 17 November 2026
- **Prompt (ringkas):** Format kelas di web tidak sesuai dengan penamaan kelas di SMAN 2 Trenggalek, yaitu X-1 s.d. X-9 dan XI-A s.d. XII-I.
- **Saran AI (ringkas):** Daftar kelas dibuat sebagai array `KELAS` di `config.js`, lalu fungsi `configKelas()` di `script.js` membaca daftar itu.
- **Validasi & Modifikasi Mandiri:** Kami menulis 27 kelas secara lengkap di `config.js`, lalu menghapus `TINGKAT` dan `JUMLAH_ROMBEL` karena tidak dipakai lagi. [Tulis hasil pengujian kalian.]

### Entri 3.6 — 17 November 2026
- **Prompt (ringkas):** Input kelas dibuat *strict*: hanya bisa memilih kelas resmi SMAN 2 Trenggalek, dengan urutan tetap.
- **Saran AI (ringkas):** Mengganti `<input>` dengan `<select>`, mengisi pilihan dari `configKelas()`, dan mempertahankan urutan daftar konfigurasi.
- **Validasi & Modifikasi Mandiri:** Kami menambahkan validasi di `onSubmit()` agar kelas yang tidak ada di daftar ditolak. Urutan filter juga kami ambil dari daftar konfigurasi, bukan diurutkan ulang. [Tulis hasil pengujian kalian.]

---

## Tahap 4 — Refleksi & Penjelasan Kode

Jawab setiap pertanyaan dengan kata-kata kalian sendiri. Jawaban harus menunjukkan bahwa kalian memahami kodenya, bukan menyalin dari AI.

**4.1** Jelaskan apa fungsi `configKelas()` dan bagaimana urutan kelas di dropdown dijaga.
> Jawaban: [tulis di sini]

**4.2** Mengapa aplikasi memiliki dua mode data (Demo dan Real-time)? Apa perbedaannya bagi guru?
> Jawaban: [tulis di sini]

**4.3** Apa fungsi Row Level Security di `setup-supabase.sql`? Mengapa hanya pencatat asli yang boleh menghapus data?
> Jawaban: [tulis di sini]

**4.4** Apa fungsi `titleCase()` dan `normalizeWA()` di `script.js`? Berikan satu contoh input dan hasilnya.
> Jawaban: [tulis di sini]

**4.5** Jika sekolah ingin pesan ke Guru BK terkirim otomatis tanpa klik, bagian mana yang harus diubah dan layanan apa yang dibutuhkan?
> Jawaban: [tulis di sini]

---

## Ringkasan Penggunaan AI

| Tahap | Jumlah entri | Keterangan |
|---|---|---|
| 1. Eksplorasi & perancangan | 2 | Konsep produk dan pemilihan database |
| 2. Scaffolding | 3 | Struktur HTML/CSS, logika JavaScript, skrip database |
| 3. Debugging | 6 | Error lokal, unduhan file, data tidak muncul, setup Supabase, format dan validasi kelas |
| 4. Refleksi | 5 pertanyaan | Dijawab oleh siswa |
