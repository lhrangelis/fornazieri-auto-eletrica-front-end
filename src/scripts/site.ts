import { getStatus } from '../lib/hours';

/* Status "aberto agora" ------------------------------------------------ */
function renderStatus() {
  const s = getStatus();

  document.querySelectorAll<HTMLElement>('[data-open-status]').forEach((el) => {
    el.classList.toggle('is-open', s.open);
    el.classList.toggle('is-closed', !s.open);
    const text = el.querySelector('[data-text]');
    if (text) text.textContent = s.message;
  });

  document.querySelectorAll<HTMLElement>('[data-open-pill]').forEach((el) => {
    el.hidden = false;
    el.textContent = s.open ? 'Aberto agora' : s.holiday ? `Fechado · ${s.holiday}` : 'Fechado agora';
    el.classList.toggle('off', !s.open);
  });

  document.querySelectorAll<HTMLElement>('[data-today-label]').forEach((el) => (el.textContent = s.todayLabel));

  document.querySelectorAll<HTMLElement>('[data-day]').forEach((el) => {
    el.classList.toggle('today', Number(el.dataset.day) === s.today);
  });
}
renderStatus();
// Atualiza a cada minuto para quem deixa a aba aberta.
setInterval(renderStatus, 60_000);

/* Reveal ao rolar ------------------------------------------------------ */
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    }),
  { threshold: 0.12 },
);
document.querySelectorAll('.rv').forEach((el) => io.observe(el));

/* Métricas de conversão -------------------------------------------------
 * Cliques em WhatsApp/telefone/Instagram/mapa viram eventos.
 * Funciona com Plausible (window.plausible) ou GA4 (window.gtag) se algum estiver instalado.
 */
declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Record<string, string> }) => void;
    gtag?: (...args: unknown[]) => void;
  }
}
document.addEventListener('click', (e) => {
  const el = (e.target as HTMLElement).closest<HTMLElement>('[data-track]');
  if (!el) return;
  const channel = el.dataset.track!;
  const section = el.closest('section, header, footer')?.id || el.closest('header, footer')?.tagName.toLowerCase() || 'page';
  window.plausible?.('Contato', { props: { channel, section } });
  window.gtag?.('event', 'contact_click', { channel, section });
});
