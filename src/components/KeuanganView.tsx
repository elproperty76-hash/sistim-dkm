import React, { useState } from 'react';
import { Keuangan } from '../types';
import { Wallet, ArrowDownRight, ArrowUpRight, Plus, Trash2, Edit2, Search, FileText } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface KeuanganViewProps {
  keuanganList: Keuangan[];
  onAddTransaction: (tx: Omit<Keuangan, 'id'>) => void;
  onUpdateTransaction?: (id: string, tx: Partial<Keuangan>) => void;
  onDeleteTransaction: (id: string) => void;
  isAdmin?: boolean;
}

export const KeuanganView: React.FC<KeuanganViewProps> = ({ keuanganList, onAddTransaction, onUpdateTransaction, onDeleteTransaction, isAdmin = false }) => {
  const [filterType, setFilterType] = useState<'ALL' | 'IN' | 'OUT'>('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Keuangan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; desc: string } | null>(null);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [category, setCategory] = useState('Infaq Jumat');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState('');

  const totalInfaq = keuanganList.filter(k => k.type === 'IN').reduce((sum, k) => sum + k.amount, 0);
  const totalKeluar = keuanganList.filter(k => k.type === 'OUT').reduce((sum, k) => sum + k.amount, 0);
  const saldo = totalInfaq - totalKeluar;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const handleOpenEdit = (tx: Keuangan) => {
    setEditTarget(tx);
    setDate(tx.date);
    setType(tx.type);
    setCategory(tx.category);
    setAmount(tx.amount.toString());
    setDescription(tx.description);
    setSource(tx.source);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    if (editTarget && onUpdateTransaction) {
      onUpdateTransaction(editTarget.id, {
        date,
        type,
        category,
        amount: Number(amount),
        description,
        source: source || 'Kas Umum DKM'
      });
      setEditTarget(null);
    } else {
      onAddTransaction({
        date,
        type,
        category,
        amount: Number(amount),
        description,
        source: source || 'Kas Umum DKM'
      });
    }
    setDescription('');
    setAmount('');
    setSource('');
    setShowModal(false);
  };

  const filteredTx = keuanganList.filter(tx => {
    const matchesType = filterType === 'ALL' || tx.type === filterType;
    const matchesCat = filterCategory === 'ALL' || tx.category === filterCategory;
    return matchesType && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pengelolaan Keuangan Transparan</h2>
          <p className="text-xs text-slate-500 mt-0.5">Pencatatan kas masuk (Infaq, Zakat, Wakaf) dan pengeluaran masjid secara akuntabel</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Catat Transaksi Baru
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Pemasukan</p>
          <p className="text-xl font-bold text-emerald-700 mt-1">{formatRupiah(totalInfaq)}</p>
          <p className="text-xs text-slate-400 mt-1">Infaq, Zakat & Wakaf</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Pengeluaran</p>
          <p className="text-xl font-bold text-rose-600 mt-1">{formatRupiah(totalKeluar)}</p>
          <p className="text-xs text-slate-400 mt-1">Operasional & Sosial</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-900 to-teal-900 p-5 rounded-xl text-white shadow-xs">
          <p className="text-xs font-medium text-emerald-200 uppercase tracking-wider">Saldo Kas Bersih</p>
          <p className="text-xl font-bold text-amber-300 mt-1">{formatRupiah(saldo)}</p>
          <p className="text-xs text-emerald-200 mt-1">Real-time Public Ledger</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['ALL', 'IN', 'OUT'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterType === t ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 'ALL' ? 'Semua Transaksi' : t === 'IN' ? 'Pemasukan Kas' : 'Pengeluaran Kas'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-48 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Infaq Jumat">Infaq Jumat</option>
            <option value="Donasi Wakaf">Donasi Wakaf</option>
            <option value="Zakat Mal">Zakat Mal</option>
            <option value="Operasional">Operasional</option>
            <option value="Sosial Yatim">Sosial Yatim</option>
          </select>
        </div>
      </div>

      {/* Table of Transactions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="p-4">Tanggal</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Keterangan</th>
                <th className="p-4">Sumber / Donatur</th>
                <th className="p-4 text-right">Jumlah</th>
                {isAdmin && <th className="p-4 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 whitespace-nowrap font-medium text-slate-900">{tx.date}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full font-medium text-[11px] ${
                      tx.type === 'IN' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="p-4 max-w-xs truncate" title={tx.description}>{tx.description}</td>
                  <td className="p-4 text-slate-500">{tx.source}</td>
                  <td className={`p-4 text-right font-bold whitespace-nowrap ${tx.type === 'IN' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {tx.type === 'IN' ? '+' : '-'}{formatRupiah(tx.amount)}
                  </td>
                  {isAdmin && (
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(tx)}
                          className="text-emerald-700 hover:text-emerald-900 p-1.5 rounded-lg hover:bg-emerald-50 transition"
                          title="Edit transaksi"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: tx.id, desc: tx.description })}
                          className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition"
                          title="Hapus transaksi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Hapus Transaksi Keuangan"
        message={`Apakah Anda yakin ingin menghapus catatan transaksi "${deleteTarget?.desc}"? Tindakan ini akan memperbarui saldo kas secara otomatis.`}
        onConfirm={() => {
          if (deleteTarget) {
            onDeleteTransaction(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Add / Edit Modal */}
      {(showModal || editTarget !== null) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{editTarget ? 'Edit Transaksi Keuangan DKM' : 'Catat Transaksi Keuangan DKM'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Transaksi</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="IN">Pemasukan Kas (Infaq / Zakat / Wakaf)</option>
                  <option value="OUT">Pengeluaran Kas (Operasional / Sosial)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Infaq Jumat">Infaq Jumat</option>
                  <option value="Infaq QRIS Digital">Infaq QRIS Digital</option>
                  <option value="Donasi Wakaf">Donasi Wakaf</option>
                  <option value="Zakat Mal">Zakat Mal</option>
                  <option value="Kotak Amal Harian">Kotak Amal Harian</option>
                  <option value="Operasional">Operasional (Marbot/Listrik/Air)</option>
                  <option value="Sosial Yatim">Sosial Yatim & Dhuafa</option>
                  <option value="Pemeliharaan">Pemeliharaan & Renovasi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah (Rupiah)</label>
                <input
                  type="number"
                  required
                  placeholder="Contoh: 500000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Keterangan / Uraian</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kotak amal shalat jumat pekan ke-2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sumber / Donatur</label>
                <input
                  type="text"
                  placeholder="Contoh: Hamba Allah / Warga Rancaekek Kencana"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditTarget(null); }}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition shadow-sm"
                >
                  {editTarget ? 'Simpan Perubahan' : 'Simpan Transaksi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

