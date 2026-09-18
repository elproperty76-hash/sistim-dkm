import React, { useState, useEffect } from 'react';
import { Jamaah, MosqueProfile } from '../types';
import {
  Users,
  UserPlus,
  Search,
  Phone,
  MapPin,
  Trash2,
  Edit2,
  ShieldCheck,
  Filter,
  Building2,
  Save,
  QrCode,
  CreditCard,
  Lock,
  Navigation,
  Compass,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import { QRISAccountSettings } from './QRISAccountSettings';
import { MosqueMapCard } from './MosqueMapCard';

interface JamaahViewProps {
  jamaahList: Jamaah[];
  onAddJamaah: (jamaah: Omit<Jamaah, 'id' | 'joinedDate'>) => void;
  onUpdateJamaah?: (id: string, jamaah: Partial<Jamaah>) => void;
  onDeleteJamaah: (id: string) => void;
  isAdmin?: boolean;
  mosqueProfile?: MosqueProfile;
  onUpdateMosqueProfile?: (profile: MosqueProfile) => void;
}

export const JamaahView: React.FC<JamaahViewProps> = ({
  jamaahList,
  onAddJamaah,
  onUpdateJamaah,
  onDeleteJamaah,
  isAdmin = false,
  mosqueProfile,
  onUpdateMosqueProfile
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Jamaah | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [activeSection, setActiveSection] = useState<'jamaah' | 'qris' | 'masjid'>('jamaah');

  // Mosque Profile & Location State
  const [mosqueName, setMosqueName] = useState(mosqueProfile?.name || 'DKM Rancaekek');
  const [mosqueAddress, setMosqueAddress] = useState(mosqueProfile?.address || 'Jl. Raya Rancaekek - Majalaya No. 12, Rancaekek Kulon, Kec. Rancaekek, Kabupaten Bandung, Jawa Barat');
  const [mosqueCallCenter, setMosqueCallCenter] = useState(mosqueProfile?.callCenter || '+62 812-2345-6789');
  const [mosqueLat, setMosqueLat] = useState<number | string>(mosqueProfile?.latitude ?? -6.9744);
  const [mosqueLng, setMosqueLng] = useState<number | string>(mosqueProfile?.longitude ?? 107.7617);
  const [mosqueLandmark, setMosqueLandmark] = useState(mosqueProfile?.landmark || 'Dekat Stasiun Kereta Api Rancaekek & Alun-Alun Rancaekek');
  const [mosquePostalCode, setMosquePostalCode] = useState(mosqueProfile?.postalCode || '40394');
  const [mosqueMapQuery, setMosqueMapQuery] = useState(mosqueProfile?.mapQuery || 'Masjid Besar Rancaekek Bandung');
  const [gettingGPS, setGettingGPS] = useState(false);

  useEffect(() => {
    if (mosqueProfile) {
      setMosqueName(mosqueProfile.name);
      setMosqueAddress(mosqueProfile.address);
      setMosqueCallCenter(mosqueProfile.callCenter);
      setMosqueLat(mosqueProfile.latitude ?? -6.9744);
      setMosqueLng(mosqueProfile.longitude ?? 107.7617);
      setMosqueLandmark(mosqueProfile.landmark || 'Dekat Stasiun Kereta Api Rancaekek & Alun-Alun Rancaekek');
      setMosquePostalCode(mosqueProfile.postalCode || '40394');
      setMosqueMapQuery(mosqueProfile.mapQuery || 'Masjid Besar Rancaekek Bandung');
    }
  }, [mosqueProfile]);

  const handleResetRancaekekLocation = () => {
    setMosqueAddress('Jl. Raya Rancaekek - Majalaya No. 12, Rancaekek Kulon, Kec. Rancaekek, Kabupaten Bandung, Jawa Barat');
    setMosqueLat(-6.9744);
    setMosqueLng(107.7617);
    setMosqueLandmark('Dekat Stasiun Kereta Api Rancaekek & Alun-Alun Rancaekek');
    setMosquePostalCode('40394');
    setMosqueMapQuery('Masjid Besar Rancaekek Bandung');
  };

  const handleGetDeviceGPS = () => {
    if (!navigator.geolocation) return;
    setGettingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMosqueLat(Number(pos.coords.latitude.toFixed(6)));
        setMosqueLng(Number(pos.coords.longitude.toFixed(6)));
        setGettingGPS(false);
      },
      () => {
        setGettingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSaveMosqueProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mosqueName.trim()) return;
    if (onUpdateMosqueProfile) {
      onUpdateMosqueProfile({
        ...(mosqueProfile || {}),
        name: mosqueName.trim(),
        address: mosqueAddress.trim(),
        callCenter: mosqueCallCenter.trim(),
        latitude: typeof mosqueLat === 'number' ? mosqueLat : (parseFloat(mosqueLat) || -6.9744),
        longitude: typeof mosqueLng === 'number' ? mosqueLng : (parseFloat(mosqueLng) || 107.7617),
        landmark: mosqueLandmark.trim(),
        postalCode: mosquePostalCode.trim(),
        mapQuery: mosqueMapQuery.trim() || undefined,
        mapEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(mosqueMapQuery.trim() || `${mosqueLat},${mosqueLng}(${mosqueName})`)}&t=&z=16&ie=UTF8&iwloc=&output=embed`
      });
    }
  };

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<'Pengurus' | 'Remaja Masjid' | 'Jamaah' | 'Muallaf'>('Jamaah');
  const [status, setStatus] = useState<'Aktif' | 'Non-Aktif'>('Aktif');

  const handleOpenEdit = (j: Jamaah) => {
    setEditTarget(j);
    setName(j.name);
    setRole(j.role);
    setPhone(j.phone);
    setAddress(j.address);
    setCategory(j.category);
    setStatus(j.status);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;
    if (editTarget && onUpdateJamaah) {
      onUpdateJamaah(editTarget.id, { name, role, phone, address, category, status });
      setEditTarget(null);
    } else {
      onAddJamaah({ name, role, phone, address, category, status });
    }
    setName('');
    setRole('');
    setPhone('');
    setAddress('');
    setShowAddModal(false);
  };

  const filteredJamaah = jamaahList.filter((j) => {
    const matchesSearch = j.name.toLowerCase().includes(searchQuery.toLowerCase()) || j.role.toLowerCase().includes(searchQuery.toLowerCase()) || j.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || j.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Sub-Navigasi Halaman Pendataan */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSection('jamaah')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSection === 'jamaah'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Direktori Jamaah & Pengurus</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeSection === 'jamaah' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-100 text-slate-700'
            }`}>
              {jamaahList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSection('qris')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSection === 'qris'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4 text-amber-500" />
            <span>Seting Rekening Penerima & QRIS</span>
            {isAdmin ? (
              <span className="bg-amber-400 text-emerald-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                Admin
              </span>
            ) : (
              <span className="bg-slate-100 text-slate-500 text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" /> Terkunci
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('masjid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeSection === 'masjid'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Identitas Masjid & Peta Lokasi</span>
          </button>
        </div>

        {/* Quick status badge */}
        <div className="hidden sm:flex items-center gap-2 text-xs pr-2">
          {isAdmin ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Mode Pengurus DKM Aktif
            </span>
          ) : (
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              Mode Publik (Hanya Baca)
            </span>
          )}
        </div>
      </div>

      {/* SECTION 1: SETING REKENING PENERIMA & QRIS */}
      {activeSection === 'qris' && (
        <QRISAccountSettings
          mosqueProfile={mosqueProfile}
          isAdmin={isAdmin}
          onUpdateMosqueProfile={onUpdateMosqueProfile}
        />
      )}

      {/* SECTION 2: IDENTITAS MASJID, LOKASI & PETA GOOGLE MAPS */}
      {activeSection === 'masjid' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Identitas Masjid & Pengaturan Peta Lokasi Google Maps</h3>
                  <p className="text-xs text-slate-500">Nama masjid, alamat, nomor WA, dan koordinat Google Maps memudahkan jamaah serta musafir menemukan lokasi DKM Rancaekek</p>
                </div>
              </div>
              {isAdmin ? (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" /> Mode Admin Aktif
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0">
                  Hanya Admin yang dapat mengubah
                </span>
              )}
            </div>

            <form onSubmit={handleSaveMosqueProfile} className="space-y-5">
              {/* Baris 1: Informasi Dasar Masjid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Masjid <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isAdmin}
                    value={mosqueName}
                    onChange={(e) => setMosqueName(e.target.value)}
                    placeholder="Contoh: DKM Rancaekek / Masjid Besar Rancaekek"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-80 disabled:bg-slate-100 transition"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Ditampilkan di Header, Sidebar, dan Pin Peta</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Alamat Lengkap Masjid <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isAdmin}
                    value={mosqueAddress}
                    onChange={(e) => setMosqueAddress(e.target.value)}
                    placeholder="Contoh: Jl. Raya Rancaekek - Majalaya No. 12, Rancaekek Kulon"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-80 disabled:bg-slate-100 transition"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Alamat fisik yang dapat disalin oleh jamaah</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    No. WA Call Center <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      disabled={!isAdmin}
                      value={mosqueCallCenter}
                      onChange={(e) => setMosqueCallCenter(e.target.value)}
                      placeholder="Contoh: +62 812-2345-6789"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-80 disabled:bg-slate-100 transition"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Dihubungkan ke tombol chat WA langsung</p>
                </div>
              </div>

              {/* Baris 2: Pengaturan Koordinat Google Maps & Landmark */}
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                    <Compass className="w-4 h-4 text-emerald-700" />
                    <span>Koordinat Titik Lokasi Google Maps</span>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResetRancaekekLocation}
                        className="text-[11px] bg-white text-emerald-800 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold flex items-center gap-1 transition cursor-pointer"
                        title="Kembalikan ke titik koordinat DKM Rancaekek"
                      >
                        <RotateCcw className="w-3 h-3 text-emerald-600" />
                        <span>Reset Titik DKM Rancaekek</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleGetDeviceGPS}
                        disabled={gettingGPS}
                        className="text-[11px] bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition cursor-pointer"
                        title="Ambil titik GPS dari perangkat saat ini"
                      >
                        <Navigation className={`w-3 h-3 text-amber-300 ${gettingGPS ? 'animate-spin' : ''}`} />
                        <span>{gettingGPS ? 'Mencari GPS...' : 'Ambil GPS Saya'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Latitude (Garis Lintang)
                    </label>
                    <input
                      type="text"
                      disabled={!isAdmin}
                      value={mosqueLat}
                      onChange={(e) => setMosqueLat(e.target.value)}
                      placeholder="-6.9744"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-80 disabled:bg-slate-100 transition"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">Default Rancaekek: -6.9744</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Longitude (Garis Bujur)
                    </label>
                    <input
                      type="text"
                      disabled={!isAdmin}
                      value={mosqueLng}
                      onChange={(e) => setMosqueLng(e.target.value)}
                      placeholder="107.7617"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-80 disabled:bg-slate-100 transition"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">Default Rancaekek: 107.7617</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Patokan / Landmark Terdekat
                    </label>
                    <input
                      type="text"
                      disabled={!isAdmin}
                      value={mosqueLandmark}
                      onChange={(e) => setMosqueLandmark(e.target.value)}
                      placeholder="Dekat Stasiun Rancaekek"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-80 disabled:bg-slate-100 transition"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">Petunjuk visual untuk jamaah</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Kode Pos Wilayah
                    </label>
                    <input
                      type="text"
                      disabled={!isAdmin}
                      value={mosquePostalCode}
                      onChange={(e) => setMosquePostalCode(e.target.value)}
                      placeholder="40394"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-80 disabled:bg-slate-100 transition"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">Kecamatan Rancaekek: 40394</p>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Kueri Pencarian Lokasi Google Maps (Search Query / Nama Tempat)
                  </label>
                  <input
                    type="text"
                    disabled={!isAdmin}
                    value={mosqueMapQuery}
                    onChange={(e) => setMosqueMapQuery(e.target.value)}
                    placeholder="Contoh: Masjid Besar Rancaekek Bandung"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-80 disabled:bg-slate-100 transition"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Kueri ini digunakan untuk sematan iframe Google Maps dan tautan navigasi aplikasi Google Maps.
                  </p>
                </div>
              </div>

              {isAdmin && (
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Simpan Profil Masjid & Perbarui Peta
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Pratinjau Komponen Peta Lokasi */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Pratinjau Komponen Peta Google Maps (Tampilan Jamaah):</span>
              </h4>
              <span className="text-[11px] text-slate-500">
                Peta interaktif dapat digeser, diperbesar (zoom), dan beralih ke citra satelit
              </span>
            </div>
            <MosqueMapCard
              mosqueProfile={{
                name: mosqueName,
                address: mosqueAddress,
                callCenter: mosqueCallCenter,
                latitude: typeof mosqueLat === 'number' ? mosqueLat : (parseFloat(mosqueLat) || -6.9744),
                longitude: typeof mosqueLng === 'number' ? mosqueLng : (parseFloat(mosqueLng) || 107.7617),
                landmark: mosqueLandmark,
                postalCode: mosquePostalCode,
                mapQuery: mosqueMapQuery,
                qris: mosqueProfile?.qris
              }}
              isAdmin={isAdmin}
            />
          </div>
        </div>
      )}

      {/* SECTION 3: DIREKTORI JAMAAH & PENGURUS */}
      {activeSection === 'jamaah' && (
        <>
          {/* Quick Notice Banner for Setting QRIS */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50/50 p-4 rounded-xl border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-700">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-amber-300 flex items-center justify-center shrink-0">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900">Pengaturan Rekening Kas & QRIS Donasi Digital:</span>
                <p className="text-[11px] text-slate-600">
                  Nomor rekening bank kas masjid & barcode QRIS untuk jamaah dapat disesuaikan pada tab pengaturan rekening.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveSection('qris')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-300" />
              <span>Kelola Rekening & QRIS</span>
            </button>
          </div>

          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Pendataan Jamaah & Pengurus DKM</h2>
              <p className="text-xs text-slate-500 mt-0.5">Direktori pengurus, remaja masjid, dan jamaah aktif di Kecamatan Rancaekek</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm cursor-pointer"
              >
                <UserPlus className="w-4 h-4" /> Tambah Jamaah / Pengurus
              </button>
            )}
          </div>

          {/* Filter & Search */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama, jabatan, atau alamat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              {['All', 'Pengurus', 'Remaja Masjid', 'Jamaah', 'Muallaf'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                    filterCategory === cat ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'All' ? 'Semua Kategori' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Jamaah */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJamaah.map((j) => (
              <div key={j.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">{j.name}</h3>
                      <p className="text-xs font-semibold text-emerald-700 mt-0.5">{j.role}</p>
                    </div>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                      j.category === 'Pengurus' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      j.category === 'Remaja Masjid' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {j.category}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 mb-4">
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{j.phone}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="line-clamp-1">{j.address}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Bergabung: {j.joinedDate}</span>
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(j)}
                        className="text-emerald-700 hover:text-emerald-900 p-1.5 rounded-lg hover:bg-emerald-50 transition cursor-pointer"
                        title="Edit data"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: j.id, name: j.name })}
                        className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                        title="Hapus data"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredJamaah.length === 0 && (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700">Tidak ada data jamaah yang ditemukan.</p>
              <p className="text-xs text-slate-500 mt-1">Coba ubah kata kunci pencarian atau kategori filter.</p>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Hapus Data Jamaah"
        message={`Apakah Anda yakin ingin menghapus data "${deleteTarget?.name}" dari direktori DKM? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={() => {
          if (deleteTarget) {
            onDeleteJamaah(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Add / Edit Modal */}
      {(showAddModal || editTarget !== null) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{editTarget ? 'Edit Data Jamaah / Pengurus' : 'Tambah Data Jamaah / Pengurus'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: H. Asep Saepudin, S.Ag."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan / Peran</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ketua DKM / Imam / Jamaah"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp / Telepon</label>
                <input
                  type="text"
                  placeholder="Contoh: +62 812-3456-7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Domisili di Rancaekek</label>
                <input
                  type="text"
                  placeholder="Contoh: Kp. Bojongloa RT 03/05 Rancaekek"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Pengurus">Pengurus DKM</option>
                  <option value="Remaja Masjid">Remaja Masjid (IRMAS)</option>
                  <option value="Jamaah">Jamaah Regular</option>
                  <option value="Muallaf">Muallaf binaan</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditTarget(null); }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition shadow-sm"
                >
                  {editTarget ? 'Simpan Perubahan' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

