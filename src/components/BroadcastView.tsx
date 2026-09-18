import React, { useState } from 'react';
import { BroadcastMessage } from '../types';
import { Send, MessageSquare, CheckCircle2, PhoneCall, Sparkles } from 'lucide-react';

interface BroadcastViewProps {
  broadcastList: BroadcastMessage[];
  onSendBroadcast: (msg: { title: string; recipient: string; message: string }) => void;
  isAdmin?: boolean;
}

export const BroadcastView: React.FC<BroadcastViewProps> = ({ broadcastList, onSendBroadcast, isAdmin = false }) => {
  const [title, setTitle] = useState('');
  const [recipient, setRecipient] = useState('Seluruh Pengurus DKM & Jamaah');
  const [message, setMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    onSendBroadcast({ title, recipient, message });
    setTitle('');
    setMessage('');
    setSuccessMsg('Pesan berhasil disiarkan melalui WhatsApp Gateway DKM Rancaekek!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Integrasi Pesan Instan & Broadcast WhatsApp</h2>
          <p className="text-xs text-slate-500 mt-0.5">Kirim pengumuman, undangan rapat, dan laporan keuangan kepada pengurus dan jamaah secara instan</p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
        {/* Send Broadcast Form */}
        {isAdmin && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-700" /> Buat Broadcast Baru
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul / Subjek Pesan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Undangan Pengajian Akbar"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Penerima</label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Seluruh Pengurus DKM">Seluruh Pengurus DKM</option>
                  <option value="Remaja Masjid (IRMAS)">Remaja Masjid (IRMAS)</option>
                  <option value="Jamaah & Publik Rancaekek">Jamaah & Publik Rancaekek</option>
                  <option value="Majelis Taklim Ibu-Ibu">Majelis Taklim Ibu-Ibu</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Isi Pesan WhatsApp</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan pesan atau informasi penting di sini..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Siarkan Pesan Sekarang
              </button>
            </form>
          </div>
        )}

        {/* Broadcast History Log */}
        <div className={`${isAdmin ? 'lg:col-span-2' : 'lg:col-span-1'} bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col`}>
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-700" /> Riwayat Pesan Terkirim
          </h3>
          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[420px] pr-1">
            {broadcastList.map((b) => (
              <div key={b.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">{b.title}</h4>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                    {b.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">{b.message}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Kepada: <strong className="text-slate-600">{b.recipient}</strong></span>
                  <span>{b.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
