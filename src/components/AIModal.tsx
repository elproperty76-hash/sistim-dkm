import React, { useState } from 'react';
import { Sparkles, X, Copy, Check, Loader2 } from 'lucide-react';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose }) => {
  const [promptType, setPromptType] = useState('khotbah');
  const [customTopic, setCustomTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptType, customTopic })
      });
      const data = await res.json();
      setResult(data.result || 'Tidak dapat menghasilkan teks.');
    } catch (err) {
      setResult('Terjadi kesalahan koneksi ke server AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Generator Khotbah & Buletin DKM</h3>
              <p className="text-xs text-slate-500">Didukung oleh Google Gemini AI untuk Pengurus DKM Rancaekek</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Jenis Konten</label>
            <select
              value={promptType}
              onChange={(e) => setPromptType(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="khotbah">Naskah Khotbah Jumat</option>
              <option value="buletin">Buletin Keuangan & Dakwah</option>
              <option value="undangan">Pesan Undangan WhatsApp</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Topik / Tema Khusus (Opsional)</label>
            <input
              type="text"
              placeholder="Contoh: Memakmurkan Masjid di Akhir Zaman / Ukhuwah Warga Rancaekek"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Sedang Menyusun Naskah AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" /> Hasilkan Teks dengan AI
              </>
            )}
          </button>
        </form>

        {result && (
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Hasil Naskah AI</span>
              <button
                onClick={handleCopy}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Tersalin!' : 'Salin Teks'}
              </button>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-800 whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
