import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  ExternalLink,
  Copy,
  Check,
  Phone,
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Share2,
  Info,
  Car,
  Clock,
  Sparkles
} from 'lucide-react';
import { MosqueProfile } from '../types';

interface MosqueMapCardProps {
  mosqueProfile?: MosqueProfile;
  isAdmin?: boolean;
  onNavigateToSettings?: () => void;
  variant?: 'full' | 'compact';
}

export const MosqueMapCard: React.FC<MosqueMapCardProps> = ({
  mosqueProfile,
  isAdmin = false,
  onNavigateToSettings,
  variant = 'full'
}) => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [zoom, setZoom] = useState<number>(16);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const mosqueName = mosqueProfile?.name || 'DKM Rancaekek';
  const address = mosqueProfile?.address || 'Jl. Raya Rancaekek - Majalaya No. 12, Rancaekek Kulon, Kec. Rancaekek, Kabupaten Bandung, Jawa Barat';
  const callCenter = mosqueProfile?.callCenter || '+62 812-2345-6789';
  const latitude = mosqueProfile?.latitude ?? -6.9744;
  const longitude = mosqueProfile?.longitude ?? 107.7617;
  const landmark = mosqueProfile?.landmark || 'Dekat Stasiun Kereta Api Rancaekek & Alun-Alun Rancaekek';
  const postalCode = mosqueProfile?.postalCode || '40394';

  // Construct iframe Google Maps Embed URL
  const queryParam = mosqueProfile?.mapQuery || `${latitude},${longitude}(${encodeURIComponent(mosqueName)})`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(queryParam)}&t=${mapType === 'satellite' ? 'k' : 'm'}&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

  // External Google Maps Links
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${mosqueName} ${address}`)}`;
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(`${mosqueName}, ${address} (Kode Pos: ${postalCode})`);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyCoordinates = async () => {
    try {
      await navigator.clipboard.writeText(`${latitude}, ${longitude}`);
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lokasi ${mosqueName}`,
          text: `Kunjungi ${mosqueName} di ${address}`,
          url: googleMapsDirectionsUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      handleCopyAddress();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 p-4 sm:p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-800/90 border border-emerald-600/70 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Google Maps Terintegrasi
              </span>
              <span className="bg-emerald-800 text-emerald-200 text-[10px] font-medium px-2 py-0.5 rounded-full hidden sm:inline">
                Kecamatan Rancaekek
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
              Peta Lokasi & Profil {mosqueName}
            </h3>
            <p className="text-xs text-emerald-100 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="line-clamp-1">{address}</span>
            </p>
          </div>
        </div>

        {/* Quick Header Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            title="Buka panduan rute navigasi di Google Maps"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Petunjuk Arah (GPS)</span>
          </a>

          <a
            href={googleMapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-800/90 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded-xl text-xs border border-emerald-600/70 flex items-center gap-1.5 transition cursor-pointer"
            title="Buka di aplikasi Google Maps"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Buka di Maps</span>
          </a>

          {isAdmin && onNavigateToSettings && (
            <button
              onClick={onNavigateToSettings}
              className="bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white px-3 py-1.5 rounded-xl text-xs font-medium border border-white/20 transition cursor-pointer"
              title="Atur alamat & koordinat peta"
            >
              Ubah Lokasi
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Map Frame & Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
        {/* Kolom Kiri: Peta Sematan Google Maps Iframe */}
        <div className="lg:col-span-7 xl:col-span-8 relative bg-slate-100 min-h-[320px] sm:min-h-[380px] flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
          {/* Map Controls Bar */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
            <div className="bg-white/95 backdrop-blur-xs border border-slate-200/80 shadow-sm rounded-lg px-2.5 py-1 flex items-center gap-2 pointer-events-auto text-xs font-semibold text-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px]">Pin Lokasi: {mosqueName}</span>
            </div>

            {/* Map Controls: Satellite & Zoom */}
            <div className="flex items-center gap-1 pointer-events-auto bg-white/95 backdrop-blur-xs border border-slate-200/80 shadow-sm rounded-lg p-1">
              <button
                onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
                className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                  mapType === 'satellite'
                    ? 'bg-emerald-700 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                title="Beralih antara Peta Standar & Citra Satelit"
              >
                <Layers className="w-3 h-3" />
                <span>{mapType === 'satellite' ? 'Satelit' : 'Peta'}</span>
              </button>

              <div className="w-px h-4 bg-slate-200 mx-0.5"></div>

              <button
                onClick={() => setZoom(Math.min(zoom + 1, 20))}
                className="p-1 rounded text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="Perbesar Peta (Zoom In)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setZoom(Math.max(zoom - 1, 12))}
                className="p-1 rounded text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="Perkecil Peta (Zoom Out)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  setZoom(16);
                  setMapType('roadmap');
                }}
                className="p-1 rounded text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="Reset Tampilan Peta"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Google Maps iFrame */}
          <div className="relative w-full h-full min-h-[320px] sm:min-h-[380px]">
            <iframe
              title={`Peta Lokasi Google Maps ${mosqueName}`}
              src={embedUrl}
              className="w-full h-full border-0 absolute inset-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setIsIframeLoaded(true)}
              allowFullScreen
            />
          </div>

          {/* Bottom Bar inside map container */}
          <div className="p-2.5 bg-slate-50/90 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 truncate">
              📍 Koordinat: <strong>{latitude}, {longitude}</strong>
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyCoordinates}
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 transition cursor-pointer"
              >
                {copiedCoords ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCoords ? 'Tersalin' : 'Salin Koordinat'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Panduan Akses & Info Detail Lokasi */}
        <div className="lg:col-span-5 xl:col-span-4 p-4 sm:p-5 flex flex-col justify-between space-y-4 bg-white">
          <div className="space-y-3.5">
            {/* Address Box */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" /> Alamat Resmi
                </span>
                <button
                  onClick={handleCopyAddress}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition cursor-pointer"
                >
                  {copiedAddress ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAddress ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
              <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                {address}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Kode Pos: <span className="font-semibold text-slate-700">{postalCode}</span>
              </p>
            </div>

            {/* Landmark & Panduan Akses */}
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1 mb-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Patokan & Akses Terdekat
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {landmark}
              </p>
              <div className="mt-2.5 pt-2 border-t border-emerald-100/80 flex flex-wrap gap-2 text-[10px] text-emerald-900">
                <span className="bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  🚆 Stasiun Rancaekek
                </span>
                <span className="bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  🚗 Akses Tol Cileunyi / Cisumdawu
                </span>
                <span className="bg-white/80 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  🏛️ Kantor Kecamatan
                </span>
              </div>
            </div>

            {/* Fasilitas & Aksesibilitas Masjid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Car className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">Area Parkir</p>
                  <p className="text-[11px] font-bold text-slate-800">Mobil & Motor Luas</p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-medium">Operasional</p>
                  <p className="text-[11px] font-bold text-slate-800">Buka 24 Jam</p>
                </div>
              </div>
            </div>

            {/* Call Center & Layanan Jamaah */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">WA Call Center DKM</p>
                  <p className="text-xs font-bold text-slate-900">{callCenter}</p>
                </div>
              </div>
              <a
                href={`https://wa.me/${callCenter.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalamu'alaikum Pengurus DKM Rancaekek, saya ingin menanyakan informasi masjid.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition shadow-2xs shrink-0 cursor-pointer"
              >
                Chat WA
              </a>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer text-center"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-300" />
              <span>Buka Rute di Google Maps</span>
            </a>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
              title="Bagikan Lokasi Masjid"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
