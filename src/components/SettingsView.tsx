import React, { useState, useEffect } from 'react';
import { MosqueProfile, UserProfile } from '../types';
import { loginUserAccount } from '../lib/firestoreService';
import { Settings, ShieldCheck, MapPin, Phone, Lock, Save, LogOut, CheckCircle2, AlertCircle, Eye, EyeOff, Sparkles, Cloud } from 'lucide-react';

interface SettingsViewProps {
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  mosqueProfile: MosqueProfile;
  onUpdateMosqueProfile: (profile: MosqueProfile) => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onLogin,
  onLogout,
  mosqueProfile,
  onUpdateMosqueProfile,
}) => {
  const isAdmin = currentUser?.id === 'admin';

  // Login form state (if not logged in as admin)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Mosque Profile fields state
  const [name, setName] = useState(mosqueProfile?.name || '');
  const [address, setAddress] = useState(mosqueProfile?.address || '');
  const [callCenter, setCallCenter] = useState(mosqueProfile?.callCenter || '');
  const [latitude, setLatitude] = useState<number | string>(mosqueProfile?.latitude ?? -6.9744);
  const [longitude, setLongitude] = useState<number | string>(mosqueProfile?.longitude ?? 107.7617);
  const [landmark, setLandmark] = useState(mosqueProfile?.landmark || '');
  const [postalCode, setPostalCode] = useState(mosqueProfile?.postalCode || '');
  const [mapQuery, setMapQuery] = useState(mosqueProfile?.mapQuery || '');

  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync state with prop updates
  useEffect(() => {
    if (mosqueProfile) {
      setName(mosqueProfile.name);
      setAddress(mosqueProfile.address);
      setCallCenter(mosqueProfile.callCenter);
      setLatitude(mosqueProfile.latitude ?? -6.9744);
      setLongitude(mosqueProfile.longitude ?? 107.7617);
      setLandmark(mosqueProfile.landmark || '');
      setPostalCode(mosqueProfile.postalCode || '');
      setMapQuery(mosqueProfile.mapQuery || '');
    }
  }, [mosqueProfile]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    const inputUser = username.trim().toLowerCase();
    if (inputUser !== 'admin') {
      setLoginError('Halaman ini khusus untuk login Admin Utama (user: admin)');
      setLoading(false);
      return;
    }

    if (password !== 'dkm123') {
      setLoginError('Password yang Anda masukkan salah.');
      setLoading(false);
      return;
    }

    try {
      const user = await loginUserAccount('admin', password);
      onLogin(user);
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setLoginError(err?.message || 'Gagal masuk sebagai admin utama.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setSaveError('Nama masjid tidak boleh kosong.');
      return;
    }

    setSaving(true);
    setSaveSuccess('');
    setSaveError('');

    try {
      const latVal = typeof latitude === 'number' ? latitude : parseFloat(latitude) || -6.9744;
      const lngVal = typeof longitude === 'number' ? longitude : parseFloat(longitude) || 107.7617;
      
      const updatedProfile: MosqueProfile = {
        ...mosqueProfile,
        name: name.trim(),
        address: address.trim(),
        callCenter: callCenter.trim(),
        latitude: latVal,
        longitude: lngVal,
        landmark: landmark.trim(),
        postalCode: postalCode.trim(),
        mapQuery: mapQuery.trim() || undefined,
        mapEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery.trim() || `${latVal},${lngVal}(${name.trim()})`)}&t=&z=16&ie=UTF8&iwloc=&output=embed`
      };

      await onUpdateMosqueProfile(updatedProfile);
      setSaveSuccess('Alhamdulillah, pengaturan identitas masjid berhasil disimpan secara permanen di database!');
      setTimeout(() => setSaveSuccess(''), 6000);
    } catch (err: any) {
      setSaveError(err?.message || 'Gagal menyimpan pengaturan ke database.');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-emerald-900 px-6 py-8 text-center text-white relative">
            <div className="absolute top-4 right-4 bg-emerald-800/60 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-700 flex items-center gap-1">
              <Cloud className="w-3 h-3 text-emerald-400" /> Cloud Sync
            </div>
            <div className="w-16 h-16 rounded-2xl bg-emerald-800/80 border border-emerald-700/80 flex items-center justify-center mx-auto shadow-inner mb-4">
              <Lock className="w-8 h-8 text-amber-300" />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">Akses Pengaturan Utama</h2>
            <p className="text-xs text-emerald-200/90 mt-1.5 max-w-xs mx-auto">
              Silakan masuk menggunakan kredensial Admin Utama untuk mengubah identitas masjid secara permanen.
            </p>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8">
            {loginError && (
              <div className="mb-5 bg-rose-50 border border-rose-150 text-rose-850 p-3.5 rounded-xl text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{loginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Username Admin Utama</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Masukkan 'admin'"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                  />
                  <ShieldCheck className="absolute right-3 top-3 w-4.5 h-4.5 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password Utama</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Masukkan password admin"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-800/50 text-white font-bold py-3 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-300" />
                    <span>Masuk & Buka Pengaturan</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Title Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Settings className="w-5.5 h-5.5 text-emerald-700" /> Pengaturan Identitas Aplikasi
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Kelola profil utama DKM, nama masjid, nomor layanan Whatsapp, dan peta lokasi yang akan diterapkan secara permanen untuk seluruh pengunjung.
          </p>
        </div>
        <button
          onClick={onLogout}
          className="bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition border border-slate-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Keluar Admin Utama
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-start gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Pembaruan Berhasil!</p>
            <p className="font-normal text-emerald-700 mt-0.5">{saveSuccess}</p>
          </div>
        </div>
      )}

      {saveError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs font-semibold flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Gagal Menyimpan</p>
            <p className="font-normal text-rose-700 mt-0.5">{saveError}</p>
          </div>
        </div>
      )}

      {/* Grid Layout settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Fields */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" /> Profil & Identitas DKM Masjid
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Masjid Utama</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Masjid Jami' Al-Ikhlas"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nomor WA Call Center</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={callCenter}
                    onChange={(e) => setCallCenter(e.target.value)}
                    placeholder="Contoh: +62 812-3456-7890"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                  />
                  <Phone className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Alamat Lengkap Masjid</label>
              <div className="relative">
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Alamat lengkap beserta RT, RW, kelurahan, kecamatan, dan kabupaten"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                ></textarea>
                <MapPin className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
              </div>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/60 space-y-4">
              <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" /> Koordinat & Integrasi Peta Lokasi (Google Maps)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Latitude</label>
                  <input
                    type="text"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="-6.9744"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Longitude</label>
                  <input
                    type="text"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="107.7617"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Landmark / Detail Patokan</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Dekat Alun-Alun atau Stasiun"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kode Pos</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="40394"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kata Kunci Pencarian Peta</label>
                <input
                  type="text"
                  value={mapQuery}
                  onChange={(e) => setMapQuery(e.target.value)}
                  placeholder="Contoh: Masjid Besar Rancaekek Bandung"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Digunakan untuk menyusun pencarian otomatis di link Google Maps resmi.
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-800/50 text-white font-bold py-3 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Save className="w-4.5 h-4.5" />
                  <span>Simpan Pengaturan Utama Permanen</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Preview Column */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Live Preview Header</h4>
            
            <div className="bg-emerald-900 text-white p-4 rounded-xl border border-emerald-950 shadow-md">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-8 h-8 rounded bg-emerald-800 border border-emerald-700 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold font-serif text-amber-300">🕌</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <h5 className="text-xs font-bold truncate">{name || 'DKM Rancaekek'}</h5>
                    <span className="bg-emerald-800 text-amber-300 text-[8px] px-1 py-0.2 rounded font-medium border border-emerald-700 flex items-center gap-0.5 shrink-0">
                      Resmi
                    </span>
                  </div>
                  <div className="text-[9px] text-emerald-200 mt-0.5 space-y-0.5">
                    <p className="flex items-center gap-0.5 truncate max-w-[200px]">
                      <MapPin className="w-2 h-2 text-amber-400 shrink-0" />
                      <span className="truncate">{address || 'Jl. Raya Rancaekek...'}</span>
                    </p>
                    <p className="flex items-center gap-0.5 text-amber-300 font-medium">
                      <Phone className="w-2 h-2 text-amber-400 shrink-0" />
                      <span>WA: {callCenter || '+62 812...'}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 mt-3 text-[11px] text-slate-600 leading-relaxed">
              <span className="font-bold text-emerald-850">Informasi Penting:</span> Ketika Anda menyimpan pengaturan ini, data profil masjid di atas akan langsung disimpan secara permanen di database cloud Firestore. Perubahan akan langsung terlihat di bagian atas (header) aplikasi oleh siapa saja, bahkan setelah Anda melakukan log out.
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Sistem Autentikasi Mandiri</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Kredensial utama dilindungi dengan hash keamanan lokal dan cloud. Gunakan password default <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-emerald-800">dkm123</code> untuk login admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
