# Análise técnica — protótipo Fornazieri Auto Elétrica

Arquivo analisado: `design/prototipo-claude-design.html` (gerado pelo Claude Design).
Um único HTML de **125 KB e 537 linhas**, com CSS (~250 linhas), JS (~80 linhas) e duas imagens em base64 embutidas.

---

## 1. Resumo executivo

O visual é bom e coerente: os tokens de cor e tipografia estão bem definidos, a hierarquia é clara, o layout responde bem em 3 breakpoints, os CTAs de WhatsApp estão bem posicionados e o "aberto/fechado agora" no fuso de São Paulo é uma ótima ideia.

**Como produto, porém, ainda não está pronto para publicar.** Os problemas mais sérios:

1. **Dados de mentira em produção**: endereço "Rua Exemplo, 000 — Cidade/SP" e um mapa que é só um quadro de placeholder.
2. **O site não diz a cidade em lugar nenhum.** Para uma oficina que vive de busca local ("auto elétrica em ___"), isso mata o SEO.
3. **O conteúdo some sem JavaScript**: tudo que tem a classe `.rv` começa com `opacity:0`, e os 20 serviços e os horários são injetados via JS.
4. **O cabeçalho não tem logo**: a grade `1fr auto 1fr` deixa a 1ª coluna vazia, e no celular aparece só o botão de menu.
5. **Não há prova social**: nenhuma foto real da oficina, nenhuma avaliação do Google, nenhum "desde XXXX".

---

## 2. Problemas encontrados (por gravidade)

### 🔴 Bloqueadores (corrigir antes de publicar)

| # | Problema | Onde | Correção |
|---|----------|------|----------|
| B1 | Endereço fictício "Rua Exemplo, 000" | seção `#contato` | Endereço real e completo, com CEP |
| B2 | Mapa é placeholder | `.map` | Embed do Google Maps (`<iframe loading="lazy">`) ou imagem estática com link para o Maps |
| B3 | Nenhuma menção à cidade/região | `<title>`, `<h1>`, meta description | Ex.: "Auto Elétrica em [Cidade] – SP" no title, no H1 ou subtítulo e no rodapé |
| B4 | Conteúdo invisível sem JS | `.rv{opacity:0}` + listas geradas por JS | Renderizar o HTML no build (SSG) e aplicar a animação só quando o JS carregar (`.js .rv{...}`) |
| B5 | Cabeçalho sem marca/logo | `header.nav` | Incluir o `.brand` na coluna 1 (o CSS dele já existe e não é usado) |

### 🟠 Importantes

**SEO / descoberta**
- Falta **dados estruturados** `LocalBusiness`/`AutoRepair` (JSON-LD) com endereço, telefone, `openingHoursSpecification`, `geo` e `sameAs` (Instagram). Para oficina, isso é o que mais rende no Google.
- Faltam tags **Open Graph/Twitter**. O link compartilhado no WhatsApp vai aparecer sem imagem nem título bonito, e esse é justamente o canal principal do cliente.
- Faltam **favicon**, `apple-touch-icon`, `<link rel="canonical">`, `robots.txt` e `sitemap.xml`.
- Os 20 serviços ficam numa página só, e no rodapé todos apontam para `#servicos`. Páginas individuais para os serviços principais ("injeção eletrônica em [cidade]", "ar-condicionado automotivo em [cidade]") trariam muito mais tráfego orgânico.
- Não há link para o **Perfil da Empresa no Google** (avaliações, rota).

**Duas fontes de verdade**
- O horário está no JS (array `H`) **e** escrito à mão no rodapé. Mudou o horário, alguém vai esquecer de atualizar um dos dois.
- O telefone e a URL do WhatsApp se repetem **8 vezes** no HTML.
- Feriados não são tratados: em um feriado, o site vai mostrar "Aberto agora".

**Performance**
- A mesma imagem do logo está embutida **duas vezes** em base64 (~31 KB cada, idênticas). Ela não vai para o cache e engorda o HTML. O certo é um arquivo `.webp`/`.svg` servido uma vez só.
- Google Fonts é carregado de fora (requisição bloqueante + DNS). O ideal é hospedar as fontes no próprio site, com subset latin e `font-display:swap`.
- Há CSS morto: `.topbar`, `.btn-dark`, `.hide-sm`, `.brand` do header e `.dot.off` dentro do hero (esta funciona, mas está misturada).

**Acessibilidade**
- O botão do menu mobile não tem `aria-expanded` nem `aria-controls`, não fecha com `Esc` e usa `onclick` inline.
- Os chips de filtro não têm `aria-pressed`, e o leitor de tela não sabe qual está ativo.
- Os ícones SVG decorativos não têm `aria-hidden="true"`.
- O vermelho `#e3141e` em texto pequeno (eyebrow 14px) sobre o fundo claro `#f4f4f5` fica perto do limite de contraste AA (~4.3:1). Vale escurecer o vermelho nas seções claras.
- Falta um link "Pular para o conteúdo".
- Os links com `target="_blank"` não avisam que abrem em nova aba.
- Os status "Aberto agora" e "Fechado" mudam via JS sem `aria-live`. É um detalhe menor, porque a mudança acontece só uma vez.

### 🟡 Melhorias de conteúdo / produto

- **Credibilidade**: faltam fotos reais da oficina, da equipe e de serviços prontos (antes e depois do som, por exemplo). Hoje a única imagem é o logo. Para um negócio local, isso pesa mais que qualquer animação.
- **Avaliações**: falta um bloco com nota e depoimentos do Google.
- O **medidor "Sistema OK"** é puramente decorativo e não comunica nada. Pode virar algo útil, como "+X anos de experiência" ou "X carros atendidos".
- O serviço **"Freios"** em "Conforto & Segurança", descrito como "componentes elétricos relacionados", fica vago. Confirmar com o cliente se ele realmente faz freios.
- **Rodapé**: faltam CNPJ/razão social (passa confiança), um link de política de privacidade (LGPD, necessário se houver analytics) e o crédito do desenvolvedor.
- **Medição**: não há como saber quantos clientes clicaram no WhatsApp. Um evento no GA4 ou Plausible por clique em `wa.me` transforma o site em algo que dá para provar valor ao cliente.
- Falta uma seção curta de **FAQ** ("atende a domicílio?", "faz orçamento sem compromisso?"), que também ajuda no SEO (FAQPage).

### ✅ O que está bom e deve ser mantido

- Design tokens em `:root` (cores, raio, fontes), fáceis de migrar para qualquer stack.
- `prefers-reduced-motion` respeitado.
- `IntersectionObserver` para o reveal, sem biblioteca.
- Horário calculado em `America/Sao_Paulo` com `Intl`, então funciona com o visitante em qualquer fuso.
- Mensagens de WhatsApp pré-preenchidas por serviço, ótimas para conversão.
- Botão flutuante de WhatsApp.
- `rel="noopener"` em todos os links externos.
- SVG sprite para o ícone do WhatsApp.

---

## 3. Sugestões de stack

O site é **institucional, estático, de uma oficina**: não tem login, carrinho nem banco de dados. A stack deve ser leve, barata (idealmente custo zero de hospedagem) e fácil de manter.

### ⭐ Recomendada: **Astro + TypeScript + CSS puro (tokens atuais)**

| Camada | Escolha | Por quê |
|--------|---------|---------|
| Framework | **Astro 5** | Gera HTML estático com zero JS por padrão (resolve o B4) e usa JS só nas "ilhas" (filtro, status aberto/fechado) |
| Linguagem | TypeScript | Tipar `services`, `hours` e `contact` evita erro de digitação em dados |
| Estilo | CSS puro com os tokens existentes (ou Tailwind 4, se preferir) | O CSS atual já é bom; dá para dividir em componentes `.astro` com `<style>` escopado |
| Dados | `src/data/business.ts` (telefone, endereço, horários, serviços) | **Uma fonte de verdade**: o rodapé, o JSON-LD, o widget de horário e os links de WhatsApp leem dali |
| Ícones | `astro-icon` + Lucide (os ícones atuais já seguem o estilo Lucide) | Remove os SVGs repetidos inline |
| Imagens | `astro:assets` (`<Image>`) | Converte para WebP/AVIF, gera `srcset` e define width/height automaticamente |
| Fontes | `@fontsource/inter` + `@fontsource/barlow-semi-condensed` | Hospedagem própria, sem chamar o Google |
| SEO | `@astrojs/sitemap` + componente `<SEO>` + JSON-LD `AutoRepair` | Sitemap, OG e dados estruturados |
| Páginas de serviço | Coleção de conteúdo (`src/content/servicos/*.md`) | Uma página por serviço principal para SEO local |
| Analytics | Plausible ou GA4 com evento em cliques `wa.me`/`tel:` | Mostra o ROI para o cliente |
| Qualidade | Prettier, ESLint, Lighthouse CI no GitHub Actions | Meta: 95+ em todas as categorias |
| Deploy | **Cloudflare Pages** ou **Vercel** (grátis) | Deploy automático a cada push no `main`, preview por PR e HTTPS |
| Domínio | `.com.br` no Registro.br (~R$40/ano) | |

**Esforço estimado** para migrar o protótipo: 2 a 4 dias, incluindo as correções acima, sem contar o conteúdo (fotos, endereço e textos) que depende do cliente.

### Alternativas

| Opção | Quando faz sentido | Contras |
|-------|--------------------|---------|
| **HTML/CSS/JS + Vite** | Você quer o mínimo de ferramenta e mudar pouco o protótipo | Sem componentes nem SSG; a duplicação de dados continua, a menos que você crie um script |
| **Next.js (App Router, export estático)** | Você já domina React ou planeja agendamento online/área do cliente no futuro | Mais pesado do que o site precisa; envia React para o navegador |
| **Astro + CMS headless** (Keystatic, Decap ou Sanity) | **O próprio cliente** vai querer editar serviços, fotos e horários | Mais configuração; Sanity tem limite no plano grátis |
| **WordPress** | O cliente exige um painel conhecido | Hospedagem paga, manutenção de plugins e segurança, desempenho pior. Não recomendo para esse escopo |

### Sobre o nome do repositório (`-front-end`)

O nome sugere um back-end separado, mas **este site não precisa de back-end**: contato é via WhatsApp e o horário é calculado no navegador. Se um dia surgir um formulário de orçamento, uma função serverless (Cloudflare/Vercel Functions) resolve sem servidor dedicado.

---

## 4. Checklist do que pedir ao cliente

- [ ] Endereço completo + CEP + link do Google Maps
- [ ] Cidade/região de atendimento (atende a domicílio? socorro?)
- [ ] CNPJ e razão social
- [ ] Logo em alta resolução (SVG ou PNG ≥ 1000px)
- [ ] 6 a 12 fotos reais (fachada, oficina, equipe, serviços prontos)
- [ ] Ano de fundação e diferenciais
- [ ] Confirmação da lista de 20 serviços (especialmente "Freios")
- [ ] Horários especiais e feriados
- [ ] Acesso ao Perfil da Empresa no Google (para link e avaliações)
- [ ] Domínio desejado

## 5. Próximos passos sugeridos

1. Criar o projeto Astro e portar o protótipo em componentes (`Header`, `Hero`, `Services`, `HowItWorks`, `Sound`, `Contact`, `Footer`).
2. Centralizar os dados em `business.ts` e gerar o JSON-LD, o rodapé e os links a partir dele.
3. Corrigir os bloqueadores B1–B5 e os itens de acessibilidade.
4. Configurar o deploy (Cloudflare Pages) e o domínio.
5. Rodar o Lighthouse e ajustar até 95+.
