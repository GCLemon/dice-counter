import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx, defineManifest } from '@crxjs/vite-plugin';
import path from 'path';

// Chrome 拡張のマニフェスト
const manifest = defineManifest({
  manifest_version: 3,
  name: 'Dice Counter',
  version: '1.0.0',
  action: { default_popup: 'index.html' },
  content_scripts: [{
    matches: ['https://ccfolia.com/rooms/*'],
    run_at: 'document_start',
    js: ['./src/content/index.tsx']
  }]
});

// Vite Config
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
