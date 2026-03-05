#!/usr/bin/env node
/**
 * render.mjs — Remotion presentation video renderer
 *
 * Usage:
 *   node render.mjs [--out output.mp4] [--fps 30] [--codec h264]
 */

import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const argv = process.argv.slice(2);
const get = (flag, def) => { const i = argv.indexOf(flag); return i !== -1 ? argv[i + 1] : def; };

const outFile = get('--out', resolve(__dirname, '..', 'presentations', 'openclaw-agentic-presentation.mp4'));
const fps = parseInt(get('--fps', '30'));
const codec = get('--codec', 'h264');

async function main() {
  console.log('\n🎬 Remotion Presentation Renderer');
  console.log(`   Output: ${outFile}`);
  console.log(`   FPS:    ${fps}`);
  console.log(`   Codec:  ${codec}\n`);

  console.log('📦 Bundling...');
  const serveUrl = await bundle({
    entryPoint: resolve(__dirname, 'src/Root.jsx'),
    webpackOverride: (c) => c,
  });

  console.log('🎯 Selecting composition...');
  const composition = await selectComposition({
    serveUrl,
    id: 'Presentation',
  });

  const totalFrames = composition.durationInFrames;
  const durationSec = totalFrames / fps;
  console.log(`🎬 Rendering ${totalFrames} frames (${durationSec.toFixed(0)}s @ ${fps}fps)...`);

  let lastPct = -1;
  await renderMedia({
    composition,
    serveUrl,
    codec,
    outputLocation: outFile,
    onProgress: ({ progress }) => {
      const pct = Math.round(progress * 100);
      if (pct !== lastPct) { process.stdout.write(`\r   ${pct}%`); lastPct = pct; }
    },
  });

  console.log(`\n\n✅ ${outFile}\n`);
}

main().catch(e => {
  console.error('\n❌', e.message || e);
  process.exit(1);
});
