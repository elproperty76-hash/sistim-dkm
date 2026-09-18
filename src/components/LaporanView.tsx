import React from 'react';
import { Keuangan, Aset } from '../types';
import { FileText, Printer, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LaporanViewProps {
  keuanganList: Keuangan[];
  asetList: Aset[];
}

export const LaporanView: React.FC<LaporanViewProps> = ({ keuanganList, asetList }) => {
  const totalInfaq = keuanganList.filter(k => k.type === 'IN').reduce((sum, k) => sum + k.amount, 0);
  const totalKeluar = keuanganList.filter(k => k.type === 'OUT').reduce((sum, k) => sum + k.amount, 0);
  const saldo = totalInfaq - totalKeluar;
  const totalAsetNilai = asetList.reduce((sum, a) => sum + (a.value * a.qty), 0);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Laporan Berkala Publik Real-Time</h2>
          <p className="text-xs text-slate-500 mt-0.5">Transparansi laporan keuangan dan inventaris DKM Rancaekek untuk diakses masyarakat umum</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm"
          >
            <Printer className="w-4 h-4" /> Cetak / Unduh Laporan (PDF)
          </button>
        </div>
      </div>

      {/* Printable Report Document */}
      <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm space-y-8 max-w-4xl mx-auto print:shadow-none print:border-none print:p-0">
        {/* Letterhead */}
        <div className="text-center border-b border-slate-200 pb-6 space-y-2">
          <div className="w-14 h-14 bg-emerald-900 text-amber-300 mx-auto rounded-2xl flex items-center justify-center text-2xl font-bold font-serif shadow-inner">
            🕌
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 uppercase tracking-wide">
            DEWAN KEMAKMURAN MASJID (DKM) KECAMATAN RANCAEKEK
          </h1>
          <p className="text-xs md:text-sm font-semibold text-emerald-800">
            Kabupaten Bandung, Provinsi Jawa Barat
          </p>
          <p className="text-xs text-slate-500">
            Sekretariat: Jl. Raya Rancaekek No. 100 Telp. (022) 779xxxx / Email: dkm.rancaekek@bandung.go.id
          </p>
        </div>

        {/* Report Title */}
        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-slate-900 underline uppercase">
            LAPORAN PERTANGGUNGJAWABAN KEUANGAN & INVENTARIS REAL-TIME
          </h3>
          <p className="text-xs text-slate-500">Periode Publikasi: September 2026</p>
        </div>

        {/* Financial Summary Table */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wider border-l-4 border-emerald-600 pl-2">
            1. Rekapitulasi Kas & Keuangan Masjid
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <tbody>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <td className="p-3 font-semibold text-slate-700">Total Saldo Pemasukan (Infaq, Zakat, Wakaf)</td>
                  <td className="p-3 text-right font-bold text-emerald-700">{formatRupiah(totalInfaq)}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-3 font-semibold text-slate-700">Total Pengeluaran Kas (Operasional & Sosial)</td>
                  <td className="p-3 text-right font-bold text-rose-600">{formatRupiah(totalKeluar)}</td>
                </tr>
                <tr className="bg-emerald-50/60 font-bold text-slate-900 text-sm">
                  <td className="p-3">SALDO KAS BERSIH SAAT INI</td>
                  <td className="p-3 text-right text-emerald-900">{formatRupiah(saldo)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Transactions */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wider border-l-4 border-emerald-600 pl-2">
            2. Rincian Transaksi Terbaru
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                  <th className="p-2.5">Tanggal</th>
                  <th className="p-2.5">Kategori</th>
                  <th className="p-2.5">Uraian</th>
                  <th className="p-2.5 text-right">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {keuanganList.map((tx) => (
                  <tr key={tx.id}>
                    <td className="p-2.5">{tx.date}</td>
                    <td className="p-2.5">{tx.category}</td>
                    <td className="p-2.5">{tx.description}</td>
                    <td className={`p-2.5 text-right font-bold ${tx.type === 'IN' ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {tx.type === 'IN' ? '+' : '-'}{formatRupiah(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Asset Summary */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wider border-l-4 border-emerald-600 pl-2">
            3. Ringkasan Inventaris Aset & Sarana
          </h4>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-900">Total Item Barang Terdaftar: {asetList.length} Jenis Aset</p>
              <p className="text-slate-500 mt-0.5">Seluruh aset dalam pengawasan dan pemeliharaan pengurus DKM Rancaekek.</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500">Estimasi Nilai Total</p>
              <p className="text-sm font-bold text-emerald-800">{formatRupiah(totalAsetNilai)}</p>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-8 grid grid-cols-2 gap-8 text-xs text-center">
          <div className="space-y-16">
            <p className="font-semibold text-slate-700">Mengetahui,<br />Ketua DKM Kecamatan Rancaekek</p>
            <div>
              <p className="font-bold text-slate-900 underline">H. Asep Saepudin, S.Ag.</p>
              <p className="text-slate-500">NIP. 19720512xxxxxx</p>
            </div>
          </div>
          <div className="space-y-16">
            <p className="font-semibold text-slate-700">Bendahara DKM</p>
            <div>
              <p className="font-bold text-slate-900 underline">Drs. H. Ujang Supriatna</p>
              <p className="text-slate-500">DKM Rancaekek</p>
            </div>
          </div>
        </div>

        <div className="pt-4 text-center border-t border-slate-200 text-[11px] text-slate-400">
          <p>Laporan ini diterbitkan secara transparan dan real-time melalui Sistem Informasi DKM Rancaekek Kab. Bandung.</p>
        </div>
      </div>
    </div>
  );
};
