import React, { useState } from 'react';
import { X, Lock, Mail, ShieldCheck, User, Building2, UserPlus, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { loginUserAccount, registerUserAccount } from '../lib/firestoreService';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regMosqueName, setRegMosqueName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await loginUserAccount(loginEmail, loginPassword);
      onLogin(user);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Gagal masuk. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (regPassword !== regConfirmPassword) {
      setError('Konfirmasi password tidak cocok dengan password yang dimasukkan.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password minimal harus 6 karakter.');
      return;
    }

    setLoading(true);

    try {
      const user = await registerUserAccount(
        regName,
        regEmail,
        regPassword,
        regMosqueName
      );
      onLogin(user);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Gagal mendaftarkan akun. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 my-8">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {currentUser ? 'Akun Pengurus Aktif' : 'Portal Akses & Database Masjid'}
              </h3>
              <p className="text-xs text-slate-500">
                {currentUser ? 'Kelola sesi admin Anda' : 'Data tersimpan terpisah untuk setiap masjid'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser ? (
          /* User Logged In View */
          <div className="py-5 space-y-4 text-center">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-xl font-bold border border-emerald-200">
              👤
            </div>
            <div>
              <p className="text-xs text-slate-500">Anda saat ini masuk sebagai:</p>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">{currentUser.name}</h4>
              <p className="text-xs text-emerald-700 font-semibold">{currentUser.role} &bull; {currentUser.email}</p>
              {currentUser.mosqueName && (
                <p className="text-xs text-slate-600 mt-1 font-medium bg-emerald-50/70 border border-emerald-100 py-1 px-2.5 rounded-lg inline-block">
                  🕌 {currentUser.mosqueName}
                </p>
              )}
            </div>

            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/80 text-left text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Database Cloud Terisolasi Aktif
              </p>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Semua entri (keuangan, jamaah, aset, kegiatan, dan profil masjid) disimpan secara eksklusif untuk akun Anda di Firebase Firestore.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow-sm"
              >
                Keluar (Logout)
              </button>
            </div>
          </div>
        ) : (
          /* Login & Registration Tabs */
          <div className="pt-3">
            {/* Tabs Selector */}
            <div className="flex rounded-xl bg-slate-100 p-1 mb-4 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setError('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  tab === 'login'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Masuk (Login)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setError('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  tab === 'register'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
                Daftar Akun Baru
              </button>
            </div>

            {error && (
              <div className="mb-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {tab === 'login' ? (
              /* FORM LOGIN */
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Pengurus yang Terdaftar
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="contoh: ahmad@gmail.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Masukkan password Anda"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                    {loading ? 'Memverifikasi Data...' : 'Masuk ke Database Masjid'}
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-[11px] text-slate-500">
                    Belum punya akun masjid sendiri?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setTab('register');
                        setError('');
                      }}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      Daftar Akun Baru Sekarang
                    </button>
                  </p>
                </div>
              </form>
            ) : (
              /* FORM DAFTAR AKUN BARU */
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="bg-emerald-50/60 border border-emerald-200/70 p-2.5 rounded-xl text-[11px] text-emerald-900 leading-relaxed">
                  💡 <strong>Data Terpisah & Mandiri:</strong> Setiap akun yang didaftarkan akan dibuatkan ruang data tersendiri di Firebase. Data masjid Anda tidak akan tercampur dengan pengguna lain.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Pengurus <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="contoh: H. Ahmad Fauzi, S.Pd."
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Masjid / Musholla <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="contoh: DKM Masjid Al-Ikhlas"
                      value={regMosqueName}
                      onChange={(e) => setRegMosqueName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Pengurus <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="contoh: dkm.alikhlas@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password (min 6) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="Minimal 6 karakter"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Konfirmasi Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        placeholder="Ulangi password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Tampilkan password</span>
                  </label>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <UserPlus className="w-4 h-4 text-amber-300" />
                    {loading ? 'Mendaftarkan & Membuat Database...' : 'Daftar Akun Baru & Buat Database Masjid'}
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-[11px] text-slate-500">
                    Sudah memiliki akun terdaftar?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setTab('login');
                        setError('');
                      }}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      Masuk di sini
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
