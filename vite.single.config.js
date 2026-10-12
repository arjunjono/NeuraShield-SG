/* Builds everything into one self-contained HTML file you can double-click:
   npm run build:single  ->  dist-single/index.html */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  publicDir: false, // the OCR files cannot be used from a file:// page anyway
  build: { outDir: 'dist-single', emptyOutDir: true, assetsInlineLimit: 100000000, cssCodeSplit: false },
})
