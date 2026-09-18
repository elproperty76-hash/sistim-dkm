import React, { useState } from 'react';
import {
  X,
  ArrowRightLeft,
  Calendar as CalendarIcon,
  Moon,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  CalendarDays,
  Info
} from 'lucide-react';
import {
  getHijriDate,
  convertGregorianToHijri,
  convertHijriToGregorian,
  ISLAMIC_MONTHS,
  ISLAMIC_EVENTS,
  getUpcomingEvents,
  HijriDateInfo
} from '../lib/hijriUtils';

interface HijriConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
}

export const HijriConverterModal: React.FC<HijriConverterModalProps> = ({
  isOpen,
  onClose,
  initialDate = new Date()
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'m2h' | 'h2m' | 'events'>('m2h');

  // Tab 1: Masehi ke Hijriah state
  const [gregorianInput, setGregorianInput] = useState<string>(() => {
    const d = initialDate;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });

  const convertedHijri = convertGregorianToHijri(gregorianInput);

  // Tab 2: Hijriah ke Masehi state
  const [hDay, setHDay] = useState<number>(convertedHijri.day);
  const [hMonth, setHMonth] = useState<number>(convertedHijri.month);
  const [hYear, setHYear] = useState<number>(convertedHijri.year);

  const convertedGregorian = convertHijriToGregorian(hDay, hMonth, hYear);

  // Check if date is Ayyamul Bidh (13, 14, 15 Hijriah)
  const isAyyamulBidh = [13, 14, 15].includes(convertedHijri.day);

  // Check if converted date matches any Islamic event
  const matchingEvent = ISLAMIC_EVENTS.find(
    e => e.hijriMonth === convertedHijri.month && e.hijriDay === convertedHijri.day
  );

  const todayHijri = getHijriDate(new Date());
  const upcomingEvents = getUpcomingEvents(todayHijri);

  const handleSelectEvent = (eventHijriDay: number, eventHijriMonth: number) => {
    setHDay(eventHijriDay);
    setHMonth(eventHijriMonth);
    setHYear(todayHijri.year);
    setActiveTab('h2m');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">Konverter Penanggalan Masehi ⇄ Hijriah</h3>
                <span className="bg-amber-400 text-emerald-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                  Hisab Astronomis
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Kalender Umm al-Qura & Penentuan Hari Besar Islam (PHBI)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('m2h')}
            className={`px-4 py-2.5 rounded-t-xl transition border-t border-x flex items-center gap-2 ${
              activeTab === 'm2h'
                ? 'bg-white text-emerald-800 border-slate-200 border-b-white -mb-px shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <CalendarIcon className="w-4 h-4 text-emerald-600" />
            <span>Masehi ke Hijriah</span>
          </button>

          <button
            onClick={() => setActiveTab('h2m')}
            className={`px-4 py-2.5 rounded-t-xl transition border-t border-x flex items-center gap-2 ${
              activeTab === 'h2m'
                ? 'bg-white text-emerald-800 border-slate-200 border-b-white -mb-px shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4 text-teal-600" />
            <span>Hijriah ke Masehi</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2.5 rounded-t-xl transition border-t border-x flex items-center gap-2 ${
              activeTab === 'events'
                ? 'bg-white text-emerald-800 border-slate-200 border-b-white -mb-px shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Hari Besar Islam (PHBI)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* TAB 1: MASEHI KE HIJRIAH */}
          {activeTab === 'm2h' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pilih Tanggal Masehi (Kalender Nasional):
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="date"
                    value={gregorianInput}
                    onChange={(e) => setGregorianInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        const now = new Date();
                        const yyyy = now.getFullYear();
                        const mm = String(now.getMonth() + 1).padStart(2, '0');
                        const dd = String(now.getDate()).padStart(2, '0');
                        setGregorianInput(`${yyyy}-${mm}-${dd}`);
                      }}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                    >
                      Hari Ini
                    </button>
                    <button
                      onClick={() => {
                        const besok = new Date();
                        besok.setDate(besok.getDate() + 1);
                        const yyyy = besok.getFullYear();
                        const mm = String(besok.getMonth() + 1).padStart(2, '0');
                        const dd = String(besok.getDate()).padStart(2, '0');
                        setGregorianInput(`${yyyy}-${mm}-${dd}`);
                      }}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                    >
                      Besok
                    </button>
                  </div>
                </div>
              </div>

              {/* Conversion Output Card */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 rounded-2xl p-5 border border-emerald-200 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-emerald-700" />
                    Hasil Konversi Penanggalan Hijriah
                  </span>
                  {convertedHijri.isBulanHaram && (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Bulan Haram (Asyhurul Hurum)
                    </span>
                  )}
                </div>

                {/* Big Arabic Display */}
                <div className="text-center my-3">
                  <p className="text-3xl sm:text-4xl font-serif text-emerald-950 font-bold tracking-wide" dir="rtl">
                    {convertedHijri.formattedArabic}
                  </p>
                  <p className="text-lg sm:text-xl font-black text-emerald-900 mt-2">
                    {convertedHijri.weekdayId}, {convertedHijri.formattedText}
                  </p>
                </div>

                {/* Details Pills */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-emerald-200/80 text-xs">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 text-center">
                    <p className="text-slate-500 text-[10px] uppercase font-bold">Hari</p>
                    <p className="font-bold text-slate-900">{convertedHijri.weekdayId} ({convertedHijri.weekdayAr})</p>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 text-center">
                    <p className="text-slate-500 text-[10px] uppercase font-bold">Bulan Hijriah ke-{convertedHijri.month}</p>
                    <p className="font-bold text-slate-900">{convertedHijri.monthNameId} ({convertedHijri.monthNameAr})</p>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 text-center">
                    <p className="text-slate-500 text-[10px] uppercase font-bold">Tahun Hijriah</p>
                    <p className="font-bold text-slate-900">{convertedHijri.year} H</p>
                  </div>
                </div>

                {/* Event or Sunnah Detection */}
                {matchingEvent && (
                  <div className="mt-4 bg-emerald-700 text-white p-3 rounded-xl flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                        Hari Besar Islam: {matchingEvent.title}
                      </p>
                      <p className="text-xs text-emerald-100">{matchingEvent.description}</p>
                    </div>
                  </div>
                )}

                {isAyyamulBidh && !matchingEvent && (
                  <div className="mt-4 bg-teal-800 text-white p-3 rounded-xl flex items-center gap-3">
                    <Moon className="w-5 h-5 text-amber-300 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-amber-300">
                        Disunnahkan: Puasa Ayyamul Bidh (Hari ke-{convertedHijri.day})
                      </p>
                      <p className="text-xs text-teal-100">
                        Puasa pada hari-hari putih (13, 14, 15 Hijriah) setiap bulan bernilai pahala puasa sepanjang tahun.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: HIJRIAH KE MASEHI */}
          {activeTab === 'h2m' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tentukan Tanggal, Bulan, dan Tahun Hijriah:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Tanggal (1-30):</label>
                    <select
                      value={hDay}
                      onChange={(e) => setHDay(Number(e.target.value))}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          Tanggal {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Bulan Hijriah:</label>
                    <select
                      value={hMonth}
                      onChange={(e) => setHMonth(Number(e.target.value))}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {ISLAMIC_MONTHS.map((m) => (
                        <option key={m.number} value={m.number}>
                          {m.number}. {m.nameId} ({m.nameAr})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Tahun Hijriah (H):</label>
                    <select
                      value={hYear}
                      onChange={(e) => setHYear(Number(e.target.value))}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {Array.from({ length: 15 }, (_, i) => 1445 + i).map((yr) => (
                        <option key={yr} value={yr}>
                          {yr} Hijriah
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Conversion Result to Gregorian */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <CalendarDays className="w-4 h-4 text-emerald-700" />
                  Prakiraan Tanggal Masehi (Kalender Masehi):
                </span>

                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-2xs">
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">
                    {convertedGregorian.toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Cocok dengan: {hDay} {ISLAMIC_MONTHS.find(m => m.number === hMonth)?.nameId} {hYear} H
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DAFTAR HARI BESAR ISLAM (PHBI) */}
          {activeTab === 'events' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Kalender Hari Besar Islam (PHBI) 1448 H</h4>
                  <p className="text-xs text-slate-500">Daftar momen penting dan hari raya dalam penanggalan Hijriah</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {upcomingEvents.map(({ event, daysRemaining, estimatedDate }) => {
                  const isSoon = daysRemaining <= 30;
                  return (
                    <div
                      key={event.id}
                      className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSoon
                          ? 'bg-emerald-50/70 border-emerald-300'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            event.category === 'Hari Raya'
                              ? 'bg-rose-100 text-rose-800'
                              : event.category === 'Wajib'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}>
                            {event.category}
                          </span>
                          <h5 className="text-sm font-bold text-slate-900">{event.title}</h5>
                        </div>
                        <p className="text-xs text-slate-600">{event.description}</p>
                        <p className="text-[11px] text-slate-400">
                          {event.hijriDay} {event.monthName} &bull; Prakiraan: <strong>{estimatedDate}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          daysRemaining === 0
                            ? 'bg-emerald-600 text-white'
                            : isSoon
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {daysRemaining === 0 ? 'Hari Ini' : `${daysRemaining} hari lagi`}
                        </span>

                        <button
                          onClick={() => handleSelectEvent(event.hijriDay, event.hijriMonth)}
                          className="px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100 rounded-lg transition"
                          title="Konversi tanggal ini"
                        >
                          Lihat
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>Penetapan awal bulan Hijriah resmi tetap mengikuti sidang Isbat Kementerian Agama RI.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
