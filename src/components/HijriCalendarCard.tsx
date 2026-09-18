import React, { useState } from 'react';
import {
  Moon,
  Calendar,
  Sparkles,
  ArrowRightLeft,
  ChevronRight,
  Clock,
  Compass,
  Star,
  Info
} from 'lucide-react';
import { getHijriDate, getUpcomingEvents, ISLAMIC_MONTHS } from '../lib/hijriUtils';
import { HijriConverterModal } from './HijriConverterModal';

interface HijriCalendarCardProps {
  compact?: boolean;
}

export const HijriCalendarCard: React.FC<HijriCalendarCardProps> = ({ compact = false }) => {
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const todayHijri = getHijriDate(new Date());
  const upcomingEvents = getUpcomingEvents(todayHijri);
  const nextEvent = upcomingEvents[0];

  const currentMonthData = ISLAMIC_MONTHS.find(m => m.number === todayHijri.month);

  return (
    <>
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-xl p-3 sm:p-3.5 border border-emerald-700/60 shadow-xs flex flex-col justify-between relative overflow-hidden h-full">
        {/* Background Subtle Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/15 via-transparent to-transparent pointer-events-none"></div>

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between gap-2 pb-2 border-b border-emerald-700/50">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-md bg-emerald-800/80 border border-emerald-600/60 flex items-center justify-center text-amber-300">
              <Moon className="w-3.5 h-3.5 fill-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold tracking-tight text-white">
                  Penanggalan Hijriah
                </h4>
                {todayHijri.isBulanHaram && (
                  <span className="bg-amber-400 text-emerald-950 text-[8px] font-extrabold px-1.5 py-0.2 rounded-full">
                    Bulan Haram
                  </span>
                )}
              </div>
              <p className="text-[9px] text-emerald-200">Hisab Umm al-Qura & Kemenag RI</p>
            </div>
          </div>

          <button
            onClick={() => setIsConverterOpen(true)}
            className="bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 hover:text-white border border-emerald-600/70 text-[10px] font-bold px-2 py-1 rounded-lg transition flex items-center gap-1 shrink-0 cursor-pointer"
            title="Buka Konverter Masehi ke Hijriah"
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>Konverter</span>
          </button>
        </div>

        {/* Middle Date Showcase */}
        <div className="relative z-10 py-2 text-center sm:text-left">
          {/* Arabic Calligraphy Style */}
          <p className="text-lg sm:text-xl font-serif font-bold text-amber-300 tracking-wide mb-0.5" dir="rtl">
            {todayHijri.formattedArabic}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
            <span className="text-xs sm:text-sm font-bold text-white">
              {todayHijri.weekdayId}, {todayHijri.formattedText}
            </span>
            <span className="text-[9px] bg-emerald-800/80 border border-emerald-600 px-1.5 py-0.2 rounded text-emerald-200">
              Bulan ke-{todayHijri.month}
            </span>
          </div>

          {currentMonthData && (
            <p className="text-[10px] text-emerald-100/90 mt-1 line-clamp-1">
              {currentMonthData.desc}
            </p>
          )}
        </div>

        {/* Nearest Islamic Event (PHBI) Notice */}
        {nextEvent && (
          <div className="relative z-10 mt-1.5 pt-2 border-t border-emerald-700/50">
            <div className="bg-emerald-800/60 rounded-lg p-2 border border-emerald-600/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-md bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-amber-300 font-bold uppercase tracking-wider">
                      Hari Besar Terdekat
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-white truncate">
                    {nextEvent.event.title}
                  </p>
                  <p className="text-[9px] text-emerald-200">
                    Prakiraan: {nextEvent.estimatedDate}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="bg-amber-400 text-emerald-950 font-extrabold text-[10px] px-2 py-0.5 rounded-md inline-block shadow-2xs">
                  {nextEvent.daysRemaining === 0 ? 'Hari Ini' : `${nextEvent.daysRemaining} hari`}
                </span>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="mt-1.5 flex items-center justify-between text-[10px]">
              <span className="text-emerald-300">
                Ayyamul Bidh: 13-15 {todayHijri.monthNameId}
              </span>
              <button
                onClick={() => setIsConverterOpen(true)}
                className="text-amber-300 hover:text-white font-bold flex items-center gap-0.5 transition cursor-pointer"
              >
                <span>Lihat Semua PHBI</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Converter Modal */}
      <HijriConverterModal
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
      />
    </>
  );
};
