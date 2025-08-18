import path from 'node:path';
import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
// @ts-check
import { defineConfig, envField } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  adapter: node({
    mode: 'standalone',
  }),
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
        '~': path.resolve('./'),
      },
    },
  },
  integrations: [react()],
  env: {
    schema: {
      BASE_URL: envField.string({ context: 'server', access: 'secret', default: 'http://localhost:4321', url: true }),
      NOMADLIST_USERNAME: envField.string({ context: 'server', access: 'secret', default: 'jorgechato' }),
      NOMADLIST_KEY: envField.string({ context: 'server', access: 'secret', default: '' }),
      GITHUB_OWNER: envField.string({ context: 'server', access: 'secret', default: 'jorgechato' }),
      GITHUB_GIST: envField.string({ context: 'server', access: 'secret', default: '' }),
    },
  },
});
