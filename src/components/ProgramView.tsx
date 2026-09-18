import React, { useState } from 'react';
import { Program } from '../types';
import { Calendar, Plus, Trash2, Edit2, Clock, MapPin, UserCheck, BookOpen } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface ProgramViewProps {
  programList: Program[];
  onAddProgram: (prog: Omit<Program, 'id'>) => void;
  onUpdateProgram?: (id: string, p: Partial<Program>) => void;
  onDeleteProgram: (id: string) => void;
  isAdmin?: boolean;
}

export const ProgramView: React.FC<ProgramViewProps> = ({ programList, onAddProgram, onUpdateProgram, onDeleteProgram, isAdmin = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Program | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const [title, setTitle] = useState('');
  const [schedule, setSchedule] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [location, setLocation] = useState('Masjid Besar Rancaekek');
  const [target, setTarget] = useState('Umum & Jamaah');
  const [status, setStatus] = useState<'Aktif' | 'Selesai' | 'Akan Datang'>('Aktif');

  const handleOpenEdit = (p: Program) => {
    setEditTarget(p);
    setTitle(p.title);
    setSchedule(p.schedule);
    setSpeaker(p.speaker);
    setLocation(p.location);
    setTarget(p.target);
    setStatus(p.status);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !schedule) return;
    if (editTarget && onUpdateProgram) {
      onUpdateProgram(editTarget.id, { title, schedule, speaker, location, target, status });
      setEditTarget(null);
    } else {
      onAddProgram({ title, schedule, speaker, location, target, status });
    }
    setTitle('');
    setSchedule('');
    setSpeaker('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Program DKM & Jadwal Majelis Taklim</h2>
          <p className="text-xs text-slate-500 mt-0.5">Jadwal kajian rutin, TPQ, dan program kemakmuran masjid di Kecamatan Rancaekek</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Program Baru
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programList.map((p) => (
          <div key={p.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{p.title}</h3>
                    <span className="text-[11px] font-semibold text-emerald-700">Target: {p.target}</span>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {p.status}
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 my-4 pl-1">
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{p.schedule}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{p.location}</span>
                </p>
                <p className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Pemateri: <strong className="text-slate-900">{p.speaker}</strong></span>
                </p>
              </div>
            </div>

            {isAdmin && (
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-1">
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="text-emerald-700 hover:text-emerald-900 p-1.5 rounded-lg hover:bg-emerald-50 transition text-xs font-medium flex items-center gap-1"
                  title="Edit program"
                >
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => setDeleteTarget({ id: p.id, title: p.title })}
                  className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition text-xs font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Hapus Program
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Hapus Program DKM"
        message={`Apakah Anda yakin ingin menghapus program "${deleteTarget?.title}"?`}
        onConfirm={() => {
          if (deleteTarget) {
            onDeleteProgram(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Add / Edit Modal */}
      {(showModal || editTarget !== null) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{editTarget ? 'Edit Program / Majelis Taklim' : 'Tambah Program / Majelis Taklim'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Program / Kajian</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kajian Tafsir Al-Quran Ba'da Subuh"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jadwal Pelaksanaan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Setiap Ahad Pagi (05:00 - 06:30)"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pemateri / Narasumber</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ustadz Dr. H. M. Taufik, M.Pd.I."
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Jamaah</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Umum / Khusus Muslimah / Remaja"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status Program</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Akan Datang">Akan Datang</option>
                  <option value="Selesai">Selesai</option>
                </select>
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
                  {editTarget ? 'Simpan Perubahan' : 'Simpan Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

