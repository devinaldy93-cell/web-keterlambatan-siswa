/* =========================================================
   KONFIGURASI — ubah bagian ini sesuai sekolah kalian.
   Tidak perlu mengubah file lain untuk pengaturan dasar.
   ========================================================= */

window.CONFIG = {
  // ---- Identitas sekolah ----
  NAMA_SEKOLAH: "SMA Negeri Contoh",

  // ---- Kontak Guru BK (bisa juga diubah lewat tombol "Kontak BK" di web) ----
  BK_NAMA: "Guru BK",
  BK_WA: "081234567890",              // boleh format 08xxx atau 628xxx
  BK_EMAIL: "guru.bk@sekolah.sch.id",

  // ---- Database real-time (Supabase) ----
  // Kosongkan keduanya = MODE DEMO (data hanya tersimpan di browser ini).
  // Isi keduanya = MODE REAL-TIME (semua guru melihat data yang sama).
  // Cara mendapatkannya ada di README.md
  SUPABASE_URL: "https://jydkqbajzczpeffbetsd.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_CkfhiFhdMyp5-8xxgC76Cg_X2O2Q8fk",

  // ---- Daftar kelas (muncul sebagai saran saat mengetik) ----
  TINGKAT: ["X", "XI", "XII"],
  JUMLAH_ROMBEL: 8,                   // contoh: X-1 sampai X-8

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
