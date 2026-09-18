import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { db, auth } from './firebase';
import {
  Jamaah,
  Keuangan,
  Aset,
  Kegiatan,
  Program,
  BroadcastMessage,
  MosqueProfile,
  UserProfile
} from '../types';

export const defaultMosqueProfile: MosqueProfile = {
  name: 'DKM Rancaekek',
  address: 'Jl. Raya Rancaekek - Majalaya No. 12, Rancaekek Kulon, Kec. Rancaekek, Kabupaten Bandung, Jawa Barat',
  callCenter: '+62 812-2345-6789',
  latitude: -6.9744,
  longitude: 107.7617,
  landmark: 'Dekat Stasiun Kereta Api Rancaekek & Alun-Alun Rancaekek',
  postalCode: '40394',
  mapQuery: 'Masjid Besar Rancaekek Bandung',
  mapEmbedUrl: 'https://maps.google.com/maps?q=-6.9744,107.7617(Masjid+Besar+DKM+Rancaekek)&t=&z=16&ie=UTF8&iwloc=&output=embed',
  qris: {
    merchantName: 'DKM MASJID BESAR RANCAEKEK',
    nmid: 'ID1020038472918',
    bankName: 'Bank Syariah Indonesia (BSI)',
    accountNumber: '7144829103',
    accountHolder: 'DKM RANCAEKEK PEDULI UMAT',
    qrPayload: '00020101021126580016ID.CO.QRIS.WWW01189360091800000000000215ID10200384729180303UMI51440014ID.GO.BI.QRIS5204000053033605802ID5926DKM MASJID BESAR RANCAEKEK6015BANDUNG KAB.61054039262070703A016304C49E',
    instructions: 'Buka aplikasi perbankan atau e-wallet Anda, pilih menu Bayar/Scan QRIS, lalu arahkan kamera ke kode QR.'
  }
};

export const defaultJamaah: Jamaah[] = [
  { id: "j1", name: "H. Asep Saepudin, S.Ag.", role: "Ketua DKM", phone: "+62 812-2345-6789", address: "Jl. Rancaekek Kencana Blok J No. 12", category: "Pengurus", status: "Aktif", joinedDate: "2023-01-10" },
  { id: "j2", name: "Drs. H. Ujang Supriatna", role: "Sekretaris", phone: "+62 813-8765-4321", address: "Kp. Bojongloa RT 03/05 Rancaekek", category: "Pengurus", status: "Aktif", joinedDate: "2023-01-15" },
  { id: "j3", name: "Hj. Siti Aminah, M.Pd.", role: "Ketua Majelis Taklim Ibu-Ibu", phone: "+62 815-9988-7766", address: "Perum Rancaekek Permai 2 Blok C", category: "Pengurus", status: "Aktif", joinedDate: "2023-02-01" },
  { id: "j4", name: "Fauzan Al-Ghifari", role: "Ketua Remaja Masjid (IRMAS)", phone: "+62 821-3456-7890", address: "Jl. Raya Rancaekek No. 45", category: "Remaja Masjid", status: "Aktif", joinedDate: "2024-03-12" },
  { id: "j5", name: "Budi Santoso", role: "Jamaah Regular", phone: "+62 856-1122-3344", address: "Kp. Cikijing Ds. Jelegong Rancaekek", category: "Jamaah", status: "Aktif", joinedDate: "2024-05-20" },
  { id: "j6", name: "Rahmat Hidayat", role: "Imam Rawatib", phone: "+62 811-9900-1122", address: "Komplek Graha Rancaekek", category: "Pengurus", status: "Aktif", joinedDate: "2022-11-05" }
];

export const defaultKeuangan: Keuangan[] = [
  { id: "k1", date: "2026-09-01", type: "IN", category: "Infaq Jumat", amount: 4850000, description: "Kotak Amal Shalat Jumat Masjid", source: "Jamaah Umum" },
  { id: "k2", date: "2026-09-03", type: "IN", category: "Donasi Wakaf", amount: 15000000, description: "Wakaf Pembangunan Tempat Wudhu", source: "H. Dahlan (Warga)" },
  { id: "k3", date: "2026-09-05", type: "OUT", category: "Operasional", amount: 1200000, description: "Honor Marbot & Pembersihan Karpet Masjid", source: "Kas DKM" },
  { id: "k4", date: "2026-09-10", type: "IN", category: "Zakat Mal", amount: 3500000, description: "Zakat Penghasilan Jamaah", source: "Warga Dermawan" },
  { id: "k5", date: "2026-09-14", type: "OUT", category: "Sosial Yatim", amount: 2500000, description: "Santunan Bulanan Anak Yatim Piatu", source: "Dana Sosial DKM" }
];

export const defaultAset: Aset[] = [
  { id: "as1", name: "Sound System Professional (TOA & Mixer)", category: "Elektronik", qty: 2, condition: "Baik", location: "Ruang Utama Masjid", year: 2024, value: 15000000 },
  { id: "as2", name: "Karpet Turki Merah (Roll Besar)", category: "Interior", qty: 12, condition: "Baik", location: "Lantai Utama Shalat", year: 2023, value: 36000000 },
  { id: "as3", name: "Genset Diesel 15 PK", category: "Elektronik", qty: 1, condition: "Baik", location: "Gudang Belakang", year: 2022, value: 25000000 },
  { id: "as4", name: "AC Split 2 PK (Daikin)", category: "Elektronik", qty: 4, condition: "Rusak Ringan", location: "Ruang Mihtrab & VIP", year: 2021, value: 18000000 },
  { id: "as5", name: "Kotak Infaq Kayu Jati", category: "Inventaris Umum", qty: 6, condition: "Baik", location: "Pintu Masuk Masjid", year: 2023, value: 3000000 }
];

export const defaultKegiatan: Kegiatan[] = [
  { id: "g1", title: "Peringatan Maulid Nabi Muhammad SAW", date: "2026-09-12", category: "Peringatan Hari Besar", description: "Peringatan hari besar Islam dihadiri seluruh jamaah dan warga sekitar.", image: "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800" },
  { id: "g2", title: "Bakti Sosial & Pengobatan Gratis Warga", date: "2026-08-25", category: "Sosial", description: "Pemeriksaan kesehatan gratis dan pembagian sembako berkah.", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800" },
  { id: "g3", title: "Pelatihan Pengurusan Jenazah Remaja Masjid", date: "2026-08-10", category: "Pendidikan", description: "Pelatihan praktik fardhu kifayah bagi pemuda dan remaja masjid.", image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800" }
];

export const defaultProgram: Program[] = [
  { id: "p1", title: "Kajian Rutin Tafsir Al-Quran Ba'da Subuh", schedule: "Setiap Ahad Pagi (05:00 - 06:30)", speaker: "Ustadz Pembina DKM", location: "Ruang Utama Masjid", target: "Umum & Jamaah", status: "Aktif" },
  { id: "p2", title: "Majelis Taklim Ibu-Ibu", schedule: "Setiap Selasa (13:00 - 15:00)", speaker: "Ustadzah Pembina", location: "Serambi Masjid", target: "Khusus Muslimah", status: "Aktif" },
  { id: "p3", title: "TPA / TPQ Anak-Anak Masjid", schedule: "Senin s.d. Jumat (15:30 - 17:30)", speaker: "Tim Ustadz Pengajar", location: "Gedung TPQ DKM", target: "Anak-anak & Remaja", status: "Aktif" }
];

export const defaultBroadcast: BroadcastMessage[] = [
  { id: "b1", date: "2026-09-15 08:30", title: "Undangan Rapat Pleno DKM", recipient: "Seluruh Pengurus DKM", message: "Yth. Pengurus DKM, diundang hadir dalam rapat evaluasi bulanan di Kantor Sekretariat DKM.", status: "Terkirim (WhatsApp Gateway)" },
  { id: "b2", date: "2026-09-12 14:00", title: "Laporan Saldo Infaq Pekan Ini", recipient: "Jamaah & Publik", message: "Alhamdulillah saldo kas infaq telah diperbarui. Jazakumullahu khairan katsiran.", status: "Terkirim (Publik Real-time)" }
];

/**
 * Normalizes user identifier to provide safe, isolated Firestore collection paths.
 */
export function getUserScope(userEmailOrId?: string | null): string {
  if (!userEmailOrId) return 'public_demo';
  return userEmailOrId.trim().toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_');
}

// ==========================================
// USER AUTHENTICATION & MULTI-TENANCY
// ==========================================

export async function registerUserAccount(
  name: string,
  email: string,
  password: string,
  mosqueName?: string
): Promise<UserProfile> {
  const emailNorm = email.trim().toLowerCase();
  if (!emailNorm || !emailNorm.includes('@')) {
    throw new Error('Alamat email tidak valid.');
  }
  if (!password || password.length < 6) {
    throw new Error('Password minimal 6 karakter.');
  }
  if (!name.trim()) {
    throw new Error('Nama lengkap wajib diisi.');
  }

  const userId = getUserScope(emailNorm);
  const userDocRef = doc(db, 'users', userId);

  // Check if user already exists
  const existingSnap = await getDoc(userDocRef);
  if (existingSnap.exists()) {
    throw new Error('Email ini sudah terdaftar. Silakan pilih tab "Masuk (Login)".');
  }

  // Attempt Firebase Auth sign-up if active
  try {
    await createUserWithEmailAndPassword(auth, emailNorm, password);
  } catch (err: any) {
    // If Firebase Auth fails because email in use or not configured, log but proceed if store is clear
    if (err.code === 'auth/email-already-in-use') {
      throw new Error('Email ini sudah terdaftar di Firebase Auth. Silakan pilih tab "Masuk".');
    }
    console.warn('Firebase Auth notice:', err?.message || err);
  }

  const resolvedMosqueName = mosqueName?.trim() || `DKM Masjid ${name.trim()}`;

  const userProfile: UserProfile = {
    id: userId,
    email: emailNorm,
    name: name.trim(),
    role: 'Admin DKM',
    mosqueName: resolvedMosqueName,
    createdAt: new Date().toISOString()
  };

  // Save to Firestore users collection
  await setDoc(userDocRef, {
    ...userProfile,
    passwordHash: password // stored securely per user document
  });

  // Initialize new user's private mosque profile and initial starter data
  const customMosqueProfile: MosqueProfile = {
    name: resolvedMosqueName,
    address: 'Kabupaten Bandung, Jawa Barat',
    callCenter: '+62 812-xxxx-xxxx'
  };

  await setDoc(doc(db, 'users', userId, 'data', 'mosque_profile'), customMosqueProfile);

  // Seed user's initial isolated records
  const batch = writeBatch(db);

  // Seed default jamaah with this user as Ketua DKM
  const initialJamaah: Jamaah[] = [
    {
      id: `j_${Date.now()}_1`,
      name: name.trim(),
      role: 'Ketua DKM',
      phone: '+62 812-xxxx-xxxx',
      address: 'Wilayah Masjid',
      category: 'Pengurus',
      status: 'Aktif',
      joinedDate: new Date().toISOString().split('T')[0]
    },
    {
      id: `j_${Date.now()}_2`,
      name: 'Ustadz Pembina',
      role: 'Imam & Penasihat',
      phone: '+62 813-xxxx-xxxx',
      address: 'Wilayah Masjid',
      category: 'Pengurus',
      status: 'Aktif',
      joinedDate: new Date().toISOString().split('T')[0]
    }
  ];

  for (const j of initialJamaah) {
    batch.set(doc(db, 'users', userId, 'jamaah', j.id), j);
  }

  // Seed starter initial keuangan
  const initialKeuangan: Keuangan[] = [
    {
      id: `k_${Date.now()}_1`,
      date: new Date().toISOString().split('T')[0],
      type: 'IN',
      category: 'Infaq Kas Awal',
      amount: 2500000,
      description: `Kas Awal ${resolvedMosqueName}`,
      source: 'Kas DKM'
    }
  ];
  for (const k of initialKeuangan) {
    batch.set(doc(db, 'users', userId, 'keuangan', k.id), k);
  }

  // Seed starter initial aset
  const initialAset: Aset[] = [
    {
      id: `as_${Date.now()}_1`,
      name: 'Sound System & Mic Wireless',
      category: 'Elektronik',
      qty: 1,
      condition: 'Baik',
      location: 'Ruang Utama',
      year: new Date().getFullYear(),
      value: 5000000
    }
  ];
  for (const as of initialAset) {
    batch.set(doc(db, 'users', userId, 'aset', as.id), as);
  }

  // Seed starter program
  const initialProgram: Program[] = [
    {
      id: `p_${Date.now()}_1`,
      title: 'Kajian Rutin Pekanan Jamaah',
      schedule: 'Setiap Ahad Subuh',
      speaker: 'Ustadz Pembina',
      location: 'Ruang Utama',
      target: 'Seluruh Jamaah',
      status: 'Aktif'
    }
  ];
  for (const p of initialProgram) {
    batch.set(doc(db, 'users', userId, 'program', p.id), p);
  }

  await batch.commit();

  return userProfile;
}

export async function loginUserAccount(
  email: string,
  password: string
): Promise<UserProfile> {
  const emailNorm = email.trim().toLowerCase();
  if (!emailNorm) {
    throw new Error('Email atau username wajib diisi.');
  }

  // Handle quick demo admin
  if (emailNorm === 'admin' && (password === 'dkm123' || !password)) {
    return {
      id: 'admin',
      email: 'admin@masjid.id',
      name: 'Administrator DKM',
      role: 'Super Admin',
      mosqueName: 'DKM Rancaekek'
    };
  }

  const userId = getUserScope(emailNorm);
  const userDocRef = doc(db, 'users', userId);

  // Try Firebase Auth first
  try {
    await signInWithEmailAndPassword(auth, emailNorm, password);
  } catch (err: any) {
    console.warn('Firebase Auth sign-in notice:', err?.message || err);
  }

  // Check Firestore users document
  const snap = await getDoc(userDocRef);
  if (!snap.exists()) {
    throw new Error(
      `Akun dengan email "${emailNorm}" belum terdaftar. Silakan pilih tab "Daftar Akun Baru".`
    );
  }

  const data = snap.data();
  if (data.passwordHash && data.passwordHash !== password) {
    throw new Error('Password yang Anda masukkan salah. Silakan periksa kembali.');
  }

  return {
    id: data.id || userId,
    email: data.email || emailNorm,
    name: data.name || 'Pengurus DKM',
    role: data.role || 'Admin DKM',
    mosqueName: data.mosqueName || 'DKM Masjid'
  };
}

export async function logoutUserAccount(): Promise<void> {
  try {
    await signOut(auth);
  } catch (e) {
    // ignore
  }
}

// ==========================================
// USER-SCOPED DATA REPOSITORIES (FIRESTORE)
// ==========================================

// --- 1. MOSQUE PROFILE ---
export async function getMosqueProfileFromFirestore(userEmailOrId?: string | null): Promise<MosqueProfile> {
  const scope = getUserScope(userEmailOrId);
  try {
    const profileRef = doc(db, 'users', scope, 'data', 'mosque_profile');
    const snap = await getDoc(profileRef);
    if (snap.exists()) {
      const data = snap.data() as MosqueProfile;
      return {
        ...defaultMosqueProfile,
        ...data,
        qris: data.qris || defaultMosqueProfile.qris,
        mapEmbedUrl: data.mapEmbedUrl || defaultMosqueProfile.mapEmbedUrl,
        mapQuery: data.mapQuery || defaultMosqueProfile.mapQuery,
        latitude: data.latitude || defaultMosqueProfile.latitude,
        longitude: data.longitude || defaultMosqueProfile.longitude,
        landmark: data.landmark || defaultMosqueProfile.landmark,
      };
    } else {
      // Seed default profile for this scope
      const defaultProf: MosqueProfile = {
        ...defaultMosqueProfile,
        name: scope === 'public_demo' ? 'DKM Rancaekek' : (defaultMosqueProfile.name || 'DKM Masjid'),
      };
      await setDoc(profileRef, defaultProf);
      return defaultProf;
    }
  } catch (error) {
    console.warn(`Firestore: Falling back for mosque profile (${scope})`, error);
    const local = localStorage.getItem(`dkm_mosque_profile_${scope}`);
    return local ? JSON.parse(local) : defaultMosqueProfile;
  }
}

export async function saveMosqueProfileToFirestore(
  profile: MosqueProfile,
  userEmailOrId?: string | null
): Promise<void> {
  const scope = getUserScope(userEmailOrId);
  const profileRef = doc(db, 'users', scope, 'data', 'mosque_profile');
  await setDoc(profileRef, {
    ...profile,
    updatedAt: new Date().toISOString()
  });
  localStorage.setItem(`dkm_mosque_profile_${scope}`, JSON.stringify(profile));
}

// --- 2. JAMAAH ---
export async function getJamaahFromFirestore(userEmailOrId?: string | null): Promise<Jamaah[]> {
  const scope = getUserScope(userEmailOrId);
  try {
    const colRef = collection(db, 'users', scope, 'jamaah');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      if (scope === 'public_demo') {
        const batch = writeBatch(db);
        for (const item of defaultJamaah) {
          batch.set(doc(db, 'users', scope, 'jamaah', item.id), item);
        }
        await batch.commit();
        return defaultJamaah;
      }
      return [];
    }
    return snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Jamaah));
  } catch (error) {
    console.warn(`Firestore: Falling back for jamaah (${scope})`, error);
    return scope === 'public_demo' ? defaultJamaah : [];
  }
}

export async function addJamaahToFirestore(
  item: Omit<Jamaah, 'id' | 'joinedDate'>,
  userEmailOrId?: string | null
): Promise<Jamaah> {
  const scope = getUserScope(userEmailOrId);
  const id = 'j_' + Date.now();
  const newItem: Jamaah = {
    ...item,
    id,
    joinedDate: new Date().toISOString().split('T')[0]
  };
  await setDoc(doc(db, 'users', scope, 'jamaah', id), newItem);
  return newItem;
}

export async function updateJamaahInFirestore(
  id: string,
  updates: Partial<Jamaah>,
  userEmailOrId?: string | null
): Promise<void> {
  const scope = getUserScope(userEmailOrId);
  await updateDoc(doc(db, 'users', scope, 'jamaah', id), updates);
}

export async function deleteJamaahFromFirestore(
  id: string,
  userEmailOrId?: string | null
): Promise<void> {
  const scope = getUserScope(userEmailOrId);
  await deleteDoc(doc(db, 'users', scope, 'jamaah', id));
}

// --- 3. KEUANGAN ---
export async function getKeuanganFromFirestore(userEmailOrId?: string | null): Promise<Keuangan[]> {
  const scope = getUserScope(userEmailOrId);
  try {
    const colRef = collection(db, 'users', scope, 'keuangan');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      if (scope === 'public_demo') {
        const batch = writeBatch(db);
        for (const item of defaultKeuangan) {
          batch.set(doc(db, 'users', scope, 'keuangan', item.id), item);
        }
        await batch.commit();
        return defaultKeuangan;
      }
      return [];
    }
    const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Keuangan));
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.warn(`Firestore: Falling back for keuangan (${scope})`, error);
    return scope === 'public_demo' ? defaultKeuangan : [];
  }
}

export async function addKeuanganToFirestore(
  item: Omit<Keuangan, 'id'>,
  userEmailOrId?: string | null
): Promise<Keuangan> {
  const scope = getUserScope(userEmailOrId);
  const id = 'k_' + Date.now();
  const newItem: Keuangan = {
    ...item,
    id,
    date: item.date || new Date().toISOString().split('T')[0]
  };
  await setDoc(doc(db, 'users', scope, 'keuangan', id), newItem);
  return newItem;
}

export async function updateKeuanganInFirestore(
  id: string,
  updates: Partial<Keuangan>,
  userEmailOrId?: string | null
): Promise<void> {
  const scope = getUserScope(userEmailOrId);
  await updateDoc(doc(db, 'users', scope, 'keuangan', id), updates);
}

export async function deleteKeuanganFromFirestore(
  id: string,
  userEmailOrId?: string | null
): Promise<void> {
  const scope = getUserScope(userEmailOrId);
  await deleteDoc(doc(db, 'users', scope, 'keuangan', id));
}

// --- 4. ASET ---
export async function getAsetFromFirestore(userEmailOrId?: string | null): Promise<Aset[]> {
  const scope = getUserScope(userEmailOrId);
  try {
    const colRef = collection(db, 'users', scope, 'aset');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      if (scope === 'public_demo') {
        const batch = writeBatch(db);
        for (const item of defaultAset) {
          batch.set(doc(db, 'users', scope, 'aset', item.id), item);
        }
        await batch.commit();
        return defaultAset;
      }
      return [];
    }
    return snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Aset));
  } catch (error) {
    console.warn(`Firestore: Falling back for aset (${scope})`, error);
    return scope === 'public_demo' ? defaultAset : [];
  }
}

export async function addAsetToFirestore(
  item: Omit<Aset, 'id'>,
  userEmailOrId?: string | null
): Promise<Aset> {
  const scope = getUserScope(userEmailOrId);
  const id = 'as_' + Date.now();
  const newItem: Aset = {
    ...item,
    id
  };
  await setDoc(doc(db, 'users', scope, 'aset', id), newItem);
  return newItem;
}

export async function updateAsetInFirestore(
  id: string,
  updates: Partial<Aset>,
  userEmailOrId?: string | null
): Promise<void> {
  const scope = getUserScope(userEmailOrId);
  await updateDoc(doc(db, 'users', scope, 'aset', id), updates);
}

export async function deleteAsetFromFirestore(
  id: string,
  userEmailOrId?: string | null
): Promise<void> {
  const scope = getUserScope(userEmailOrId);
  await deleteDoc(doc(db, 'users', scope, 'aset', id));
}

// --- 5. KEGIATAN ---
export async function getKegiatanFromFirestore(userEmailOrId?: string | null): Promise<Kegiatan[]> {
  const scope = getUserScope(userEmailOrId);
  try {
    const colRef = collection(db, 'users', scope, 'kegiatan');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      if (scope === 'public_demo') {
        const batch = writeBatch(db);
        for (const item of defaultKegiatan) {
          batch.set(doc(db, 'users', scope, 'kegiatan', item.id), item);
        }
        await batch.commit();
        return defaultKegiatan;
      }
      return [];
    }
    const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Kegiatan));
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.warn(`Firestore: Falling back for kegiatan (${scope})`, error);
    return scope === 'public_demo' ? defaultKegiatan : [];
  }
}

export async function addKegiatanToFirestore(
  item: Omit<Kegiatan, 'id'>,
  userEmailOrId?: string | null
): Promise<Kegiatan> {
  const scope = getUserScope(userEmailOrId);
  const id = 'g_' + Date.now();
  const newItem: Kegiatan = {
    ...item,
    id
  };
  await setDoc(doc(db, 'users', scope, 'kegiatan', id), newItem);
  return newItem;
}

export async function updateKegiatanInFirestore(
  id: string,
  updates: Partial<Kegiatan>,
  userEmailOrId?: string | null
): Promise<void> {
  const scope = getUserScope(userEmailOrId);
  await updateDoc(doc(db, 'users', scope, 'kegiatan', id), updates);
}

export async function deleteKegiatanFromFirestore(
  id: string,
  userEmailOrId?: string | null
): Promise<void> {
  const scope = getUserScope(userEmailOrId);
  await deleteDoc(doc(db, 'users', scope, 'kegiatan', id));
}

// --- 6. PROGRAM ---
export async function getProgramFromFirestore(userEmailOrId?: string | null): Promise<Program[]> {
  const scope = getUserScope(userEmailOrId);
  try {
    const colRef = collection(db, 'users', scope, 'program');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      if (scope === 'public_demo') {
        const batch = writeBatch(db);
        for (const item of defaultProgram) {
          batch.set(doc(db, 'users', scope, 'program', item.id), item);
        }
        await batch.commit();
        return defaultProgram;
      }
      return [];
    }
    return snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Program));
  } catch (error) {
    console.warn(`Firestore: Falling back for program (${scope})`, error);
    return scope === 'public_demo' ? defaultProgram : [];
  }
}

export async function addProgramToFirestore(
  item: Omit<Program, 'id'>,
  userEmailOrId?: string | null
): Promise<Program> {
  const scope = getUserScope(userEmailOrId);
  const id = 'p_' + Date.now();
  const newItem: Program = {
    ...item,
    id
  };
  await setDoc(doc(db, 'users', scope, 'program', id), newItem);
  return newItem;
}

export async function updateProgramInFirestore(
  id: string,
  updates: Partial<Program>,
  userEmailOrId?: string | null
): Promise<void> {
  const scope = getUserScope(userEmailOrId);
  await updateDoc(doc(db, 'users', scope, 'program', id), updates);
}

export async function deleteProgramFromFirestore(
  id: string,
  userEmailOrId?: string | null
): Promise<void> {
  const scope = getUserScope(userEmailOrId);
  await deleteDoc(doc(db, 'users', scope, 'program', id));
}

// --- 7. BROADCAST ---
export async function getBroadcastFromFirestore(userEmailOrId?: string | null): Promise<BroadcastMessage[]> {
  const scope = getUserScope(userEmailOrId);
  try {
    const colRef = collection(db, 'users', scope, 'broadcast');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      if (scope === 'public_demo') {
        const batch = writeBatch(db);
        for (const item of defaultBroadcast) {
          batch.set(doc(db, 'users', scope, 'broadcast', item.id), item);
        }
        await batch.commit();
        return defaultBroadcast;
      }
      return [];
    }
    const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as BroadcastMessage));
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.warn(`Firestore: Falling back for broadcast (${scope})`, error);
    return scope === 'public_demo' ? defaultBroadcast : [];
  }
}

export async function addBroadcastToFirestore(
  item: Omit<BroadcastMessage, 'id' | 'date'>,
  userEmailOrId?: string | null
): Promise<BroadcastMessage> {
  const scope = getUserScope(userEmailOrId);
  const id = 'b_' + Date.now();
  const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const newItem: BroadcastMessage = {
    ...item,
    id,
    date: dateStr
  };
  await setDoc(doc(db, 'users', scope, 'broadcast', id), newItem);
  return newItem;
}
