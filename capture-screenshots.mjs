import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const OUTPUT = '/Users/albert/clawd/spendbot/store-assets/play-store';
await mkdir(OUTPUT, { recursive: true });

const SCALE = 2;
const W = 540;
const H = 960;

const supabase = createClient(
  'https://euyrskubpiexkdqrtcxh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1eXJza3VicGlleGtkcXJ0Y3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5ODE3NDUsImV4cCI6MjA4NTU1Nzc0NX0.E7eApgqUpiOPbSWENmWkPDQnZEAebzOeRgj2mnGlY2g'
);

const { data: authData } = await supabase.auth.signInWithPassword({
  email: 'screenshots@spendbot.test', password: 'Screenshot2026!'
});
if (!authData?.session) { console.error('Auth failed'); process.exit(1); }
const userId = authData.user.id;
console.log('Auth OK');

// Seed expenses
await supabase.from('expenses').delete().eq('user_id', userId);
const expenses = [
  { amount: 4250, category_id: 'food', note: 'Chipotle lunch', date: '2026-02-20T12:30:00Z' },
  { amount: 8599, category_id: 'groceries', note: 'Whole Foods', date: '2026-02-19T18:00:00Z' },
  { amount: 1599, category_id: 'subscriptions', note: 'Netflix', date: '2026-02-18T08:00:00Z' },
  { amount: 3500, category_id: 'transport', note: 'Uber ride', date: '2026-02-17T06:30:00Z' },
  { amount: 6750, category_id: 'entertainment', note: 'Concert tickets', date: '2026-02-16T20:00:00Z' },
  { amount: 12000, category_id: 'bills', note: 'Electric bill', date: '2026-02-15T10:00:00Z' },
  { amount: 4999, category_id: 'shopping', note: 'New headphones', date: '2026-02-14T14:00:00Z' },
  { amount: 2500, category_id: 'health', note: 'Supplements', date: '2026-02-13T09:00:00Z' },
  { amount: 15000, category_id: 'travel', note: 'Hotel booking', date: '2026-02-12T16:00:00Z' },
  { amount: 899, category_id: 'food', note: 'Coffee & pastry', date: '2026-02-11T07:30:00Z' },
  { amount: 3200, category_id: 'food', note: 'Thai dinner', date: '2026-02-10T19:00:00Z' },
  { amount: 7500, category_id: 'groceries', note: 'Costco run', date: '2026-02-09T11:00:00Z' },
  { amount: 2999, category_id: 'entertainment', note: 'Movie night', date: '2026-02-08T21:00:00Z' },
  { amount: 5500, category_id: 'shopping', note: 'Running shoes', date: '2026-02-07T13:00:00Z' },
  { amount: 1800, category_id: 'food', note: 'Lunch sandwich', date: '2026-02-06T12:00:00Z' },
];
const { error: insertErr } = await supabase.from('expenses').insert(
  expenses.map(e => ({ user_id: userId, ...e }))
);
if (insertErr) { console.error('Insert error:', insertErr); process.exit(1); }
console.log('Seeded', expenses.length, 'expenses');

// Update settings
await supabase.from('user_settings').update({
  monthly_budget: 200000, is_premium: true, onboarding_complete: true
}).eq('user_id', userId);

const browser = await puppeteer.launch({ 
  headless: true, args: ['--no-sandbox'], protocolTimeout: 60000
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: SCALE });

// Inject session
await page.goto('https://spendbot.app', { waitUntil: 'domcontentloaded', timeout: 20000 });
await page.evaluate((sess) => {
  localStorage.setItem('sb-euyrskubpiexkdqrtcxh-auth-token', JSON.stringify(sess));
}, authData.session);
await page.goto('https://spendbot.app', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 5000));

// Skip onboarding if shown
for (let i = 0; i < 8; i++) {
  const c = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(x => 
      ['Continue', 'Skip', "Let's Go"].some(t => x.innerText.includes(t))
    );
    if (b) { b.click(); return b.innerText.trim().substring(0, 20); }
    return null;
  });
  if (!c) break;
  console.log('Clicked:', c);
  await new Promise(r => setTimeout(r, 1200));
}

await new Promise(r => setTimeout(r, 3000));

async function shot(name) {
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(OUTPUT, name), type: 'png' });
  const { size } = (await import('fs')).statSync(path.join(OUTPUT, name));
  console.log(`✅ ${name} (${(size/1024).toFixed(0)}KB)`);
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
    const b = [...document.querySelectorAll('button, a')].find(x => x.innerText.includes(t));
    if (b) { b.click(); return true; } return false;
  }, text);
  if (found) await new Promise(r => setTimeout(r, 2000));
  return found;
}

// Hide the install banner and any dismiss-able overlays for clean screenshots
await page.evaluate(() => {
  // Hide install banner
  const banners = document.querySelectorAll('[class*="install"], [class*="Install"]');
  banners.forEach(b => b.style.display = 'none');
  // Also hide via text matching
  const allEls = document.querySelectorAll('div, section');
  allEls.forEach(el => {
    if (el.innerText?.includes('Add to Home Screen') && el.offsetHeight < 200) {
      el.style.display = 'none';
    }
  });
});

let text = await page.evaluate(() => document.body.innerText.substring(0, 300));
console.log('\n=== Dashboard ===\n', text.substring(0, 200));

// 1: Dashboard
await shot('01-dashboard.png');

// 2: Add Expense (click FAB)
if (await clickAria('Add new expense')) {
  console.log('Add expense opened');
} else {
  console.log('FAB not found, trying alternatives...');
  await clickText('+');
}
text = await page.evaluate(() => document.body.innerText.substring(0, 200));
console.log('Add screen:', text.substring(0, 100));
await shot('02-add-expense.png');

// Close add expense overlay
console.log('Closing add expense...');
await clickAria('Cancel and close') || await clickText('Cancel');
await new Promise(r => setTimeout(r, 2000));

// 3: History
if (await clickText('See All')) {
  console.log('History opened via See All');
} else {
  console.log('See All not found');
  // Try scrolling to find it
  await page.evaluate(() => window.scrollBy(0, 400));
  await new Promise(r => setTimeout(r, 1000));
  await clickText('See All');
}
text = await page.evaluate(() => document.body.innerText.substring(0, 200));
console.log('History:', text.substring(0, 100));
await shot('03-history.png');

// Back from history
await clickText('← Back') || await clickText('←');
await new Promise(r => setTimeout(r, 2000));

// 4: Settings
if (await clickAria('Open settings')) {
  console.log('Settings opened');
}
text = await page.evaluate(() => document.body.innerText.substring(0, 200));
console.log('Settings:', text.substring(0, 100));
await shot('04-settings.png');

// Back from settings
await clickText('← Back') || await clickText('←');
await new Promise(r => setTimeout(r, 1500));

// 5: Calendar
if (await clickAria('Open calendar view')) {
  console.log('Calendar opened');
}
await shot('05-calendar.png');

// Back from calendar
await clickText('←') || await clickAria('Go back');
await new Promise(r => setTimeout(r, 1500));

// 6: Dashboard scrolled (gamification/insights)
await page.evaluate(() => window.scrollBy(0, 600));
await shot('06-insights.png');

// 7: Onboarding
await supabase.from('user_settings').update({ onboarding_complete: false }).eq('user_id', userId);
await page.goto('https://spendbot.app', { waitUntil: 'networkidle2', timeout: 20000 });
await new Promise(r => setTimeout(r, 3000));
await shot('07-onboarding.png');
await supabase.from('user_settings').update({ onboarding_complete: true }).eq('user_id', userId);

// 8: Landing
await page.evaluate(() => localStorage.clear());
await page.goto('https://spendbot.app', { waitUntil: 'networkidle2', timeout: 20000 });
await new Promise(r => setTimeout(r, 5000));
await shot('08-landing.png');

await browser.close();

// Cleanup old files
const fs = await import('fs');
for (const f of fs.readdirSync(OUTPUT)) {
  if (!f.match(/^0[1-8]-/) || f.includes('welcome') || f.includes('after-click') || f.includes('amount') || f.includes('clean')) {
    // keep only 01-08 named files
  }
}

console.log('\n=== FINAL ===');
for (const f of fs.readdirSync(OUTPUT).filter(f => /^0[1-8]-/.test(f)).sort()) {
  const stat = fs.statSync(path.join(OUTPUT, f));
  console.log(`${f}: ${(stat.size/1024).toFixed(0)}KB`);
}
console.log(`${W*SCALE}x${H*SCALE}px — Google Play ✅`);
