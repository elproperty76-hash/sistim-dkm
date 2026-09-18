export interface Jamaah {
  id: string;
  name: string;
  role: string;
  phone: string;
  address: string;
  category: 'Pengurus' | 'Remaja Masjid' | 'Jamaah' | 'Muallaf';
  status: 'Aktif' | 'Non-Aktif';
  joinedDate: string;
}

export interface Keuangan {
  id: string;
  date: string;
  type: 'IN' | 'OUT';
  category: string;
  amount: number;
  description: string;
  source: string;
}

export interface Aset {
  id: string;
  name: string;
  category: string;
  qty: number;
  condition: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  location: string;
  year: number;
  value: number;
}

export interface Kegiatan {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image: string;
}

export interface Program {
  id: string;
  title: string;
  schedule: string;
  speaker: string;
  location: string;
  target: string;
  status: 'Aktif' | 'Selesai' | 'Akan Datang';
}

export interface BroadcastMessage {
  id: string;
  date: string;
  title: string;
  recipient: string;
  message: string;
  status: string;
}

export interface Stats {
  totalJamaah: number;
  totalPengurus: number;
  saldoKas: number;
  totalInfaq: number;
  totalKeluar: number;
  totalAset: number;
  totalAsetNilai: number;
  totalProgram: number;
  totalKegiatan: number;
}

export interface DonationQRIS {
  merchantName?: string;
  nmid?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  qrImageUrl?: string;
  qrPayload?: string;
  instructions?: string;
}

export interface MosqueProfile {
  name: string;
  address: string;
  callCenter: string;
  qris?: DonationQRIS;
  mapEmbedUrl?: string;
  mapQuery?: string;
  latitude?: number;
  longitude?: number;
  landmark?: string;
  postalCode?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  mosqueName?: string;
  password?: string;
  createdAt?: string;
}

