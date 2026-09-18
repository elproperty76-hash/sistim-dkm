import React from 'react';
import { Stats, Keuangan, Program, Kegiatan, MosqueProfile } from '../types';
import { Users, Wallet, Archive, Calendar, ArrowUpRight, ArrowDownRight, ShieldAlert, CheckCircle2, TrendingUp, Clock } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PrayerSchedule } from './PrayerSchedule';
import { QRISSection } from './QRISSection';
import { MosqueMapCard } from './MosqueMapCard';

interface DashboardViewProps {
  stats: Stats | null;
  keuanganList: Keuangan[];
  programList: Program[];
  kegiatanList: Kegiatan[];
  onNavigate: (tab: string) => void;
  mosqueProfile?: MosqueProfile;
  isAdmin?: boolean;
  onUpdateMosqueProfile?: (profile: MosqueProfile) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  keuanganList,
  programList,
  kegiatanList,
  onNavigate,
  mosqueProfile,
  isAdmin = false,
  onUpdateMosqueProfile
}) => {
  const chartData = [
    { bulan: 'Mei', infaq: 12500000, pengeluaran: 8200000 },
    { bulan: 'Juni', infaq: 14200000, pengeluaran: 9500000 },
    { bulan: 'Juli', infaq: 18800000, pengeluaran: 11000000 },
    { bulan: 'Agustus', infaq: 16500000, pengeluaran: 10200000 },
    { bulan: 'September', infaq: stats?.totalInfaq || 23350000, pengeluaran: stats?.totalKeluar || 3700000 },
  ];

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="bg-emerald-800/80 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-700 inline-block mb-3">
            Portal Resmi DKM Rancaekek
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
            Selamat Datang di Sistem Informasi Manajemen DKM Rancaekek
          </h2>
          <p className="text-emerald-100 text-sm md:text-base leading-relaxed mb-6">
            Pusat transparansi pencatatan jamaah, pengelolaan keuangan kas masjid, inventaris aset, majelis taklim, dan laporan berkala real-time untuk kemaslahatan warga Kecamatan Rancaekek, Kabupaten Bandung.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('keuangan')}
              className="bg-amber-500 hover:bg-amber-600 text-emerald-950 font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" /> Lihat Kas Transparan
            </button>
            <button
              onClick={() => onNavigate('laporan')}
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition border border-emerald-700 flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-amber-400" /> Unduh Laporan Publik
            </button>
          </div>
        </div>
      </div>

      {/* Jadwal Sholat Sesuai Wilayah */}
      <PrayerSchedule mosqueProfile={mosqueProfile} />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Saldo Kas Masjid</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatRupiah(stats?.saldoKas || 0)}</p>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi & Transparan
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Jamaah & Pengurus</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{stats?.totalJamaah || 0} Orang</p>
            <p className="text-xs text-slate-500 mt-1">({stats?.totalPengurus || 0} Pengurus DKM)</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Inventaris Aset</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{stats?.totalAset || 0} Jenis Aset</p>
            <p className="text-xs text-emerald-600 mt-1">Kondisi Terawat Baik</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700">
            <Archive className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Majelis Taklim & Program</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{stats?.totalProgram || 0} Program Aktif</p>
            <p className="text-xs text-slate-500 mt-1">Rutin Pekanan & Bulanan</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Donasi & Infaq Digital QRIS Resmi */}
      <QRISSection
        mosqueProfile={mosqueProfile}
        isAdmin={isAdmin}
        onUpdateMosqueProfile={onUpdateMosqueProfile}
      />

      {/* Main Content Split: Chart & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Grafik Arus Kas Masjid</h3>
              <p className="text-xs text-slate-500">Perbandingan pemasukan infaq dan pengeluaran operasional (dalam Rupiah)</p>
            </div>
            <button
              onClick={() => onNavigate('keuangan')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Lihat Detail &rarr;
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="bulan" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(val) => `${val / 1000000}jt`} />
                <Tooltip formatter={(val: any) => formatRupiah(Number(val))} />
                <Area type="monotone" dataKey="infaq" name="Pemasukan" stroke="#047857" fill="#10b981" fillOpacity={0.15} />
                <Area type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="#dc2626" fill="#f87171" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Financial Transactions */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Kas Terbaru</h3>
            <button
              onClick={() => onNavigate('keuangan')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Semua &rarr;
            </button>
          </div>
          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-64 pr-1">
            {keuanganList.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tx.type === 'IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {tx.type === 'IN' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 line-clamp-1">{tx.description}</p>
                    <p className="text-[11px] text-slate-500">{tx.date} • {tx.category}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold whitespace-nowrap ${tx.type === 'IN' ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {tx.type === 'IN' ? '+' : '-'}{formatRupiah(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Program & Kegiatan Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Majelis Taklim Preview */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Jadwal Majelis Taklim & Program</h3>
            <button
              onClick={() => onNavigate('program')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Kelola &rarr;
            </button>
          </div>
          <div className="space-y-3">
            {programList.slice(0, 3).map((prog) => (
              <div key={prog.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">{prog.title}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-medium">{prog.status}</span>
                </div>
                <p className="text-xs text-slate-600">🗓️ {prog.schedule} • 📍 {prog.location}</p>
                <p className="text-[11px] text-slate-500">Pemateri: <span className="font-semibold text-slate-700">{prog.speaker}</span></p>
              </div>
            ))}
          </div>
        </div>

        {/* Galeri Kegiatan Preview */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Galeri & Dokumentasi Rancaekek</h3>
            <button
              onClick={() => onNavigate('kegiatan')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Semua Foto &rarr;
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {kegiatanList.slice(0, 3).map((k) => (
              <div key={k.id} className="group relative rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200">
                <img src={k.image} alt={k.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                  <p className="text-[10px] text-white font-medium line-clamp-1">{k.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peta Lokasi Google Maps DKM Rancaekek */}
      <MosqueMapCard
        mosqueProfile={mosqueProfile}
        isAdmin={isAdmin}
        onNavigateToSettings={() => onNavigate('jamaah')}
      />

      {/* Donasi Infaq Digital QRIS */}
      <QRISSection
        mosqueProfile={mosqueProfile}
        isAdmin={isAdmin}
        onUpdateMosqueProfile={onUpdateMosqueProfile}
      />
    </div>
  );
};
