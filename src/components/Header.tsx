import React from 'react';
import { MapPin, ShieldCheck, Sparkles, UserCheck, LogIn, Phone, Cloud } from 'lucide-react';
import { MosqueProfile, UserProfile } from '../types';

interface HeaderProps {
  onOpenBroadcast?: () => void;
  onOpenAI: () => void;
  onOpenLogin: () => void;
  onOpenMap?: () => void;
  currentUser: UserProfile | null;
  mosqueProfile?: MosqueProfile;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAI, onOpenLogin, onOpenMap, currentUser, mosqueProfile }) => {
  const mosqueName = mosqueProfile?.name || 'DKM Rancaekek';
  const mosqueAddress = mosqueProfile?.address || 'Jl. Raya Rancaekek - Majalaya No. 12, Rancaekek Kulon, Kec. Rancaekek, Kabupaten Bandung, Jawa Barat';
  const mosqueCallCenter = mosqueProfile?.callCenter || '+62 812-2345-6789';

  return (
    <header className="bg-emerald-900 text-white shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4">
        {/* Branding */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-800 border border-emerald-700 flex items-center justify-center shadow-inner shrink-0">
              <span className="text-base sm:text-lg font-bold font-serif text-amber-300">🕌</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-white truncate">{mosqueName}</h1>
                <span className="bg-emerald-800/90 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-medium border border-emerald-700/80 flex items-center gap-0.5 shrink-0">
                  <ShieldCheck className="w-2.5 h-2.5 text-amber-400" /> Resmi
                </span>
                <span title="Terhubung ke Firebase Firestore" className="bg-emerald-800/80 text-emerald-300 p-0.5 rounded-full border border-emerald-700/80 flex items-center justify-center shrink-0">
                  <Cloud className="w-3 h-3 text-emerald-300" />
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-emerald-200 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 mt-0.5">
                <button
                  type="button"
                  onClick={onOpenMap}
                  className="flex items-center gap-1 hover:text-white transition cursor-pointer text-left group max-w-[260px] sm:max-w-md lg:max-w-none truncate"
                  title="Buka Peta Lokasi Google Maps DKM Rancaekek"
                >
                  <MapPin className="w-2.5 h-2.5 text-amber-400 shrink-0 group-hover:scale-110 transition" />
                  <span className="hover:underline underline-offset-2 truncate">{mosqueAddress}</span>
                  <span className="bg-amber-400 text-emerald-950 font-bold text-[8px] px-1 py-0.2 rounded uppercase ml-0.5 shrink-0">
                    Peta
                  </span>
                </button>
                {mosqueCallCenter && (
                  <p className="flex items-center gap-1 text-amber-300 font-medium shrink-0">
                    <Phone className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                    <span>WA: {mosqueCallCenter}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap w-full md:w-auto justify-end">
          {onOpenMap && (
            <button
              onClick={onOpenMap}
              className="bg-emerald-800/90 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition border border-emerald-700 shadow-xs cursor-pointer"
              title="Buka Peta Lokasi Google Maps DKM Rancaekek"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Peta Lokasi</span>
            </button>
          )}

          <button
            onClick={onOpenLogin}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border shadow-xs cursor-pointer ${
              currentUser
                ? 'bg-amber-400 text-emerald-950 border-amber-300 font-bold'
                : 'bg-emerald-800/90 hover:bg-emerald-700 text-white border-emerald-700'
            }`}
          >
            {currentUser ? <UserCheck className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
            <span className="truncate max-w-[120px]">{currentUser ? currentUser.name : 'Login Admin'}</span>
          </button>

          <button
            onClick={onOpenAI}
            className="bg-emerald-800/90 hover:bg-emerald-700 text-amber-300 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition border border-emerald-700 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Khotbah</span>
          </button>
        </div>
      </div>
    </header>
  );
};

