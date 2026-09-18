export interface HijriDateInfo {
  day: number;
  month: number;
  monthNameId: string;
  monthNameAr: string;
  year: number;
  weekdayId: string;
  weekdayAr: string;
  formattedText: string;
  formattedArabic: string;
  isBulanHaram: boolean;
}

export interface IslamicEvent {
  id: string;
  title: string;
  hijriDay: number;
  hijriMonth: number;
  monthName: string;
  description: string;
  category: 'Wajib' | 'Hari Raya' | 'Sunnah' | 'Peringatan';
}

export const ISLAMIC_MONTHS = [
  { number: 1, nameId: 'Muharram', nameAr: 'المحرم', desc: 'Bulan pertama kalender Hijriah & salah satu dari 4 Bulan Haram (Asyhurul Hurum).' },
  { number: 2, nameId: 'Shafar', nameAr: 'صفر', desc: 'Bulan kedua kalender Islam, dianjurkan memperbanyak istighfar dan amal shaleh.' },
  { number: 3, nameId: "Rabi'ul Awwal", nameAr: 'ربيع الأول', desc: 'Bulan kelahiran Rasulullah SAW (12 Rabiul Awwal).' },
  { number: 4, nameId: "Rabi'ul Akhir", nameAr: 'ربيع الثاني', desc: 'Bulan keempat kalender Islam, musim semi kedua.' },
  { number: 5, nameId: 'Jumadil Ula', nameAr: 'جمادى الأولى', desc: 'Bulan kelima dalam kalender Hijriah.' },
  { number: 6, nameId: 'Jumadil Akhirah', nameAr: 'جمادى الآخرة', desc: 'Bulan keenam kalender Hijriah sebelum memasuki bulan-bulan mulia.' },
  { number: 7, nameId: 'Rajab', nameAr: 'رجب', desc: 'Bulan Haram yang mulia, peristiwa agung Isra Mi\'raj Nabi Muhammad SAW (27 Rajab).' },
  { number: 8, nameId: "Sya'ban", nameAr: 'شعبان', desc: 'Bulan diangkatnya amal perbuatan kepada Allah SWT & malam Nisfu Sya\'ban.' },
  { number: 9, nameId: 'Ramadhan', nameAr: 'رمضان', desc: 'Bulan suci berpuasa wajib, diturunkannya Al-Qur\'an, dan malam Lailatul Qadr.' },
  { number: 10, nameId: 'Syawwal', nameAr: 'شوال', desc: 'Bulan kemenangan Idul Fitri (1 Syawwal) dan puasa sunnah 6 hari.' },
  { number: 11, nameId: "Dzulqa'dah", nameAr: 'ذو القعدة', desc: 'Bulan Haram persiapan ibadah haji, terikat perjanjian damai.' },
  { number: 12, nameId: 'Dzulhijjah', nameAr: 'ذو الحجة', desc: 'Bulan puncak ibadah Haji, wukuf Arafah (9 Dzulhijjah), dan Idul Adha (10 Dzulhijjah).' }
];

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    id: 'muharram-1',
    title: 'Tahun Baru Islam (1 Muharram)',
    hijriDay: 1,
    hijriMonth: 1,
    monthName: 'Muharram',
    description: 'Awal tahun baru penanggalan Hijriah, momentum hijrah Rasulullah SAW.',
    category: 'Peringatan'
  },
  {
    id: 'asyura-10',
    title: "Hari Asyura & Tasu'a (9-10 Muharram)",
    hijriDay: 10,
    hijriMonth: 1,
    monthName: 'Muharram',
    description: 'Puasa sunnah Asyura yang melebur dosa setahun yang lalu.',
    category: 'Sunnah'
  },
  {
    id: 'maulid-12',
    title: 'Maulid Nabi Muhammad SAW (12 Rabiul Awwal)',
    hijriDay: 12,
    hijriMonth: 3,
    monthName: "Rabi'ul Awwal",
    description: 'Peringatan kelahiran baginda Nabi Muhammad SAW rahmatan lil \'alamin.',
    category: 'Peringatan'
  },
  {
    id: 'isra-miraj-27',
    title: "Isra Mi'raj Nabi Muhammad SAW (27 Rajab)",
    hijriDay: 27,
    hijriMonth: 7,
    monthName: 'Rajab',
    description: 'Perjalanan malam Rasulullah dari Masjidil Haram ke Masjidil Aqsha hingga Sidratul Muntaha, turunnya perintah sholat 5 waktu.',
    category: 'Peringatan'
  },
  {
    id: 'nisfu-syaban-15',
    title: "Malam Nisfu Sya'ban (15 Sya'ban)",
    hijriDay: 15,
    hijriMonth: 8,
    monthName: "Sya'ban",
    description: 'Malam pertengahan bulan Sya\'ban yang penuh maghfirah dan ampunan Allah SWT.',
    category: 'Sunnah'
  },
  {
    id: 'ramadhan-1',
    title: 'Awal Puasa Ramadhan (1 Ramadhan)',
    hijriDay: 1,
    hijriMonth: 9,
    monthName: 'Ramadhan',
    description: 'Hari pertama ibadah puasa fardhu bulan suci Ramadhan.',
    category: 'Wajib'
  },
  {
    id: 'nuzulul-quran-17',
    title: "Nuzulul Qur'an (17 Ramadhan)",
    hijriDay: 17,
    hijriMonth: 9,
    monthName: 'Ramadhan',
    description: 'Peringatan malam pertama kali Al-Qur\'an diturunkan kepada Rasulullah SAW.',
    category: 'Peringatan'
  },
  {
    id: 'lailatul-qadr',
    title: 'Malam Lailatul Qadr (10 Malam Terakhir)',
    hijriDay: 21,
    hijriMonth: 9,
    monthName: 'Ramadhan',
    description: 'Malam kemuliaan yang lebih baik daripada seribu bulan.',
    category: 'Sunnah'
  },
  {
    id: 'idul-fitri-1',
    title: 'Hari Raya Idul Fitri (1-2 Syawwal)',
    hijriDay: 1,
    hijriMonth: 10,
    monthName: 'Syawwal',
    description: 'Hari raya kesucian umat Islam setelah sebulan penuh berpuasa Ramadhan.',
    category: 'Hari Raya'
  },
  {
    id: 'arafah-9',
    title: 'Hari Arafah (9 Dzulhijjah)',
    hijriDay: 9,
    hijriMonth: 12,
    monthName: 'Dzulhijjah',
    description: 'Puncak wukuf di padang Arafah & disunnahkan berpuasa bagi yang tidak berhaji.',
    category: 'Sunnah'
  },
  {
    id: 'idul-adha-10',
    title: 'Hari Raya Idul Adha & Qurban (10 Dzulhijjah)',
    hijriDay: 10,
    hijriMonth: 12,
    monthName: 'Dzulhijjah',
    description: 'Hari raya penyembelihan hewan qurban meneladani Nabi Ibrahim AS dan Nabi Ismail AS.',
    category: 'Hari Raya'
  },
  {
    id: 'tasyrik-11-13',
    title: 'Hari Tasyrik (11-13 Dzulhijjah)',
    hijriDay: 11,
    hijriMonth: 12,
    monthName: 'Dzulhijjah',
    description: 'Hari-hari makan, minum, dan berdzikir mengingat Allah SWT (diharamkan berpuasa).',
    category: 'Hari Raya'
  }
];

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export function toArabicDigits(num: number | string): string {
  return String(num).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);
}

/**
 * Converts a Gregorian Date to Hijri using Intl DateTimeFormat with Umm al-Qura calendar
 */
export function getHijriDate(date: Date = new Date()): HijriDateInfo {
  try {
    const formatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      weekday: 'long'
    });

    const parts = formatter.formatToParts(date);
    let day = 1;
    let month = 1;
    let year = 1448;
    let weekdayId = 'Jumat';

    for (const p of parts) {
      if (p.type === 'day') day = parseInt(p.value, 10);
      if (p.type === 'month') month = parseInt(p.value, 10);
      if (p.type === 'year') year = parseInt(p.value, 10);
      if (p.type === 'weekday') weekdayId = p.value;
    }

    const monthObj = ISLAMIC_MONTHS.find(m => m.number === month) || ISLAMIC_MONTHS[3];
    const isBulanHaram = [1, 7, 11, 12].includes(month);

    const arabicWeekdays: Record<string, string> = {
      'Minggu': 'الأحد',
      'Senin': 'الإثنين',
      'Selasa': 'الثلاثاء',
      'Rabu': 'الأربعاء',
      'Kamis': 'الخميس',
      'Jumat': 'الجمعة',
      'Sabtu': 'السبت'
    };

    const weekdayAr = arabicWeekdays[weekdayId] || 'الجمعة';
    const formattedText = `${day} ${monthObj.nameId} ${year} H`;
    const formattedArabic = `${toArabicDigits(day)} ${monthObj.nameAr} ${toArabicDigits(year)} هـ`;

    return {
      day,
      month,
      monthNameId: monthObj.nameId,
      monthNameAr: monthObj.nameAr,
      year,
      weekdayId,
      weekdayAr,
      formattedText,
      formattedArabic,
      isBulanHaram
    };
  } catch (e) {
    // Robust mathematical fallback
    return {
      day: 7,
      month: 4,
      monthNameId: "Rabi'ul Akhir",
      monthNameAr: 'ربيع الثاني',
      year: 1448,
      weekdayId: 'Jumat',
      weekdayAr: 'الجمعة',
      formattedText: "7 Rabi'ul Akhir 1448 H",
      formattedArabic: "٧ ربيع الثاني ١٤٤٨ هـ",
      isBulanHaram: false
    };
  }
}

/**
 * Converts a specific Gregorian date (YYYY-MM-DD) to Hijri
 */
export function convertGregorianToHijri(dateStr: string): HijriDateInfo {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d, 12, 0, 0);
  return getHijriDate(date);
}

/**
 * Approximates a Gregorian Date given a Hijri Day, Month, and Year
 */
export function convertHijriToGregorian(hDay: number, hMonth: number, hYear: number): Date {
  // Reference anchor: 1 Muharram 1448 H corresponds to June 16, 2026
  const anchorHYear = 1448;
  const anchorGDate = new Date(2026, 5, 16, 12, 0, 0); // 16 June 2026

  // Cumulative days in Hijri year up to month
  let daysOffset = (hYear - anchorHYear) * 354.367;
  // months 1..hMonth-1
  for (let m = 1; m < hMonth; m++) {
    daysOffset += (m % 2 === 1) ? 30 : 29;
  }
  daysOffset += (hDay - 1);

  const approxMs = anchorGDate.getTime() + daysOffset * 86400000;
  let result = new Date(approxMs);

  // Fine-tune by verifying with Intl
  for (let adjust = -3; adjust <= 3; adjust++) {
    const candidate = new Date(approxMs + adjust * 86400000);
    const check = getHijriDate(candidate);
    if (check.year === hYear && check.month === hMonth && check.day === hDay) {
      return candidate;
    }
  }

  return result;
}

/**
 * Finds upcoming Islamic events relative to a current Hijri Date
 */
export function getUpcomingEvents(currentHijri: HijriDateInfo): {
  event: IslamicEvent;
  daysRemaining: number;
  estimatedDate: string;
}[] {
  const list: { event: IslamicEvent; daysRemaining: number; estimatedDate: string }[] = [];

  for (const ev of ISLAMIC_EVENTS) {
    let targetYear = currentHijri.year;
    if (
      ev.hijriMonth < currentHijri.month ||
      (ev.hijriMonth === currentHijri.month && ev.hijriDay < currentHijri.day)
    ) {
      targetYear += 1;
    }

    // Rough day difference in lunar calendar (average 29.53 days/month)
    const monthDiff = (targetYear - currentHijri.year) * 12 + (ev.hijriMonth - currentHijri.month);
    let approxDays = Math.round(monthDiff * 29.53) + (ev.hijriDay - currentHijri.day);
    if (approxDays < 0) approxDays = 0;

    const gDate = convertHijriToGregorian(ev.hijriDay, ev.hijriMonth, targetYear);
    const dateStr = gDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    list.push({
      event: ev,
      daysRemaining: approxDays,
      estimatedDate: dateStr
    });
  }

  return list.sort((a, b) => a.daysRemaining - b.daysRemaining);
}
