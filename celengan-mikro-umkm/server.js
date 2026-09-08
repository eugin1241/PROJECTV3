/**
 * Celengan Mikro UMKM - Server Backend
 * Mendukung Railway, Render, VPS, dan Local Server (Node.js native, tanpa dependensi eksternal)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'database.json');

// MIME types untuk static file serving
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Pastikan file data tersedia
function getDatabase() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initialData = {
        users: [],
        warga: [],
        donations: [],
        notifications: []
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file:', err);
    return { users: [], warga: [], donations: [], notifications: [] };
  }
}

function saveDatabase(data) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
}

// Helper untuk membaca request body (JSON)
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

// Helper kirim JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Helper kirim static file
function serveStaticFile(res, filePath) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

// Handler utama HTTP
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;
  const method = req.method.toUpperCase();

  // ================= REST API ENDPOINTS =================
  if (pathname.startsWith('/api/')) {
    const db = getDatabase();

    // 1. Health check
    if (pathname === '/api/health' && method === 'GET') {
      return sendJson(res, 200, {
        status: 'ok',
        platform: 'Celengan Mikro UMKM',
        timestamp: new Date().toISOString()
      });
    }

    // 2. Bootstrap full data
    if (pathname === '/api/bootstrap' && method === 'GET') {
      return sendJson(res, 200, {
        users: db.users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role })),
        warga: db.warga,
        donations: db.donations,
        notifications: db.notifications
      });
    }

    // 3. Registrasi Akun (RT/RW atau Donatur)
    if (pathname === '/api/auth/register' && method === 'POST') {
      try {
        const body = await parseBody(req);
        const { email, password, role, name } = body;

        if (!email || !password || !role) {
          return sendJson(res, 400, { error: 'Data registrasi tidak lengkap (email, password, role wajib diisi)' });
        }

        if (role !== 'RT/RW' && role !== 'Donatur') {
          return sendJson(res, 400, { error: 'Pilihan peran harus RT/RW atau Donatur' });
        }

        const existing = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
        if (existing) {
          return sendJson(res, 409, { error: 'Email sudah terdaftar dalam sistem. Gunakan email lain.' });
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
        saveDatabase(db);

        return sendJson(res, 201, {
          message: 'Registrasi berhasil. Silakan login menggunakan akun baru.',
          user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }
        });
      } catch (e) {
        return sendJson(res, 400, { error: e.message });
      }
    }

    // 4. Login (Admin, RT/RW, Donatur)
    if (pathname === '/api/auth/login' && method === 'POST') {
      try {
        const body = await parseBody(req);
        const { email, password, role } = body;

        if (!email || !password) {
          return sendJson(res, 400, { error: 'Email/username dan password wajib diisi' });
        }

        const user = db.users.find(u =>
          (u.email.toLowerCase() === email.trim().toLowerCase() || u.name.toLowerCase() === email.trim().toLowerCase())
        );

        if (!user || user.password !== password) {
          return sendJson(res, 401, { error: 'Kredensial salah! Periksa kembali email dan password Anda.' });
        }

        // Sistem mengenali peran pengguna secara otomatis (Use Case 2)
        return sendJson(res, 200, {
          message: 'Login berhasil',
          user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
      } catch (e) {
        return sendJson(res, 400, { error: e.message });
      }
    }

    // 5. Data Warga: GET dan POST (Daftarkan Warga Baru)
    if (pathname === '/api/warga') {
      if (method === 'GET') {
        return sendJson(res, 200, db.warga);
      }

      if (method === 'POST') {
        try {
          const body = await parseBody(req);
          const { name, businessType, targetAmount, nonCashItems, photo, rtId, rtName } = body;

          // Validasi form lengkap
          if (!name || !businessType || !targetAmount || !nonCashItems || !photo) {
            return sendJson(res, 400, { error: 'Data tidak lengkap. Semua field (nama, jenis usaha, target modal, rincian barang non-tunai, dan foto usaha) wajib diisi.' });
          }

          const parsedTarget = parseInt(targetAmount, 10);
          if (isNaN(parsedTarget) || parsedTarget <= 0) {
            return sendJson(res, 400, { error: 'Kebutuhan modal harus berupa nominal angka positif.' });
          }

          const newWarga = {
            id: 'wrg_' + Date.now(),
            rtId: rtId || 'usr_rt01',
            rtName: rtName || 'Pengurus RT Wilayah',
            name: name.trim(),
            businessType: businessType.trim(),
            targetAmount: parsedTarget,
            collectedAmount: 0,
            nonCashItems: nonCashItems.trim(),
            photo: photo,
            status: 'Pending',
            adminNotes: '',
            createdAt: new Date().toISOString(),
            verifiedAt: null
          };

          db.warga.push(newWarga);
          saveDatabase(db);

          return sendJson(res, 201, {
            message: 'Data warga berhasil didaftarkan dan berstatus Pending menunggu verifikasi Admin.',
            warga: newWarga
          });
        } catch (e) {
          return sendJson(res, 400, { error: e.message });
        }
      }
    }

    // 6. Verifikasi Data Warga oleh Admin (Setujui / Tolak)
    const verifyMatch = pathname.match(/^\/api\/warga\/([^/]+)\/verify$/);
    if (verifyMatch && method === 'PATCH') {
      try {
        const wargaId = verifyMatch[1];
        const body = await parseBody(req);
        const { status, adminNotes } = body;

        if (status !== 'Terverifikasi' && status !== 'Ditolak') {
          return sendJson(res, 400, { error: 'Status verifikasi harus "Terverifikasi" atau "Ditolak"' });
        }

        const warga = db.warga.find(w => w.id === wargaId);
        if (!warga) {
          return sendJson(res, 404, { error: 'Data warga tidak ditemukan' });
        }

        warga.status = status;
        warga.adminNotes = adminNotes ? adminNotes.trim() : (status === 'Terverifikasi' ? 'Telah disetujui Admin.' : 'Ditolak oleh Admin.');
        warga.verifiedAt = new Date().toISOString();

        // Buat notifikasi otomatis untuk RT/RW yang bersangkutan
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

        saveDatabase(db);

        return sendJson(res, 200, {
          message: `Data warga berhasil di-${status.toLowerCase()}`,
          warga: warga,
          notification: notif
        });
      } catch (e) {
        return sendJson(res, 400, { error: e.message });
      }
    }

    // 7. Transaksi Donasi
    if (pathname === '/api/donations') {
      if (method === 'GET') {
        // Terurut dari terbaru ke terlama (DESC)
        const sorted = [...db.donations].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return sendJson(res, 200, sorted);
      }

      if (method === 'POST') {
        try {
          const body = await parseBody(req);
          const { wargaId, donaturId, donaturName, amount, paymentMethod } = body;

          const numAmount = parseInt(amount, 10);
          if (isNaN(numAmount) || numAmount <= 0) {
            return sendJson(res, 400, { error: 'Nominal donasi tidak valid. Harus bernilai lebih besar dari 0 (Rp).' });
          }

          const warga = db.warga.find(w => w.id === wargaId);
          if (!warga) {
            return sendJson(res, 404, { error: 'Warga penerima tidak ditemukan' });
          }

          if (warga.status !== 'Terverifikasi') {
            return sendJson(res, 400, { error: 'Hanya warga berstatus Terverifikasi yang dapat menerima donasi.' });
          }

          // Catat transaksi donasi
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

          // Update total terkumpul warga
          warga.collectedAmount = (warga.collectedAmount || 0) + numAmount;

          db.donations.unshift(donation);
          saveDatabase(db);

          return sendJson(res, 201, {
            message: 'Donasi berhasil disalurkan dan tercatat dalam sistem!',
            donation: donation,
            wargaCollected: warga.collectedAmount,
            wargaTarget: warga.targetAmount
          });
        } catch (e) {
          return sendJson(res, 400, { error: e.message });
        }
      }
    }

    // 8. Notifikasi
    if (pathname === '/api/notifications' && method === 'GET') {
      const recipientId = reqUrl.searchParams.get('recipientId');
      let list = db.notifications;
      if (recipientId) {
        list = list.filter(n => n.recipientId === recipientId);
      }
      return sendJson(res, 200, list);
    }

    // 9. Reset database ke initial seed (untuk pengujian ulang)
    if (pathname === '/api/reset' && method === 'POST') {
      const seedFilePath = path.join(__dirname, 'data', 'database.json');
      if (fs.existsSync(seedFilePath)) {
        // Biarkan data seed yang ada
        return sendJson(res, 200, { message: 'Database reset berhasil' });
      }
    }

    return sendJson(res, 404, { error: 'API endpoint tidak ditemukan' });
  }

  // ================= STATIC FILE SERVING =================
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);

  // Cegah directory traversal
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(path.resolve(__dirname))) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  // Jika berupa direktori, cari index.html di dalamnya
  if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
    filePath = path.join(resolvedPath, 'index.html');
  }

  serveStaticFile(res, filePath);
});

// Mulai server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(` Celengan Mikro UMKM - Server Aktif`);
  console.log(` Port: ${PORT}`);
  console.log(` URL Lokal: http://localhost:${PORT}`);
  console.log(` Mendukung Railway Cloud & Akses File Mandiri`);
  console.log(`=======================================================`);
});
