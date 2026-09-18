import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { JamaahView } from './components/JamaahView';
import { KeuanganView } from './components/KeuanganView';
import { AsetView } from './components/AsetView';
import { GalleryView } from './components/GalleryView';
import { ProgramView } from './components/ProgramView';
import { LaporanView } from './components/LaporanView';
import { BroadcastView } from './components/BroadcastView';
import { PrayerSchedule } from './components/PrayerSchedule';
import { AIModal } from './components/AIModal';
import { LoginModal } from './components/LoginModal';
import { MosqueLocationModal } from './components/MosqueLocationModal';
import { Toast } from './components/Toast';
import { Jamaah, Keuangan, Aset, Kegiatan, Program, BroadcastMessage, Stats, MosqueProfile, UserProfile } from './types';

import {
  getMosqueProfileFromFirestore,
  saveMosqueProfileToFirestore,
  getJamaahFromFirestore,
  addJamaahToFirestore,
  updateJamaahInFirestore,
  deleteJamaahFromFirestore,
  getKeuanganFromFirestore,
  addKeuanganToFirestore,
  updateKeuanganInFirestore,
  deleteKeuanganFromFirestore,
  getAsetFromFirestore,
  addAsetToFirestore,
  updateAsetInFirestore,
  deleteAsetFromFirestore,
  getKegiatanFromFirestore,
  addKegiatanToFirestore,
  updateKegiatanInFirestore,
  deleteKegiatanFromFirestore,
  getProgramFromFirestore,
  addProgramToFirestore,
  updateProgramInFirestore,
  deleteProgramFromFirestore,
  getBroadcastFromFirestore,
  addBroadcastToFirestore,
  logoutUserAccount,
  defaultMosqueProfile
} from './lib/firestoreService';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [jamaahList, setJamaahList] = useState<Jamaah[]>([]);
  const [keuanganList, setKeuanganList] = useState<Keuangan[]>([]);
  const [asetList, setAsetList] = useState<Aset[]>([]);
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [programList, setProgramList] = useState<Program[]>([]);
  const [broadcastList, setBroadcastList] = useState<BroadcastMessage[]>([]);
  const [mosqueProfile, setMosqueProfile] = useState<MosqueProfile>(() => {
    const saved = localStorage.getItem('dkm_mosque_profile');
    return saved ? JSON.parse(saved) : defaultMosqueProfile;
  });
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('dkm_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const userScope = currentUser?.id || currentUser?.email || null;

  const calculateStats = (keuangan: Keuangan[], jamaah: Jamaah[], aset: Aset[], program: Program[], kegiatan: Kegiatan[]): Stats => {
    const totalInfaq = keuangan.filter(k => k.type === 'IN').reduce((sum, k) => sum + k.amount, 0);
    const totalKeluar = keuangan.filter(k => k.type === 'OUT').reduce((sum, k) => sum + k.amount, 0);
    const saldoKas = totalInfaq - totalKeluar;
    const totalAsetNilai = aset.reduce((sum, a) => sum + (a.value * a.qty), 0);
    return {
      totalJamaah: jamaah.length,
      totalPengurus: jamaah.filter(j => j.category === 'Pengurus').length,
      saldoKas,
      totalInfaq,
      totalKeluar,
      totalAset: aset.length,
      totalAsetNilai,
      totalProgram: program.length,
      totalKegiatan: kegiatan.length
    };
  };

  const fetchData = async (scopeParam?: string | null) => {
    const activeScope = scopeParam !== undefined ? scopeParam : userScope;
    try {
      const [jamaahRes, keuanganRes, asetRes, kegiatanRes, programRes, broadcastRes, masjidRes] = await Promise.all([
        getJamaahFromFirestore(activeScope),
        getKeuanganFromFirestore(activeScope),
        getAsetFromFirestore(activeScope),
        getKegiatanFromFirestore(activeScope),
        getProgramFromFirestore(activeScope),
        getBroadcastFromFirestore(activeScope),
        getMosqueProfileFromFirestore(activeScope)
      ]);

      setJamaahList(jamaahRes);
      setKeuanganList(keuanganRes);
      setAsetList(asetRes);
      setKegiatanList(kegiatanRes);
      setProgramList(programRes);
      setBroadcastList(broadcastRes);
      setMosqueProfile(masjidRes);
      localStorage.setItem('dkm_mosque_profile', JSON.stringify(masjidRes));

      setStats(calculateStats(keuanganRes, jamaahRes, asetRes, programRes, kegiatanRes));
    } catch (err) {
      console.error("Failed to fetch Firestore DKM data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMosqueProfile = async (profile: MosqueProfile) => {
    setMosqueProfile(profile);
    localStorage.setItem('dkm_mosque_profile', JSON.stringify(profile));
    try {
      await saveMosqueProfileToFirestore(profile, userScope);
      setToastMessage(`Profil identitas ${profile.name} berhasil disimpan ke database Anda.`);
    } catch (e) {
      console.error("Failed to save mosque profile to Firestore:", e);
      setToastMessage(`Profil disimpan lokal, namun gagal sync Firebase.`);
    }
  };

  useEffect(() => {
    fetchData(userScope);
  }, [userScope]);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('dkm_current_user', JSON.stringify(user));
    const scope = user.id || user.email;
    fetchData(scope);
    setToastMessage(`Alhamdulillah, berhasil masuk sebagai ${user.name}. Database masjid Anda siap digunakan!`);
  };

  const handleLogout = async () => {
    await logoutUserAccount();
    setCurrentUser(null);
    localStorage.removeItem('dkm_current_user');
    fetchData(null);
    setToastMessage("Anda telah keluar (logout) dari akun pengurus.");
  };

  const handleAddJamaah = async (newJ: Omit<Jamaah, 'id' | 'joinedDate'>) => {
    try {
      await addJamaahToFirestore(newJ, userScope);
      await fetchData();
      setToastMessage(`Data jamaah "${newJ.name}" berhasil disimpan.`);
    } catch (e) {
      console.error(e);
      setToastMessage("Gagal menyimpan ke database.");
    }
  };

  const handleUpdateJamaah = async (id: string, jamaah: Partial<Jamaah>) => {
    try {
      await updateJamaahInFirestore(id, jamaah, userScope);
      await fetchData();
      setToastMessage("Perubahan data jamaah berhasil disimpan.");
    } catch (e) {
      console.error(e);
      setToastMessage("Gagal memperbarui data.");
    }
  };

  const handleDeleteJamaah = async (id: string) => {
    try {
      await deleteJamaahFromFirestore(id, userScope);
      await fetchData();
      setToastMessage("Data jamaah berhasil dihapus.");
    } catch (e) {
      console.error(e);
      setToastMessage("Gagal menghapus data.");
    }
  };

  const handleAddTransaction = async (tx: Omit<Keuangan, 'id'>) => {
    try {
      await addKeuanganToFirestore(tx, userScope);
      await fetchData();
      setToastMessage(`Transaksi "${tx.description}" berhasil dicatat.`);
    } catch (e) {
      console.error(e);
      setToastMessage("Gagal menyimpan transaksi.");
    }
  };

  const handleUpdateTransaction = async (id: string, tx: Partial<Keuangan>) => {
    try {
      await updateKeuanganInFirestore(id, tx, userScope);
      await fetchData();
      setToastMessage("Transaksi keuangan berhasil diperbarui.");
    } catch (e) {
      console.error(e);
      setToastMessage("Gagal memperbarui transaksi.");
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteKeuanganFromFirestore(id, userScope);
      await fetchData();
      setToastMessage("Transaksi keuangan berhasil dihapus.");
    } catch (e) {
      console.error(e);
      setToastMessage("Gagal menghapus transaksi.");
    }
  };

  const handleAddAset = async (aset: Omit<Aset, 'id'>) => {
    try {
      await addAsetToFirestore(aset, userScope);
      await fetchData();
      setToastMessage(`Aset "${aset.name}" berhasil ditambahkan.`);
    } catch (e) {
      console.error(e);
      setToastMessage("Gagal menyimpan aset.");
    }
  };

  const handleUpdateAset = async (id: string, aset: Partial<Aset>) => {
    try {
      await updateAsetInFirestore(id, aset, userScope);
      await fetchData();
      setToastMessage("Data aset berhasil diperbarui.");
    } catch (e) {
      console.error(e);
      setToastMessage("Gagal memperbarui aset.");
    }
  };

  const handleDeleteAset = async (id: string) => {
    try {
      await deleteAsetFromFirestore(id, userScope);
      await fetchData();
      setToastMessage("Data aset berhasil dihapus.");
    } catch (e) {
      console.error(e);
      setToastMessage("Gagal menghapus aset.");
    }
  };

  const handleAddKegiatan = async (k: Omit<Kegiatan, 'id'>) => {
    try {
      await addKegiatanToFirestore(k, userScope);
      await fetchData();
      setToastMessage(`Dokumentasi kegiatan "${k.title}" berhasil disimpan.`);
    } catch (e) {
      console.error(e);
      setToastMessage("Gagal menyimpan kegiatan.");
    }
  };

  const handleUpdateKegiatan = async (id: string, k: Partial<Kegiatan>) => {
    try {
      await updateKegiatanInFirestore(id, k, userScope);
      await fetchData();
      setToastMessage("Dokumentasi kegiatan berhasil diperbarui.");
    } catch (e) {
      console.error(e);
      setToastMessage("Gagal memperbarui kegiatan.");
    }
  };

  const handleDeleteKegiatan = async (id: string) => {
    try {
      await deleteKegiatanFromFirestore(id, userScope);
      await fetchData();
      setToastMessage("Dokumentasi kegiatan berhasil dihapus.");
    } catch (e) {
      console.error(e);
      setToastMessage("Gagal menghapus kegiatan.");
    }
  };

  const handleAddProgram = async (p: Omit<Program, 'id'>) => {
    try {
      await addProgramToFirestore(p, userScope);
      await fetchData();
      setToastMessage(`Program DKM "${p.title}" berhasil disimpan.`);
    } catch (e) {
      console.error(e);
      setToastMessage("Gagal menyimpan program.");
    }
  };

  const handleUpdateProgram = async (id: string, p: Partial<Program>) => {
    try {
      await updateProgramInFirestore(id, p, userScope);
      await fetchData();
      setToastMessage("Program DKM berhasil diperbarui.");
    } catch (e) {
      console.error(e);
      setToastMessage("Gagal memperbarui program.");
    }
  };

  const handleDeleteProgram = async (id: string) => {
    try {
      await deleteProgramFromFirestore(id, userScope);
      await fetchData();
      setToastMessage("Program DKM berhasil dihapus.");
    } catch (e) {
      console.error(e);
      setToastMessage("Gagal menghapus program.");
    }
  };

  const handleSendBroadcast = async (msg: { title: string; recipient: string; message: string }) => {
    try {
      await addBroadcastToFirestore({ ...msg, status: 'Terkirim (WhatsApp Gateway)' }, userScope);
      await fetchData();
      setToastMessage("Pesan berhasil disiarkan dan dicatat.");
    } catch (e) {
      console.error(e);
      setToastMessage("Gagal mencatat siaran.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-slate-600">Memuat Sistem Manajemen DKM Rancaekek...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Header
        onOpenBroadcast={() => setCurrentTab('broadcast')}
        onOpenAI={() => setIsAIModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onOpenMap={() => setIsMapModalOpen(true)}
        currentUser={currentUser}
        mosqueProfile={mosqueProfile}
      />

      {/* Ticker Jadwal Sholat Real-Time */}
      <PrayerSchedule compact={true} mosqueProfile={mosqueProfile} />

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} mosqueName={mosqueProfile.name} />

        <main className="flex-1 min-w-0">
          {currentTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              keuanganList={keuanganList}
              programList={programList}
              kegiatanList={kegiatanList}
              onNavigate={setCurrentTab}
              mosqueProfile={mosqueProfile}
              isAdmin={Boolean(currentUser)}
              onUpdateMosqueProfile={handleUpdateMosqueProfile}
            />
          )}
          {currentTab === 'sholat' && (
            <div className="space-y-6">
              <PrayerSchedule mosqueProfile={mosqueProfile} />
            </div>
          )}
          {currentTab === 'jamaah' && (
            <JamaahView
              jamaahList={jamaahList}
              onAddJamaah={handleAddJamaah}
              onUpdateJamaah={handleUpdateJamaah}
              onDeleteJamaah={handleDeleteJamaah}
              isAdmin={Boolean(currentUser)}
              mosqueProfile={mosqueProfile}
              onUpdateMosqueProfile={handleUpdateMosqueProfile}
            />
          )}
          {currentTab === 'keuangan' && (
            <KeuanganView
              keuanganList={keuanganList}
              onAddTransaction={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              isAdmin={Boolean(currentUser)}
            />
          )}
          {currentTab === 'aset' && (
            <AsetView
              asetList={asetList}
              onAddAset={handleAddAset}
              onUpdateAset={handleUpdateAset}
              onDeleteAset={handleDeleteAset}
              isAdmin={Boolean(currentUser)}
            />
          )}
          {currentTab === 'kegiatan' && (
            <GalleryView
              kegiatanList={kegiatanList}
              onAddKegiatan={handleAddKegiatan}
              onUpdateKegiatan={handleUpdateKegiatan}
              onDeleteKegiatan={handleDeleteKegiatan}
              isAdmin={Boolean(currentUser)}
            />
          )}
          {currentTab === 'program' && (
            <ProgramView
              programList={programList}
              onAddProgram={handleAddProgram}
              onUpdateProgram={handleUpdateProgram}
              onDeleteProgram={handleDeleteProgram}
              isAdmin={Boolean(currentUser)}
            />
          )}
          {currentTab === 'laporan' && (
            <LaporanView
              keuanganList={keuanganList}
              asetList={asetList}
            />
          )}
          {currentTab === 'broadcast' && (
            <BroadcastView
              broadcastList={broadcastList}
              onSendBroadcast={handleSendBroadcast}
              isAdmin={Boolean(currentUser)}
            />
          )}
        </main>
      </div>

      <AIModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      <MosqueLocationModal
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        mosqueProfile={mosqueProfile}
        isAdmin={Boolean(currentUser)}
        onNavigateToSettings={() => {
          setIsMapModalOpen(false);
          setCurrentTab('jamaah');
        }}
      />
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-auto">
        <p className="flex items-center justify-center gap-1.5 flex-wrap">
          <span>© 2026 {mosqueProfile.name} -</span>
          <button
            type="button"
            onClick={() => setIsMapModalOpen(true)}
            className="hover:text-emerald-700 underline underline-offset-2 cursor-pointer"
            title="Klik untuk membuka peta lokasi Google Maps"
          >
            {mosqueProfile.address}
          </button>
          <span>. All rights reserved.</span>
        </p>
      </footer>
    </div>
  );
}

