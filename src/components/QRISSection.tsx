import React, { useState } from 'react';
import {
  QrCode,
  Copy,
  Check,
  Download,
  Share2,
  Maximize2,
  Heart,
  Building2,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  Edit3,
  X,
  Sparkles,
  Info
} from 'lucide-react';
import { MosqueProfile, DonationQRIS } from '../types';

interface QRISSectionProps {
  mosqueProfile?: MosqueProfile;
  isAdmin?: boolean;
  onUpdateMosqueProfile?: (profile: MosqueProfile) => void;
}

const NOMINAL_PRESETS = [
  { label: 'Rp 10.000', value: 10000 },
  { label: 'Rp 25.000', value: 25000 },
  { label: 'Rp 50.000', value: 50000 },
  { label: 'Rp 100.000', value: 100000 },
  { label: 'Rp 250.000', value: 250000 },
  { label: 'Sukarela', value: 0 }
];

export const QRISSection: React.FC<QRISSectionProps> = ({
  mosqueProfile,
  isAdmin = false,
  onUpdateMosqueProfile
}) => {
  const qrisData = mosqueProfile?.qris || {
    merchantName: mosqueProfile?.name ? `${mosqueProfile.name.toUpperCase()}` : 'DKM MASJID BESAR RANCAEKEK',
    nmid: 'ID1020038472918',
    bankName: 'Bank Syariah Indonesia (BSI)',
    accountNumber: '7144829103',
    accountHolder: mosqueProfile?.name ? `${mosqueProfile.name} PEDULI UMAT` : 'DKM RANCAEKEK PEDULI UMAT',
    qrPayload: '00020101021126580016ID.CO.QRIS.WWW01189360091800000000000215ID10200384729180303UMI51440014ID.GO.BI.QRIS5204000053033605802ID5926DKM MASJID BESAR RANCAEKEK6015BANDUNG KAB.61054039262070703A016304C49E',
    instructions: 'Buka aplikasi perbankan atau e-wallet (BSI, Mandiri, BCA, GoPay, OVO, DANA), scan kode QR di atas.'
  };

  const [selectedNominal, setSelectedNominal] = useState<number>(50000);
  const [customNominal, setCustomNominal] = useState<string>('');
  const [copiedRekening, setCopiedRekening] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Edit form state
  const [merchantName, setMerchantName] = useState(qrisData.merchantName || '');
  const [nmid, setNmid] = useState(qrisData.nmid || '');
  const [bankName, setBankName] = useState(qrisData.bankName || '');
  const [accountNumber, setAccountNumber] = useState(qrisData.accountNumber || '');
  const [accountHolder, setAccountHolder] = useState(qrisData.accountHolder || '');
  const [qrImageUrl, setQrImageUrl] = useState(qrisData.qrImageUrl || '');

  const effectiveNominal = selectedNominal === 0
    ? (Number(customNominal.replace(/\D/g, '')) || 0)
    : selectedNominal;

  const qrCodeUrl = qrisData.qrImageUrl && qrisData.qrImageUrl.trim() !== ''
    ? qrisData.qrImageUrl
    : `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(
        qrisData.qrPayload || `QRIS:${qrisData.nmid || 'ID1020038472918'}:${mosqueProfile?.name || 'DKM Rancaekek'}`
      )}&margin=12`;

  const handleCopyRekening = () => {
    if (!qrisData.accountNumber) return;
    navigator.clipboard.writeText(qrisData.accountNumber);
    setCopiedRekening(true);
    setTimeout(() => setCopiedRekening(false), 2500);
  };

  const handleConfirmWhatsApp = () => {
    const rawPhone = mosqueProfile?.callCenter || '6281223456789';
    const cleanPhone = rawPhone.replace(/\D/g, '');
    const amountStr = effectiveNominal > 0
      ? `Rp ${effectiveNominal.toLocaleString('id-ID')}`
      : 'infaq / sedekah';

    const text = encodeURIComponent(
      `Assalamu'alaikum Pengurus ${mosqueProfile?.name || 'DKM Rancaekek'},\n\n` +
      `Alhamdulillah, saya telah menyalurkan donasi digital melalui QRIS sebesar ${amountStr}.\n` +
      `Tanggal: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}\n\n` +
      `Mohon dicatat dan semoga berkah untuk kemakmuran masjid serta umat. Terima kasih. Wassalamu'alaikum.`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateMosqueProfile || !mosqueProfile) return;

    const updatedQRIS: DonationQRIS = {
      ...qrisData,
      merchantName: merchantName.trim() || mosqueProfile.name.toUpperCase(),
      nmid: nmid.trim() || 'ID1020038472918',
      bankName: bankName.trim() || 'Bank Syariah Indonesia (BSI)',
      accountNumber: accountNumber.trim(),
      accountHolder: accountHolder.trim() || mosqueProfile.name,
      qrImageUrl: qrImageUrl.trim()
    };

    onUpdateMosqueProfile({
      ...mosqueProfile,
      qris: updatedQRIS
    });

    setIsEditOpen(false);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 px-5 py-4 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold">Donasi & Infaq Digital QRIS</h3>
              <span className="bg-amber-400 text-emerald-950 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Instan 24 Jam
              </span>
            </div>
            <p className="text-xs text-emerald-100">
              Mendukung seluruh Mobile Banking & E-Wallet (BSI, BCA, Mandiri, GoPay, DANA, OVO, ShopeePay, LinkAja)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => {
                setMerchantName(qrisData.merchantName || '');
                setNmid(qrisData.nmid || '');
                setBankName(qrisData.bankName || '');
                setAccountNumber(qrisData.accountNumber || '');
                setAccountHolder(qrisData.accountHolder || '');
                setQrImageUrl(qrisData.qrImageUrl || '');
                setIsEditOpen(true);
              }}
              className="bg-emerald-700/70 hover:bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg border border-emerald-600/80 flex items-center gap-1.5 font-medium transition"
              title="Ubah data QRIS & Rekening Masjid"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              <span>Atur QRIS</span>
            </button>
          )}

          <button
            onClick={() => setIsZoomOpen(true)}
            className="bg-emerald-700/70 hover:bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg border border-emerald-600/80 flex items-center gap-1.5 font-medium transition"
            title="Perbesar Tampilan QR Code"
          >
            <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Perbesar QR</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Official Indonesian QRIS Stand Display */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[290px] bg-white rounded-2xl border-2 border-slate-200 shadow-md p-4 text-center relative overflow-hidden transition-transform hover:scale-[1.01]">
            {/* Top Red Bar QRIS Indonesia standard header */}
            <div className="border-b border-slate-200 pb-2 mb-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-rose-600 font-black tracking-tighter text-lg font-sans">
                  QRIS
                </span>
                <span className="text-[9px] text-slate-500 font-semibold tracking-wider uppercase border border-slate-300 px-1.5 py-0.5 rounded">
                  GPN
                </span>
              </div>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                Quick Response Code Indonesian Standard
              </p>
            </div>

            {/* Merchant Identity */}
            <div className="mb-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight line-clamp-1">
                {qrisData.merchantName || mosqueProfile?.name || 'DKM MASJID BESAR RANCAEKEK'}
              </h4>
              <p className="text-[10px] text-slate-500 font-mono">
                NMID: {qrisData.nmid || 'ID1020038472918'}
              </p>
            </div>

            {/* QR Code Graphic Frame */}
            <div
              onClick={() => setIsZoomOpen(true)}
              className="bg-white p-2.5 rounded-xl border border-slate-200 inline-block cursor-pointer group relative shadow-inner"
              title="Klik untuk memperbesar tampilan QR Code"
            >
              <img
                src={qrCodeUrl}
                alt={`QRIS ${mosqueProfile?.name || 'DKM Rancaekek'}`}
                className="w-48 h-48 sm:w-52 sm:h-52 object-contain mx-auto transition group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition rounded-xl">
                <span className="bg-white/90 text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5" /> Klik Perbesar
                </span>
              </div>
            </div>

            {/* Bottom Footer Tags */}
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
              <span className="font-semibold text-emerald-700">✓ Standar BI & ASPI</span>
              <span>Bebas Biaya Admin</span>
            </div>
          </div>

          {/* Quick Download Button */}
          <div className="mt-3 flex items-center gap-2">
            <a
              href={qrCodeUrl}
              target="_blank"
              rel="noreferrer"
              download={`QRIS_${(mosqueProfile?.name || 'Masjid').replace(/\s+/g, '_')}.png`}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-emerald-50 transition"
            >
              <Download className="w-3.5 h-3.5" /> Unduh Gambar QRIS
            </a>
          </div>
        </div>

        {/* Right Column: Interaction, Preset Nominals, Bank Transfer, and Confirmation */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          {/* Preset Infaq Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                Pilih Nominal Infaq / Sedekah
              </label>
              {effectiveNominal > 0 && (
                <span className="text-xs font-bold text-emerald-700">
                  {formatRupiah(effectiveNominal)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {NOMINAL_PRESETS.map((p) => {
                const isSelected = selectedNominal === p.value;
                return (
                  <button
                    key={p.label}
                    onClick={() => {
                      setSelectedNominal(p.value);
                      if (p.value !== 0) setCustomNominal('');
                    }}
                    className={`px-2.5 py-2 rounded-xl text-xs font-bold transition border ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {selectedNominal === 0 && (
              <div className="mt-3">
                <label className="block text-[11px] text-slate-500 mb-1">
                  Masukkan Nominal Khusus (Rp):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="text"
                    value={customNominal}
                    onChange={(e) => {
                      const num = e.target.value.replace(/\D/g, '');
                      setCustomNominal(num ? Number(num).toLocaleString('id-ID') : '');
                    }}
                    placeholder="Contoh: 75.000"
                    className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Alternative Bank Account Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/90">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-slate-900">
                  Transfer Rekening {qrisData.bankName || 'Bank Syariah Indonesia (BSI)'}
                </span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Rekening Resmi DKM
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div>
                <p className="text-[11px] text-slate-500">Nomor Rekening Kas Masjid:</p>
                <p className="text-lg font-black font-mono tracking-wider text-slate-900">
                  {qrisData.accountNumber || '7144829103'}
                </p>
                <p className="text-xs text-slate-600 font-medium">
                  a.n. <strong className="text-slate-800">{qrisData.accountHolder || mosqueProfile?.name || 'DKM RANCAEKEK'}</strong>
                </p>
              </div>

              <button
                onClick={handleCopyRekening}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border ${
                  copiedRekening
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                {copiedRekening ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>No. Rekening Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-emerald-600" />
                    <span>Salin No. Rekening</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action Confirmation via WhatsApp and Supported Apps */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Dana masuk 100% langsung ke rekening kas masjid.</span>
            </div>

            <button
              onClick={handleConfirmWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition"
            >
              <Smartphone className="w-4 h-4 text-amber-300" />
              <span>Konfirmasi Infaq via WhatsApp</span>
            </button>
          </div>

          {/* Supported Channels Logo Chips */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <span className="text-slate-400 font-semibold mr-1">Didukung:</span>
            {['BSI Mobile', 'BCA Mobile', 'Livin Mandiri', 'BRImo', 'GoPay', 'DANA', 'OVO', 'ShopeePay', 'LinkAja'].map((app) => (
              <span key={app} className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-slate-600">
                {app}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* FULLSCREEN ZOOM MODAL */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <span className="text-rose-600 font-black tracking-tighter text-2xl font-sans">
                QRIS
              </span>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                STANDAR PEMBAYARAN NASIONAL INDONESIA
              </p>
            </div>

            <div className="bg-emerald-50 p-2 rounded-xl mb-3">
              <h4 className="text-sm font-bold text-emerald-950 uppercase">
                {qrisData.merchantName || mosqueProfile?.name || 'DKM MASJID BESAR RANCAEKEK'}
              </h4>
              <p className="text-xs text-emerald-700 font-mono">
                NMID: {qrisData.nmid || 'ID1020038472918'}
              </p>
            </div>

            <div className="bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-inner inline-block my-2">
              <img
                src={qrCodeUrl}
                alt="QRIS Besar"
                className="w-64 h-64 object-contain mx-auto"
              />
            </div>

            {effectiveNominal > 0 && (
              <p className="text-sm font-bold text-emerald-800 mt-2">
                Nominal Pilihan: {formatRupiah(effectiveNominal)}
              </p>
            )}

            <p className="text-xs text-slate-500 mt-3">
              Arahkan kamera smartphone atau aplikasi Mobile Banking/E-Wallet Anda ke kode QR ini.
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <a
                href={qrCodeUrl}
                target="_blank"
                rel="noreferrer"
                download={`QRIS_${(mosqueProfile?.name || 'Masjid').replace(/\s+/g, '_')}.png`}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" /> Unduh Kode QR
              </a>
              <button
                onClick={() => setIsZoomOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN EDIT QRIS MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Pengaturan QRIS & Rekening Donasi</h3>
                  <p className="text-xs text-slate-500">Perbarui data infaq digital yang tampil di Dashboard</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Merchant QRIS:
                </label>
                <input
                  type="text"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  placeholder="Contoh: DKM MASJID BESAR RANCAEKEK"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NMID QRIS (Nasional):
                  </label>
                  <input
                    type="text"
                    value={nmid}
                    onChange={(e) => setNmid(e.target.value)}
                    placeholder="Contoh: ID1020038472918"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Bank Resmi:
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Contoh: Bank Syariah Indonesia (BSI)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor Rekening:
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Contoh: 7144829103"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Atas Nama Rekening:
                  </label>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="Contoh: DKM RANCAEKEK PEDULI UMAT"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Gambar QR Code Khusus (Opsional):
                </label>
                <input
                  type="url"
                  value={qrImageUrl}
                  onChange={(e) => setQrImageUrl(e.target.value)}
                  placeholder="Kosongkan untuk generate otomatis dari NMID"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Jika Anda memiliki gambar barcode QRIS resmi dari bank (format JPG/PNG), masukkan tautan gambarnya di sini.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  Simpan ke Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
