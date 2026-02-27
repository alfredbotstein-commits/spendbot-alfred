import puppeteer from 'puppeteer';
import { mkdir, stat } from 'fs/promises';
import { readdirSync, statSync } from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const OUTPUT = '/Users/albert/clawd/spendbot/screenshots/appstore';
await mkdir(OUTPUT, { recursive: true });

// iPhone 6.7" = 1320x2868 at 3x = viewport 440x956
const SCALE = 3;
const W = 440;
const H = 956;

const supabase = createClient(
  'https://euyrskubpiexkdqrtcxh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1eXJza3VicGlleGtkcXJ0Y3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5ODE3NDUsImV4cCI6MjA4NTU1Nzc0NX0.E7eApgqUpiOPbSWENmWkPDQnZEAebzOeRgj2mnGlY2g'
);

const { data: authData } = await supabase.auth.signInWithPassword({
  email: 'screenshots@spendbot.test', password: 'Screenshot2026!'
});
if (!authData?.session) { console.error('Auth failed'); process.exit(1); }
const userId = authData.user.id;
console.log('Auth OK, userId:', userId);

// Seed expenses with current-looking dates
const now = new Date();
function daysAgo(n) {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

await supabase.from('expenses').delete().eq('user_id', userId);
const expenses = [
  { amount: 4250, category_id: 'food', note: 'Chipotle lunch', date: daysAgo(0) },
  { amount: 8599, category_id: 'groceries', note: 'Whole Foods', date: daysAgo(1) },
  { amount: 1599, category_id: 'subscriptions', note: 'Netflix', date: daysAgo(2) },
  { amount: 3500, category_id: 'transport', note: 'Uber ride', date: daysAgo(3) },
  { amount: 6750, category_id: 'entertainment', note: 'Concert tickets', date: daysAgo(4) },
  { amount: 12000, category_id: 'bills', note: 'Electric bill', date: daysAgo(5) },
  { amount: 4999, category_id: 'shopping', note: 'New headphones', date: daysAgo(6) },
  { amount: 2500, category_id: 'health', note: 'Supplements', date: daysAgo(7) },
  { amount: 15000, category_id: 'travel', note: 'Hotel booking', date: daysAgo(8) },
  { amount: 899, category_id: 'food', note: 'Coffee & pastry', date: daysAgo(9) },
  { amount: 3200, category_id: 'food', note: 'Thai dinner', date: daysAgo(10) },
  { amount: 7500, category_id: 'groceries', note: 'Costco run', date: daysAgo(11) },
  { amount: 2999, category_id: 'entertainment', note: 'Movie night', date: daysAgo(12) },
  { amount: 5500, category_id: 'shopping', note: 'Running shoes', date: daysAgo(13) },
  { amount: 1800, category_id: 'food', note: 'Lunch sandwich', date: daysAgo(14) },
];
const { error: insertErr } = await supabase.from('expenses').insert(
  expenses.map(e => ({ user_id: userId, ...e }))
);
if (insertErr) { console.error('Insert error:', insertErr); process.exit(1); }
console.log('Seeded', expenses.length, 'expenses');

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

// Hide install banners
await page.evaluate(() => {
  document.querySelectorAll('[class*="install"], [class*="Install"]').forEach(b => b.style.display = 'none');
  document.querySelectorAll('div, section').forEach(el => {
    if (el.innerText?.includes('Add to Home Screen') && el.offsetHeight < 200) el.style.display = 'none';
  });
});

async function shot(name) {
  await new Promise(r => setTimeout(r, 1500));
  // Hide install banners again before each shot
  await page.evaluate(() => {
    document.querySelectorAll('[class*="install"], [class*="Install"]').forEach(b => b.style.display = 'none');
    document.querySelectorAll('div, section').forEach(el => {
      if (el.innerText?.includes('Add to Home Screen') && el.offsetHeight < 200) el.style.display = 'none';
    });
  });
  const fp = path.join(OUTPUT, name);
  await page.screenshot({ path: fp, type: 'png' });
  const s = statSync(fp);
  console.log(`✅ ${name} (${(s.size/1024).toFixed(0)}KB)`);
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
    const b = [...document.querySelectorAll('button, a, div[role="button"]')].find(x => x.innerText.includes(t));
    if (b) { b.click(); return true; } return false;
  }, text);
  if (found) await new Promise(r => setTimeout(r, 2000));
  return found;
}

function logPage() {
  return page.evaluate(() => document.body.innerText.substring(0, 200));
}

// 1: Dashboard
console.log('\n--- 1: Dashboard ---');
console.log(await logPage());
await shot('spendbot-01-dashboard.png');

// 2: Transaction list (See All)
console.log('\n--- 2: Transactions ---');
if (await clickText('See All')) {
  console.log('History opened');
} else {
  await page.evaluate(() => window.scrollBy(0, 400));
  await new Promise(r => setTimeout(r, 1000));
  await clickText('See All');
}
console.log(await logPage());
await shot('spendbot-02-transactions.png');

// Back
await clickText('← Back') || await clickText('←') || await page.goBack();
await new Promise(r => setTimeout(r, 2000));

// 3: Add transaction
console.log('\n--- 3: Add Transaction ---');
if (await clickAria('Add new expense')) {
  console.log('Add expense opened');
} else {
  await clickText('+');
}
console.log(await logPage());
await shot('spendbot-03-add-transaction.png');

// Close
await clickAria('Cancel and close') || await clickText('Cancel') || await page.keyboard.press('Escape');
await new Promise(r => setTimeout(r, 2000));

// 4: Settings / Budget setup
console.log('\n--- 4: Settings ---');
if (await clickAria('Open settings')) {
  console.log('Settings opened');
}
console.log(await logPage());
await shot('spendbot-04-settings.png');

// Back
await clickText('← Back') || await clickText('←') || await page.goBack();
await new Promise(r => setTimeout(r, 2000));

// 5: Calendar view
console.log('\n--- 5: Calendar ---');
if (await clickAria('Open calendar view')) {
  console.log('Calendar opened');
}
console.log(await logPage());
await shot('spendbot-05-calendar.png');

// Back
await clickText('←') || await clickAria('Go back') || await page.goBack();
await new Promise(r => setTimeout(r, 2000));

// 6: Scrolled dashboard (insights/gamification)
console.log('\n--- 6: Insights ---');
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 500));
await page.evaluate(() => window.scrollBy(0, 600));
await new Promise(r => setTimeout(r, 1000));
console.log(await logPage());
await shot('spendbot-06-insights.png');

// 7: Category detail - click on a category in spending breakdown
console.log('\n--- 7: Category Detail ---');
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise(r => setTimeout(r, 1000));
// Try clicking a category chip or section
const catClicked = await page.evaluate(() => {
  // Try finding category elements
  const cats = [...document.querySelectorAll('button, a, div[role="button"], [class*="category"], [class*="Category"]')];
  const cat = cats.find(c => c.innerText?.includes('Food') || c.innerText?.includes('🍔') || c.innerText?.includes('Groceries'));
  if (cat) { cat.click(); return cat.innerText.substring(0, 30); }
  return null;
});
if (catClicked) {
  console.log('Clicked category:', catClicked);
  await new Promise(r => setTimeout(r, 2000));
}
console.log(await logPage());
await shot('spendbot-07-category.png');

// Back
await clickText('← Back') || await clickText('←') || await page.goBack();
await new Promise(r => setTimeout(r, 2000));

// 8: Onboarding/Welcome screen
console.log('\n--- 8: Onboarding ---');
await supabase.from('user_settings').update({ onboarding_complete: false }).eq('user_id', userId);
await page.goto('https://spendbot.app', { waitUntil: 'networkidle2', timeout: 20000 });
await new Promise(r => setTimeout(r, 3000));
console.log(await logPage());
await shot('spendbot-08-onboarding.png');

// Restore
await supabase.from('user_settings').update({ onboarding_complete: true }).eq('user_id', userId);

await browser.close();

// Verify
console.log('\n=== VERIFICATION ===');
const files = readdirSync(OUTPUT).filter(f => f.startsWith('spendbot-0')).sort();
console.log(`Files: ${files.length}/8`);
for (const f of files) {
  const s = statSync(path.join(OUTPUT, f));
  console.log(`  ${f}: ${(s.size/1024).toFixed(0)}KB`);
}
console.log(`Expected: ${W*SCALE}x${H*SCALE}px = ${W*SCALE}x${H*SCALE}`);
