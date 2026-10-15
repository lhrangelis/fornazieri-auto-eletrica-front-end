# Fornazieri Auto Elétrica — site

Site institucional da Fornazieri Auto Elétrica e Som Automotivo, feito em [Astro](https://astro.build) e gerado como HTML estático.

## Rodando

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # type-check + build em dist/
npm run preview  # serve o dist/
```

Requer Node 20+.

## Estrutura

```
src/
  data/business.ts   ← fonte única: telefone, endereço, horários, feriados extras, serviços
  data/icons.ts      ← ícones SVG (estilo Lucide)
  lib/hours.ts       ← horário, feriados nacionais e status "aberto agora"
  scripts/site.ts    ← JS do cliente: status em tempo real, reveal, métricas de clique
  components/        ← seções da página (Header, Hero, Services, Contact…)
  layouts/Layout.astro ← <head>, SEO, Open Graph, JSON-LD
  styles/global.css  ← design tokens e estilos compartilhados
design/              ← protótipo original gerado pelo Claude Design (referência)
docs/                ← análise técnica
```

Para alterar telefone, horário ou serviços, edite **apenas** `src/data/business.ts`.

## Antes de publicar

Os campos marcados com `MOCK` em `src/data/business.ts` são fictícios:

- [x] endereço, CEP e cidade
- [x] coordenadas (`geo`) e link do Perfil da Empresa no Google
- [ ] CNPJ, razão social e ano de fundação
- [ ] confirmar o serviço "Freios"
- [ ] domínio definitivo em `astro.config.mjs` e `public/robots.txt`
- [ ] feriados municipais em `extraClosedDates`
- [ ] analytics (Plausible ou GA4); os cliques já disparam eventos via `data-track`
