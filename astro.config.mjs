import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [preact({ compat: true })],
  vite: {
    plugins: [tailwindcss()]
  }
});
