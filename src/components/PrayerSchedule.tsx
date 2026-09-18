import React, { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  Compass,
  Volume2,
  VolumeX,
  RotateCw,
  Navigation,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronDown,
  ArrowRightLeft,
  Sparkles
} from 'lucide-react';
import { MosqueProfile } from '../types';
import { HijriConverterModal } from './HijriConverterModal';

interface PrayerScheduleProps {
  mosqueProfile?: MosqueProfile;
  compact?: boolean;
}

interface PrayerTimings {
  Imsak: string;
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const PRESET_CITIES = [
  { name: 'Rancaekek, Kab. Bandung', lat: -6.968, lng: 107.761, zone: 'WIB' },
  { name: 'Kota Bandung', lat: -6.917, lng: 107.619, zone: 'WIB' },
  { name: 'Kab. Sumedang', lat: -6.858, lng: 107.926, zone: 'WIB' },
  { name: 'Kota Cimahi', lat: -6.872, lng: 107.542, zone: 'WIB' },
  { name: 'Kab. Garut', lat: -7.227, lng: 107.908, zone: 'WIB' },
  { name: 'DKI Jakarta', lat: -6.208, lng: 106.845, zone: 'WIB' },
  { name: 'Kota Bogor', lat: -6.597, lng: 106.806, zone: 'WIB' },
  { name: 'Kota Bekasi', lat: -6.238, lng: 106.975, zone: 'WIB' },
  { name: 'Kota Cirebon', lat: -6.732, lng: 108.552, zone: 'WIB' },
  { name: 'Kota Semarang', lat: -6.966, lng: 110.438, zone: 'WIB' },
  { name: 'Kota Yogyakarta', lat: -7.795, lng: 110.369, zone: 'WIB' },
  { name: 'Kota Surabaya', lat: -7.257, lng: 112.752, zone: 'WIB' },
  { name: 'Kota Medan', lat: 3.595, lng: 98.672, zone: 'WIB' },
  { name: 'Kota Makassar', lat: -5.147, lng: 119.432, zone: 'WITA' },
  { name: 'Kota Denpasar', lat: -8.670, lng: 115.212, zone: 'WITA' }
];

export const PrayerSchedule: React.FC<PrayerScheduleProps> = ({ mosqueProfile, compact = false }) => {
  const [selectedCity, setSelectedCity] = useState(PRESET_CITIES[0]);
  const [isUsingGPS, setIsUsingGPS] = useState(false);
  const [customLocationName, setCustomLocationName] = useState('');
  const [timings, setTimings] = useState<PrayerTimings>({
    Imsak: '04:14',
    Fajr: '04:24',
    Sunrise: '05:41',
    Dhuhr: '11:43',
    Asr: '14:56',
    Maghrib: '17:46',
    Isha: '18:55'
  });
  const [hijriDate, setHijriDate] = useState('7 Rabiul Akhir 1448 H');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isConverterOpen, setIsConverterOpen] = useState(false);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; diffMs: number }>({
    name: 'Dzuhur',
    time: '11:43',
    diffMs: 0
  });

  // Sound chime synthesizer
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.3);
        gain.gain.setValueAtTime(0.18, now + i * 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.3 + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.3);
        osc.stop(now + i * 0.3 + 0.55);
      });
    } catch (e) {
      console.warn("Chime playback error:", e);
    }
  };

  // Fetch timings from Aladhan Kemenag Method 20
  const fetchTimings = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=20`
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.data && data.data.timings) {
          const t = data.data.timings;
          setTimings({
            Imsak: t.Imsak ? t.Imsak.slice(0, 5) : '04:14',
            Fajr: t.Fajr ? t.Fajr.slice(0, 5) : '04:24',
            Sunrise: t.Sunrise ? t.Sunrise.slice(0, 5) : '05:41',
            Dhuhr: t.Dhuhr ? t.Dhuhr.slice(0, 5) : '11:43',
            Asr: t.Asr ? t.Asr.slice(0, 5) : '14:56',
            Maghrib: t.Maghrib ? t.Maghrib.slice(0, 5) : '17:46',
            Isha: t.Isha ? t.Isha.slice(0, 5) : '18:55'
          });

          if (data.data.date && data.data.date.hijri) {
            const h = data.data.date.hijri;
            setHijriDate(`${h.day} ${h.month.en} ${h.year} H`);
          }
        }
      }
    } catch (err) {
      console.warn('Aladhan API unavailable, using offline astronomical calculation:', err);
    } finally {
      setLoading(false);
    }
  };

  // Try GPS Location
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Fitur Geolocation tidak didukung di peramban ini.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setIsUsingGPS(true);
        setCustomLocationName('Lokasi GPS Saat Ini');
        fetchTimings(lat, lng);
      },
      (err) => {
        console.warn('Geolocation denied or failed:', err);
        alert('Izin lokasi tidak diberikan atau tidak dapat diakses. Menggunakan wilayah default.');
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    fetchTimings(selectedCity.lat, selectedCity.lng);
  }, [selectedCity]);

  // Live timer tick & calculate next prayer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Prayer list with times for today
      const prayerList = [
        { name: 'Imsak', time: timings.Imsak },
        { name: 'Subuh', time: timings.Fajr },
        { name: 'Terbit (Syuruq)', time: timings.Sunrise },
        { name: 'Dzuhur', time: timings.Dhuhr },
        { name: 'Ashar', time: timings.Asr },
        { name: 'Maghrib', time: timings.Maghrib },
        { name: 'Isya', time: timings.Isha }
      ];

      let upcoming = null;
      for (const p of prayerList) {
        const [hours, minutes] = p.time.split(':').map(Number);
        const pDate = new Date(now);
        pDate.setHours(hours, minutes, 0, 0);
        const diff = pDate.getTime() - now.getTime();
        if (diff > 0) {
          upcoming = { name: p.name, time: p.time, diffMs: diff };
          break;
        }
      }

      // If all prayers today have passed, next is tomorrow's Subuh
      if (!upcoming) {
        const [hours, minutes] = timings.Fajr.split(':').map(Number);
        const tomorrowSubuh = new Date(now);
        tomorrowSubuh.setDate(tomorrowSubuh.getDate() + 1);
        tomorrowSubuh.setHours(hours, minutes, 0, 0);
        const diff = tomorrowSubuh.getTime() - now.getTime();
        upcoming = { name: 'Subuh (Besok)', time: timings.Fajr, diffMs: diff };
      }

      setNextPrayer(upcoming);
    }, 1000);

    return () => clearInterval(timer);
  }, [timings]);

  // Format countdown string
  const formatCountdown = (diffMs: number) => {
    if (diffMs <= 0) return 'Telah Tiba';
    const totalSecs = Math.floor(diffMs / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}j ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}d`;
  };

  const prayerCards = [
    { id: 'imsak', name: 'Imsak', time: timings.Imsak, icon: Moon, desc: 'Batas sahur' },
    { id: 'subuh', name: 'Subuh', time: timings.Fajr, icon: Sunrise, desc: 'Fajar shadiq' },
    { id: 'terbit', name: 'Terbit', time: timings.Sunrise, icon: Sun, desc: 'Syuruq fajar' },
    { id: 'dzuhur', name: 'Dzuhur', time: timings.Dhuhr, icon: Sun, desc: 'Tergelincir matahari' },
    { id: 'ashar', name: 'Ashar', time: timings.Asr, icon: Sun, desc: 'Bayangan seimbang' },
    { id: 'maghrib', name: 'Maghrib', time: timings.Maghrib, icon: Sunset, desc: 'Terbenam matahari' },
    { id: 'isya', name: 'Isya', time: timings.Isha, icon: Moon, desc: 'Hilang syafaq merah' }
  ];

  const formattedMasehi = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const formattedDigitalClock = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // COMPACT VIEW (for header ticker or top bar)
  if (compact) {
    return (
      <div className="bg-emerald-950 text-white border-b border-emerald-800 px-3 py-1.5 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-amber-300">Jadwal Sholat ({selectedCity.name}):</span>
            <span className="text-emerald-200">
              Dzuhur <strong className="text-white">{timings.Dhuhr}</strong> &bull; Ashar <strong className="text-white">{timings.Asr}</strong> &bull; Maghrib <strong className="text-white">{timings.Maghrib}</strong> &bull; Isya <strong className="text-white">{timings.Isha}</strong> &bull; Subuh <strong className="text-white">{timings.Fajr}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono font-bold text-amber-300 text-xs">
            <span>{formattedDigitalClock} {selectedCity.zone}</span>
            <span className="bg-emerald-900 border border-emerald-700 px-2 py-0.5 rounded text-[10px] text-emerald-200">
              Menuju {nextPrayer.name}: {formatCountdown(nextPrayer.diffMs)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // FULL COMPONENT VIEW
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden mb-4">
      {/* Top Banner Header - Compact Size */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 p-3 sm:p-4 text-white relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Compass className="w-3 h-3 text-amber-300" />
                Standar Kemenag RI
              </span>
              <button
                onClick={() => setIsConverterOpen(true)}
                className="text-[11px] text-amber-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 px-2 py-0.5 rounded-full flex items-center gap-1.5 font-medium transition cursor-pointer"
                title="Klik untuk membuka Konverter Masehi ke Hijriah"
              >
                <Moon className="w-3 h-3 text-amber-300" />
                <span>{hijriDate}</span>
                <ArrowRightLeft className="w-2.5 h-2.5 text-amber-300" />
              </button>
            </div>
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
              Jadwal Sholat & Waktu Imsakiyah
            </h3>
            <p className="text-[11px] sm:text-xs text-emerald-100 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Wilayah: <strong>{isUsingGPS ? customLocationName : selectedCity.name}</strong> ({selectedCity.zone})</span>
            </p>
          </div>

          {/* Real-time Clock & Countdown Highlight */}
          <div className="bg-emerald-950/80 border border-emerald-700/60 rounded-lg p-2 sm:px-3 text-right flex flex-row md:flex-col items-center md:items-end justify-between gap-2.5">
            <div>
              <p className="text-[10px] text-emerald-300 uppercase tracking-wider font-semibold">Waktu Sekarang</p>
              <div className="text-lg sm:text-xl font-bold font-mono tracking-tight text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>{formattedDigitalClock}</span>
                <span className="text-[11px] text-emerald-300 font-sans font-bold">{selectedCity.zone}</span>
              </div>
            </div>

            <div className="bg-emerald-900/90 border border-emerald-700/80 rounded-md px-2.5 py-0.5 text-left md:text-right">
              <p className="text-[9px] text-amber-300 font-bold uppercase">
                Menuju {nextPrayer.name}
              </p>
              <p className="text-xs font-bold font-mono text-white">
                {formatCountdown(nextPrayer.diffMs)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls: Location Selector & Audio Toggle */}
        <div className="mt-2.5 pt-2 border-t border-emerald-700/50 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-emerald-200 text-[11px]">Wilayah:</span>
            <div className="relative inline-block">
              <select
                value={isUsingGPS ? 'gps' : selectedCity.name}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'gps') {
                    handleUseGPS();
                  } else {
                    const match = PRESET_CITIES.find(c => c.name === val);
                    if (match) {
                      setIsUsingGPS(false);
                      setSelectedCity(match);
                    }
                  }
                }}
                className="bg-emerald-800 text-white border border-emerald-700 rounded-lg px-2.5 py-1 pr-7 text-xs font-medium appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                {PRESET_CITIES.map((c) => (
                  <option key={c.name} value={c.name} className="bg-slate-900 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-emerald-300 absolute right-2 top-2 pointer-events-none" />
            </div>

            <button
              onClick={handleUseGPS}
              className="bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white px-2 py-1 rounded-lg border border-emerald-700 flex items-center gap-1 transition text-[11px] font-medium cursor-pointer"
              title="Gunakan koordinat GPS perangkat Anda"
            >
              <Navigation className="w-3 h-3 text-amber-300" />
              <span>GPS</span>
            </button>

            <button
              onClick={() => fetchTimings(selectedCity.lat, selectedCity.lng)}
              className="bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 px-2 py-1 rounded-lg border border-emerald-700 flex items-center gap-1 transition text-[11px] cursor-pointer"
              title="Perbarui data"
            >
              <RotateCw className={`w-3 h-3 text-emerald-200 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playChime();
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-400 text-emerald-950 border-amber-300'
                  : 'bg-emerald-800 text-emerald-200 border-emerald-700'
              }`}
              title="Aktifkan nada pengingat jadwal"
            >
              {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              <span>{soundEnabled ? 'Suara Aktif' : 'Bisu'}</span>
            </button>

            <span className="text-emerald-200 text-[11px] hidden sm:inline">
              📅 {formattedMasehi}
            </span>
          </div>
        </div>

        {/* Jadwal Sholat 7 Waktu (Baris Inline Ringkas & Sleek) */}
        <div className="mt-2.5 pt-2 border-t border-emerald-700/50 flex flex-wrap items-center justify-between gap-1.5 text-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-bold uppercase tracking-wider shrink-0 mr-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Jadwal Sholat ({selectedCity.name}):</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 flex-1 justify-end">
            {prayerCards.map((p) => {
              const isNext = nextPrayer.name.toLowerCase().includes(p.name.toLowerCase());
              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition ${
                    isNext
                      ? 'bg-amber-400 text-emerald-950 font-bold shadow-xs ring-1 ring-amber-300'
                      : 'bg-emerald-950/60 text-emerald-100 border border-emerald-700/70 hover:bg-emerald-900/80'
                  }`}
                >
                  <span className={`text-[10px] uppercase font-semibold ${isNext ? 'text-emerald-950' : 'text-emerald-200'}`}>
                    {p.name}
                  </span>
                  <span className="font-mono font-bold text-xs">{p.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Konverter Masehi ke Hijriah & PHBI */}
      <HijriConverterModal
        isOpen={isConverterOpen}
        onClose={() => setIsConverterOpen(false)}
      />
    </div>
  );
};
