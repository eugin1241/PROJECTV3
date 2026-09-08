/**
 * Celengan Mikro UMKM - Frontend Logic (js/app.js)
 * Dual-Mode Architecture:
 * 1. Buka langsung dari file (file://) -> berjalan mandiri menggunakan localStorage
 * 2. Dijalankan di server (Railway/Local) -> tersinkronisasi via REST API server
 */

// ================= INITIAL SEED DATA =================
const SEED_DATA = {
  users: [
    {
      id: "usr_admin",
      email: "admin@celengan.id",
      password: "admin123",
      name: "Admin Utama",
      role: "Admin",
      createdAt: "2026-09-01T08:00:00.000Z"
    },
    {
      id: "usr_rt01",
      email: "rt01@kelurahan.id",
      password: "rt12345",
      name: "Pengurus RT 01 / RW 05",
      role: "RT/RW",
      createdAt: "2026-09-01T08:30:00.000Z"
    },
    {
      id: "usr_rt02",
      email: "rt02@kelurahan.id",
      password: "rt12345",
      name: "Pengurus RT 02 / RW 03",
      role: "RT/RW",
      createdAt: "2026-09-01T08:45:00.000Z"
    },
    {
      id: "usr_donatur1",
      email: "budi@donatur.id",
      password: "donatur123",
      name: "Budi Santoso",
      role: "Donatur",
      createdAt: "2026-09-02T09:00:00.000Z"
    },
    {
      id: "usr_donatur2",
      email: "siti@donatur.id",
      password: "donatur123",
      name: "Siti Rahmawati",
      role: "Donatur",
      createdAt: "2026-09-02T10:00:00.000Z"
    }
  ],
  warga: [
    {
      id: "wrg_001",
      rtId: "usr_rt01",
      rtName: "Pengurus RT 01 / RW 05",
      name: "Pak Joko Widodo (Pedagang)",
      businessType: "Jualan Gorengan Crispy Keliling",
      targetAmount: 1500000,
      collectedAmount: 950000,
      nonCashItems: "Wajan stainless besar diameter 60cm, kompor gas mawar tekanan tinggi, regulator SNI, dan modal bahan baku tepung & minyak goreng 20L",
      photo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80",
      status: "Terverifikasi",
      adminNotes: "Layak dibantu. Kondisi gerobak perlu pembaruan wajan dan kompor.",
      createdAt: "2026-09-02T11:00:00.000Z",
      verifiedAt: "2026-09-02T13:00:00.000Z"
    },
    {
      id: "wrg_002",
      rtId: "usr_rt01",
      rtName: "Pengurus RT 01 / RW 05",
      name: "Ibu Aminah",
      businessType: "Jasa Jahit & Permak Pakaian",
      targetAmount: 2200000,
      collectedAmount: 2200000,
      nonCashItems: "Mesin jahit portable multi-fungsi, gunting potong kain profesional, set benang 24 warna, dan meteran jahit",
      photo: "https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?w=600&auto=format&fit=crop&q=80",
      status: "Terverifikasi",
      adminNotes: "Disetujui. Target dana telah tercapai, dalam proses penyaluran barang kebutuhan.",
      createdAt: "2026-09-02T11:30:00.000Z",
      verifiedAt: "2026-09-02T14:00:00.000Z"
    },
    {
      id: "wrg_003",
      rtId: "usr_rt02",
      rtName: "Pengurus RT 02 / RW 03",
      name: "Pak Bambang Irawan",
      businessType: "Bengkel Tambal Ban & Isi Angin Motor",
      targetAmount: 1800000,
      collectedAmount: 450000,
      nonCashItems: "Kompresor angin mini portable 1 HP, alat pres tambal ban listrik, selang spiral 10 meter, dan set ban dalam cadangan",
      photo: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80",
      status: "Terverifikasi",
      adminNotes: "Telah diverifikasi dan siap menerima donasi mikro.",
      createdAt: "2026-09-03T09:15:00.000Z",
      verifiedAt: "2026-09-03T10:00:00.000Z"
    },
    {
      id: "wrg_004",
      rtId: "usr_rt01",
      rtName: "Pengurus RT 01 / RW 05",
      name: "Ibu Kartini",
      businessType: "Warung Sarapan Nasi Uduk & Lontong Sayur",
      targetAmount: 1200000,
      collectedAmount: 0,
      nonCashItems: "Dandang kukusan nasi uduk aluminium 10L, termos nasi insulated, etalase meja display kaca 1 meter, dan mangkuk saji",
      photo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80",
      status: "Pending",
      adminNotes: "",
      createdAt: "2026-09-04T10:00:00.000Z",
      verifiedAt: null
    }
  ],
  donations: [
    {
      id: "dns_101",
      donaturId: "usr_donatur1",
      donaturName: "Budi Santoso",
      wargaId: "wrg_001",
      wargaName: "Pak Joko Widodo (Pedagang)",
      rtName: "Pengurus RT 01 / RW 05",
      amount: 250000,
      paymentMethod: "QRIS",
      status: "Berhasil",
      createdAt: "2026-09-03T14:20:00.000Z"
    },
    {
      id: "dns_102",
      donaturId: "usr_donatur2",
      donaturName: "Siti Rahmawati",
      wargaId: "wrg_001",
      wargaName: "Pak Joko Widodo (Pedagang)",
      rtName: "Pengurus RT 01 / RW 05",
      amount: 700000,
      paymentMethod: "Transfer Bank Mandiri",
      status: "Berhasil",
      createdAt: "2026-09-03T15:00:00.000Z"
    },
    {
      id: "dns_103",
      donaturId: "usr_donatur1",
      donaturName: "Budi Santoso",
      wargaId: "wrg_002",
      wargaName: "Ibu Aminah",
      rtName: "Pengurus RT 01 / RW 05",
      amount: 1200000,
      paymentMethod: "QRIS",
      status: "Berhasil",
      createdAt: "2026-09-03T16:10:00.000Z"
    },
    {
      id: "dns_104",
      donaturId: "usr_donatur2",
      donaturName: "Siti Rahmawati",
      wargaId: "wrg_002",
      wargaName: "Ibu Aminah",
      rtName: "Pengurus RT 01 / RW 05",
      amount: 1000000,
      paymentMethod: "Transfer Bank BCA",
      status: "Berhasil",
      createdAt: "2026-09-03T17:00:00.000Z"
    },
    {
      id: "dns_105",
      donaturId: "usr_donatur1",
      donaturName: "Budi Santoso",
      wargaId: "wrg_003",
      wargaName: "Pak Bambang Irawan",
      rtName: "Pengurus RT 02 / RW 03",
      amount: 450000,
      paymentMethod: "QRIS",
      status: "Berhasil",
      createdAt: "2026-09-04T08:30:00.000Z"
    }
  ],
  notifications: [
    {
      id: "notif_001",
      recipientId: "usr_rt01",
      title: "Verifikasi Disetujui",
      message: "Data warga Pak Joko Widodo (Pedagang) telah diverifikasi dan disetujui oleh Admin. Penggalangan donasi modal usaha telah tayang ke publik.",
      type: "success",
      createdAt: "2026-09-02T13:00:00.000Z",
      isRead: true
    },
    {
      id: "notif_002",
      recipientId: "usr_rt01",
      title: "Verifikasi Disetujui",
      message: "Data warga Ibu Aminah telah disetujui oleh Admin dan tayang di katalog donasi.",
      type: "success",
      createdAt: "2026-09-02T14:00:00.000Z",
      isRead: true
    },
    {
      id: "notif_003",
      recipientId: "usr_rt02",
      title: "Verifikasi Disetujui",
      message: "Data warga Pak Bambang Irawan telah disetujui oleh Admin.",
      type: "success",
      createdAt: "2026-09-03T10:00:00.000Z",
      isRead: false
    }
  ]
};

// ================= DATA SERVICE LAYER (DUAL-MODE) =================
const StorageManager = {
  isServerAvailable: false,
  storageKey: 'celengan_mikro_data_v1',
  currentUserKey: 'celengan_current_user',
  _memoryFallback: {},

  _getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return this._memoryFallback[key] || null;
    }
  },

  _setItem(key, val) {
    try {
      localStorage.setItem(key, val);
    } catch (e) {
      this._memoryFallback[key] = val;
    }
  },

  _removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      delete this._memoryFallback[key];
    }
  },

  async init() {
    // Cek apakah server backend aktif
    if (window.location.protocol.startsWith('http')) {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          this.isServerAvailable = true;
          const tag = document.getElementById('runningModeTag');
          if (tag) tag.textContent = 'Server Mode (Cloud / Railway / Local API)';
        }
      } catch (e) {
        this.isServerAvailable = false;
      }
    }

    if (!this.isServerAvailable) {
      const tag = document.getElementById('runningModeTag');
      if (tag) tag.textContent = 'File Mode (Langsung Browser / LocalStorage)';
      // Inisialisasi local storage jika belum ada
      if (!this._getItem(this.storageKey)) {
        this._setItem(this.storageKey, JSON.stringify(SEED_DATA));
      }
    }
  },

  getLocalData() {
    const raw = this._getItem(this.storageKey);
    if (!raw) {
      this._setItem(this.storageKey, JSON.stringify(SEED_DATA));
      return JSON.parse(JSON.stringify(SEED_DATA));
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      this._setItem(this.storageKey, JSON.stringify(SEED_DATA));
      return JSON.parse(JSON.stringify(SEED_DATA));
    }
  },

  saveLocalData(data) {
    this._setItem(this.storageKey, JSON.stringify(data));
  },

  async getUsers() {
    if (this.isServerAvailable) {
      const res = await fetch('/api/bootstrap');
      const data = await res.json();
      return data.users;
    }
    return this.getLocalData().users;
  },

  async getWarga() {
    if (this.isServerAvailable) {
      const res = await fetch('/api/warga');
      return await res.json();
    }
    return this.getLocalData().warga;
  },

  async getDonations() {
    if (this.isServerAvailable) {
      const res = await fetch('/api/donations');
      return await res.json();
    }
    const data = this.getLocalData();
    return [...data.donations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getNotifications(recipientId) {
    if (this.isServerAvailable) {
      const url = recipientId ? `/api/notifications?recipientId=${recipientId}` : '/api/notifications';
      const res = await fetch(url);
      return await res.json();
    }
    const data = this.getLocalData();
    if (recipientId) {
      return data.notifications.filter(n => n.recipientId === recipientId);
    }
    return data.notifications;
  },

  // Registrasi Akun
  async registerUser({ email, password, role, name }) {
    if (this.isServerAvailable) {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal registrasi');
      return data;
    }

    // LocalStorage mode
    const db = this.getLocalData();
    const existing = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      throw new Error('Email sudah terdaftar dalam sistem. Gunakan email lain.');
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      email: email.trim().toLowerCase(),
      password: password,
      name: name ? name.trim() : (role === 'RT/RW' ? 'Pengurus RT/RW' : 'Donatur Baru'),
      role: role,
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    this.saveLocalData(db);

    return {
      message: 'Registrasi berhasil. Silakan login menggunakan akun baru.',
      user: newUser
    };
  },

  // Login User (Otomatis mengenali peran sesuai kredensial)
  async loginUser({ email, password, role }) {
    if (this.isServerAvailable) {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Kredensial salah');
      return data.user;
    }

    // LocalStorage mode
    const db = this.getLocalData();
    const user = db.users.find(u =>
      (u.email.toLowerCase() === email.trim().toLowerCase() || u.name.toLowerCase() === email.trim().toLowerCase())
    );

    if (!user || user.password !== password) {
      throw new Error('Kredensial salah! Periksa kembali email dan password Anda.');
    }

    // Sistem mengenali peran pengguna secara otomatis (Use Case 2 langkah 5)
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  },

  // Daftarkan Warga (RT/RW)
  async addWarga(wargaData) {
    if (this.isServerAvailable) {
      const res = await fetch('/api/warga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wargaData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mendaftarkan warga');
      return data.warga;
    }

    // LocalStorage mode
    const db = this.getLocalData();
    const newWarga = {
      id: 'wrg_' + Date.now(),
      rtId: wargaData.rtId || 'usr_rt01',
      rtName: wargaData.rtName || 'Pengurus RT Wilayah',
      name: wargaData.name.trim(),
      businessType: wargaData.businessType.trim(),
      targetAmount: parseInt(wargaData.targetAmount, 10),
      collectedAmount: 0,
      nonCashItems: wargaData.nonCashItems.trim(),
      photo: wargaData.photo,
      status: 'Pending',
      adminNotes: '',
      createdAt: new Date().toISOString(),
      verifiedAt: null
    };

    db.warga.push(newWarga);
    this.saveLocalData(db);
    return newWarga;
  },

  // Verifikasi Data Warga (Admin)
  async verifyWarga(wargaId, status, adminNotes) {
    if (this.isServerAvailable) {
      const res = await fetch(`/api/warga/${wargaId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memverifikasi warga');
      return data;
    }

    // LocalStorage mode
    const db = this.getLocalData();
    const warga = db.warga.find(w => w.id === wargaId);
    if (!warga) throw new Error('Data warga tidak ditemukan');

    warga.status = status;
    warga.adminNotes = adminNotes ? adminNotes.trim() : (status === 'Terverifikasi' ? 'Telah disetujui Admin.' : 'Ditolak oleh Admin.');
    warga.verifiedAt = new Date().toISOString();

    const notif = {
      id: 'notif_' + Date.now(),
      recipientId: warga.rtId,
      title: status === 'Terverifikasi' ? 'Pengajuan Warga Disetujui' : 'Pengajuan Warga Ditolak',
      message: status === 'Terverifikasi'
        ? `Pengajuan warga "${warga.name}" (${warga.businessType}) telah DISETUJUI oleh Admin dan kini tayang di katalog donatur.`
        : `Pengajuan warga "${warga.name}" (${warga.businessType}) DITOLAK oleh Admin. Catatan: ${warga.adminNotes}`,
      type: status === 'Terverifikasi' ? 'success' : 'error',
      createdAt: new Date().toISOString(),
      isRead: false
    };
    db.notifications.unshift(notif);

    this.saveLocalData(db);
    return { warga, notification: notif };
  },

  // Transaksi Donasi (Donatur)
  async createDonation({ wargaId, donaturId, donaturName, amount, paymentMethod }) {
    if (this.isServerAvailable) {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wargaId, donaturId, donaturName, amount, paymentMethod })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memproses donasi');
      return data.donation;
    }

    // LocalStorage mode
    const db = this.getLocalData();
    const warga = db.warga.find(w => w.id === wargaId);
    if (!warga) throw new Error('Warga penerima tidak ditemukan');

    const numAmount = parseInt(amount, 10);
    const donation = {
      id: 'dns_' + Date.now(),
      donaturId: donaturId || 'usr_donatur1',
      donaturName: donaturName || 'Donatur Peduli',
      wargaId: warga.id,
      wargaName: warga.name,
      rtName: warga.rtName,
      amount: numAmount,
      paymentMethod: paymentMethod || 'QRIS',
      status: 'Berhasil',
      createdAt: new Date().toISOString()
    };

    warga.collectedAmount = (warga.collectedAmount || 0) + numAmount;
    db.donations.unshift(donation);
    this.saveLocalData(db);

    return donation;
  },

  getCurrentUser() {
    const raw = sessionStorage.getItem(this.currentUserKey);
    return raw ? JSON.parse(raw) : null;
  },

  setCurrentUser(user) {
    if (user) {
      sessionStorage.setItem(this.currentUserKey, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(this.currentUserKey);
    }
  }
};

// ================= UI CONTROLLER =================
const App = {
  activeDonationWarga: null,
  selectedPaymentMethod: 'QRIS',

  async init() {
    await StorageManager.init();
    this.bindEvents();
    this.updateAuthStatusUI();
    this.routeTo('katalog');
  },

  // Format Mata Uang Rupiah
  formatRupiah(amount) {
    return 'Rp ' + Number(amount || 0).toLocaleString('id-ID');
  },

  // Format Tanggal
  formatDate(isoString) {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Navigasi Tampilan (Routing)
  routeTo(viewName) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));

    const targetSection = document.getElementById(`view-${viewName}`);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    const activeNavBtn = document.querySelector(`.nav-link[data-view="${viewName}"]`);
    if (activeNavBtn) {
      activeNavBtn.classList.add('active');
    }

    // Tampilkan banner hero hanya pada halaman katalog (beranda)
    const heroEl = document.querySelector('.hero');
    if (heroEl) {
      heroEl.style.display = (viewName === 'katalog' ? 'block' : 'none');
    }

    // Scroll ke atas agar tampilan baru langsung terlihat jelas
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Panggil loader view terkait
    if (viewName === 'katalog') this.loadKatalogWarga();
    if (viewName === 'rt-dashboard') this.loadRtDashboard();
    if (viewName === 'admin-verify') this.loadAdminVerify();
    if (viewName === 'donatur-dashboard') this.loadDonaturDashboard();
    if (viewName === 'admin-history') this.loadAdminHistory();
    if (viewName === 'auth') {
      this.clearAuthForms();
    }
  },

  // Event Listeners
  bindEvents() {
    // Navigasi menu
    document.querySelectorAll('.nav-link').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = btn.getAttribute('data-view');
        if (view) this.routeTo(view);
      });
    });

    // Logo brand klik kembali ke katalog
    document.getElementById('brandLogo').addEventListener('click', () => {
      this.routeTo('katalog');
    });

    // Tab Auth (Login vs Register)
    document.querySelectorAll('.auth-tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab-btn').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.getAttribute('data-target');
        if (target === 'login') {
          document.getElementById('formLoginContainer').style.display = 'block';
          document.getElementById('formRegisterContainer').style.display = 'none';
        } else {
          document.getElementById('formLoginContainer').style.display = 'none';
          document.getElementById('formRegisterContainer').style.display = 'block';
        }
      });
    });

    // Tombol Demo Credential Autofill & Masuk Langsung
    document.querySelectorAll('.demo-btn-fill').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = btn.getAttribute('data-email');
        const pass = btn.getAttribute('data-pass');
        const role = btn.getAttribute('data-role');

        const emailEl = document.getElementById('loginEmail');
        const passEl = document.getElementById('loginPassword');
        if (emailEl) emailEl.value = email;
        if (passEl) passEl.value = pass;
        const roleRadio = document.querySelector(`input[name="loginRole"][value="${role}"]`);
        if (roleRadio) roleRadio.checked = true;

        // Eksekusi login instan untuk kenyamanan pengujian
        await App.handleLogin();
      });
    });

    // Otomatis deteksi peran saat pengguna mengetik email
    const loginEmailInput = document.getElementById('loginEmail');
    if (loginEmailInput) {
      loginEmailInput.addEventListener('input', () => {
        const val = loginEmailInput.value.toLowerCase().trim();
        let matchedRole = null;
        if (val.includes('admin')) matchedRole = 'Admin';
        else if (val.includes('rt') || val.includes('rw') || val.includes('kelurahan')) matchedRole = 'RT/RW';
        else if (val.includes('donatur') || val.includes('budi') || val.includes('siti')) matchedRole = 'Donatur';

        if (matchedRole) {
          const radio = document.querySelector(`input[name="loginRole"][value="${matchedRole}"]`);
          if (radio) radio.checked = true;
        }
      });
    }

    // Form Login Submit
    document.getElementById('formLogin').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleLogin();
    });

    // Form Register Submit
    document.getElementById('formRegister').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleRegister();
    });

    // Tombol Logout
    document.getElementById('btnLogout').addEventListener('click', () => {
      this.handleLogout();
    });

    // Form Daftarkan Warga (RT/RW)
    document.getElementById('formDaftarWarga').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleDaftarWarga();
    });

    // Preview Foto Usaha
    const fotoInput = document.getElementById('wargaFotoFile');
    fotoInput.addEventListener('change', () => {
      const file = fotoInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          document.getElementById('wargaFotoPreview').src = e.target.result;
          document.getElementById('wargaFotoPreviewContainer').style.display = 'block';
          document.getElementById('wargaFotoUrl').value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // Preset Foto Cepat
    document.querySelectorAll('.btn-preset-photo').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-url');
        document.getElementById('wargaFotoUrl').value = url;
        document.getElementById('wargaFotoPreview').src = url;
        document.getElementById('wargaFotoPreviewContainer').style.display = 'block';
      });
    });

    // Modal Donasi: Pilih Nominal Cepat
    document.querySelectorAll('.btn-nominal').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-nominal').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const val = btn.getAttribute('data-amount');
        document.getElementById('donasiNominalInput').value = val;
      });
    });

    // Form Donasi: Langkah Pembayaran
    document.getElementById('btnLanjutPembayaran').addEventListener('click', () => {
      this.handleLanjutPembayaran();
    });

    // Pemilihan metode pembayaran (QRIS vs Transfer)
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
      radio.addEventListener('change', () => {
        this.selectedPaymentMethod = radio.value;
        this.updatePaymentDetailsDisplay();
      });
    });

    // Tombol Selesaikan Pembayaran Donasi
    document.getElementById('btnKonfirmasiBayar').addEventListener('click', async () => {
      await this.handleKonfirmasiBayar();
    });

    // Tombol Tutup Modal
    document.querySelectorAll('.modal-close, .btn-modal-cancel').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeDonationModal();
      });
    });
  },

  // Update Status Header Navigasi berdasarkan User yang Login
  updateAuthStatusUI() {
    const user = StorageManager.getCurrentUser();
    const navAuth = document.getElementById('navAuth');
    const userBadgeContainer = document.getElementById('userBadgeContainer');
    const navDaftarWarga = document.getElementById('navDaftarWarga');
    const navAdminVerify = document.getElementById('navAdminVerify');
    const navRtDashboard = document.getElementById('navRtDashboard');
    const navDonaturDashboard = document.getElementById('navDonaturDashboard');
    const navAdminHistory = document.getElementById('navAdminHistory');

    // Default sembunyikan menu khusus peran
    navDaftarWarga.style.display = 'none';
    navAdminVerify.style.display = 'none';
    navRtDashboard.style.display = 'none';
    navDonaturDashboard.style.display = 'none';
    navAdminHistory.style.display = 'none';

    if (user) {
      navAuth.style.display = 'none';
      userBadgeContainer.style.display = 'flex';

      const roleBadge = document.getElementById('userRoleBadge');
      const userName = document.getElementById('userDisplayName');
      userName.textContent = user.name;
      roleBadge.textContent = user.role;

      roleBadge.className = 'user-badge';
      if (user.role === 'Admin') {
        roleBadge.classList.add('badge-admin');
        navAdminVerify.style.display = 'inline-flex';
        navAdminHistory.style.display = 'inline-flex';
      } else if (user.role === 'RT/RW') {
        roleBadge.classList.add('badge-rt');
        navDaftarWarga.style.display = 'inline-flex';
        navRtDashboard.style.display = 'inline-flex';
      } else if (user.role === 'Donatur') {
        roleBadge.classList.add('badge-donatur');
        navDonaturDashboard.style.display = 'inline-flex';
      }
    } else {
      navAuth.style.display = 'inline-flex';
      userBadgeContainer.style.display = 'none';
    }
  },

  clearAuthForms() {
    document.getElementById('loginAlert').style.display = 'none';
    document.getElementById('registerAlert').style.display = 'none';
  },

  // ================= 1. MODUL MANAJEMEN AKUN =================
  // Handler Registrasi Akun (Use Case 1)
  async handleRegister() {
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const name = document.getElementById('regName').value.trim();
    const roleRadio = document.querySelector('input[name="regRole"]:checked');
    const alertBox = document.getElementById('registerAlert');

    alertBox.style.display = 'none';

    if (!email || !password || !roleRadio) {
      alertBox.className = 'alert alert-error';
      alertBox.textContent = 'Data registrasi tidak lengkap! Silakan isi nama, email, password, dan pilih peran.';
      alertBox.style.display = 'block';
      return;
    }

    const role = roleRadio.value;

    try {
      const res = await StorageManager.registerUser({ email, password, role, name });
      alertBox.className = 'alert alert-success';
      alertBox.textContent = `✅ Registrasi berhasil untuk peran ${role}! Otomatis masuk ke sistem...`;
      alertBox.style.display = 'block';

      // Otomatis login dengan akun yang baru didaftarkan
      const user = await StorageManager.loginUser({ email, password, role });
      StorageManager.setCurrentUser(user);
      this.updateAuthStatusUI();

      document.getElementById('formRegister').reset();

      setTimeout(() => {
        if (user.role === 'RT/RW') {
          this.routeTo('rt-dashboard');
        } else {
          this.routeTo('katalog');
        }
      }, 1000);
    } catch (err) {
      alertBox.className = 'alert alert-error';
      alertBox.textContent = '❌ Gagal Registrasi: ' + err.message;
      alertBox.style.display = 'block';
    }
  },

  // Handler Login (Use Case 2)
  async handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const roleRadio = document.querySelector('input[name="loginRole"]:checked');
    const alertBox = document.getElementById('loginAlert');

    alertBox.style.display = 'none';

    if (!email || !password) {
      alertBox.className = 'alert alert-error';
      alertBox.textContent = 'Email/username dan password wajib diisi.';
      alertBox.style.display = 'block';
      return;
    }

    const role = roleRadio ? roleRadio.value : null;

    try {
      const user = await StorageManager.loginUser({ email, password, role });
      StorageManager.setCurrentUser(user);
      this.updateAuthStatusUI();

      alertBox.className = 'alert alert-success';
      alertBox.textContent = `✅ Login berhasil sebagai ${user.role} (${user.name})! Mengarahkan ke dashboard...`;
      alertBox.style.display = 'block';

      setTimeout(() => {
        // Redirect berbasis peran (Role-based redirect)
        if (user.role === 'Admin') {
          this.routeTo('admin-verify');
        } else if (user.role === 'RT/RW') {
          this.routeTo('rt-dashboard');
        } else if (user.role === 'Donatur') {
          this.routeTo('donatur-dashboard');
        } else {
          this.routeTo('katalog');
        }
      }, 600);
    } catch (err) {
      alertBox.className = 'alert alert-error';
      alertBox.textContent = '❌ ' + err.message;
      alertBox.style.display = 'block';
    }
  },

  handleLogout() {
    StorageManager.setCurrentUser(null);
    this.updateAuthStatusUI();
    this.routeTo('katalog');
  },

  // ================= 2. MODUL PENDATAAN & VERIFIKASI WARGA =================
  // Handler Daftar Warga Baru (Use Case 3 - RT/RW)
  async handleDaftarWarga() {
    const user = StorageManager.getCurrentUser();
    if (!user || user.role !== 'RT/RW') {
      alert('Akses khusus pengurus RT/RW yang telah login.');
      this.routeTo('auth');
      return;
    }

    const name = document.getElementById('wargaNama').value.trim();
    const businessType = document.getElementById('wargaUsaha').value.trim();
    const targetAmount = document.getElementById('wargaTarget').value;
    const nonCashItems = document.getElementById('wargaBarang').value.trim();
    const photo = document.getElementById('wargaFotoUrl').value.trim();
    const alertBox = document.getElementById('daftarWargaAlert');

    alertBox.style.display = 'none';

    // Validasi Form Wajib Lengkap
    if (!name || !businessType || !targetAmount || !nonCashItems || !photo) {
      alertBox.className = 'alert alert-error';
      alertBox.textContent = 'Data tidak lengkap! Semua kolom (nama, jenis usaha, kebutuhan modal, rincian barang non-tunai, dan foto usaha) wajib diisi.';
      alertBox.style.display = 'block';
      return;
    }

    try {
      const newWarga = await StorageManager.addWarga({
        name,
        businessType,
        targetAmount,
        nonCashItems,
        photo,
        rtId: user.id,
        rtName: user.name
      });

      alertBox.className = 'alert alert-success';
      alertBox.textContent = `Data warga "${newWarga.name}" berhasil diajukan dengan status PENDING dan masuk ke antrean verifikasi Admin!`;
      alertBox.style.display = 'block';

      document.getElementById('formDaftarWarga').reset();
      document.getElementById('wargaFotoPreviewContainer').style.display = 'none';
      document.getElementById('wargaFotoUrl').value = '';

      // Tampilkan notifikasi dan alihkan ke dashboard RT/RW
      setTimeout(() => {
        this.routeTo('rt-dashboard');
      }, 1500);
    } catch (err) {
      alertBox.className = 'alert alert-error';
      alertBox.textContent = err.message;
      alertBox.style.display = 'block';
    }
  },

  // Loader Halaman Verifikasi Warga (Use Case 4 - Admin)
  async loadAdminVerify() {
    const user = StorageManager.getCurrentUser();
    if (!user || user.role !== 'Admin') {
      alert('Hanya Admin yang berwenang mengakses halaman verifikasi data warga.');
      this.routeTo('auth');
      return;
    }

    const wargaList = await StorageManager.getWarga();
    const pendingWarga = wargaList.filter(w => w.status === 'Pending');
    const container = document.getElementById('adminPendingWargaContainer');
    const countBadge = document.getElementById('pendingCountBadge');

    countBadge.textContent = `${pendingWarga.length} Menunggu`;

    if (pendingWarga.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">✅</div>
          <h3>Tidak Ada Antrean Verifikasi</h3>
          <p>Seluruh data warga yang didaftarkan oleh RT/RW telah diverifikasi.</p>
        </div>
      `;
      return;
    }

    let html = '';
    pendingWarga.forEach(w => {
      html += `
        <div class="card" style="margin-bottom: 20px;">
          <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <div style="width: 220px; height: 160px; border-radius: 8px; overflow: hidden; background: #e2e8f0; flex-shrink: 0;">
              <img src="${w.photo}" alt="${w.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="flex: 1; min-width: 260px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
                <h3 style="font-size: 1.2rem; font-weight: 700;">${w.name}</h3>
                <span class="warga-badge status-pending">Status: Pending</span>
              </div>
              <div style="font-size: 0.9rem; color: var(--secondary); font-weight: 600; margin-bottom: 6px;">
                Usaha: ${w.businessType}
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px;">
                Diajukan oleh: <strong>${w.rtName}</strong> • Tanggal: ${this.formatDate(w.createdAt)}
              </div>
              <div class="non-cash-box" style="margin-bottom: 12px;">
                <div class="non-cash-title">📦 Rincian Pengadaan Kebutuhan Usaha Non-Tunai:</div>
                ${w.nonCashItems}
              </div>
              <div style="font-size: 1.05rem; font-weight: 800; color: var(--primary); margin-bottom: 16px;">
                Kebutuhan Modal: ${this.formatRupiah(w.targetAmount)}
              </div>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="btn btn-success btn-sm" onclick="App.handleVerifyWarga('${w.id}', 'Terverifikasi')">
                  ✅ Setujui & Terbitkan
                </button>
                <button class="btn btn-danger btn-sm" onclick="App.handleVerifyWarga('${w.id}', 'Ditolak')">
                  ❌ Tolak Pengajuan
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  },

  // Eksekusi Setujui / Tolak Warga oleh Admin
  async handleVerifyWarga(wargaId, status) {
    let reason = '';
    if (status === 'Ditolak') {
      reason = prompt('Masukkan alasan penolakan untuk diinformasikan kepada RT/RW:', 'Dokumen pendukung atau kondisi usaha belum memenuhi kriteria modal produktif.');
      if (reason === null) return; // Batal jika user klik cancel
    }

    try {
      const res = await StorageManager.verifyWarga(wargaId, status, reason);
      alert(`Warga berhasil di-${status.toUpperCase()}. Notifikasi telah dikirimkan ke pengurus RT/RW.`);
      this.loadAdminVerify();
    } catch (err) {
      alert('Gagal memverifikasi data: ' + err.message);
    }
  },

  // ================= 3. MODUL DONASI =================
  // Loader Katalog Warga Terverifikasi untuk Donatur & Publik
  async loadKatalogWarga() {
    const wargaList = await StorageManager.getWarga();
    const verifiedWarga = wargaList.filter(w => w.status === 'Terverifikasi');
    const container = document.getElementById('katalogWargaGrid');
    const statsTotalDonasi = document.getElementById('statTotalDonasiTerkumpul');
    const statsUmkmTerbantu = document.getElementById('statUmkmTerbantu');

    // Hitung total terkumpul dan UMKM
    let totalAll = 0;
    verifiedWarga.forEach(w => totalAll += (w.collectedAmount || 0));
    if (statsTotalDonasi) statsTotalDonasi.textContent = this.formatRupiah(totalAll);
    if (statsUmkmTerbantu) statsUmkmTerbantu.textContent = `${verifiedWarga.length} Keluarga`;

    if (verifiedWarga.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <div class="empty-icon">🏪</div>
          <h3>Belum Ada Warga Terverifikasi</h3>
          <p>Saat ini belum ada pengajuan warga yang disetujui untuk penggalangan donasi modal usaha.</p>
        </div>
      `;
      return;
    }

    let html = '';
    verifiedWarga.forEach(w => {
      const percent = Math.min(100, Math.round((w.collectedAmount / w.targetAmount) * 100));
      const isComplete = w.collectedAmount >= w.targetAmount;

      html += `
        <div class="warga-card">
          <div class="warga-img-wrapper">
            <img src="${w.photo}" alt="${w.name}" class="warga-img">
            <span class="warga-badge status-terverifikasi">Terverifikasi</span>
          </div>
          <div class="warga-body">
            <h3 class="warga-name">${w.name}</h3>
            <div class="warga-business">${w.businessType}</div>
            <div class="warga-rt">📍 ${w.rtName}</div>

            <div class="non-cash-box">
              <div class="non-cash-title">🎁 Bantuan Non-Tunai Langsung:</div>
              ${w.nonCashItems}
            </div>

            <div class="progress-section">
              <div class="progress-labels">
                <span class="progress-collected">${this.formatRupiah(w.collectedAmount)}</span>
                <span class="progress-target">Target: ${this.formatRupiah(w.targetAmount)}</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" style="width: ${percent}%;"></div>
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted); text-align: right; margin-top: 4px;">
                ${percent}% Terkumpul ${isComplete ? '• 🎉 Target Tercapai!' : ''}
              </div>
            </div>

            <button class="btn ${isComplete ? 'btn-secondary' : 'btn-primary'} btn-full" 
                    onclick="App.openDonationModal('${w.id}')"
                    ${isComplete ? 'disabled title="Target modal sudah tercapai"' : ''}>
              ${isComplete ? 'Target Modal Tercapai (Penyaluran)' : 'Bantu Modal Usaha (Mulai Rp 10.000)'}
            </button>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  },

  // Buka Modal Donasi Mikro
  async openDonationModal(wargaId) {
    const user = StorageManager.getCurrentUser();
    if (!user) {
      alert('Silakan login terlebih dahulu sebagai Donatur untuk melakukan donasi.');
      this.routeTo('auth');
      return;
    }

    const wargaList = await StorageManager.getWarga();
    const warga = wargaList.find(w => w.id === wargaId);
    if (!warga) return;

    this.activeDonationWarga = warga;
    document.getElementById('modalWargaName').textContent = warga.name;
    document.getElementById('modalWargaBusiness').textContent = warga.businessType;
    document.getElementById('modalWargaTarget').textContent = this.formatRupiah(warga.targetAmount);
    document.getElementById('modalWargaCollected').textContent = this.formatRupiah(warga.collectedAmount);
    document.getElementById('modalWargaNonCash').textContent = warga.nonCashItems;

    // Reset step
    document.getElementById('donasiStep1').style.display = 'block';
    document.getElementById('donasiStep2').style.display = 'none';
    document.getElementById('donasiAlert').style.display = 'none';
    document.getElementById('donasiNominalInput').value = '25000';

    document.querySelectorAll('.btn-nominal').forEach(b => b.classList.remove('active'));
    const defBtn = document.querySelector('.btn-nominal[data-amount="25000"]');
    if (defBtn) defBtn.classList.add('active');

    document.getElementById('modalDonasi').classList.add('active');
  },

  closeDonationModal() {
    document.getElementById('modalDonasi').classList.remove('active');
    this.activeDonationWarga = null;
  },

  // Langkah Menuju Pemilihan Metode Pembayaran
  handleLanjutPembayaran() {
    const rawVal = document.getElementById('donasiNominalInput').value;
    const nominal = parseInt(rawVal, 10);
    const alertBox = document.getElementById('donasiAlert');
    alertBox.style.display = 'none';

    // Validasi ketat nominal mikro: harus > 0 (Test Case 10)
    if (isNaN(nominal) || nominal <= 0) {
      alertBox.className = 'alert alert-error';
      alertBox.textContent = 'Nominal donasi tidak valid! Harap masukkan nominal angka yang lebih besar dari 0.';
      alertBox.style.display = 'block';
      return;
    }

    document.getElementById('paySummaryNominal').textContent = this.formatRupiah(nominal);
    this.updatePaymentDetailsDisplay();

    document.getElementById('donasiStep1').style.display = 'none';
    document.getElementById('donasiStep2').style.display = 'block';
  },

  // Tampilkan visual QRIS dinamis atau Rekening Transfer
  updatePaymentDetailsDisplay() {
    const nominal = parseInt(document.getElementById('donasiNominalInput').value, 10) || 25000;
    const qrisBox = document.getElementById('paymentMethodQrisBox');
    const transferBox = document.getElementById('paymentMethodTransferBox');

    if (this.selectedPaymentMethod === 'QRIS') {
      qrisBox.style.display = 'block';
      transferBox.style.display = 'none';

      // Buat SVG dynamic QRIS code yang valid & visual
      const qrContainer = document.getElementById('qrisCodeWrapper');
      qrContainer.innerHTML = `
        <svg viewBox="0 0 100 100" style="width: 170px; height: 170px; display: block; margin: 0 auto;">
          <rect width="100" height="100" fill="#ffffff" />
          <!-- Corner Finders -->
          <rect x="5" y="5" width="26" height="26" fill="#0f172a" />
          <rect x="9" y="9" width="18" height="18" fill="#ffffff" />
          <rect x="13" y="13" width="10" height="10" fill="#0f172a" />

          <rect x="69" y="5" width="26" height="26" fill="#0f172a" />
          <rect x="73" y="9" width="18" height="18" fill="#ffffff" />
          <rect x="77" y="13" width="10" height="10" fill="#0f172a" />

          <rect x="5" y="69" width="26" height="26" fill="#0f172a" />
          <rect x="9" y="73" width="18" height="18" fill="#ffffff" />
          <rect x="13" y="77" width="10" height="10" fill="#0f172a" />

          <!-- Dynamic payload barcode patterns -->
          <rect x="36" y="8" width="8" height="8" fill="#0f172a" />
          <rect x="48" y="8" width="12" height="8" fill="#0f172a" />
          <rect x="36" y="20" width="14" height="8" fill="#0f172a" />
          <rect x="54" y="20" width="8" height="8" fill="#0f172a" />

          <rect x="8" y="36" width="12" height="12" fill="#0f172a" />
          <rect x="24" y="36" width="8" height="20" fill="#0f172a" />
          <rect x="36" y="36" width="28" height="28" fill="#059669" />
          <rect x="40" y="40" width="20" height="20" fill="#ffffff" />
          <text x="50" y="53" font-size="8" font-weight="bold" fill="#059669" text-anchor="middle">QRIS</text>

          <rect x="68" y="36" width="16" height="12" fill="#0f172a" />
          <rect x="88" y="36" width="6" height="24" fill="#0f172a" />
          <rect x="68" y="52" width="16" height="8" fill="#0f172a" />

          <rect x="36" y="68" width="12" height="14" fill="#0f172a" />
          <rect x="52" y="68" width="20" height="8" fill="#0f172a" />
          <rect x="40" y="86" width="16" height="8" fill="#0f172a" />
          <rect x="60" y="80" width="12" height="14" fill="#0f172a" />
          <rect x="76" y="72" width="18" height="22" fill="#0f172a" />
        </svg>
        <div style="font-weight: 700; color: #0f172a; margin-top: 8px;">NMID: ID1020304050607</div>
        <div style="font-size: 0.75rem; color: #64748b;">A/N: CELENGAN MIKRO NON-TUNAI</div>
      `;
    } else {
      qrisBox.style.display = 'none';
      transferBox.style.display = 'block';
    }
  },

  // Konfirmasi Penyelesaian Pembayaran Donasi (Use Case 6 - Donasi)
  async handleKonfirmasiBayar() {
    const user = StorageManager.getCurrentUser();
    if (!user) {
      alert('Sesi login telah berakhir. Silakan login kembali.');
      this.closeDonationModal();
      this.routeTo('auth');
      return;
    }

    const warga = this.activeDonationWarga;
    if (!warga) return;

    const amount = parseInt(document.getElementById('donasiNominalInput').value, 10);
    const method = this.selectedPaymentMethod;

    try {
      const donation = await StorageManager.createDonation({
        wargaId: warga.id,
        donaturId: user.id,
        donaturName: user.name,
        amount: amount,
        paymentMethod: method
      });

      alert(`Alhamdulillah, donasi sebesar ${this.formatRupiah(amount)} via ${method} berhasil disalurkan!\n\nDana akan digunakan untuk pengadaan barang produktif non-tunai: "${warga.nonCashItems}". Terima kasih atas kebaikan Anda!`);

      this.closeDonationModal();
      // Muat ulang katalog dan jika user donatur arahkan ke dashboard riwayat donatur
      await this.loadKatalogWarga();
      if (user.role === 'Donatur') {
        this.routeTo('donatur-dashboard');
      }
    } catch (err) {
      alert('Gagal memproses donasi: ' + err.message);
    }
  },

  // ================= 4. MODUL DASHBOARD & TRANSPARANSI =================
  // Dashboard RT/RW (Use Case 5)
  async loadRtDashboard() {
    const user = StorageManager.getCurrentUser();
    if (!user || user.role !== 'RT/RW') {
      alert('Akses khusus pengurus RT/RW.');
      this.routeTo('auth');
      return;
    }

    document.getElementById('rtDashboardTitle').textContent = `Dashboard Pemantauan - ${user.name}`;

    const [wargaList, notifList] = await Promise.all([
      StorageManager.getWarga(),
      StorageManager.getNotifications(user.id)
    ]);

    // Filter warga binaan RT yang sedang login
    const wargaBinaan = wargaList.filter(w => w.rtId === user.id || w.rtName === user.name);

    // Hitung ringkasan statistik
    let totalTarget = 0;
    let totalCollected = 0;
    let verifiedCount = 0;
    let pendingCount = 0;

    wargaBinaan.forEach(w => {
      totalTarget += w.targetAmount;
      totalCollected += (w.collectedAmount || 0);
      if (w.status === 'Terverifikasi') verifiedCount++;
      if (w.status === 'Pending') pendingCount++;
    });

    document.getElementById('statRtTotalWarga').textContent = `${wargaBinaan.length} Orang`;
    document.getElementById('statRtTotalTerkumpul').textContent = this.formatRupiah(totalCollected);
    document.getElementById('statRtVerifCount').textContent = `${verifiedCount} Terverifikasi (${pendingCount} Pending)`;

    // Render Tabel Progres Warga Binaan
    const tbody = document.getElementById('rtWargaTableBody');
    if (wargaBinaan.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 30px; color: var(--text-muted);">
            Belum ada warga yang didaftarkan oleh wilayah Anda. Silakan klik menu "Daftarkan Warga Baru".
          </td>
        </tr>
      `;
    } else {
      let rows = '';
      wargaBinaan.forEach((w, idx) => {
        const percent = Math.min(100, Math.round(((w.collectedAmount || 0) / w.targetAmount) * 100));
        let badgeClass = 'status-pending';
        if (w.status === 'Terverifikasi') badgeClass = 'status-terverifikasi';
        if (w.status === 'Ditolak') badgeClass = 'status-ditolak';

        rows += `
          <tr>
            <td>${idx + 1}</td>
            <td>
              <strong>${w.name}</strong>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${w.businessType}</div>
            </td>
            <td>
              <span class="warga-badge ${badgeClass}">${w.status}</span>
            </td>
            <td>
              <div><strong>${this.formatRupiah(w.collectedAmount)}</strong> / ${this.formatRupiah(w.targetAmount)}</div>
              <div class="progress-track" style="height: 6px; margin-top: 4px;">
                <div class="progress-fill" style="width: ${percent}%;"></div>
              </div>
              <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">${percent}% tercapai</div>
            </td>
            <td>
              <div style="font-size: 0.75rem; max-width: 280px; color: #475569;">
                ${w.nonCashItems}
              </div>
            </td>
            <td>
              <div style="font-size: 0.75rem; color: ${w.status === 'Ditolak' ? 'var(--danger)' : 'var(--text-muted)'};">
                ${w.adminNotes || (w.status === 'Pending' ? 'Menunggu peninjauan Admin' : 'Siap belanja barang usaha')}
              </div>
            </td>
          </tr>
        `;
      });
      tbody.innerHTML = rows;
    }

    // Render Notifikasi dari Admin
    const notifContainer = document.getElementById('rtNotifList');
    if (notifList.length === 0) {
      notifContainer.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted);">Tidak ada notifikasi baru dari Admin.</p>`;
    } else {
      let notifHtml = '';
      notifList.forEach(n => {
        notifHtml += `
          <div class="alert ${n.type === 'success' ? 'alert-success' : 'alert-error'}" style="margin-bottom: 8px;">
            <div>
              <strong>${n.title}</strong> • <span style="font-size: 0.75rem;">${this.formatDate(n.createdAt)}</span>
              <div style="margin-top: 2px;">${n.message}</div>
            </div>
          </div>
        `;
      });
      notifContainer.innerHTML = notifHtml;
    }
  },

  // Dashboard Riwayat Donasi (Use Case 7 - Donatur)
  async loadDonaturDashboard() {
    const user = StorageManager.getCurrentUser();
    if (!user || user.role !== 'Donatur') {
      alert('Akses khusus Donatur.');
      this.routeTo('auth');
      return;
    }

    document.getElementById('donaturDashboardTitle').textContent = `Riwayat Donasi Saya - ${user.name}`;

    const [allDonations, wargaList] = await Promise.all([
      StorageManager.getDonations(),
      StorageManager.getWarga()
    ]);

    // Filter donasi milik user ini
    const myDonations = allDonations.filter(d => d.donaturId === user.id || d.donaturName === user.name);

    let totalMyDonasi = 0;
    myDonations.forEach(d => totalMyDonasi += d.amount);

    document.getElementById('statDonaturTotalNominal').textContent = this.formatRupiah(totalMyDonasi);
    document.getElementById('statDonaturTotalTransaksi').textContent = `${myDonations.length} Kali`;

    const container = document.getElementById('donaturHistoryContainer');
    if (myDonations.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🤝</div>
          <h3>Belum Ada Riwayat Donasi</h3>
          <p>Anda belum pernah berdonasi. Mari bantu modal usaha keluarga rentan melalui katalog usaha kami.</p>
          <button class="btn btn-primary" style="margin-top: 14px;" onclick="App.routeTo('katalog')">
            Jelajahi Katalog Warga
          </button>
        </div>
      `;
      return;
    }

    let rows = '';
    myDonations.forEach((d, idx) => {
      const warga = wargaList.find(w => w.id === d.wargaId) || {};
      const percent = warga.targetAmount ? Math.min(100, Math.round(((warga.collectedAmount || 0) / warga.targetAmount) * 100)) : 100;
      const isComplete = (warga.collectedAmount || 0) >= (warga.targetAmount || 1);

      const statusPenyaluran = isComplete
        ? '<span style="color: #059669; font-weight: 700;">✅ Target 100% Tercapai - Pengadaan Alat Usaha Non-Tunai Berlangsung</span>'
        : `<span style="color: #0284c7; font-weight: 600;">🔄 Penggalangan Aktif (${percent}% terkumpul)</span>`;

      rows += `
        <tr>
          <td>${idx + 1}</td>
          <td>${this.formatDate(d.createdAt)}</td>
          <td>
            <strong>${d.wargaName}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${d.rtName || '-'}</div>
          </td>
          <td><strong>${this.formatRupiah(d.amount)}</strong></td>
          <td><span class="user-badge badge-rt">${d.paymentMethod}</span></td>
          <td>${statusPenyaluran}</td>
        </tr>
      `;
    });

    container.innerHTML = `
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Warga Penerima</th>
              <th>Nominal Donasi</th>
              <th>Metode Pembayaran</th>
              <th>Status Penyaluran Non-Tunai</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  },

  // History Donasi Menyeluruh (Use Case 8 - Admin)
  async loadAdminHistory() {
    const user = StorageManager.getCurrentUser();
    if (!user || user.role !== 'Admin') {
      alert('Hanya Admin yang berwenang mengakses seluruh riwayat donasi.');
      this.routeTo('auth');
      return;
    }

    const donations = await StorageManager.getDonations();

    let totalAmount = 0;
    donations.forEach(d => totalAmount += d.amount);

    document.getElementById('statAdminTotalDonasi').textContent = this.formatRupiah(totalAmount);
    document.getElementById('statAdminTotalTransaksi').textContent = `${donations.length} Transaksi`;

    const container = document.getElementById('adminHistoryTableBody');
    if (donations.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 30px; color: var(--text-muted);">
            Belum ada data transaksi donasi dalam sistem.
          </td>
        </tr>
      `;
      return;
    }

    let rows = '';
    donations.forEach((d, idx) => {
      rows += `
        <tr>
          <td>${idx + 1}</td>
          <td><code>${d.id}</code></td>
          <td>${this.formatDate(d.createdAt)}</td>
          <td><strong>${d.donaturName}</strong></td>
          <td>
            <div>${d.wargaName}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${d.rtName || '-'}</div>
          </td>
          <td><strong style="color: var(--primary);">${this.formatRupiah(d.amount)}</strong></td>
          <td><span class="user-badge badge-rt">${d.paymentMethod}</span></td>
        </tr>
      `;
    });
    container.innerHTML = rows;
  }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
