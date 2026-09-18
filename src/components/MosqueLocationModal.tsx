import React from 'react';
import { X, MapPin } from 'lucide-react';
import { MosqueProfile } from '../types';
import { MosqueMapCard } from './MosqueMapCard';

interface MosqueLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  mosqueProfile?: MosqueProfile;
  isAdmin?: boolean;
  onNavigateToSettings?: () => void;
}

export const MosqueLocationModal: React.FC<MosqueLocationModalProps> = ({
  isOpen,
  onClose,
  mosqueProfile,
  isAdmin,
  onNavigateToSettings
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 bg-emerald-900 text-white border-b border-emerald-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-300">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                Lokasi & Rute Menuju {mosqueProfile?.name || 'DKM Rancaekek'}
              </h3>
              <p className="text-[11px] text-emerald-200">
                Peta interaktif Google Maps untuk kemudahan jamaah dan musafir
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 sm:p-4">
          <MosqueMapCard
            mosqueProfile={mosqueProfile}
            isAdmin={isAdmin}
            onNavigateToSettings={() => {
              onClose();
              if (onNavigateToSettings) onNavigateToSettings();
            }}
          />
        </div>
      </div>
    </div>
  );
};
