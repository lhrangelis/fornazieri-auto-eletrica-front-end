// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Endereço atual no Cloudflare. Trocar pelo domínio .com.br quando estiver ativo.
export default defineConfig({
  site: 'https://fornazieriautoeletrica.lh-rissilb2.workers.dev',
  integrations: [sitemap()],
});
