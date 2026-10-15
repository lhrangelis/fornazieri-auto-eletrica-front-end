/**
 * Fonte única de verdade do negócio.
 * Header, rodapé, horários, JSON-LD e links de WhatsApp leem daqui.
 *
 * ⚠️ Campos marcados com MOCK são fictícios e precisam ser trocados antes de publicar.
 */
import type { IconName } from './icons';

export const business = {
  name: 'Fornazieri Auto Elétrica',
  legalName: 'Fornazieri Auto Elétrica e Som Automotivo', // MOCK: confirmar razão social
  cnpj: '00.000.000/0001-00', // MOCK
  tagline: 'Auto Elétrica · Som',
  foundingYear: 2010, // MOCK
  phone: {
    display: '(14) 98818-6461',
    e164: '+5514988186461',
    whatsapp: '5514988186461',
  },
  instagram: {
    handle: 'fornazieriautoeletrica',
    url: 'https://www.instagram.com/fornazieriautoeletrica/',
  },
  address: {
    street: 'Rua Exemplo, 000', // MOCK
    district: 'Centro', // MOCK
    city: 'Cidade', // MOCK
    state: 'SP',
    postalCode: '00000-000', // MOCK
  },
  /** Coordenadas da oficina (vão para o JSON-LD). MOCK: preencher com as reais. */
  geo: null as { lat: number; lng: number } | null,
  /** Link "Como chegar" e embed. MOCK: usar o link do Perfil da Empresa no Google. */
  maps: {
    link: 'https://www.google.com/maps/search/?api=1&query=Fornazieri+Auto+El%C3%A9trica',
    embed: 'https://www.google.com/maps?q=Fornazieri+Auto+El%C3%A9trica&output=embed',
  },
  timeZone: 'America/Sao_Paulo',
} as const;

export const fullAddress = `${business.address.street} — ${business.address.district}, ${business.address.city}/${business.address.state}`;

export const waLink = (message = 'Olá! Gostaria de um orçamento.') =>
  `https://wa.me/${business.phone.whatsapp}?text=${encodeURIComponent(message)}`;

export const telLink = `tel:${business.phone.e164}`;

/* ------------------------------------------------------------------ */
/* Horários                                                           */
/* ------------------------------------------------------------------ */

/** Minutos desde 00:00. `null` = fechado. Índice 0 = domingo (igual a Date#getDay). */
export type DayHours = readonly [open: number, close: number] | null;

export const weekHours: readonly DayHours[] = [
  null, // domingo
  [450, 1080], // segunda 07:30–18:00
  [450, 1080],
  [450, 1080],
  [450, 1080],
  [450, 1080], // sexta
  [450, 1020], // sábado 07:30–17:00
];

export const dayNames = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
] as const;

/**
 * Datas extras de fechamento (AAAA-MM-DD): feriados municipais, Carnaval, recesso etc.
 * Os feriados nacionais já são calculados automaticamente em `lib/hours.ts`.
 */
export const extraClosedDates: readonly string[] = [];

/* ------------------------------------------------------------------ */
/* Serviços                                                           */
/* ------------------------------------------------------------------ */

export const categories = {
  ele: 'Elétrica & Diagnóstico',
  con: 'Conforto & Segurança',
  som: 'Som & Iluminação',
  vei: 'Motos & Caminhões',
} as const;

export type CategoryKey = keyof typeof categories;

export interface Service {
  title: string;
  icon: IconName;
  category: CategoryKey;
  description: string;
}

export const services: readonly Service[] = [
  { title: 'Elétrica geral', icon: 'bolt', category: 'ele', description: 'Revisão e reparo do sistema elétrico, chicotes, fusíveis, relés e curto-circuitos.' },
  { title: 'Diagnóstico de motor', icon: 'pulse', category: 'ele', description: 'Leitura com scanner, análise de falhas e luz de injeção acesa no painel.' },
  { title: 'Injeção eletrônica', icon: 'drop', category: 'ele', description: 'Limpeza e teste de bicos, sensores de injeção e correção de falhas de funcionamento.' },
  { title: 'Bateria', icon: 'battery', category: 'ele', description: 'Teste de carga, troca de bateria e verificação de consumo excessivo.' },
  { title: 'Alternadores', icon: 'alternator', category: 'ele', description: 'Reparo e revisão de alternadores e sistema de carga do veículo.' },
  { title: 'Sensores', icon: 'sensor', category: 'ele', description: 'Diagnóstico e substituição de sensores do motor, ABS, temperatura e estacionamento.' },
  { title: 'Painel', icon: 'gauge', category: 'ele', description: 'Reparo de instrumentos, luzes de alerta e iluminação do painel.' },
  { title: 'Ar-condicionado', icon: 'snow', category: 'con', description: 'Manutenção, carga de gás, limpeza e reparo elétrico do sistema de climatização.' },
  // MOCK: confirmar com o cliente se atende freios e qual o escopo.
  { title: 'Freios', icon: 'brake', category: 'con', description: 'Revisão do sistema de freios e componentes elétricos relacionados.' },
  { title: 'Alarmes', icon: 'shield', category: 'con', description: 'Instalação e manutenção de alarmes, travas e sistemas de segurança.' },
  { title: 'Fechaduras', icon: 'lock', category: 'con', description: 'Travas elétricas, fechaduras e conserto de comandos de portas.' },
  { title: 'Janelas elétricas', icon: 'window', category: 'con', description: 'Reparo de máquinas de vidro, motores e módulos de vidro elétrico.' },
  { title: 'Interruptores', icon: 'switch', category: 'con', description: 'Troca e reparo de botões, chaves de seta, comandos e interruptores.' },
  { title: 'Buzinas', icon: 'horn', category: 'con', description: 'Instalação, troca e reparo de buzinas e seus circuitos.' },
  { title: 'Som', icon: 'speaker', category: 'som', description: 'Manutenção de rádios, multimídias, alto-falantes e módulos.' },
  { title: 'Instalação de som automotivo', icon: 'music', category: 'som', description: 'Projetos de som instalados com fiação dedicada e acabamento limpo.' },
  { title: 'Iluminação', icon: 'bulb', category: 'som', description: 'Faróis, lanternas, luzes auxiliares e iluminação interna.' },
  { title: 'Iluminação de carretinha', icon: 'trailer', category: 'som', description: 'Instalação completa do chicote e da sinalização da carretinha.' },
  { title: 'Caminhões', icon: 'truck', category: 'vei', description: 'Elétrica completa para veículos pesados e utilitários.' },
  { title: 'Motocicletas', icon: 'moto', category: 'vei', description: 'Parte elétrica de motos: partida, carga, iluminação e injeção.' },
];
