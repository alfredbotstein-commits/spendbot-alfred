/**
 * SpendBot Play Store Screenshot Generator v8
 * Reloads /test per screen, patches test data in DOM, proper compositing.
 */
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.env.HOME, 'clawd/spendbot/screenshots');
mkdirSync(OUTPUT_DIR, { recursive: true });

const VIEWPORT = { width: 393, height: 852, deviceScaleFactor: 3 };
const OUT_W = 1080;
const OUT_H = 1920;
const wait = (page, ms) => page.evaluate(ms => new Promise(r => setTimeout(r, ms)), ms);

// Reordered for maximum impact
const SCREENSHOTS = [
  { id: 1, screen: 'dashboard', caption: 'Know Where Every\nDollar Goes', gradient: ['#667eea', '#764ba2'] },
  { id: 2, screen: 'dashboard', caption: 'Smart Budget\nTracking', gradient: ['#f093fb', '#f5576c'], scroll: 350 },
  { id: 3, screen: 'dashboard', caption: 'Add Expenses\nIn 3 Seconds', gradient: ['#4facfe', '#00f2fe'], clickAdd: true, fillAmount: true },
  { id: 4, screen: 'history', caption: 'Your Complete\nSpending History', gradient: ['#43e97b', '#38f9d7'] },
  { id: 5, screen: 'paywall', caption: '$4.99 Once\nYours Forever', gradient: ['#2563eb', '#7c3aed'] },
  { id: 6, screen: 'settings', caption: 'Your Budget\nYour Rules', gradient: ['#a18cd1', '#fbc2eb'], fixSettings: true },
  { id: 7, screen: 'dashboard', caption: 'Stay On Budget\nEvery Month', gradient: ['#fa709a', '#fee140'] },
  { id: 8, screen: 'dashboard', caption: 'Everything You Need\nNothing You Don\'t', gradient: ['#0c0c1d', '#1a1a3e'], darkCaption: true },
];

async function loadScreen(page, screenName) {
  await page.goto('https://spendbot.app/test', { waitUntil: 'networkidle2', timeout: 30000 });
  await wait(page, 2500);
  
  if (screenName !== 'dashboard') {
    await page.evaluate((name) => {
      const btns = [...document.querySelectorAll('button')];
      const btn = btns.find(b => b.textContent?.trim().toLowerCase() === name.toLowerCase());
      if (btn) btn.click();
    }, screenName);
    await wait(page, 1500);
  }
  
  // Hide dev nav
  await page.evaluate(() => {
    const nav = document.querySelector('.fixed.top-0');
    if (nav) nav.style.display = 'none';
  });
  await wait(page, 300);
}

async function fixSettingsScreen(page) {
  // Replace "Test User" and "test@example.com" with realistic data
  await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.textContent === 'Test User') node.textContent = 'Sarah M.';
      if (node.textContent === 'test@example.com') node.textContent = 'sarah@gmail.com';
    }
  });
}

async function fillAddExpense(page) {
  // Type an amount and select a category to make it look used
  await page.evaluate(() => {
    // Find the amount display and update it
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.textContent?.trim() === '$0.00' || node.textContent?.trim() === '0.00') {
        node.textContent = '14.50';
      }
      if (node.textContent?.trim() === '$') {
        // Keep the dollar sign
      }
    }
    // Try to highlight a category (coffee)
    const btns = [...document.querySelectorAll('button')];
    const coffeeBtn = btns.find(b => b.textContent?.includes('☕'));
    if (coffeeBtn) {
      coffeeBtn.style.border = '2px solid #22c55e';
      coffeeBtn.style.background = 'rgba(34, 197, 94, 0.2)';
    }
  });
}

async function compositeScreenshot(screenBuffer, config) {
  const { caption, gradient, darkCaption } = config;
  const [color1, color2] = gradient;
  
  const phoneScreenW = 590;
  const phoneScreenH = 1280;
  const frameW = phoneScreenW + 18;
  const frameH = phoneScreenH + 18;
  const captionH = 340;
  const phoneY = captionH + 35;
  const phoneX = Math.round((OUT_W - frameW) / 2);
  const textColor = darkCaption ? '#e2e8f0' : '#ffffff';
  const lines = caption.split('\n');
  const lineH = 66;
  const startY = captionH / 2 - (lines.length * lineH) / 2 + 16;

  const bgSvg = `<svg width="${OUT_W}" height="${OUT_H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stop-color="${color1}"/>
        <stop offset="100%" stop-color="${color2}"/>
      </linearGradient>
    </defs>
    <rect width="${OUT_W}" height="${OUT_H}" fill="url(#bg)"/>
    <style>.c{font-family:'Inter','Helvetica Neue','SF Pro Display',sans-serif;font-weight:800;font-size:56px;fill:${textColor};text-anchor:middle;letter-spacing:-1.5px;}</style>
    ${lines.map((l,i) => `<text x="${OUT_W/2}" y="${startY + i*lineH}" class="c">${escapeXml(l)}</text>`).join('')}
  </svg>`;

  const frameSvg = `<svg width="${frameW+60}" height="${frameH+60}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="fs" x="-10%" y="-5%" width="120%" height="115%">
        <feDropShadow dx="0" dy="10" stdDeviation="18" flood-opacity="0.3"/>
      </filter>
      <linearGradient id="bz" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#2a2a2a"/>
        <stop offset="50%" stop-color="#1a1a1a"/>
        <stop offset="100%" stop-color="#222"/>
      </linearGradient>
    </defs>
    <rect x="30" y="30" width="${frameW}" height="${frameH}" rx="36" fill="url(#bz)" filter="url(#fs)"/>
    <rect x="30" y="200" width="2" height="60" rx="1" fill="#444"/>
    <rect x="30" y="280" width="2" height="40" rx="1" fill="#444"/>
    <rect x="${30+frameW-2}" y="240" width="2" height="80" rx="1" fill="#444"/>
    <rect x="39" y="39" width="${phoneScreenW}" height="${phoneScreenH}" rx="28" fill="black"/>
    <rect x="${30+frameW/2-52}" y="34" width="104" height="28" rx="14" fill="#0d0d0d"/>
  </svg>`;

  // Android-style status bar
  const statusSvg = `<svg width="${phoneScreenW}" height="40" xmlns="http://www.w3.org/2000/svg">
    <rect width="${phoneScreenW}" height="40" fill="#0A0A0F"/>
    <style>.st{font-family:'Roboto','Inter',sans-serif;font-size:13px;fill:#ccc;font-weight:400;}</style>
    <text x="16" y="27" class="st">12:30</text>
    <!-- WiFi icon -->
    <text x="${phoneScreenW-16}" y="27" class="st" text-anchor="end">■ 🔋</text>
  </svg>`;

  const resizedScreen = await sharp(screenBuffer)
    .resize(phoneScreenW, phoneScreenH - 40, { fit: 'cover', position: 'top' })
    .png().toBuffer();
  const statusBar = await sharp(Buffer.from(statusSvg)).png().toBuffer();
  
  const fullScreen = await sharp({
    create: { width: phoneScreenW, height: phoneScreenH, channels: 4, background: { r: 10, g: 10, b: 15, alpha: 1 } }
  }).composite([
    { input: statusBar, top: 0, left: 0 },
    { input: resizedScreen, top: 40, left: 0 },
  ]).png().toBuffer();

  const frameBuffer = await sharp(Buffer.from(frameSvg)).png().toBuffer();

  return sharp(Buffer.from(bgSvg))
    .composite([
      { input: frameBuffer, top: phoneY - 30, left: phoneX - 30 },
      { input: fullScreen, top: phoneY + 9, left: phoneX + 9 },
    ]).png().toBuffer();
}

function escapeXml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
}

async function main() {
  console.log('🚀 SpendBot screenshot gen v8');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  
  for (const config of SCREENSHOTS) {
    console.log(`📸 ${config.id}: ${config.screen} → "${config.caption.split('\n')[0]}"`);
    await loadScreen(page, config.screen);
    
    if (config.clickAdd) {
      await page.evaluate(() => {
        const btns = [...document.querySelectorAll('button')];
        const btn = btns.find(b => b.textContent?.includes('+ Add Expense'));
        if (btn) btn.click();
      });
      await wait(page, 1500);
      await page.evaluate(() => {
        const nav = document.querySelector('.fixed.top-0');
        if (nav) nav.style.display = 'none';
      });
    }
    
    if (config.fillAmount) await fillAddExpense(page);
    if (config.fixSettings) await fixSettingsScreen(page);
    if (config.scroll) {
      await page.evaluate(px => window.scrollBy(0, px), config.scroll);
      await wait(page, 500);
    }
    
    await wait(page, 500);
    const buf = await page.screenshot({ type: 'png' });
    const final = await compositeScreenshot(buf, config);
    writeFileSync(join(OUTPUT_DIR, `screenshot-${config.id}.png`), final);
    console.log(`  ✅ (${Math.round(final.length/1024)}KB)`);
  }
  
  await browser.close();
  console.log('\n🎉 Done!', OUTPUT_DIR);
}

main().catch(e => { console.error('❌', e); process.exit(1); });
