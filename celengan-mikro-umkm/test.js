/**
 * Celengan Mikro UMKM - Automated Test Suite
 * Memvalidasi ke-13 Skenario Pengujian (Test Cases 1-13) pada Dokumen Waterfall
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

// Impor atau panggil server langsung
const PORT = 3099; // Port khusus testing
process.env.PORT = PORT;

// Jalankan server untuk pengetesan
const serverModule = require('./server.js');

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runAllTests() {
  console.log('\n=============================================================');
  console.log(' MEMULAI PENGUJIAN OTOMATIS: CELENGAN MIKRO UMKM');
  console.log(' (Berdasarkan Tabel 4. Skenario Pengujian Dokumen Waterfall)');
  console.log('=============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(testNum, testName, condition, details = '') {
    if (condition) {
      console.log(`✅ [LULUS] Test Case ${testNum}: ${testName}`);
      passed++;
    } else {
      console.error(`❌ [GAGAL] Test Case ${testNum}: ${testName} -> ${details}`);
      failed++;
    }
  }

  try {
    // 0. Server Health Check
    const health = await makeRequest('GET', '/api/health');
    assert(0, 'Server Health Check', health.status === 200 && health.data.status === 'ok');

    // Test Case 1: Registrasi dengan data lengkap dan valid
    const uniqueEmail = `rt_test_${Date.now()}@kelurahan.id`;
    const res1 = await makeRequest('POST', '/api/auth/register', {
      email: uniqueEmail,
      password: 'password123',
      role: 'RT/RW',
      name: 'Pengurus RT 09 Test'
    });
    assert(1, 'Registrasi Akun dengan Data Lengkap', res1.status === 201 && res1.data.user.email === uniqueEmail);

    // Test Case 2: Registrasi dengan email yang sudah terdaftar
    const res2 = await makeRequest('POST', '/api/auth/register', {
      email: uniqueEmail, // email yang sama
      password: 'password123',
      role: 'RT/RW',
      name: 'Pengurus RT Duplikat'
    });
    assert(2, 'Registrasi Akun dengan Email Duplikat (Menolak & Tampil Error)', res2.status === 409 && !!res2.data.error);

    // Test Case 3: Login dengan kredensial benar sesuai peran
    const res3 = await makeRequest('POST', '/api/auth/login', {
      email: uniqueEmail,
      password: 'password123',
      role: 'RT/RW'
    });
    assert(3, 'Login dengan Kredensial Benar', res3.status === 200 && res3.data.user.role === 'RT/RW');

    // Test Case 4: Login dengan password salah
    const res4 = await makeRequest('POST', '/api/auth/login', {
      email: uniqueEmail,
      password: 'passwordsalah!',
      role: 'RT/RW'
    });
    assert(4, 'Login dengan Password Salah (Menolak Akses)', res4.status === 401 && !!res4.data.error);

    // Test Case 5: RT/RW mendaftarkan warga dengan data lengkap
    const res5 = await makeRequest('POST', '/api/warga', {
      name: 'Pak Slamet (Test)',
      businessType: 'Penjual Cilok Kuah',
      targetAmount: 1200000,
      nonCashItems: 'Dandang cilok, kompor gas, dan bahan baku tepung 25kg',
      photo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
      rtId: res1.data.user.id,
      rtName: res1.data.user.name
    });
    const createdWargaId = res5.data.warga ? res5.data.warga.id : null;
    assert(5, 'Daftar Data Warga Lengkap (Status Pending)', res5.status === 201 && res5.data.warga.status === 'Pending');

    // Test Case 6: RT/RW mendaftarkan warga dengan data tidak lengkap (field kosong)
    const res6 = await makeRequest('POST', '/api/warga', {
      name: '', // kosong
      businessType: 'Penjual Es',
      targetAmount: 500000,
      nonCashItems: '',
      photo: ''
    });
    assert(6, 'Daftar Data Warga Tidak Lengkap (Gagal & Tampil Error)', res6.status === 400 && !!res6.data.error);

    // Test Case 7: Admin menyetujui data warga Pending
    const res7 = await makeRequest('PATCH', `/api/warga/${createdWargaId}/verify`, {
      status: 'Terverifikasi',
      adminNotes: 'Usaha layak didukung.'
    });
    assert(7, 'Admin Menyetujui Warga Pending (Status Terverifikasi & Notifikasi RT)', res7.status === 200 && res7.data.warga.status === 'Terverifikasi');

    // Buat warga pending kedua untuk menguji penolakan
    const resWargaDitolak = await makeRequest('POST', '/api/warga', {
      name: 'Warga Uji Tolak',
      businessType: 'Usaha Spekulatif',
      targetAmount: 5000000,
      nonCashItems: 'Barang non-produktif',
      photo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
      rtId: res1.data.user.id,
      rtName: res1.data.user.name
    });
    const tolakWargaId = resWargaDitolak.data.warga.id;

    // Test Case 8: Admin menolak data warga Pending
    const res8 = await makeRequest('PATCH', `/api/warga/${tolakWargaId}/verify`, {
      status: 'Ditolak',
      adminNotes: 'Tidak sesuai kriteria modal produktif.'
    });
    assert(8, 'Admin Menolak Warga Pending (Status Ditolak & Notifikasi RT)', res8.status === 200 && res8.data.warga.status === 'Ditolak');

    // Test Case 9: Donatur melakukan donasi dengan nominal valid
    const res9 = await makeRequest('POST', '/api/donations', {
      wargaId: createdWargaId,
      donaturId: 'usr_donatur1',
      donaturName: 'Budi Santoso (Test)',
      amount: 50000,
      paymentMethod: 'QRIS'
    });
    assert(9, 'Donasi Nominal Valid via QRIS/Transfer (Tercatat & Total Bertambah)', res9.status === 201 && res9.data.wargaCollected === 50000);

    // Test Case 10: Donatur memasukkan nominal tidak valid (0 atau negatif)
    const res10 = await makeRequest('POST', '/api/donations', {
      wargaId: createdWargaId,
      donaturId: 'usr_donatur1',
      donaturName: 'Budi Santoso',
      amount: 0, // nominal tidak valid
      paymentMethod: 'QRIS'
    });
    assert(10, 'Donasi Nominal Tidak Valid (0/Negatif - Ditolak)', res10.status === 400 && !!res10.data.error);

    // Test Case 11: Dashboard Progress Donasi (RT/RW)
    const res11 = await makeRequest('GET', '/api/warga');
    const rtWarga = res11.data.filter(w => w.rtId === res1.data.user.id);
    const hasProgress = rtWarga.length > 0 && typeof rtWarga[0].collectedAmount === 'number';
    assert(11, 'Dashboard Progress Donasi RT/RW (Menampilkan Data & Progress Warga Binaan)', res11.status === 200 && hasProgress);

    // Test Case 12: Dashboard Riwayat Donasi (Donatur)
    const res12 = await makeRequest('GET', '/api/donations');
    const donaturHistory = res12.data.filter(d => d.donaturId === 'usr_donatur1');
    assert(12, 'Dashboard Riwayat Donasi Donatur (Riwayat Bantuan Tampil)', res12.status === 200 && donaturHistory.length > 0);

    // Test Case 13: Lihat History Donasi (Admin)
    const res13 = await makeRequest('GET', '/api/donations');
    // Cek apakah urut dari terbaru ke terlama (DESC by date)
    let isSorted = true;
    for (let i = 0; i < res13.data.length - 1; i++) {
      if (new Date(res13.data[i].createdAt) < new Date(res13.data[i + 1].createdAt)) {
        isSorted = false;
        break;
      }
    }
    assert(13, 'Lihat History Donasi Admin (Seluruh Transaksi Terurut Terbaru ke Terlama)', res13.status === 200 && res13.data.length > 0 && isSorted);

    console.log('\n=============================================================');
    console.log(` HASIL PENGUJIAN: ${passed} LULUS, ${failed} GAGAL`);
    console.log('=============================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Error saat menjalankan test suite:', error);
    process.exit(1);
  }
}

// Beri jeda 500ms agar server binding selesai
setTimeout(runAllTests, 500);
