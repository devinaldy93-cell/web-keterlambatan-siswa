/* =========================================================
   KONFIGURASI — SMA Negeri 2 Trenggalek
   Isi bagian yang bertanda "GANTI" sesuai data sekolah.
   ========================================================= */

window.CONFIG = {
  // ---- Identitas sekolah ----
  NAMA_SEKOLAH: "SMA Negeri 2 Trenggalek",

  // ---- Kontak Guru BK (bisa juga diubah lewat tombol "Kontak BK" di web) ----
  BK_NAMA: "Vigor Wahyu Setiawan",
  BK_WA: "081234349696",                          // GANTI: nomor WA Guru BK, mis. 081234567890 atau 628xxx
  BK_EMAIL: "vigorsetiawan34@guru.sma.belajar.id",                       // GANTI: email Guru BK, mis. nama@gmail.com

  // ---- Database real-time (Supabase) ----
  // Kosongkan keduanya = MODE DEMO (data hanya tersimpan di browser ini).
  // Isi keduanya = MODE REAL-TIME (semua guru melihat data yang sama).
  SUPABASE_URL: "https://jydkqbajzczpeffbetsd.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_CkfhiFhdMyp5-8xxgC76Cg_X2O2Q8fk",

  // ---- Daftar kelas (muncul sebagai saran saat mengetik dan di filter) ----
  KELAS: [
    "X-1", "X-2", "X-3", "X-4", "X-5", "X-6", "X-7", "X-8", "X-9",
    "XI-A", "XI-B", "XI-C", "XI-D", "XI-E", "XI-F", "XI-G", "XI-H", "XI-I",
    "XII-A", "XII-B", "XII-C", "XII-D", "XII-E", "XII-F", "XII-G", "XII-H", "XII-I"
  ],

  // ---- Pilihan alasan terlambat ----
  ALASAN: [
    "Bangun kesiangan",
    "Macet",
    "Kendaraan bermasalah",
    "Antar jemput terlambat",
    "Sakit / keperluan keluarga",
    "Tanpa keterangan",
    "Lainnya"
  ],

  // ---- Siswa dianggap "sering terlambat" jika dalam 1 bulan >= angka ini ----
  BATAS_SERING_TERLAMBAT: 3
};
