/* ---------------------------------------------------------------------------
   Copies the OCR engine and English language data into public/tesseract/,
   so screenshot reading works with no internet connection when the app is
   served by `npm run dev` or `npm run preview`. Runs after `npm install`.
--------------------------------------------------------------------------- */
import { copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const out = new URL('../public/tesseract/', import.meta.url).pathname
mkdirSync(out, { recursive: true })

const pkgDir = (name) => dirname(require.resolve(`${name}/package.json`))
const files = [
  [join(pkgDir('tesseract.js'), 'dist', 'worker.min.js'), 'worker.min.js'],
  [join(pkgDir('tesseract.js-core'), 'tesseract-core-lstm.wasm.js'), 'tesseract-core-lstm.wasm.js'],
  [join(pkgDir('tesseract.js-core'), 'tesseract-core-simd-lstm.wasm.js'), 'tesseract-core-simd-lstm.wasm.js'],
  [join(pkgDir('@tesseract.js-data/eng'), '4.0.0_best_int', 'eng.traineddata.gz'), 'eng.traineddata.gz'],
]
for (const [from, name] of files) {
  if (!existsSync(from)) {
    console.warn(`[ocr assets] missing ${from}; screenshot reading will fall back to the internet`)
    continue
  }
  copyFileSync(from, join(out, name))
}
console.log('[ocr assets] copied to public/tesseract/')
