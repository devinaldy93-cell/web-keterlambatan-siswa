# AI Logbook — Data Keterlambatan Siswa

Tim: Devin Aldy Putra Pratama & Muhammad Dalhar Chodafi · SMA Negeri 2 Trenggalek
Alat AI: Claude (Anthropic)

Logbook ini mencatat interaksi dengan AI selama mengembangkan produk, sesuai Pedoman Teknis Pelatihan TIK Bagi Siswa Tahun 2026. Setiap entri memuat kolom **Validasi & Modifikasi Mandiri (V&M)**, yaitu perubahan dan pemeriksaan yang kami lakukan terhadap saran AI.

---

## Tahap 1 — Eksplorasi Ide & Perancangan Solusi

### Entri 1.1 — 16 November 2026
- **Prompt (ringkas):** Meminta dibuatkan web pendataan keterlambatan siswa dengan HTML, CSS, dan JavaScript. Guru piket memasukkan nama dan kelas secara real time, guru BK dihubungi lewat WA atau Gmail, dan semua guru bisa mengakses web.
- **Saran AI (ringkas):** Rancangan dua mode data (Mode Demo di browser dan Mode Real-time dengan database), daftar fitur (form, statistik, tabel, filter, rekap WA/Gmail, unduh CSV), serta rencana file `index.html`, `style.css`, `script.js`, dan `config.js`.
- **V&M:** Kami sangat puas dengan rancangan awal web ini. Kami juga sering menggunakan JSFiddle untuk memeriksa tampilan HTML dan CSS awal serta JavaScript, apakah sudah berjalan dengan benar. Berdasarkan hasil uji di JSFiddle, kami cukup puas dengan rancangan dari entri ini.

### Entri 1.2 — 17 November 2026
- **Prompt (ringkas):** Meminta perbandingan database Supabase dan Firebase, dari sisi perbedaan, pola data, dan keamanan untuk aplikasi ini.
- **Saran AI (ringkas):** Tabel perbandingan (SQL dan NoSQL, real-time, Row Level Security dan Security Rules, setup, dan paket gratis). Ditambahkan catatan bahwa biaya Firebase dihitung per dokumen yang dibaca.
- **V&M:** Kami sepakat dengan alasan AI dan memilih **Supabase**. Devin sudah lebih berpengalaman menggunakan Supabase dibanding Firebase, dan Supabase terasa lebih mudah dipahami dan lebih rapi untuk data yang berbentuk tabel.

---

## Tahap 2 — Penyusunan Kerangka Kode (Scaffolding)

### Entri 2.1 — 16 November 2026
- **Prompt (ringkas):** Permintaan membuat kerangka halaman HTML dan CSS, termasuk halaman login, form guru piket, tabel data, filter, dan modal kontak BK.
- **Saran AI (ringkas):** `index.html` dengan struktur berbagian (header, login, statistik, form, tabel, dan modal), `style.css` yang responsif untuk HP dan laptop, serta `config.js` sebagai satu-satunya file pengaturan.
- **V&M:** Kami melakukan validasi dan verifikasi dalam dua langkah untuk memastikan setiap variabel dan elemen sesuai dengan `id`-nya. Langkah pertama memeriksa bahwa setiap `id` yang dipanggil di JavaScript ada di HTML. Langkah kedua memeriksa bahwa setiap elemen dipanggil dengan benar.

### Entri 2.2 — 16 November 2026
- **Prompt (ringkas):** Permintaan membuat logika `script.js` dengan Mode Demo (`localStorage`) dan Mode Real-time (Supabase), termasuk form, filter, statistik, kirim WA/Gmail, dan ekspor CSV.
- **Saran AI (ringkas):** Lapisan data yang memisahkan Mode Demo dan Supabase, fungsi `renderAll()`, pesan WhatsApp dan Gmail yang dibentuk otomatis, serta pencegahan *formula injection* pada CSV.
- **V&M:** Pemeriksaan sintaks dilakukan dengan **Node.js** (perintah `node --check script.js`), bukan dengan PowerShell. Perintah ini memeriksa apakah penulisan JavaScript sudah benar tanpa menjalankan web. Kami sendiri masih belum sepenuhnya memahami seluruh isi kode di bagian ini, dan akan mempelajarinya lebih lanjut.

### Entri 2.3 — 16 November 2026
- **Prompt (ringkas):** Permintaan skrip database untuk Supabase: tabel, Row Level Security, dan real-time.
- **Saran AI (ringkas):** Tabel `keterlambatan`, aturan RLS (guru yang sudah login boleh melihat dan mencatat, hanya pencatat asli yang boleh menghapus), dan pendaftaran tabel ke `supabase_realtime`.
- **V&M:** Skrip ini dijalankan di Supabase dan tabel serta aturannya sudah terbentuk. Penjelasan tentang aturan `created_by = auth.uid()` ada di bagian refleksi (4.3).

---

## Tahap 3 — Pemecahan Masalah & Penanganan Galat (Debugging)

### Entri 3.1 — 16 November 2026
- **Prompt (ringkas):** Pesan error PowerShell: `cd C:\lokasi\folder\web-keterlambatan` tidak ditemukan dan `py` tidak dikenali.
- **Saran AI (ringkas):** Path di contoh hanya ilustrasi dan harus diganti dengan folder asli. `py` tidak dikenali karena Python belum terpasang atau belum masuk PATH. Web bisa dijalankan dengan membuka `index.html` langsung tanpa server.
- **V&M:** Kami pertama membuka `index.html` langsung di browser Chrome, tetapi halaman hanya menampilkan tulisan "Menghubungkan…" dan tidak berfungsi. Karena itu kami beralih ke JSFiddle, lalu menyatukan HTML, CSS, dan JavaScript yang sudah ada dan berfungsi di sana.

### Entri 3.2 — 16 November 2026
- **Prompt (ringkas):** Tombol unduh menampilkan pesan *"This file type can't be downloaded"*.
- **Saran AI (ringkas):** Gunakan tombol *Download all*, atau minta isi file ditampilkan langsung di chat.
- **V&M:** Karena file berjenis `.md` dan `.sql` di komputer kami tidak bisa diunduh, kami menyalin seluruh isi dari setiap file secara manual (copy paste): `index.html`, `style.css`, `script.js`, `config.js`, `README.md`, dan `AI_LOGBOOK.md`.

### Entri 3.3 — 16 November 2026
- **Prompt (ringkas):** Data yang dicatat belum muncul di tampilan, dan kami menanyakan apakah itu karena database belum disiapkan.
- **Saran AI (ringkas):** Mode Demo menyimpan data hanya di browser tempat data dicatat. Data tidak akan terlihat di browser atau perangkat lain. Solusinya adalah mengaktifkan Mode Real-time dengan Supabase.
- **V&M:** Sudah sesuai dengan penjelasan AI.

### Entri 3.4 — 17 November 2026
- **Prompt (ringkas):** Menanyakan apakah database bisa dibuat langsung lewat koneksi Supabase.
- **Saran AI (ringkas):** Ternyata belum ada project di akun. AI meminta persetujuan sebelum membuat project baru, dengan nama, organisasi, dan region yang akan digunakan.
- **V&M:** Sudah sesuai. Kami menyetujui pembuatan project dengan region `ap-southeast-1` (Singapura). Setelah project aktif, skrip database dijalankan dan kredensial diisi di `config.js`.

### Entri 3.5 — 17 November 2026
- **Prompt (ringkas):** Format kelas di web tidak sesuai dengan penamaan kelas di SMAN 2 Trenggalek, yaitu X-1 s.d. X-9 dan XI-A s.d. XII-I.
- **Saran AI (ringkas):** Daftar kelas dibuat sebagai array `KELAS` di `config.js`, lalu fungsi `configKelas()` di `script.js` membaca daftar itu.
- **V&M:** Sudah sesuai. Kami menulis 27 kelas secara lengkap di `config.js`, lalu menghapus `TINGKAT` dan `JUMLAH_ROMBEL` karena tidak dipakai lagi.

### Entri 3.6 — 17 November 2026
- **Prompt (ringkas):** Input kelas dibuat *strict*: hanya bisa memilih kelas resmi SMAN 2 Trenggalek, dengan urutan tetap.
- **Saran AI (ringkas):** Mengganti `<input>` dengan `<select>`, mengisi pilihan dari `configKelas()`, dan mempertahankan urutan daftar konfigurasi.
- **V&M:** Sudah sesuai. Kami juga menambahkan validasi di `onSubmit()` agar kelas yang tidak ada di daftar ditolak.

---

## Tahap 4 — Refleksi & Penjelasan Kode

**4.1** Jelaskan apa fungsi `configKelas()` dan bagaimana urutan kelas di dropdown dijaga.

> `configKelas()` mengambil daftar kelas yang sudah ditentukan di `config.js` untuk ditampilkan pada dropdown. Urutan kelas mengikuti urutan array `KELAS` yang sudah dibuat, sehingga kelas tidak diurutkan secara otomatis atau berubah-ubah. Dengan demikian, guru hanya bisa memilih kelas resmi yang tersedia.

**4.2** Mengapa aplikasi memiliki dua mode data (Demo dan Real-time)? Apa perbedaannya bagi guru?

> Mode Demo digunakan untuk menguji bagaimana web bekerja sebelum dipublikasikan. Mode ini hanya berjalan di browser, sehingga data tidak dibagikan ke perangkat lain. Mode Real-time berjalan secara nyata: data yang dimasukkan masuk ke database dan langsung terlihat oleh guru lain yang sudah login. Perbedaannya bagi guru adalah data di Mode Real-time tersimpan dan diperbarui secara real time. Orang sembarangan tidak bisa masuk dengan menyamar sebagai guru, karena hanya akun yang didaftarkan oleh administrator yang bisa login. Dengan begitu, hanya guru yang sudah diverifikasi yang bisa masuk ke web.

**4.3** Apa fungsi Row Level Security di `setup-supabase.sql`? Mengapa hanya pencatat asli yang boleh menghapus data?

> Row Level Security (RLS) melindungi data di database Supabase dengan mengatur siapa yang boleh melihat, menambahkan, mengubah, dan menghapus data. Hanya guru yang sudah login yang dapat mengakses data sesuai aturan yang ditentukan. Penghapusan hanya diperbolehkan bagi guru yang mencatat data tersebut, karena setiap data memiliki identitas pembuat (`created_by = auth.uid()`). Tujuannya agar guru lain tidak bisa sembarangan menghapus catatan, dan tanggung jawab setiap pencatatan tetap jelas.

**4.4** Apa fungsi `titleCase()` dan `normalizeWA()` di `script.js`? Berikan satu contoh input dan hasilnya.

> `titleCase()` mengubah huruf pertama setiap kata menjadi huruf kapital agar penulisan nama lebih rapi. `normalizeWA()` menyesuaikan format nomor WhatsApp menjadi format internasional agar bisa digunakan untuk membuat tautan WhatsApp. Kode negara Indonesia adalah 62.
>
> | Fungsi | Input | Hasil |
> |---|---|---|
> | `titleCase()` | devin aldy putra | Devin Aldy Putra |
> | `normalizeWA()` | 081234567890 | 6281234567890 |

**4.5** Jika sekolah ingin pesan ke Guru BK terkirim otomatis tanpa klik, bagian mana yang harus diubah dan layanan apa yang dibutuhkan?

> Bagian yang perlu diubah adalah fungsi pengiriman WhatsApp di `script.js`, terutama `waLink()` dan bagian `onSubmit()` yang sekarang membuka tautan WhatsApp menggunakan `window.open()`. Agar pesan terkirim otomatis, sekolah membutuhkan WhatsApp Business Platform (Cloud API) dan backend seperti Supabase Edge Functions untuk menghubungkan aplikasi dengan layanan WhatsApp. Dengan begitu, sistem dapat mengirim pesan secara otomatis setelah data keterlambatan berhasil disimpan, tanpa guru harus membuka WhatsApp dan menekan tombol kirim.

---

## Ringkasan Penggunaan AI

| Tahap | Jumlah entri | Keterangan |
|---|---|---|
| 1. Eksplorasi & perancangan | 2 | Konsep produk dan pemilihan database |
| 2. Scaffolding | 3 | Struktur HTML/CSS, logika JavaScript, skrip database |
| 3. Debugging | 6 | Error lokal, unduhan file, data tidak muncul, setup Supabase, format dan validasi kelas |
| 4. Refleksi | 5 pertanyaan | Dijawab oleh siswa |
