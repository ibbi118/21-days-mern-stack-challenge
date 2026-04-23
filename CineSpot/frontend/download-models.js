/**
 * download-models.js
 * Run once from the frontend/ directory:
 *   node download-models.js
 *
 * Downloads the face-api.js model files (.json + .bin) from:
 * https://github.com/justadudewhohacks/face-api.js/tree/master/weights
 *
 * Files are saved to: frontend/public/models/
 */

import https from 'https';
import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODELS_DIR = path.join(__dirname, 'public', 'models');

// Raw GitHub base URL — justadudewhohacks/face-api.js weights folder
const BASE =
  'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

/**
 * The actual files present in the GitHub repo weights/ folder.
 * Each model has:
 *   - one *_manifest.json  (tiny descriptor)
 *   - one or more *-shard*.bin  (weight shards)
 */
const FILES = [
  // ── Tiny Face Detector ─────────────────────────────────────────────────
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',            // this is a .bin, no extension in repo

  // ── Face Landmark 68 Tiny ──────────────────────────────────────────────
  'face_landmark_68_tiny_model-weights_manifest.json',
  'face_landmark_68_tiny_model-shard1',

  // ── Face Expression Recognition ────────────────────────────────────────
  'face_expression_recognition_model-weights_manifest.json',
  'face_expression_recognition_model-shard1',
];

// ── Ensure output directory exists ────────────────────────────────────────
if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
  console.log(`📁  Created ${MODELS_DIR}\n`);
}

// ── Download helper with redirect support ─────────────────────────────────
function download(url, dest) {
  return new Promise((resolve, reject) => {
    const attempt = (targetUrl, redirects = 0) => {
      if (redirects > 5) { reject(new Error('Too many redirects')); return; }

      https.get(targetUrl, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          attempt(res.headers.location, redirects + 1);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
        file.on('error',  (err) => { fs.unlink(dest, () => {}); reject(err); });
      }).on('error', reject);
    };
    attempt(url);
  });
}

// ── Main ──────────────────────────────────────────────────────────────────
(async () => {
  console.log('⬇️   Downloading face-api.js model files…\n');
  let downloaded = 0;
  let skipped    = 0;
  let failed     = 0;

  for (const file of FILES) {
    const dest = path.join(MODELS_DIR, file);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      console.log(`  ⏭️   Already exists — skipping: ${file}`);
      skipped++;
      continue;
    }

    const url = `${BASE}/${file}`;
    process.stdout.write(`  ⬇️   ${file} … `);

    try {
      await download(url, dest);
      const kb = Math.round(fs.statSync(dest).size / 1024);
      console.log(`✅  (${kb} KB)`);
      downloaded++;
    } catch (err) {
      console.log(`❌  ${err.message}`);
      failed++;
    }
  }

  console.log('\n' + '─'.repeat(54));
  console.log(`✨  Done — ${downloaded} downloaded, ${skipped} skipped, ${failed} failed`);
  console.log(`📂  Models folder: ${MODELS_DIR}`);

  if (failed > 0) {
    console.log('\n⚠️   Some files failed. Check your internet connection and retry.');
    console.log('    Or download manually from:');
    console.log('    https://github.com/justadudewhohacks/face-api.js/tree/master/weights\n');
  } else {
    console.log('\n🚀  All models ready. Run: npm run dev\n');
  }
})();
