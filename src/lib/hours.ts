import { business, dayNames, extraClosedDates, weekHours, type DayHours } from '../data/business';

/** 450 -> "07:30" */
export const fmt = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export const formatRange = (h: DayHours) => (h ? `${fmt(h[0])}–${fmt(h[1])}` : 'Fechado');

/** "Seg a Sex · 07:30–18:00" — agrupa dias consecutivos com o mesmo horário (seg→dom). */
export function groupedHours(): { label: string; hours: string }[] {
  const short = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const order = [1, 2, 3, 4, 5, 6, 0];
  const groups: { days: number[]; hours: string }[] = [];
  for (const d of order) {
    const hours = formatRange(weekHours[d]);
    const last = groups.at(-1);
    if (last && last.hours === hours) last.days.push(d);
    else groups.push({ days: [d], hours });
  }
  return groups.map(({ days, hours }) => ({
    label: days.length === 1 ? dayNames[days[0]] : `${short[days[0]]} a ${short[days.at(-1)!]}`,
    hours,
  }));
}

/* ------------------------------------------------------------------ */
/* Feriados                                                           */
/* ------------------------------------------------------------------ */

const ymd = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000);

/** Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher), em UTC. */
function easter(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

/** Feriados nacionais (Lei 662/1949 e alterações) + Sexta-feira Santa. */
export function nationalHolidays(year: number): Map<string, string> {
  const fixed: [string, string][] = [
    ['01-01', 'Confraternização Universal'],
    ['04-21', 'Tiradentes'],
    ['05-01', 'Dia do Trabalho'],
    ['09-07', 'Independência do Brasil'],
    ['10-12', 'Nossa Senhora Aparecida'],
    ['11-02', 'Finados'],
    ['11-15', 'Proclamação da República'],
    ['11-20', 'Dia da Consciência Negra'],
    ['12-25', 'Natal'],
  ];
  const map = new Map(fixed.map(([md, name]) => [`${year}-${md}`, name]));
  map.set(ymd(addDays(easter(year), -2)), 'Sexta-feira Santa');
  return map;
}

function holidayName(date: string): string | null {
  if (extraClosedDates.includes(date)) return 'recesso';
  return nationalHolidays(Number(date.slice(0, 4))).get(date) ?? null;
}

/* ------------------------------------------------------------------ */
/* Status "aberto agora"                                              */
/* ------------------------------------------------------------------ */

/** Data (AAAA-MM-DD), dia da semana e minutos no fuso da oficina. */
function zonedNow(now: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: business.timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === t)!.value;
  const date = `${get('year')}-${get('month')}-${get('day')}`;
  const day = new Date(`${date}T00:00:00Z`).getUTCDay();
  const mins = Number(get('hour')) * 60 + Number(get('minute'));
  return { date, day, mins };
}

/** Horário efetivo de uma data, considerando feriados. */
function hoursOn(date: string, day: number): DayHours {
  return holidayName(date) ? null : weekHours[day];
}

export interface OpenStatus {
  open: boolean;
  message: string;
  /** Índice do dia atual (0 = domingo), para destacar na tabela. */
  today: number;
  todayLabel: string;
  holiday: string | null;
}

export function getStatus(now = new Date()): OpenStatus {
  const { date, day, mins } = zonedNow(now);
  const holiday = holidayName(date);
  const today = hoursOn(date, day);
  const open = !!today && mins >= today[0] && mins < today[1];
  const todayLabel = today ? `Hoje: ${fmt(today[0])} – ${fmt(today[1])}` : 'Hoje: fechado';

  if (open) return { open, message: `Aberto agora · fecha às ${fmt(today[1])}`, today: day, todayLabel, holiday };
  if (today && mins < today[0])
    return { open, message: `Fechado · abre hoje às ${fmt(today[0])}`, today: day, todayLabel, holiday };

  const base = new Date(`${date}T00:00:00Z`);
  for (let k = 1; k <= 14; k++) {
    const next = addDays(base, k);
    const nd = next.getUTCDay();
    const h = hoursOn(ymd(next), nd);
    if (!h) continue;
    const when = k === 1 ? 'amanhã' : dayNames[nd].toLowerCase();
    const prefix = holiday ? `Fechado hoje (${holiday})` : 'Fechado';
    return { open, message: `${prefix} · abre ${when} às ${fmt(h[0])}`, today: day, todayLabel, holiday };
  }
  return { open, message: 'Fechado', today: day, todayLabel, holiday };
}
