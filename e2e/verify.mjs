// End-to-end verification: drives the real first-run journey in a browser
// against `expo start --web` and asserts the product's promises, not just
// that screens render. Run:
//
//   npx expo start --web --port 8091     # terminal 1
//   npm run e2e                            # terminal 2
//
// PORT overrides the port; PW_CHROMIUM points at a chromium binary when
// playwright's own download isn't available.

import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = `http://localhost:${process.env.PORT ?? '8091'}`;
const OUT = new URL('./shots/', import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || undefined,
  args: [
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
    '--autoplay-policy=no-user-gesture-required',
  ],
});
const context = await browser.newContext({
  viewport: { width: 420, height: 860 },
  permissions: ['microphone'],
});
const page = await context.newPage();
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));

const shot = (name) => page.screenshot({ path: `${OUT}/${name}.png` });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 1. Home
await page.goto(BASE, { waitUntil: 'networkidle', timeout: 120000 });
await page.waitForSelector('text=Tonight', { timeout: 120000 });
await shot('1-home');

// 2. Plant a seed
await page.click('text=Plant a problem');
await page.waitForSelector('text=What are you turning over tonight?', { timeout: 30000 });
await page.fill('[placeholder="Act 2 feels flat"]', 'Act 2 feels flat');
await page.fill(
  '[placeholder="The midpoint has no reversal; the reader has no reason to keep going."]',
  'The midpoint has no reversal. The reader has no reason to keep going.'
);
await shot('2-seed-entry');
await page.click('text=Prime & sleep');

// 3. Priming ritual — step through via the dim continue control
await page.waitForSelector('text=Read it once more.', { timeout: 30000 });
await shot('3-ritual-step1');
await page.click('text=continue');
await page.waitForSelector('text=Hold the problem.', { timeout: 15000 });
await page.click('text=continue');
await page.waitForSelector('text=Let it go. Sleep on it.', { timeout: 15000 });
await shot('4-ritual-step3');
await page.click('text=continue');

// 4. Capture surface — record two fragments
await page.waitForSelector('text=Tap anywhere. Speak.', { timeout: 30000 });
await shot('5-capture-rest');
await sleep(1200); // let permission+prepare settle
for (let i = 0; i < 2; i++) {
  await page.mouse.click(210, 400);
  await page.waitForSelector('text=Speaking. Tap to stop.', { timeout: 15000 });
  if (i === 0) await shot('6-capture-recording');
  await sleep(2500); // fake mic feeds a tone
  await page.mouse.click(210, 400);
  await page.waitForSelector('text=Tap anywhere. Speak.', { timeout: 15000 });
  await sleep(600); // > debounce before next tap
}

// Stack navigation keeps prior screens mounted — always target the last match.
const seen = (sel) => page.locator(sel).last();

// 5. Leave to home — fragments counted
await page.click('text=leave');
await seen('text=2 fragments caught.').waitFor({ timeout: 30000 });
await shot('7-home-caught');

// 6. Digest — offline fallback, keep one fragment
await seen("text=Here's what you caught").click();
await sleep(3000);
console.log('after digest click URL:', page.url());
await shot('probe-after-digest-click');
await seen('text=The problem you planted').waitFor({ timeout: 30000 });
await seen('text=No transcript yet. The audio is safe.').waitFor({ timeout: 30000 });
await seen('text=/Play · 0:0[1-9]/').waitFor({ timeout: 15000 }); // duration must not be 0:00
await page.locator('text="Keep"').last().click();
await shot('8-digest');

// 7. Archive + search + seed detail
await seen('text=Done').click();
await seen('text=Tonight').waitFor({ timeout: 30000 });
await seen('text=Archive').click();
await seen('text=1 kept').waitFor({ timeout: 30000 });
await shot('9-archive');
await page.fill('[placeholder="Search seeds and kept fragments"]', 'reversal');
await seen('text=Act 2 feels flat').waitFor({ timeout: 15000 });
await page.fill('[placeholder="Search seeds and kept fragments"]', 'zzz-no-match');
await seen('text=Nothing matches that search.').waitFor({ timeout: 15000 });
await page.fill('[placeholder="Search seeds and kept fragments"]', '');
await seen('text=Act 2 feels flat').click();
await seen('text=Harvest — what you kept').waitFor({ timeout: 30000 });
await shot('10-seed-detail');

// 8. Persistence across reload (metadata; blob audio is a web limitation)
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForSelector('text=2 fragments caught.', { timeout: 30000 });
await shot('11-home-after-reload');

console.log('FLOW OK');
await browser.close();
