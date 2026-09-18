import React from 'react';
import { LayoutDashboard, Users, Wallet, Archive, Image as ImageIcon, Calendar, FileText, Send, Clock, Settings } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  mosqueName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, mosqueName }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'sholat', label: 'Jadwal Sholat', icon: Clock },
    { id: 'jamaah', label: 'Pendataan Jamaah', icon: Users },
    { id: 'keuangan', label: 'Pengelolaan Keuangan', icon: Wallet },
    { id: 'aset', label: 'Inventaris Aset', icon: Archive },
    { id: 'kegiatan', label: 'Galeri Kegiatan', icon: ImageIcon },
    { id: 'program', label: 'Majelis & Program', icon: Calendar },
    { id: 'laporan', label: 'Laporan Publik Real-Time', icon: FileText },
    { id: 'broadcast', label: 'Pesan Instan / Broadcast', icon: Send },
    { id: 'settings', label: 'Pengaturan Aplikasi', icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 p-4 flex flex-col shrink-0">
      <div className="mb-4 hidden lg:block">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">Menu Navigasi</p>
      </div>
      <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-50 text-emerald-900 border-l-4 border-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Info Card */}
      <div className="mt-auto hidden lg:block pt-6">
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3.5 text-center">
          <p className="text-xs font-semibold text-emerald-900 mb-1">{mosqueName || 'DKM Masjid Rancaekek'}</p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Transparan, Amanah, dan Melayani Umat Sepenuh Hati di Kabupaten Bandung.
          </p>
        </div>
      </div>
    </aside>
  );
};
