import puppeteer from 'puppeteer';
import { mkdir, writeFile, readFile } from 'fs/promises';
import { statSync } from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const OUTPUT = '/Users/albert/clawd/spendbot/store-assets/screenshots';
const RAW_DIR = '/Users/albert/clawd/spendbot/store-assets/screenshots/raw';
await mkdir(OUTPUT, { recursive: true });
await mkdir(RAW_DIR, { recursive: true });

// ── Auth & Seed ──
const supabase = createClient(
  'https://euyrskubpiexkdqrtcxh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1eXJza3VicGlleGtkcXJ0Y3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5ODE3NDUsImV4cCI6MjA4NTU1Nzc0NX0.E7eApgqUpiOPbSWENmWkPDQnZEAebzOeRgj2mnGlY2g'
);

const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
  email: 'screenshots@spendbot.test', password: 'Screenshot2026!'
});
if (!authData?.session) { console.error('Auth failed:', authErr); process.exit(1); }
const userId = authData.user.id;
console.log('✅ Auth OK, user:', userId);

// Seed realistic expenses
await supabase.from('expenses').delete().eq('user_id', userId);
const expenses = [
  { amount: 6742, category_id: 'groceries', note: 'Whole Foods', date: '2026-02-20T18:00:00Z' },
  { amount: 4850, category_id: 'transport', note: 'Shell Gas', date: '2026-02-20T12:00:00Z' },
  { amount: 3218, category_id: 'food', note: 'DoorDash dinner', date: '2026-02-19T19:00:00Z' },
  { amount: 12400, category_id: 'bills', note: 'Electric bill', date: '2026-02-19T10:00:00Z' },
  { amount: 1599, category_id: 'subscriptions', note: 'Netflix', date: '2026-02-18T08:00:00Z' },
  { amount: 2499, category_id: 'health', note: 'Planet Fitness', date: '2026-02-18T06:00:00Z' },
  { amount: 675, category_id: 'food', note: 'Starbucks latte', date: '2026-02-17T07:30:00Z' },
  { amount: 1099, category_id: 'subscriptions', note: 'Spotify', date: '2026-02-17T00:00:00Z' },
  { amount: 4327, category_id: 'shopping', note: 'Amazon order', date: '2026-02-16T14:00:00Z' },
  { amount: 1850, category_id: 'health', note: 'CVS Pharmacy', date: '2026-02-16T11:00:00Z' },
  { amount: 6750, category_id: 'entertainment', note: 'Concert tickets', date: '2026-02-15T20:00:00Z' },
  { amount: 3500, category_id: 'transport', note: 'Uber to airport', date: '2026-02-14T06:00:00Z' },
  { amount: 15000, category_id: 'travel', note: 'Hotel booking', date: '2026-02-13T16:00:00Z' },
  { amount: 8599, category_id: 'groceries', note: 'Costco run', date: '2026-02-12T11:00:00Z' },
  { amount: 2999, category_id: 'entertainment', note: 'Movie night', date: '2026-02-11T21:00:00Z' },
  { amount: 5500, category_id: 'shopping', note: 'Running shoes', date: '2026-02-10T13:00:00Z' },
  { amount: 4250, category_id: 'food', note: 'Chipotle lunch', date: '2026-02-09T12:30:00Z' },
  { amount: 3200, category_id: 'food', note: 'Thai dinner', date: '2026-02-08T19:00:00Z' },
  { amount: 7500, category_id: 'groceries', note: 'Trader Joe\'s', date: '2026-02-07T10:00:00Z' },
  { amount: 1800, category_id: 'food', note: 'Lunch sandwich', date: '2026-02-06T12:00:00Z' },
];
const { error: insertErr } = await supabase.from('expenses').insert(
  expenses.map(e => ({ user_id: userId, ...e }))
);
if (insertErr) { console.error('Seed error:', insertErr); process.exit(1); }
console.log(`✅ Seeded ${expenses.length} expenses`);

// Set premium + onboarding done + budget
await supabase.from('user_settings').update({
  monthly_budget: 400000, is_premium: true, onboarding_complete: true
}).eq('user_id', userId);

// ── Phase 1: Capture raw screenshots from real app ──
console.log('\n📸 Phase 1: Capturing real app screens...');
const PHONE_W = 390;
const PHONE_H = 844;
const SCALE = 2;

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  protocolTimeout: 60000
});

const page = await browser.newPage();
await page.setViewport({ width: PHONE_W, height: PHONE_H, deviceScaleFactor: SCALE });

// Inject auth session
await page.goto('https://spendbot.app', { waitUntil: 'domcontentloaded', timeout: 20000 });
await page.evaluate((sess) => {
  localStorage.setItem('sb-euyrskubpiexkdqrtcxh-auth-token', JSON.stringify(sess));
}, authData.session);
await page.goto('https://spendbot.app', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 5000));

// Skip any onboarding
for (let i = 0; i < 8; i++) {
  const clicked = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(x =>
      ['Continue', 'Skip', "Let's Go", 'Get Started'].some(t => x.innerText.includes(t))
    );
    if (b) { b.click(); return true; }
    return false;
  });
  if (!clicked) break;
  await new Promise(r => setTimeout(r, 1200));
}
await new Promise(r => setTimeout(r, 3000));

// Aggressively hide install banners, PWA prompts, and any overlays
async function hideOverlays() {
  await page.evaluate(() => {
    const hide = (el) => { el.style.cssText = 'display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important;'; };
    // By class
    document.querySelectorAll('[class*="install"], [class*="Install"], [class*="banner"], [class*="Banner"], [class*="pwa"], [class*="PWA"], [class*="prompt"], [class*="Prompt"]').forEach(hide);
    // By text content
    document.querySelectorAll('div, section, aside, footer, header').forEach(el => {
      const t = el.innerText || '';
      if ((t.includes('Add to Home Screen') || t.includes('Install') || t.includes('home screen')) && el.offsetHeight < 250) hide(el);
    });
    // Hide any fixed/sticky bottom elements that look like banners
    document.querySelectorAll('*').forEach(el => {
      const s = getComputedStyle(el);
      if ((s.position === 'fixed' || s.position === 'sticky') && el.offsetHeight < 120 && el.offsetHeight > 30) {
        const t = el.innerText || '';
        if (t.includes('Install') || t.includes('Home Screen') || t.includes('Add to')) hide(el);
      }
    });
    // Dismiss any close/dismiss buttons on banners
    document.querySelectorAll('button').forEach(b => {
      const t = b.innerText?.trim();
      if (t === '✕' || t === '×' || t === 'Dismiss' || t === 'Close' || t === 'Not now') {
        const parent = b.closest('[class*="install"], [class*="banner"], [class*="prompt"]');
        if (parent) b.click();
      }
    });
  });
}
await hideOverlays();

async function rawShot(name) {
  await hideOverlays();
  await new Promise(r => setTimeout(r, 1500));
  const p = path.join(RAW_DIR, name);
  await page.screenshot({ path: p, type: 'png' });
  console.log(`  📷 ${name} (${(statSync(p).size/1024).toFixed(0)}KB)`);
  return p;
}

async function clickAria(label) {
  const found = await page.evaluate((l) => {
    const el = document.querySelector(`[aria-label="${l}"]`);
    if (el) { el.click(); return true; } return false;
  }, label);
  if (found) await new Promise(r => setTimeout(r, 2000));
  return found;
}

async function clickText(text) {
  const found = await page.evaluate((t) => {
    const b = [...document.querySelectorAll('button, a, [role="button"]')].find(x => x.innerText?.includes(t));
    if (b) { b.click(); return true; } return false;
  }, text);
  if (found) await new Promise(r => setTimeout(r, 2000));
  return found;
}

async function goBack() {
  await clickText('← Back') || await clickText('←') || await clickAria('Go back');
  await new Promise(r => setTimeout(r, 1500));
}

// Log what we see
let bodyText = await page.evaluate(() => document.body.innerText.substring(0, 300));
console.log('  Current screen:', bodyText.substring(0, 100));

// Capture screens
const rawScreens = {};

// 1: Dashboard
rawScreens.dashboard = await rawShot('dashboard.png');

// 2: Try to open add expense and fill in data
if (await clickAria('Add new expense') || await clickText('+')) {
  await new Promise(r => setTimeout(r, 1500));
  // Type an amount via keyboard to populate it
  await page.evaluate(() => {
    // Find any input or contenteditable element for amount
    const inputs = document.querySelectorAll('input[type="number"], input[inputmode="decimal"], input[inputmode="numeric"], input[placeholder*="0"], input');
    for (const input of inputs) {
      if (input.offsetHeight > 0 && input.offsetWidth > 0) {
        input.focus();
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
        if (nativeInputValueSetter) {
          nativeInputValueSetter.call(input, '42.50');
        } else {
          input.value = '42.50';
        }
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        break;
      }
    }
  });
  // Try keyboard approach too
  await page.keyboard.type('4250');
  await new Promise(r => setTimeout(r, 500));
  // Also try clicking a category
  await page.evaluate(() => {
    const cats = [...document.querySelectorAll('button, [role="button"], div[class*="category"], span')].filter(b => {
      const t = b.innerText?.trim();
      return t?.includes('Dining') || t?.includes('Food') || t === '🍕' || t?.includes('🍽');
    });
    if (cats[0]) cats[0].click();
  });
  await new Promise(r => setTimeout(r, 1000));
  rawScreens.addExpense = await rawShot('add-expense.png');
  await clickAria('Cancel and close') || await clickText('Cancel') || await clickText('✕') || await clickText('Close');
  await new Promise(r => setTimeout(r, 1500));
} else {
  console.log('  ⚠️ Add expense button not found');
}

// 3: History / See All
if (await clickText('See All') || await clickText('View All')) {
  rawScreens.history = await rawShot('history.png');
  await goBack();
} else {
  // Scroll to find it
  await page.evaluate(() => window.scrollBy(0, 400));
  await new Promise(r => setTimeout(r, 1000));
  if (await clickText('See All') || await clickText('View All')) {
    rawScreens.history = await rawShot('history.png');
    await goBack();
  }
}

// 4: Calendar
if (await clickAria('Open calendar view')) {
  rawScreens.calendar = await rawShot('calendar.png');
  await goBack();
}

// 5: Settings
if (await clickAria('Open settings')) {
  rawScreens.settings = await rawShot('settings.png');
  await goBack();
}

// 6: Scroll dashboard for insights
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 500));
await page.evaluate(() => window.scrollBy(0, 500));
await new Promise(r => setTimeout(r, 1000));
rawScreens.insights = await rawShot('insights.png');

// 7: Onboarding screen
await supabase.from('user_settings').update({ onboarding_complete: false }).eq('user_id', userId);
await page.goto('https://spendbot.app', { waitUntil: 'networkidle2', timeout: 20000 });
await new Promise(r => setTimeout(r, 3000));
rawScreens.onboarding = await rawShot('onboarding.png');
await supabase.from('user_settings').update({ onboarding_complete: true }).eq('user_id', userId);

// 8: Landing (logged out)
await page.evaluate(() => localStorage.clear());
await page.goto('https://spendbot.app', { waitUntil: 'networkidle2', timeout: 20000 });
await new Promise(r => setTimeout(r, 4000));
rawScreens.landing = await rawShot('landing.png');

console.log(`\n✅ Captured ${Object.keys(rawScreens).length} raw screens`);

// ── Phase 2: Composite into premium Play Store screenshots ──
console.log('\n🎨 Phase 2: Compositing premium screenshots...');

const screenshots = [
  { id: 1, rawKey: 'dashboard', caption: 'Track Every Dollar\nEffortlessly', gradient: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)' },
  { id: 2, rawKey: 'addExpense', fallback: 'add-expense', caption: 'Add Expenses\nin 3 Seconds', gradient: 'linear-gradient(145deg, #1b2838 0%, #172a3a 50%, #1a3a4a 100%)' },
  { id: 3, rawKey: 'history', fallback: 'history', caption: 'See Where Your\nMoney Goes', gradient: 'linear-gradient(145deg, #0f3460 0%, #1a1a4e 50%, #2d1b69 100%)' },
  { id: 4, rawKey: 'insights', fallback: 'insights', caption: 'Spot Spending\nTrends Early', gradient: 'linear-gradient(145deg, #1a0a2e 0%, #2d1b69 50%, #1a1a4e 100%)' },
  { id: 5, rawKey: 'calendar', fallback: 'calendar', caption: 'Stay Under\nBudget', gradient: 'linear-gradient(145deg, #0a1628 0%, #0f3460 50%, #0a2647 100%)' },
  { id: 6, rawKey: 'settings', fallback: 'settings', caption: 'Your Data Stays\nOn Your Device', gradient: 'linear-gradient(145deg, #1a1a2e 0%, #0d1b2a 50%, #1b2838 100%)' },
  { id: 7, rawKey: 'onboarding', fallback: 'onboarding', caption: 'Beautiful &\nSimple Design', gradient: 'linear-gradient(145deg, #0a0a0f 0%, #1a1a2e 50%, #0d0d1a 100%)' },
  { id: 8, rawKey: 'landing', fallback: 'landing', caption: 'Expense Tracking\nDone Right', gradient: 'linear-gradient(145deg, #16213e 0%, #1a1a4e 50%, #0f3460 100%)' },
];

for (const shot of screenshots) {
  const rawPath = rawScreens[shot.rawKey] || path.join(RAW_DIR, `${shot.fallback || shot.rawKey}.png`);
  let imgBase64;
  try {
    imgBase64 = (await readFile(rawPath)).toString('base64');
  } catch {
    console.log(`  ⚠️ Missing raw screen for ${shot.rawKey}, using dashboard fallback`);
    imgBase64 = (await readFile(rawScreens.dashboard)).toString('base64');
  }

  const compositeHTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
  *{margin:0;padding:0;box-sizing:border-box;}
  body{width:1080px;height:1920px;background:${shot.gradient};display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Inter',sans-serif;overflow:hidden;position:relative;}
  body::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 25% 15%,rgba(124,58,237,0.22) 0%,transparent 55%),radial-gradient(ellipse at 75% 85%,rgba(99,102,241,0.15) 0%,transparent 55%),radial-gradient(ellipse at 50% 50%,rgba(34,211,153,0.05) 0%,transparent 40%);}
  body::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 80% 20%,rgba(255,255,255,0.04) 0%,transparent 30%);}
  .caption{font-size:54px;font-weight:900;color:white;text-align:center;letter-spacing:-1.5px;margin-bottom:32px;z-index:2;text-shadow:0 2px 30px rgba(0,0,0,0.6),0 4px 60px rgba(0,0,0,0.3);line-height:1.1;white-space:pre-line;}
  .phone-shadow{position:relative;z-index:1;filter:drop-shadow(0 40px 80px rgba(0,0,0,0.5)) drop-shadow(0 10px 20px rgba(0,0,0,0.3));}
  .phone{width:640px;height:1300px;background:linear-gradient(165deg,#3d3d3d 0%,#2a2a2a 15%,#1a1a1a 50%,#111 100%);border-radius:56px;padding:12px;position:relative;border:1px solid rgba(255,255,255,0.08);}
  .phone::before{content:'';position:absolute;inset:0;border-radius:56px;background:linear-gradient(180deg,rgba(255,255,255,0.15) 0%,transparent 8%,transparent 92%,rgba(0,0,0,0.3) 100%);pointer-events:none;z-index:5;}
  .screen-wrap{width:100%;height:100%;border-radius:46px;overflow:hidden;position:relative;background:#000;}
  .screen-wrap img{width:100%;height:100%;object-fit:cover;object-position:top;display:block;}
  /* Pixel-style hole punch camera */
  .cam{position:absolute;top:14px;left:50%;transform:translateX(-50%);width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#2a2a2a,#0a0a0a);border:1.5px solid #222;z-index:10;box-shadow:0 0 0 3px rgba(0,0,0,0.8);}
  /* Side buttons - visible outside phone body */
  .btn-power{position:absolute;right:-2.5px;top:240px;width:3px;height:70px;background:linear-gradient(180deg,#555,#333,#555);border-radius:0 3px 3px 0;box-shadow:1px 0 2px rgba(0,0,0,0.3);}
  .btn-vol1{position:absolute;left:-2.5px;top:200px;width:3px;height:45px;background:linear-gradient(180deg,#555,#333,#555);border-radius:3px 0 0 3px;box-shadow:-1px 0 2px rgba(0,0,0,0.3);}
  .btn-vol2{position:absolute;left:-2.5px;top:260px;width:3px;height:45px;background:linear-gradient(180deg,#555,#333,#555);border-radius:3px 0 0 3px;box-shadow:-1px 0 2px rgba(0,0,0,0.3);}
</style></head>
<body>
  <div class="caption">${shot.caption}</div>
  <div class="phone-shadow">
    <div class="phone">
      <div class="btn-power"></div>
      <div class="btn-vol1"></div>
      <div class="btn-vol2"></div>
      <div class="screen-wrap">
        <div class="cam"></div>
        <img src="data:image/png;base64,${imgBase64}"/>
      </div>
    </div>
  </div>
</body></html>`;

  const compPage = await browser.newPage();
  await compPage.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await compPage.setContent(compositeHTML, { waitUntil: 'networkidle0', timeout: 15000 });
  await compPage.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 800));
  
  const outPath = path.join(OUTPUT, `screenshot-${shot.id}.png`);
  await compPage.screenshot({ path: outPath, type: 'png' });
  const sz = statSync(outPath);
  console.log(`  ✅ screenshot-${shot.id}.png (${(sz.size/1024).toFixed(0)}KB)`);
  await compPage.close();
}

await browser.close();

// Cleanup: restore onboarding state
await supabase.from('user_settings').update({ onboarding_complete: true }).eq('user_id', userId);

console.log('\n🎉 All 8 premium screenshots generated at 1080x1920!');
console.log(`📁 Output: ${OUTPUT}`);
