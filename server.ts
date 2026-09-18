import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client safely (server-side only)
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "dummy-key",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Default data templates
  const defaultJamaah = [
    { id: "j1", name: "H. Asep Saepudin, S.Ag.", role: "Ketua DKM", phone: "+62 812-2345-6789", address: "Jl. Rancaekek Kencana Blok J No. 12", category: "Pengurus", status: "Aktif", joinedDate: "2023-01-10" },
    { id: "j2", name: "Drs. H. Ujang Supriatna", role: "Sekretaris", phone: "+62 813-8765-4321", address: "Kp. Bojongloa RT 03/05 Rancaekek", category: "Pengurus", status: "Aktif", joinedDate: "2023-01-15" },
    { id: "j3", name: "Hj. Siti Aminah, M.Pd.", role: "Ketua Majelis Taklim Ibu-Ibu", phone: "+62 815-9988-7766", address: "Perum Rancaekek Permai 2 Blok C", category: "Pengurus", status: "Aktif", joinedDate: "2023-02-01" },
    { id: "j4", name: "Fauzan Al-Ghifari", role: "Ketua Remaja Masjid (IRMAS)", phone: "+62 821-3456-7890", address: "Jl. Raya Rancaekek No. 45", category: "Remaja Masjid", status: "Aktif", joinedDate: "2024-03-12" },
    { id: "j5", name: "Budi Santoso", role: "Jamaah Regular", phone: "+62 856-1122-3344", address: "Kp. Cikijing Ds. Jelegong Rancaekek", category: "Jamaah", status: "Aktif", joinedDate: "2024-05-20" },
    { id: "j6", name: "Rahmat Hidayat", role: "Imam Rawatib", phone: "+62 811-9900-1122", address: "Komplek Graha Rancaekek", category: "Pengurus", status: "Aktif", joinedDate: "2022-11-05" }
  ];

  const defaultKeuangan = [
    { id: "k1", date: "2026-09-01", type: "IN", category: "Infaq Jumat", amount: 4850000, description: "Kotak Amal Shalat Jumat Masjid Besar Rancaekek", source: "Jamaah Umum" },
    { id: "k2", date: "2026-09-03", type: "IN", category: "Donasi Wakaf", amount: 15000000, description: "Wakaf Pembangunan Tempat Wudhu Baru dari H. Dahlan", source: "H. Dahlan (Warga Rancaekek)" },
    { id: "k3", date: "2026-09-05", type: "OUT", category: "Operasional", amount: 1200000, description: "Honor Marbot & Pembersihan Karpet Masjid Bulanan", source: "Kas DKM" },
    { id: "k4", date: "2026-09-10", type: "IN", category: "Zakat Mal", amount: 3500000, description: "Zakat Penghasilan Warga Rancaekek Kencana", source: "Warga Dermawan" },
    { id: "k5", date: "2026-09-14", type: "OUT", category: "Sosial Yatim", amount: 2500000, description: "Santunan Bulanan 25 Anak Yatim Piatu Sekitar Rancaekek", source: "Dana Sosial DKM" }
  ];

  const defaultAset = [
    { id: "as1", name: "Sound System Professional (TOA & Mixer)", category: "Elektronik", qty: 2, condition: "Baik", location: "Ruang Utama Masjid", year: 2024, value: 15000000 },
    { id: "as2", name: "Karpet Turki Merah (Roll Besar)", category: "Interior", qty: 12, condition: "Baik", location: "Lantai Utama Shalat", year: 2023, value: 36000000 },
    { id: "as3", name: "Genset Diesel 15 PK", category: "Elektronik", qty: 1, condition: "Baik", location: "Gudang Belakang", year: 2022, value: 25000000 },
    { id: "as4", name: "AC Split 2 PK (Daikin)", category: "Elektronik", qty: 4, condition: "Rusak Ringan", location: "Ruang Mihtrab & VIP", year: 2021, value: 18000000 },
    { id: "as5", name: "Kotak Infaq Kayu Jati", category: "Inventaris Umum", qty: 6, condition: "Baik", location: "Pintu Masuk Masjid", year: 2023, value: 3000000 }
  ];

  const defaultKegiatan = [
    { id: "g1", title: "Peringatan Maulid Nabi Muhammad SAW 1448H", date: "2026-09-12", category: "Peringatan Hari Besar", description: "Penceramah KH. Abdullah Gymnastiar (Aa Gym) di Masjid Besar Rancaekek dihadiri ribuan jamaah.", image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800" },
    { id: "g2", title: "Bakti Sosial & Pengobatan Gratis Warga Rancaekek", date: "2026-08-25", category: "Sosial", description: "Pemeriksaan kesehatan gratis bekerja sama dengan Puskesmas Rancaekek dan RSUD Cikopo.", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800" },
    { id: "g3", title: "Pelatihan Pengurusan Jenazah Remaja Masjid Rancaekek", date: "2026-08-10", category: "Pendidikan", description: "Pelatihan praktik fardhu kifayah bagi pemuda dan remaja masjid se-Kecamatan Rancaekek.", image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800" }
  ];

  const defaultProgram = [
    { id: "p1", title: "Kajian Rutin Tafsir Al-Quran Ba'da Subuh", schedule: "Setiap Ahad Pagi (05:00 - 06:30)", speaker: "Ustadz Dr. H. M. Taufik, M.Pd.I.", location: "Masjid Besar Rancaekek", target: "Umum & Jamaah", status: "Aktif" },
    { id: "p2", title: "Majelis Taklim Ibu-Ibu Al-Hidayah", schedule: "Setiap Selasa (13:00 - 15:00)", speaker: "Hj. Siti Aminah, M.Pd.", location: "Serambi Masjid", target: "Khusus Muslimah", status: "Aktif" },
    { id: "p3", title: "TPA / TPQ Al-Barokah Rancaekek", schedule: "Senin s.d. Jumat (15:30 - 17:30)", speaker: "Ust. Fikri & Tim Pengajar", location: "Gedung TPQ DKM", target: "Anak-anak & Remaja", status: "Aktif" },
    { id: "p4", title: "Gerakan Shalat Subuh Berjamaah Keliling", schedule: "Pekan ke-2 Setiap Bulan", speaker: "Pengurus DKM & Muspika Rancaekek", location: "Bergilir ke Masjid Ranting", target: "Warga Rancaekek", status: "Aktif" }
  ];

  const defaultBroadcast = [
    { id: "b1", date: "2026-09-15 08:30", title: "Undangan Rapat Pleno DKM Rancaekek", recipient: "Seluruh Pengurus DKM", message: "Yth. Pengurus DKM Rancaekek, diundang hadir dalam rapat evaluasi keuangan bulanan pada Sabtu malam Ahad pukul 19.30 WIB di Kantor DKM.", status: "Terkirim (WhatsApp Gateway)" },
    { id: "b2", date: "2026-09-12 14:00", title: "Laporan Saldo Infaq Pekan Ini", recipient: "Jamaah & Publik Rancaekek", message: "Alhamdulillah saldo kas infaq terkumpul Rp 4.850.000. Jazakumullahu khairan katsiran kepada seluruh dermawan.", status: "Terkirim (Publik Real-time)" }
  ];

  const defaultMosqueProfile = {
    name: "DKM Rancaekek",
    address: "Kecamatan Rancaekek, Kabupaten Bandung, Jawa Barat",
    callCenter: "+62 812-2345-6789"
  };
  let sharedMosqueProfile = { ...defaultMosqueProfile };

  // User-specific storage map
  const userStores: Record<string, {
    jamaahList: any[];
    keuanganList: any[];
    asetList: any[];
    kegiatanList: any[];
    programList: any[];
    broadcastLog: any[];
    mosqueProfile: { name: string; address: string; callCenter: string };
  }> = {};

  const getUserStore = (email = 'public@dkm-rancaekek.org') => {
    const key = email.toLowerCase();
    if (!userStores[key]) {
      userStores[key] = {
        jamaahList: JSON.parse(JSON.stringify(defaultJamaah)),
        keuanganList: JSON.parse(JSON.stringify(defaultKeuangan)),
        asetList: JSON.parse(JSON.stringify(defaultAset)),
        kegiatanList: JSON.parse(JSON.stringify(defaultKegiatan)),
        programList: JSON.parse(JSON.stringify(defaultProgram)),
        broadcastLog: JSON.parse(JSON.stringify(defaultBroadcast)),
        mosqueProfile: JSON.parse(JSON.stringify(sharedMosqueProfile)),
      };
    }
    return userStores[key];
  };

  const getEmailFromReq = (req: any) => {
    return (req.headers['x-user-email'] as string) || (req.query.userEmail as string) || 'public@dkm-rancaekek.org';
  };

  // Admin Accounts
  const adminAccounts: Record<string, { pass: string; name: string; role: string }> = {
    'admin': { pass: 'dkm123', name: 'Administrator DKM', role: 'Admin DKM' },
    'admin@dkm-rancaekek.org': { pass: 'dkm123', name: 'Administrator DKM', role: 'Admin DKM' },
  };

  // Auth Login Endpoint
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const account = adminAccounts[email?.toLowerCase()];
    if (account && account.pass === password) {
      getUserStore(email);
      res.json({
        success: true,
        user: { email: email.toLowerCase(), name: account.name, role: account.role }
      });
    } else {
      res.status(401).json({ success: false, message: "Email atau password salah." });
    }
  });

  // API Endpoints with per-user data isolation

  app.get("/api/stats", (req, res) => {
    const email = getEmailFromReq(req);
    const store = getUserStore(email);
    const totalInfaq = store.keuanganList.filter(k => k.type === 'IN').reduce((sum, k) => sum + k.amount, 0);
    const totalKeluar = store.keuanganList.filter(k => k.type === 'OUT').reduce((sum, k) => sum + k.amount, 0);
    const saldoAkhir = totalInfaq - totalKeluar;
    const totalAsetNilai = store.asetList.reduce((sum, a) => sum + (a.value * a.qty), 0);

    res.json({
      totalJamaah: store.jamaahList.length,
      totalPengurus: store.jamaahList.filter(j => j.category === 'Pengurus').length,
      saldoKas: saldoAkhir,
      totalInfaq,
      totalKeluar,
      totalAset: store.asetList.length,
      totalAsetNilai,
      totalProgram: store.programList.length,
      totalKegiatan: store.kegiatanList.length
    });
  });

  // Profil Identitas Masjid & Call Center
  app.get("/api/masjid", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    res.json(store.mosqueProfile || sharedMosqueProfile);
  });

  app.put("/api/masjid", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    const { name, address, callCenter } = req.body;
    const updated = {
      name: name !== undefined ? name : (store.mosqueProfile?.name || sharedMosqueProfile.name),
      address: address !== undefined ? address : (store.mosqueProfile?.address || sharedMosqueProfile.address),
      callCenter: callCenter !== undefined ? callCenter : (store.mosqueProfile?.callCenter || sharedMosqueProfile.callCenter)
    };
    store.mosqueProfile = updated;
    sharedMosqueProfile = { ...updated };
    res.json(updated);
  });

  // Jamaah
  app.get("/api/jamaah", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    res.json(store.jamaahList);
  });
  app.post("/api/jamaah", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    const newJamaah = { id: "j_" + Date.now(), ...req.body, joinedDate: new Date().toISOString().split('T')[0] };
    store.jamaahList.unshift(newJamaah);
    res.json(newJamaah);
  });
  app.put("/api/jamaah/:id", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    const idx = store.jamaahList.findIndex(j => j.id === req.params.id);
    if (idx !== -1) {
      store.jamaahList[idx] = { ...store.jamaahList[idx], ...req.body };
      res.json(store.jamaahList[idx]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
  app.delete("/api/jamaah/:id", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    store.jamaahList = store.jamaahList.filter(j => j.id !== req.params.id);
    res.json({ success: true });
  });

  // Keuangan
  app.get("/api/keuangan", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    res.json(store.keuanganList);
  });
  app.post("/api/keuangan", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    const newTx = { id: "k_" + Date.now(), ...req.body, date: req.body.date || new Date().toISOString().split('T')[0] };
    store.keuanganList.unshift(newTx);
    res.json(newTx);
  });
  app.put("/api/keuangan/:id", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    const idx = store.keuanganList.findIndex(k => k.id === req.params.id);
    if (idx !== -1) {
      store.keuanganList[idx] = { ...store.keuanganList[idx], ...req.body };
      res.json(store.keuanganList[idx]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
  app.delete("/api/keuangan/:id", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    store.keuanganList = store.keuanganList.filter(k => k.id !== req.params.id);
    res.json({ success: true });
  });

  // Aset
  app.get("/api/aset", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    res.json(store.asetList);
  });
  app.post("/api/aset", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    const newAset = { id: "as_" + Date.now(), ...req.body };
    store.asetList.unshift(newAset);
    res.json(newAset);
  });
  app.put("/api/aset/:id", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    const idx = store.asetList.findIndex(a => a.id === req.params.id);
    if (idx !== -1) {
      store.asetList[idx] = { ...store.asetList[idx], ...req.body };
      res.json(store.asetList[idx]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
  app.delete("/api/aset/:id", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    store.asetList = store.asetList.filter(a => a.id !== req.params.id);
    res.json({ success: true });
  });

  // Kegiatan
  app.get("/api/kegiatan", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    res.json(store.kegiatanList);
  });
  app.post("/api/kegiatan", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    const newKegiatan = { id: "g_" + Date.now(), ...req.body, date: req.body.date || new Date().toISOString().split('T')[0] };
    store.kegiatanList.unshift(newKegiatan);
    res.json(newKegiatan);
  });
  app.put("/api/kegiatan/:id", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    const idx = store.kegiatanList.findIndex(g => g.id === req.params.id);
    if (idx !== -1) {
      store.kegiatanList[idx] = { ...store.kegiatanList[idx], ...req.body };
      res.json(store.kegiatanList[idx]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });
  app.delete("/api/kegiatan/:id", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    store.kegiatanList = store.kegiatanList.filter(g => g.id !== req.params.id);
    res.json({ success: true });
  });

  // Program
  app.get("/api/program", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    res.json(store.programList);
  });
  app.post("/api/program", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    const newProg = { id: "p_" + Date.now(), ...req.body };
    store.programList.unshift(newProg);
    res.json(newProg);
  });
  app.put("/api/program/:id", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    const idx = store.programList.findIndex(p => p.id === req.params.id);
    if (idx !== -1) {
      store.programList[idx] = { ...store.programList[idx], ...req.body };
      res.json(store.programList[idx]);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  });

  // Broadcast Log
  app.get("/api/broadcast", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    res.json(store.broadcastLog);
  });
  app.post("/api/broadcast", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    const newB = { id: "b_" + Date.now(), date: new Date().toLocaleString('id-ID'), ...req.body, status: "Terkirim (WhatsApp Gateway)" };
    store.broadcastLog.unshift(newB);
    res.json(newB);
  });

  // Laporan Berkala Publik
  app.get("/api/laporan", (req, res) => {
    const store = getUserStore(getEmailFromReq(req));
    const totalInfaq = store.keuanganList.filter(k => k.type === 'IN').reduce((sum, k) => sum + k.amount, 0);
    const totalKeluar = store.keuanganList.filter(k => k.type === 'OUT').reduce((sum, k) => sum + k.amount, 0);
    res.json({
      periode: "September 2026",
      masjid: "Masjid Besar & Jajaran DKM Kecamatan Rancaekek, Kab. Bandung",
      totalPemasukan: totalInfaq,
      totalPengeluaran: totalKeluar,
      saldoAkhir: totalInfaq - totalKeluar,
      rincianKeuangan: store.keuanganList,
      ringkasanAset: store.asetList,
      ringkasanJamaah: {
        total: store.jamaahList.length,
        pengurus: store.jamaahList.filter(j => j.category === 'Pengurus').length,
        remajaMasjid: store.jamaahList.filter(j => j.category === 'Remaja Masjid').length,
        jamaahUmum: store.jamaahList.filter(j => j.category === 'Jamaah').length
      },
      catatanDKM: "Laporan ini diterbitkan secara transparan dan akuntabel sesuai hasil Rapat Pleno DKM Kecamatan Rancaekek."
    });
  });

  // AI Assistant Endpoint (Powered by Gemini API)
  app.post("/api/ai-assistant", async (req, res) => {
    const { promptType, customTopic } = req.body;
    try {
      let systemPrompt = "Anda adalah asisten AI profesional untuk Dewan Kemakmuran Masjid (DKM) Kecamatan Rancaekek, Kabupaten Bandung, Jawa Barat. Buatkan teks yang islami, santun, baku, dan sesuai norma budaya Sunda/Indonesia.";
      let userPrompt = "";

      if (promptType === 'khotbah') {
        userPrompt = `Buatkan naskah ringkas Khotbah Jumat bertema "${customTopic || 'Keutamaan Memakmurkan Masjid di Era Modern'}" dengan bahasa yang menggugah hati, dalil Al-Quran/Hadits, dan relevan dengan jamaah di Rancaekek.`;
      } else if (promptType === 'buletin') {
        userPrompt = `Buatkan teks Buletin Jumat DKM Rancaekek mengenai transparansi keuangan minggu ini dengan sapaan hangat untuk warga Rancaekek Kencana, Bojongloa, dan sekitarnya.`;
      } else if (promptType === 'undangan') {
        userPrompt = `Buatkan pesan WhatsApp undangan resmi untuk pengurus dan jamaah DKM Rancaekek untuk acara "${customTopic || 'Pengajian Akbar Bulanan'}".`;
      } else {
        userPrompt = customTopic || "Berikan nasihat singkat tentang pentingnya ukhuwah islamiyah di lingkungan DKM Rancaekek.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      res.json({ result: response.text || "Gagal menghasilkan teks dari AI." });
    } catch (error: any) {
      console.error("Gemini AI Error:", error);
      res.status(500).json({ error: error.message || "Terjadi kesalahan saat memproses AI Assistant." });
    }
  });

  // Vite middleware setup in development, static in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DKM Rancaekek Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
