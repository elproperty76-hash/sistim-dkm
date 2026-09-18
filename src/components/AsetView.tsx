import React, { useState } from 'react';
import { Aset } from '../types';
import { Archive, Plus, Trash2, Edit2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface AsetViewProps {
  asetList: Aset[];
  onAddAset: (aset: Omit<Aset, 'id'>) => void;
  onUpdateAset?: (id: string, aset: Partial<Aset>) => void;
  onDeleteAset: (id: string) => void;
  isAdmin?: boolean;
}

export const AsetView: React.FC<AsetViewProps> = ({ asetList, onAddAset, onUpdateAset, onDeleteAset, isAdmin = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Aset | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Elektronik');
  const [qty, setQty] = useState('1');
  const [condition, setCondition] = useState<'Baik' | 'Rusak Ringan' | 'Rusak Berat'>('Baik');
  const [location, setLocation] = useState('');
  const [year, setYear] = useState('2024');
  const [value, setValue] = useState('');

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const totalValue = asetList.reduce((sum, a) => sum + (a.value * a.qty), 0);

  const handleOpenEdit = (a: Aset) => {
    setEditTarget(a);
    setName(a.name);
    setCategory(a.category);
    setQty(a.qty.toString());
    setCondition(a.condition);
    setLocation(a.location);
    setYear(a.year.toString());
    setValue(a.value.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) return;
    if (editTarget && onUpdateAset) {
      onUpdateAset(editTarget.id, {
        name,
        category,
        qty: Number(qty),
        condition,
        location,
        year: Number(year),
        value: Number(value) || 0
      });
      setEditTarget(null);
    } else {
      onAddAset({
        name,
        category,
        qty: Number(qty),
        condition,
        location,
        year: Number(year),
        value: Number(value) || 0
      });
    }
    setName('');
    setLocation('');
    setValue('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Inventaris Aset Masjid</h2>
          <p className="text-xs text-slate-500 mt-0.5">Pendataan inventaris sarana, prasarana, dan aset tetap milik Masjid Besar DKM Rancaekek</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Aset Baru
          </button>
        )}
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Jenis Barang Inventaris</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{asetList.length} Item Terdaftar</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Estimasi Nilai Total Aset</p>
          <p className="text-xl font-bold text-emerald-700 mt-1">{formatRupiah(totalValue)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="p-4">Nama Barang</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Jumlah</th>
                <th className="p-4">Kondisi</th>
                <th className="p-4">Lokasi Penyimpanan</th>
                <th className="p-4">Tahun Pengadaan</th>
                <th className="p-4 text-right">Nilai Satuan</th>
                {isAdmin && <th className="p-4 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {asetList.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-bold text-slate-900">{a.name}</td>
                  <td className="p-4"><span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full font-medium text-[11px]">{a.category}</span></td>
                  <td className="p-4 font-semibold">{a.qty} Unit</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full font-medium text-[11px] inline-flex items-center gap-1 ${
                      a.condition === 'Baik' ? 'bg-emerald-100 text-emerald-800' :
                      a.condition === 'Rusak Ringan' ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {a.condition === 'Baik' ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {a.condition}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{a.location}</td>
                  <td className="p-4 text-slate-600">{a.year}</td>
                  <td className="p-4 text-right font-semibold text-slate-900">{formatRupiah(a.value)}</td>
                  {isAdmin && (
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(a)}
                          className="text-emerald-700 hover:text-emerald-900 p-1.5 rounded-lg hover:bg-emerald-50 transition"
                          title="Edit aset"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ id: a.id, name: a.name })}
                          className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition"
                          title="Hapus aset"
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
        title="Hapus Aset Masjid"
        message={`Apakah Anda yakin ingin menghapus data aset "${deleteTarget?.name}" dari daftar inventaris DKM?`}
        onConfirm={() => {
          if (deleteTarget) {
            onDeleteAset(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Add / Edit Modal */}
      {(showModal || editTarget !== null) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{editTarget ? 'Edit Inventaris Aset Masjid' : 'Tambah Inventaris Aset Masjid'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Barang Aset</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sound System TOA / Karpet Turki"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Elektronik">Elektronik & Sound System</option>
                  <option value="Interior">Interior & Karpet</option>
                  <option value="Kebersihan">Alat Kebersihan</option>
                  <option value="Bangunan">Sarana Bangunan</option>
                  <option value="Inventaris Umum">Inventaris Umum</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah (Qty)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kondisi</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi Penyimpanan / Penempatan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ruang Utama Masjid / Gudang"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Pengadaan</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Estimasi Nilai Satuan (Rp)</label>
                  <input
                    type="number"
                    placeholder="Contoh: 1500000"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
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
                  {editTarget ? 'Simpan Perubahan' : 'Simpan Aset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

