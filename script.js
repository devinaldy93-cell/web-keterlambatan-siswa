/* =========================================================
   Data Keterlambatan Siswa — script.js

   MODE DEMO      : data disimpan di localStorage (satu browser saja)
   MODE REAL-TIME : data disimpan di Supabase, semua guru melihat
                    data yang sama dan tabel ikut berubah otomatis

   Mode ditentukan oleh config.js (SUPABASE_URL & SUPABASE_ANON_KEY).
   ========================================================= */
(() => {
  'use strict';

  const CFG = window.CONFIG || {};
  const DEMO = !CFG.SUPABASE_URL || !CFG.SUPABASE_ANON_KEY;

  const LS_BK = 'telat_bk_settings';
  const LS_PIKET = 'telat_nama_piket';
  const LS_DEMO = 'telat_demo_data';
  const MAX_RENDER = 300;
  const BATAS = Number(CFG.BATAS_SERING_TERLAMBAT) || 3;

  const $ = (id) => document.getElementById(id);

  // ---------------------------------------------------------
  // Utilitas
  // ---------------------------------------------------------
  const pad = (n) => String(n).padStart(2, '0');
  const toDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayStr = () => toDateStr(new Date());
  const nowTimeStr = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
  const parseDate = (s) => new Date(`${s}T00:00:00`);
  const hhmm = (t) => String(t || '').slice(0, 5);
  const fmtDateLong = (s) =>
    parseDate(s).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const fmtDateShort = (s) =>
    parseDate(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const lsGet = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, v); return true; } catch { return false; } };
  const lsDel = (k) => { try { localStorage.removeItem(k); } catch { /* abaikan */ } };

  // "budi SANTOSO" -> "Budi Santoso"
  function titleCase(s) {
    return s.trim().replace(/\s+/g, ' ').toLocaleLowerCase('id-ID')
      .replace(/(^|[\s\-'.])(\p{L})/gu, (_, sep, ch) => sep + ch.toLocaleUpperCase('id-ID'));
  }

  const studentKey = (r) => `${String(r.nama).toLowerCase()}|${String(r.kelas).toLowerCase()}`;

  function errMsg(err) {
    const m = (err && err.message) ? err.message : String(err);
    if (/row-level security|permission denied/i.test(m)) return 'akun ini tidak punya izin untuk aksi tersebut.';
    if (/failed to fetch|network/i.test(m)) return 'tidak ada koneksi internet.';
    return m;
  }

  let toastTimer;
  function toast(msg, type = '') {
    const t = $('toast');
    t.textContent = msg;
    t.className = 'toast' + (type ? ` toast--${type}` : '');
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 3800);
  }

  function setStatus(kind, text) {
    const b = $('statusBadge');
    b.className = `badge badge--${kind}`;
    b.textContent = text;
  }

  // ---------------------------------------------------------
  // Kontak Guru BK
  // ---------------------------------------------------------
  function getBK() {
    let saved = {};
    try { saved = JSON.parse(lsGet(LS_BK) || '{}'); } catch { saved = {}; }
    return {
      nama: saved.nama || CFG.BK_NAMA || 'Guru BK',
      wa: saved.wa || CFG.BK_WA || '',
      email: saved.email || CFG.BK_EMAIL || ''
    };
  }

  // 0812xxx / 812xxx / +62812xxx -> 62812xxx
  function normalizeWA(num) {
    let d = String(num || '').replace(/\D/g, '');
    if (d.startsWith('0')) d = '62' + d.slice(1);
    else if (d.startsWith('8')) d = '62' + d;
    return d;
  }

  const sekolah = () => CFG.NAMA_SEKOLAH || 'Sekolah';

  function periodLabel() {
    const { from, to } = filter;
    if (!from && !to) return 'Periode: semua data';
    if (from && from === to) return `Tanggal: ${fmtDateLong(from)}`;
    return `Periode: ${from ? fmtDateShort(from) : 'awal'} s.d. ${to ? fmtDateShort(to) : 'sekarang'}`;
  }

  // wa = true -> pakai format tebal WhatsApp (*teks*)
  function msgSingle(r, wa) {
    const b = (t) => (wa ? `*${t}*` : t);
    const lines = [
      b('LAPORAN KETERLAMBATAN SISWA'),
      sekolah(),
      '',
      `Nama: ${r.nama}`,
      `Kelas: ${r.kelas}`,
      `Hari/tanggal: ${fmtDateLong(r.tanggal)}`,
      `Jam datang: ${hhmm(r.jam)}`,
      `Alasan: ${r.alasan || '-'}`
    ];
    if (r.catatan) lines.push(`Catatan: ${r.catatan}`);
    lines.push(`Dicatat oleh: ${r.guru_piket || '-'}`, '', `Mohon tindak lanjut ${getBK().nama}. Terima kasih.`);
    return lines.join('\n');
  }

  function msgRekap(list, wa) {
    const b = (t) => (wa ? `*${t}*` : t);
    const MAX = 40;
    const sorted = [...list].sort((a, c) =>
      a.tanggal.localeCompare(c.tanggal) || hhmm(a.jam).localeCompare(hhmm(c.jam)));
    const body = sorted.slice(0, MAX).map((r, i) =>
      `${i + 1}. ${r.nama} (${r.kelas}) - ${fmtDateShort(r.tanggal)} ${hhmm(r.jam)} - ${r.alasan || '-'}`);
    if (list.length > MAX) body.push(`...dan ${list.length - MAX} data lainnya (lihat di web).`);
    return [
      b('REKAP KETERLAMBATAN SISWA'),
      sekolah(),
      periodLabel(),
      `Jumlah: ${list.length} data`,
      '',
      ...body,
      '',
      `Mohon tindak lanjut ${getBK().nama}. Terima kasih.`
    ].join('\n');
  }

  function msgFrequent(e, wa) {
    const b = (t) => (wa ? `*${t}*` : t);
    const bulan = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    return [
      b('PEMBERITAHUAN SISWA SERING TERLAMBAT'),
      sekolah(),
      '',
      `Nama: ${e.nama}`,
      `Kelas: ${e.kelas}`,
      `Terlambat ${e.count} kali pada ${bulan}`,
      `Terakhir: ${fmtDateLong(e.last)}`,
      '',
      `Mohon pembinaan dari ${getBK().nama}. Terima kasih.`
    ].join('\n');
  }

  function waLink(text) {
    const n = normalizeWA(getBK().wa);
    return n.length >= 10 ? `https://wa.me/${n}?text=${encodeURIComponent(text)}` : '';
  }

  function mailLink(subject, body) {
    const to = getBK().email;
    if (!to) return '';
    return 'https://mail.google.com/mail/?view=cm&fs=1' +
      `&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  // atribut <a> untuk HTML string
  const linkAttrs = (href) =>
    href ? `href="${esc(href)}" target="_blank" rel="noopener"` : 'href="#" data-missing="1"';

  // ---------------------------------------------------------
  // State
  // ---------------------------------------------------------
  let db = null;           // klien Supabase
  let session = null;
  let channel = null;
  let rows = [];
  let jamTouched = false;
  let activeRange = 'today';
  let lastDay = todayStr();
  const filter = { from: '', to: '', kelas: '', q: '' };

  const sortRows = (list) =>
    list.sort((a, b) =>
      b.tanggal.localeCompare(a.tanggal) ||
      hhmm(b.jam).localeCompare(hhmm(a.jam)) ||
      String(b.created_at || '').localeCompare(String(a.created_at || '')));

  // ---------------------------------------------------------
  // Lapisan data (demo vs Supabase)
  // ---------------------------------------------------------
  function demoLoad() {
    try { return JSON.parse(lsGet(LS_DEMO) || '[]'); } catch { return []; }
  }

  async function fetchRows() {
    if (DEMO) return demoLoad();
    const { data, error } = await db
      .from('keterlambatan')
      .select('*')
      .order('tanggal', { ascending: false })
      .order('jam', { ascending: false })
      .limit(5000);
    if (error) throw error;
    return data || [];
  }

  async function insertRow(rec) {
    if (DEMO) {
      const all = demoLoad();
      all.unshift({ ...rec, id: Date.now(), created_at: new Date().toISOString(), created_by: 'demo' });
      if (!lsSet(LS_DEMO, JSON.stringify(all))) throw new Error('Penyimpanan browser penuh atau dinonaktifkan.');
      return;
    }
    const { error } = await db.from('keterlambatan').insert(rec);
    if (error) throw error;
  }

  async function deleteRow(id) {
    if (DEMO) {
      lsSet(LS_DEMO, JSON.stringify(demoLoad().filter((r) => String(r.id) !== String(id))));
      return true;
    }
    const { data, error } = await db.from('keterlambatan').delete().eq('id', id).select();
    if (error) throw error;
    return (data || []).length > 0;
  }

  let reloadTimer;
  function scheduleReload() {
    clearTimeout(reloadTimer);
    reloadTimer = setTimeout(loadRows, 250);
  }

  async function loadRows() {
    try {
      rows = sortRows(await fetchRows());
      renderAll();
    } catch (err) {
      console.error(err);
      toast('Gagal memuat data: ' + errMsg(err), 'bad');
    }
  }

  function subscribeRealtime() {
    if (channel || !db) return;
    channel = db.channel('keterlambatan-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'keterlambatan' }, scheduleReload)
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setStatus('ok', 'Real-time aktif');
        else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setStatus('bad', 'Koneksi terputus');
        else setStatus('wait', 'Menghubungkan…');
      });
  }

  function unsubscribeRealtime() {
    if (channel && db) db.removeChannel(channel);
    channel = null;
  }

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------
  function configKelas() {
    return Array.isArray(CFG.KELAS) ? CFG.KELAS : [];
  }

  function renderOptions() {
    // saran kelas: dari config + kelas yang pernah dicatat
    const fromData = [...new Set(rows.map((r) => r.kelas))];
    const cfgKelas = configKelas();
    const extra = fromData.filter((k) => !cfgKelas.includes(k));
    const suggestions = [...cfgKelas, ...extra];
    $('listKelas').innerHTML = suggestions.map((k) => `<option value="${esc(k)}"></option>`).join('');

    // saran nama: dari data yang sudah ada
    const names = [...new Set(rows.map((r) => r.nama))].slice(0, 600);
    $('listNama').innerHTML = names.map((n) => `<option value="${esc(n)}"></option>`).join('');

    // filter kelas
    const sel = $('fKelas');
    const current = filter.kelas;
    const all = [...new Set([...cfgKelas, ...fromData])]
      .sort((a, b) => a.localeCompare(b, 'id', { numeric: true }));
    sel.innerHTML = '<option value="">Semua kelas</option>' +
      all.map((k) => `<option value="${esc(k)}">${esc(k)}</option>`).join('');
    sel.value = all.includes(current) ? current : '';
    if (sel.value !== current) filter.kelas = sel.value;
  }

  function monthStartStr() {
    const t = new Date();
    return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-01`;
  }

  function frequentStudents() {
    const start = monthStartStr();
    const map = new Map();
    rows.filter((r) => r.tanggal >= start).forEach((r) => {
      const k = studentKey(r);
      const e = map.get(k) || { nama: r.nama, kelas: r.kelas, count: 0, last: r.tanggal };
      e.count += 1;
      if (r.tanggal > e.last) e.last = r.tanggal;
      map.set(k, e);
    });
    return [...map.values()].sort((a, b) => b.count - a.count || a.nama.localeCompare(b.nama, 'id'));
  }

  function renderStats() {
    const t = new Date();
    const today = todayStr();
    const weekStart = toDateStr(new Date(t.getFullYear(), t.getMonth(), t.getDate() - 6));
    const monthStart = monthStartStr();
    let d = 0, w = 0, m = 0;
    rows.forEach((r) => {
      if (r.tanggal === today) d++;
      if (r.tanggal >= weekStart && r.tanggal <= today) w++;
      if (r.tanggal >= monthStart && r.tanggal <= today) m++;
    });
    $('statToday').textContent = d;
    $('statWeek').textContent = w;
    $('statMonth').textContent = m;
    $('statFrequent').textContent = frequentStudents().filter((e) => e.count >= BATAS).length;
  }

  function renderFrequent() {
    const list = frequentStudents().filter((e) => e.count >= BATAS).slice(0, 8);
    const ul = $('frequentList');
    if (!list.length) {
      ul.innerHTML = `<li class="frequent__empty">Belum ada siswa dengan ${BATAS}x terlambat atau lebih bulan ini.</li>`;
      return;
    }
    ul.innerHTML = list.map((e) => {
      const wa = waLink(msgFrequent(e, true));
      const mail = mailLink(`Siswa sering terlambat: ${e.nama} (${e.kelas})`, msgFrequent(e, false));
      return `<li>
        <div>
          <div class="frequent__name">${esc(e.nama)}</div>
          <div class="frequent__meta">${esc(e.kelas)} · terakhir ${esc(fmtDateShort(e.last))}</div>
        </div>
        <div class="actions">
          <span class="frequent__count">${e.count}×</span>
          <a class="icon-btn icon-btn--wa" ${linkAttrs(wa)} title="Beritahu BK lewat WhatsApp">WA</a>
          <a class="icon-btn icon-btn--mail" ${linkAttrs(mail)} title="Beritahu BK lewat Gmail">Gmail</a>
        </div>
      </li>`;
    }).join('');
  }

  function filteredRows() {
    return rows.filter((r) =>
      (!filter.from || r.tanggal >= filter.from) &&
      (!filter.to || r.tanggal <= filter.to) &&
      (!filter.kelas || r.kelas === filter.kelas) &&
      (!filter.q || String(r.nama).toLowerCase().includes(filter.q)));
  }

  function setLink(a, href, disabled) {
    a.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    if (href) {
      a.href = href;
      a.removeAttribute('data-missing');
    } else {
      a.href = '#';
      if (disabled) a.removeAttribute('data-missing');
      else a.setAttribute('data-missing', '1');
    }
  }

  function renderRekap(list) {
    const has = list.length > 0;
    setLink($('btnRekapWA'), has ? waLink(msgRekap(list, true)) : '', !has);
    setLink(
      $('btnRekapMail'),
      has ? mailLink(`Rekap keterlambatan siswa - ${periodLabel()}`, msgRekap(list, false)) : '',
      !has
    );
  }

  function renderTable() {
    const list = filteredRows();
    const counts = new Map(frequentStudents().map((e) => [studentKey(e), e.count]));
    const shown = list.slice(0, MAX_RENDER);

    $('tbody').innerHTML = shown.map((r, i) => {
      const cnt = counts.get(studentKey(r)) || 0;
      const tag = cnt >= BATAS ? `<span class="tag" title="Terlambat ${cnt} kali bulan ini">⚠ ${cnt}× bulan ini</span>` : '';
      const wa = waLink(msgSingle(r, true));
      const mail = mailLink(`Laporan keterlambatan: ${r.nama} (${r.kelas})`, msgSingle(r, false));
      const canDelete = DEMO || (session && r.created_by === session.user.id);
      return `<tr>
        <td class="num">${i + 1}</td>
        <td class="num">${esc(fmtDateShort(r.tanggal))}</td>
        <td class="time">${esc(hhmm(r.jam))}</td>
        <td><strong>${esc(r.nama)}</strong>${tag}${r.catatan ? `<span class="cell-note">${esc(r.catatan)}</span>` : ''}</td>
        <td>${esc(r.kelas)}</td>
        <td>${esc(r.alasan || '-')}</td>
        <td>${esc(r.guru_piket || '-')}</td>
        <td class="col-aksi"><div class="actions">
          <a class="icon-btn icon-btn--wa" ${linkAttrs(wa)} title="Kirim ke BK lewat WhatsApp">WA</a>
          <a class="icon-btn icon-btn--mail" ${linkAttrs(mail)} title="Kirim ke BK lewat Gmail">Gmail</a>
          ${canDelete ? `<button class="icon-btn icon-btn--del" type="button" data-del="${esc(r.id)}" title="Hapus data ini">Hapus</button>` : ''}
        </div></td>
      </tr>`;
    }).join('');

    $('emptyState').hidden = list.length > 0;
    $('resultInfo').textContent = list.length > MAX_RENDER
      ? `${list.length} data (menampilkan ${MAX_RENDER} terbaru — persempit filter untuk melihat sisanya)`
      : `${list.length} data`;
    renderRekap(list);
  }

  function renderAll() {
    renderOptions();
    renderStats();
    renderFrequent();
    renderTable();
  }

  // ---------------------------------------------------------
  // Filter
  // ---------------------------------------------------------
  function markChips() {
    document.querySelectorAll('.chip').forEach((c) =>
      c.classList.toggle('is-active', c.dataset.range === activeRange));
  }

  function setRange(kind) {
    const t = new Date();
    const today = todayStr();
    activeRange = kind;
    if (kind === 'today') { filter.from = today; filter.to = today; }
    else if (kind === 'week') { filter.from = toDateStr(new Date(t.getFullYear(), t.getMonth(), t.getDate() - 6)); filter.to = today; }
    else if (kind === 'month') { filter.from = monthStartStr(); filter.to = today; }
    else { filter.from = ''; filter.to = ''; }
    $('fFrom').value = filter.from;
    $('fTo').value = filter.to;
    markChips();
    renderTable();
  }

  // ---------------------------------------------------------
  // Form
  // ---------------------------------------------------------
  function resetForm() {
    $('inNama').value = '';
    $('inKelas').value = '';
    $('inCatatan').value = '';
    $('inAlasan').selectedIndex = 0;
    jamTouched = false;
    $('inJam').value = nowTimeStr();
    $('inNama').focus();
  }

  async function onSubmit(e) {
    e.preventDefault();

    const nama = titleCase($('inNama').value);
    const kelas = $('inKelas').value.trim().toUpperCase().replace(/\s+/g, ' ');
    const jam = $('inJam').value;
    const piket = $('inPiket').value.trim();

    if (nama.length < 3 || !kelas || !jam || !piket) {
      toast('Lengkapi nama siswa, kelas, jam, dan nama guru piket.', 'bad');
      return;
    }

    const tanggal = todayStr();
    const dup = rows.find((r) => r.tanggal === tanggal && studentKey(r) === studentKey({ nama, kelas }));
    if (dup && !confirm(`${nama} (${kelas}) sudah tercatat terlambat hari ini pukul ${hhmm(dup.jam)}.\nTetap simpan lagi?`)) {
      return;
    }

    const auto = $('inAutoWA').checked;
    if (auto && !waLink('x')) {
      toast('Nomor WhatsApp Guru BK belum diisi.', 'bad');
      openSettings();
      return;
    }
    // Jendela harus dibuka sekarang (saat klik) agar tidak diblokir browser
    const popup = auto ? window.open('', '_blank') : null;

    const rec = {
      tanggal,
      jam,
      nama,
      kelas,
      alasan: $('inAlasan').value,
      catatan: $('inCatatan').value.trim() || null,
      guru_piket: piket
    };

    const btn = $('btnSave');
    btn.disabled = true;
    btn.textContent = 'Menyimpan…';
    try {
      await insertRow(rec);
      lsSet(LS_PIKET, piket);
      toast(`Tersimpan: ${nama} (${kelas})`, 'ok');
      resetForm();
      await loadRows();
      if (popup) popup.location.href = waLink(msgSingle(rec, true));
    } catch (err) {
      console.error(err);
      if (popup) popup.close();
      toast('Gagal menyimpan: ' + errMsg(err), 'bad');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Simpan';
    }
  }

  // ---------------------------------------------------------
  // Hapus & CSV
  // ---------------------------------------------------------
  async function onTableClick(e) {
    const btn = e.target.closest('[data-del]');
    if (!btn) return;
    const row = rows.find((r) => String(r.id) === btn.dataset.del);
    if (!row) return;
    if (!confirm(`Hapus data keterlambatan ${row.nama} (${row.kelas}) tanggal ${fmtDateShort(row.tanggal)}?`)) return;
    try {
      const ok = await deleteRow(row.id);
      if (!ok) toast('Data tidak bisa dihapus. Hanya pencatat aslinya yang boleh menghapus.', 'bad');
      else toast('Data dihapus.', 'ok');
      await loadRows();
    } catch (err) {
      toast('Gagal menghapus: ' + errMsg(err), 'bad');
    }
  }

  function exportCsv() {
    const list = filteredRows();
    if (!list.length) { toast('Tidak ada data untuk diunduh.'); return; }
    const cell = (v) => {
      let s = String(v ?? '');
      if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;       // cegah formula injection di Excel
      return `"${s.replace(/"/g, '""')}"`;
    };
    const header = ['No', 'Tanggal', 'Jam', 'Nama', 'Kelas', 'Alasan', 'Catatan', 'Guru Piket'];
    const lines = [header.map(cell).join(',')];
    list.forEach((r, i) => {
      lines.push([i + 1, r.tanggal, hhmm(r.jam), r.nama, r.kelas, r.alasan, r.catatan, r.guru_piket].map(cell).join(','));
    });
    const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keterlambatan_${filter.from || 'awal'}_${filter.to || 'akhir'}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ---------------------------------------------------------
  // Pengaturan kontak BK
  // ---------------------------------------------------------
  function openSettings() {
    const bk = getBK();
    $('sNama').value = bk.nama;
    $('sWA').value = bk.wa;
    $('sEmail').value = bk.email;
    const dlg = $('settingsDialog');
    if (!dlg.open) dlg.showModal();
  }

  function onSettingsSubmit(e) {
    const wa = $('sWA').value.trim();
    if (wa && normalizeWA(wa).length < 10) {
      e.preventDefault();
      toast('Nomor WhatsApp tidak valid.', 'bad');
      return;
    }
    lsSet(LS_BK, JSON.stringify({
      nama: $('sNama').value.trim(),
      wa,
      email: $('sEmail').value.trim()
    }));
    renderAll();
    toast('Kontak BK disimpan.', 'ok');
  }

  // ---------------------------------------------------------
  // Login / logout (mode real-time)
  // ---------------------------------------------------------
  function showView(name) {
    $('loginView').hidden = name !== 'login';
    $('appView').hidden = name !== 'app';
    $('userBox').hidden = name !== 'app' || DEMO;
  }

  async function applySession(s) {
    const same = !!(s && session && s.user.id === session.user.id);
    session = s;
    if (!s) {
      unsubscribeRealtime();
      rows = [];
      showView('login');
      setStatus('wait', 'Belum masuk');
      return;
    }
    $('userEmail').textContent = s.user.email || '';
    if (same) return;                 // hanya refresh token, tidak perlu muat ulang
    showView('app');
    setStatus('wait', 'Menghubungkan…');
    setRange('today');
    await loadRows();
    subscribeRealtime();
  }

  async function onLogin(e) {
    e.preventDefault();
    const btn = $('btnLogin');
    const err = $('loginError');
    err.hidden = true;
    btn.disabled = true;
    btn.textContent = 'Masuk…';
    try {
      const { error } = await db.auth.signInWithPassword({
        email: $('loginEmail').value.trim(),
        password: $('loginPassword').value
      });
      if (error) throw error;
      $('loginPassword').value = '';
    } catch (ex) {
      err.textContent = /invalid login/i.test(ex.message || '')
        ? 'Email atau kata sandi salah.'
        : 'Gagal masuk: ' + errMsg(ex);
      err.hidden = false;
    } finally {
      btn.disabled = false;
      btn.textContent = 'Masuk';
    }
  }

  // ---------------------------------------------------------
  // Jam & tanggal berjalan
  // ---------------------------------------------------------
  function tick() {
    const d = new Date();
    $('clockDate').textContent =
      d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    $('clockTime').textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    if (!jamTouched) $('inJam').value = nowTimeStr();

    const t = todayStr();
    if (t !== lastDay) {               // hari berganti saat web dibiarkan terbuka
      lastDay = t;
      if (activeRange) setRange(activeRange);
      renderAll();
    }
  }

  // ---------------------------------------------------------
  // Inisialisasi
  // ---------------------------------------------------------
  function bindEvents() {
    $('lateForm').addEventListener('submit', onSubmit);
    $('loginForm').addEventListener('submit', onLogin);
    $('btnLogout').addEventListener('click', async () => { if (db) await db.auth.signOut(); });

    $('inJam').addEventListener('input', () => { jamTouched = true; });
    $('inPiket').addEventListener('change', () => lsSet(LS_PIKET, $('inPiket').value.trim()));

    // pilih nama yang sudah ada -> isi kelas otomatis
    $('inNama').addEventListener('change', () => {
      if ($('inKelas').value) return;
      const nama = titleCase($('inNama').value).toLowerCase();
      const found = rows.find((r) => String(r.nama).toLowerCase() === nama);
      if (found) $('inKelas').value = found.kelas;
    });

    document.querySelector('.chips').addEventListener('click', (e) => {
      const c = e.target.closest('[data-range]');
      if (c) setRange(c.dataset.range);
    });
    $('fFrom').addEventListener('change', () => { filter.from = $('fFrom').value; activeRange = null; markChips(); renderTable(); });
    $('fTo').addEventListener('change', () => { filter.to = $('fTo').value; activeRange = null; markChips(); renderTable(); });
    $('fKelas').addEventListener('change', () => { filter.kelas = $('fKelas').value; renderTable(); });
    $('fSearch').addEventListener('input', () => { filter.q = $('fSearch').value.trim().toLowerCase(); renderTable(); });

    $('tbody').addEventListener('click', onTableClick);
    $('btnCsv').addEventListener('click', exportCsv);

    $('btnSettings').addEventListener('click', openSettings);
    $('btnSettingsCancel').addEventListener('click', () => $('settingsDialog').close());
    $('btnSettingsReset').addEventListener('click', () => {
      lsDel(LS_BK);
      const bk = getBK();
      $('sNama').value = bk.nama;
      $('sWA').value = bk.wa;
      $('sEmail').value = bk.email;
      renderAll();
      toast('Kontak dikembalikan ke nilai di config.js.');
    });
    $('settingsForm').addEventListener('submit', onSettingsSubmit);

    // tautan WA/Gmail tanpa kontak -> arahkan ke pengaturan
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-missing]');
      if (a) {
        e.preventDefault();
        toast('Kontak Guru BK belum diisi lengkap.', 'bad');
        openSettings();
      }
    });
  }

  async function init() {
    $('namaSekolah').textContent = CFG.NAMA_SEKOLAH || '';
    document.title = `Keterlambatan Siswa${CFG.NAMA_SEKOLAH ? ' — ' + CFG.NAMA_SEKOLAH : ''}`;
    $('inAlasan').innerHTML = (CFG.ALASAN || ['Lainnya'])
      .map((a) => `<option value="${esc(a)}">${esc(a)}</option>`).join('');
    $('inPiket').value = lsGet(LS_PIKET) || '';

    bindEvents();
    tick();
    setInterval(tick, 1000);

    if (DEMO) {
      $('demoBanner').hidden = false;
      setStatus('demo', 'Mode Demo (lokal)');
      // sinkron antar-tab di browser yang sama
      window.addEventListener('storage', (e) => { if (e.key === LS_DEMO) loadRows(); });
      showView('app');
      setRange('today');
      await loadRows();
      return;
    }

    if (!window.supabase) {
      setStatus('bad', 'Library gagal dimuat');
      toast('Library Supabase gagal dimuat. Periksa koneksi internet lalu muat ulang.', 'bad');
      showView('login');
      return;
    }

    db = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
    // setTimeout menghindari deadlock bila memanggil Supabase di dalam callback auth
    db.auth.onAuthStateChange((_event, s) => { setTimeout(() => applySession(s), 0); });
    const { data } = await db.auth.getSession();
    await applySession(data.session);

    // cadangan bila koneksi real-time terputus: muat ulang tiap 30 detik / saat tab dibuka lagi
    setInterval(() => { if (session) loadRows(); }, 30000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden && session) loadRows(); });
  }

  init();
})();
