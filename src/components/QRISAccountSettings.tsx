import React, { useState, useEffect } from 'react';
import {
  QrCode,
  CreditCard,
  Building2,
  ShieldCheck,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Upload,
  RefreshCw,
  Eye,
  Info,
  ExternalLink,
  Smartphone
} from 'lucide-react';
import { MosqueProfile, DonationQRIS } from '../types';

interface QRISAccountSettingsProps {
  mosqueProfile?: MosqueProfile;
  isAdmin?: boolean;
  onUpdateMosqueProfile?: (profile: MosqueProfile) => void;
}

const BANK_PRESETS = [
  'Bank Syariah Indonesia (BSI)',
  'Bank BJB / BJB Syariah',
  'Bank Muamalat Indonesia',
  'Bank Mandiri',
  'Bank Central Asia (BCA)',
  'Bank Rakyat Indonesia (BRI)',
  'Bank Negara Indonesia (BNI)',
  'Bank CIMB Niaga Syariah',
  'Bank Mega Syariah',
  'Lainnya (Ketik Manual)'
];

export const QRISAccountSettings: React.FC<QRISAccountSettingsProps> = ({
  mosqueProfile,
  isAdmin = false,
  onUpdateMosqueProfile
}) => {
  const currentQRIS = mosqueProfile?.qris;

  // Form states
  const [bankName, setBankName] = useState(currentQRIS?.bankName || 'Bank Syariah Indonesia (BSI)');
  const [customBank, setCustomBank] = useState('');
  const [isCustomBank, setIsCustomBank] = useState(false);
  const [accountNumber, setAccountNumber] = useState(currentQRIS?.accountNumber || '7144829103');
  const [accountHolder, setAccountHolder] = useState(
    currentQRIS?.accountHolder || (mosqueProfile?.name ? `${mosqueProfile.name} PEDULI UMAT` : 'DKM RANCAEKEK PEDULI UMAT')
  );
  const [merchantName, setMerchantName] = useState(
    currentQRIS?.merchantName || (mosqueProfile?.name ? mosqueProfile.name.toUpperCase() : 'DKM MASJID BESAR RANCAEKEK')
  );
  const [nmid, setNmid] = useState(currentQRIS?.nmid || 'ID1020038472918');
  const [qrImageUrl, setQrImageUrl] = useState(currentQRIS?.qrImageUrl || '');
  const [instructions, setInstructions] = useState(
    currentQRIS?.instructions || 'Buka aplikasi perbankan atau e-wallet (BSI, Mandiri, BCA, GoPay, OVO, DANA), scan kode QR di atas.'
  );

  const [copiedRekening, setCopiedRekening] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewTab, setPreviewTab] = useState<'qris' | 'rekening'>('qris');

  // Synchronize when mosqueProfile updates
  useEffect(() => {
    if (mosqueProfile?.qris) {
      const q = mosqueProfile.qris;
      if (BANK_PRESETS.includes(q.bankName || '')) {
        setBankName(q.bankName || 'Bank Syariah Indonesia (BSI)');
        setIsCustomBank(false);
      } else if (q.bankName) {
        setBankName('Lainnya (Ketik Manual)');
        setCustomBank(q.bankName);
        setIsCustomBank(true);
      }
      setAccountNumber(q.accountNumber || '');
      setAccountHolder(q.accountHolder || '');
      setMerchantName(q.merchantName || '');
      setNmid(q.nmid || '');
      setQrImageUrl(q.qrImageUrl || '');
      setInstructions(q.instructions || '');
    }
  }, [mosqueProfile]);

  const handleBankSelectChange = (val: string) => {
    setBankName(val);
    if (val === 'Lainnya (Ketik Manual)') {
      setIsCustomBank(true);
    } else {
      setIsCustomBank(false);
    }
  };

  const handleCopyTest = () => {
    if (!accountNumber) return;
    navigator.clipboard.writeText(accountNumber);
    setCopiedRekening(true);
    setTimeout(() => setCopiedRekening(false), 2000);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Mohon pilih berkas gambar (PNG, JPG, JPEG, WEBP).');
      return;
    }

    // Limit file size to 1.5MB for local storage / Firestore efficiency
    if (file.size > 1.5 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 1.5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setQrImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Hanya akun Admin yang memiliki hak akses untuk mengubah nomor rekening dan data QRIS.');
      return;
    }

    if (!accountNumber.trim()) {
      alert('Nomor rekening penerima wajib diisi.');
      return;
    }

    setIsSaving(true);

    const resolvedBankName = isCustomBank ? customBank.trim() || 'Bank Kas DKM' : bankName;

    const updatedQRIS: DonationQRIS = {
      bankName: resolvedBankName,
      accountNumber: accountNumber.trim(),
      accountHolder: accountHolder.trim() || (mosqueProfile?.name ? `${mosqueProfile.name} PEDULI UMAT` : 'KAS DKM MASJID'),
      merchantName: merchantName.trim() || (mosqueProfile?.name ? mosqueProfile.name.toUpperCase() : 'DKM MASJID BESAR RANCAEKEK'),
      nmid: nmid.trim() || 'ID1020038472918',
      qrImageUrl: qrImageUrl.trim(),
      instructions: instructions.trim()
    };

    if (onUpdateMosqueProfile && mosqueProfile) {
      onUpdateMosqueProfile({
        ...mosqueProfile,
        qris: updatedQRIS
      });
    }

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }, 400);
  };

  const effectiveBank = isCustomBank ? (customBank || 'Bank Kas DKM') : bankName;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-5 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold">
                  Pengaturan Rekening Kas & QRIS Donasi Digital
                </h3>
                <span className="bg-amber-400 text-emerald-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                  Admin Control
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                Atur nomor rekening resmi penerima infaq & kode QRIS yang ditampilkan di Dashboard kepada jamaah
              </p>
            </div>
          </div>

          <div>
            {isAdmin ? (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Mode Admin: Terverifikasi
              </span>
            ) : (
              <span className="bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0">
                <Lock className="w-4 h-4 text-rose-300" />
                Hanya Admin (Mode Terkunci)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Notice Banner if Not Admin */}
      {!isAdmin && (
        <div className="bg-amber-50 border-b border-amber-200 p-4 flex items-center gap-3 text-xs text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <strong>Mode Akses Terbatas (Hanya Baca):</strong> Anda sedang melihat konfigurasi data rekening penerima saat ini. Untuk mengubah nomor rekening, nama bank, atau mengunggah barcode QRIS baru, silakan login terlebih dahulu sebagai Administrator DKM pada menu Header.
          </div>
        </div>
      )}

      {/* Success Notification */}
      {saveSuccess && (
        <div className="bg-emerald-50 border-b border-emerald-200 p-4 flex items-center justify-between gap-3 text-xs text-emerald-900 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong>Perubahan Berhasil Disimpan!</strong> Data rekening penerima dan barcode QRIS telah diperbarui di database Firebase Firestore dan langsung aktif di halaman utama Dashboard.
            </div>
          </div>
          <button
            onClick={() => setSaveSuccess(false)}
            className="text-emerald-700 hover:text-emerald-950 font-bold px-2 py-1 rounded"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Main Grid: Form Left (7 cols), Live Preview Right (5 cols) */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Settings Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <CreditCard className="w-4 h-4 text-emerald-700" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Data Rekening Bank Penerima Infaq
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Bank Penerima <span className="text-rose-500">*</span>
              </label>
              <select
                disabled={!isAdmin}
                value={bankName}
                onChange={(e) => handleBankSelectChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-80 disabled:bg-slate-100 transition"
              >
                {BANK_PRESETS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {isCustomBank && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ketik Nama Bank Khusus <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={!isAdmin}
                  value={customBank}
                  onChange={(e) => setCustomBank(e.target.value)}
                  placeholder="Contoh: Bank Jabar Banten Syariah"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-80 disabled:bg-slate-100 transition"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Rekening Penerima <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  disabled={!isAdmin}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9-]/g, ''))}
                  placeholder="Contoh: 7144829103"
                  className="w-full pr-10 px-3.5 py-2.5 font-mono bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-80 disabled:bg-slate-100 transition"
                />
                <button
                  type="button"
                  onClick={handleCopyTest}
                  title="Uji Salin Rekening"
                  className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-emerald-700 transition"
                >
                  {copiedRekening ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Tombol salin rekening di Dashboard akan menyalin nomor ini
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Atas Nama Rekening Penerima (Pemilik Kas DKM) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                disabled={!isAdmin}
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value.toUpperCase())}
                placeholder="Contoh: DKM MASJID BESAR RANCAEKEK / YAYASAN MASJID"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-80 disabled:bg-slate-100 uppercase tracking-wide transition"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 pb-2">
              <QrCode className="w-4 h-4 text-emerald-700" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Identitas QRIS Standar Bank Indonesia
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Merchant Resmi QRIS
                </label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value.toUpperCase())}
                  placeholder="Contoh: DKM MASJID BESAR RANCAEKEK"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-80 disabled:bg-slate-100 uppercase transition"
                />
                <p className="text-[10px] text-slate-400 mt-1">Dicetak di atas barcode QRIS</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  NMID (National Merchant ID)
                </label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  value={nmid}
                  onChange={(e) => setNmid(e.target.value.toUpperCase())}
                  placeholder="Contoh: ID1020038472918"
                  className="w-full px-3.5 py-2.5 font-mono bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-80 disabled:bg-slate-100 uppercase transition"
                />
                <p className="text-[10px] text-slate-400 mt-1">Nomor registrasi resmi QRIS Bank Indonesia</p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Gambar Barcode QRIS Khusus (Opsional)
                </label>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      disabled={!isAdmin}
                      value={qrImageUrl}
                      onChange={(e) => setQrImageUrl(e.target.value)}
                      placeholder="Masukkan URL gambar barcode QRIS (https://...)"
                      className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-80 disabled:bg-slate-100 transition"
                    />
                    {isAdmin && (
                      <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 transition shrink-0">
                        <Upload className="w-3.5 h-3.5 text-slate-600" />
                        <span>Unggah Gambar</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Bila dikosongkan, sistem otomatis membuat gambar barcode QRIS dinamis berkualitas tinggi secara otomatis.
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instruksi / Catatan Donasi untuk Jamaah
                </label>
                <textarea
                  rows={2}
                  disabled={!isAdmin}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Contoh: Mohon sertakan berita transfer Infaq/Wakaf dan konfirmasi ke WhatsApp Pengurus DKM."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:opacity-80 disabled:bg-slate-100 transition"
                />
              </div>
            </div>
          </div>

          {/* Action Button for Admin */}
          {isAdmin ? (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Data rekening tersimpan aman di cloud Firebase Firestore
              </span>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-sm"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Menyimpan ke Database...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Pengaturan Rekening & QRIS</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-slate-100 rounded-xl p-3 text-center text-xs text-slate-600 flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Untuk menyimpan perubahan rekening atau QRIS, silakan login sebagai Admin DKM.</span>
            </div>
          )}
        </form>

        {/* Right Side: Real-time Live Preview */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Pratinjau Tampilan di Dashboard
                </h4>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
                Live Preview
              </span>
            </div>

            {/* Simulated Dashboard Donation Box */}
            <div className="mt-3 bg-gradient-to-b from-slate-50 to-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
              {/* Tab Selector in Preview */}
              <div className="flex rounded-lg bg-slate-200/80 p-1 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setPreviewTab('qris')}
                  className={`flex-1 py-1.5 rounded-md transition ${
                    previewTab === 'qris'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kode QRIS Standar
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('rekening')}
                  className={`flex-1 py-1.5 rounded-md transition ${
                    previewTab === 'rekening'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Transfer Bank Kas
                </button>
              </div>

              {previewTab === 'qris' ? (
                <div className="bg-white rounded-xl p-4 border border-slate-200 text-center space-y-3">
                  {/* QRIS Header */}
                  <div className="border-b border-slate-100 pb-2">
                    <div className="flex items-center justify-between px-2">
                      <span className="font-extrabold text-xs tracking-wider text-rose-600">QRIS</span>
                      <span className="text-[10px] text-slate-500 font-mono">GPN</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 uppercase mt-1 truncate">
                      {merchantName || 'DKM MASJID BESAR RANCAEKEK'}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">
                      NMID: {nmid || 'ID1020038472918'}
                    </p>
                  </div>

                  {/* QR Code Graphic */}
                  <div className="w-40 h-40 mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center">
                    {qrImageUrl ? (
                      <img
                        src={qrImageUrl}
                        alt="QRIS Preview"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                          `00020101021126580016ID.CO.QRIS.WWW01189360091800000000000215${nmid}5204000053033605802ID5926${merchantName}6015BANDUNG KAB.6304`
                        )}`}
                        alt="QRIS Barcode"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-snug">
                    {instructions || 'Pindai kode QRIS menggunakan mobile banking atau e-wallet pilihan Anda.'}
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                      Rekening Kas Resmi DKM
                    </span>
                    <Building2 className="w-4 h-4 text-amber-300" />
                  </div>

                  <div>
                    <p className="text-xs text-emerald-200 font-medium">{effectiveBank}</p>
                    <p className="text-xl font-mono font-black text-amber-300 tracking-wider">
                      {accountNumber || '7144829103'}
                    </p>
                    <p className="text-xs text-white font-semibold mt-0.5 truncate">
                      a.n. {accountHolder || 'DKM MASJID BESAR RANCAEKEK'}
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-2 text-[11px] text-emerald-100 flex items-center justify-between">
                    <span>Klik tombol salin di Dashboard</span>
                    <Copy className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              <span>Pemberitahuan Sistem:</span>
            </div>
            <p>
              Data yang disimpan langsung disinkronkan ke seluruh jamaah secara real-time. Pastikan nama pemilik dan nomor rekening diperiksa ulang sebelum disimpan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
