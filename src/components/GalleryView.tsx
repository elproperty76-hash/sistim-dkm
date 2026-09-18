import React, { useState } from 'react';
import { Kegiatan } from '../types';
import { Image as ImageIcon, Plus, Trash2, Edit2, Calendar, Tag } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface GalleryViewProps {
  kegiatanList: Kegiatan[];
  onAddKegiatan: (kegiatan: Omit<Kegiatan, 'id'>) => void;
  onUpdateKegiatan?: (id: string, k: Partial<Kegiatan>) => void;
  onDeleteKegiatan: (id: string) => void;
  isAdmin?: boolean;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ kegiatanList, onAddKegiatan, onUpdateKegiatan, onDeleteKegiatan, isAdmin = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Kegiatan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Peringatan Hari Besar');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1564121211835-e88c852648ab?auto=format&fit=crop&q=80&w=800');

  const handleOpenEdit = (k: Kegiatan) => {
    setEditTarget(k);
    setTitle(k.title);
    setDate(k.date);
    setCategory(k.category);
    setDescription(k.description);
    setImage(k.image);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    if (editTarget && onUpdateKegiatan) {
      onUpdateKegiatan(editTarget.id, { title, date, category, description, image });
      setEditTarget(null);
    } else {
      onAddKegiatan({ title, date, category, description, image });
    }
    setTitle('');
    setDescription('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Galeri Kegiatan & Dokumentasi</h2>
          <p className="text-xs text-slate-500 mt-0.5">Dokumentasi foto kegiatan keagamaan, sosial, dan kemasyarakatan di Masjid DKM Rancaekek</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Dokumentasi Foto
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kegiatanList.map((k) => (
          <div key={k.id} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between group">
            <div>
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <img src={k.image} alt={k.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <span className="absolute top-3 left-3 bg-emerald-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-emerald-700">
                  {k.category}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{k.date}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">{k.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{k.description}</p>
              </div>
            </div>
            {isAdmin && (
              <div className="p-4 pt-0 flex justify-end gap-1">
                <button
                  onClick={() => handleOpenEdit(k)}
                  className="text-emerald-700 hover:text-emerald-900 p-1.5 rounded-lg hover:bg-emerald-50 transition text-xs font-medium flex items-center gap-1"
                  title="Edit dokumentasi"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => setDeleteTarget({ id: k.id, title: k.title })}
                  className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition text-xs font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Hapus
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Hapus Dokumentasi Kegiatan"
        message={`Apakah Anda yakin ingin menghapus dokumentasi kegiatan "${deleteTarget?.title}"?`}
        onConfirm={() => {
          if (deleteTarget) {
            onDeleteKegiatan(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Add / Edit Modal */}
      {(showModal || editTarget !== null) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{editTarget ? 'Edit Dokumentasi Kegiatan' : 'Tambah Dokumentasi Kegiatan'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Kegiatan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Santunan Yatim Piatu Rancaekek"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Peringatan Hari Besar">Peringatan Hari Besar Islam</option>
                  <option value="Sosial">Bakti Sosial & Santunan</option>
                  <option value="Pendidikan">Pendidikan & Pelatihan</option>
                  <option value="Gotong Royong">Gotong Royong Kebersihan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL Gambar (Foto)</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ceritakan jalannya acara..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                ></textarea>
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
                  {editTarget ? 'Simpan Perubahan' : 'Simpan Foto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

