import puppeteer from 'puppeteer';
import { statSync } from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const OUTPUT = '/Users/albert/clawd/spendbot/screenshots/appstore';
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
const userId = authData.user.id;

// Set monthly budget so settings shows it
await supabase.from('user_settings').update({
  monthly_budget: 200000, is_premium: true, onboarding_complete: true
}).eq('user_id', userId);

const browser = await puppeteer.launch({
  headless: true, args: ['--no-sandbox'], protocolTimeout: 60000
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: SCALE });

await page.goto('https://spendbot.app', { waitUntil: 'domcontentloaded', timeout: 20000 });
await page.evaluate((sess) => {
  localStorage.setItem('sb-euyrskubpiexkdqrtcxh-auth-token', JSON.stringify(sess));
}, authData.session);
await page.goto('https://spendbot.app', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 5000));

// Skip onboarding
for (let i = 0; i < 8; i++) {
  const c = await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(x =>
      ['Continue', 'Skip', "Let's Go"].some(t => x.innerText.includes(t))
    );
    if (b) { b.click(); return true; }
    return null;
  });
  if (!c) break;
  await new Promise(r => setTimeout(r, 1200));
}
await new Promise(r => setTimeout(r, 3000));

// Hide install banners
async function hideBanners() {
  await page.evaluate(() => {
    document.querySelectorAll('[class*="install"], [class*="Install"]').forEach(b => b.style.display = 'none');
    document.querySelectorAll('div, section').forEach(el => {
      if (el.innerText?.includes('Add to Home Screen') && el.offsetHeight < 200) el.style.display = 'none';
    });
  });
}
await hideBanners();

async function shot(name) {
  await new Promise(r => setTimeout(r, 1500));
  await hideBanners();
  const fp = path.join(OUTPUT, name);
  await page.screenshot({ path: fp, type: 'png' });
  console.log(`✅ ${name} (${(statSync(fp).size/1024).toFixed(0)}KB)`);
}

// Retake 04-settings (budget should now show $2,000)
console.log('\n--- Retake Settings ---');
const settingsOpened = await page.evaluate(() => {
  const el = document.querySelector('[aria-label="Open settings"]');
  if (el) { el.click(); return true; } return false;
});
if (settingsOpened) await new Promise(r => setTimeout(r, 2000));
console.log(await page.evaluate(() => document.body.innerText.substring(0, 300)));
await shot('spendbot-04-settings.png');

// Back
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button, a')].find(x => x.innerText.includes('←'));
  if (b) b.click();
});
await new Promise(r => setTimeout(r, 2000));

// For 07: Try tapping on a category in the Top Categories section at bottom of dashboard
console.log('\n--- Retake Category Detail ---');
await page.evaluate(() => window.scrollTo(0, 9999));
await new Promise(r => setTimeout(r, 1500));

// Look for category items to click
const catInfo = await page.evaluate(() => {
  const items = document.querySelectorAll('*');
  const results = [];
  items.forEach(el => {
    const text = el.innerText?.trim();
    if (text && (text.includes('Groceries') || text.includes('Food')) && el.offsetHeight > 0 && el.offsetHeight < 100) {
      results.push({ tag: el.tagName, text: text.substring(0, 50), h: el.offsetHeight, w: el.offsetWidth });
    }
  });
  return results.slice(0, 10);
});
console.log('Category elements found:', JSON.stringify(catInfo, null, 2));

// Click on Groceries category
const clicked = await page.evaluate(() => {
  const items = [...document.querySelectorAll('div, li, a, button, span')];
  // Find the smallest element containing "Groceries" that looks like a list item
  const groceries = items.filter(el => {
    const t = el.innerText?.trim();
    return t && t.includes('Groceries') && el.offsetHeight > 20 && el.offsetHeight < 80 && el.offsetWidth > 100;
  }).sort((a, b) => a.innerText.length - b.innerText.length);
  if (groceries[0]) { groceries[0].click(); return groceries[0].innerText.substring(0, 50); }
  return null;
});
console.log('Clicked:', clicked);
await new Promise(r => setTimeout(r, 2000));
console.log(await page.evaluate(() => document.body.innerText.substring(0, 300)));

// Check if we navigated to a detail view
const isDetail = await page.evaluate(() => {
  return document.body.innerText.includes('← Back') || document.body.innerText.includes('Groceries') && !document.body.innerText.includes('Spending Personality');
});
console.log('Is detail view:', isDetail);

if (isDetail) {
  await shot('spendbot-07-category.png');
} else {
  // The app might not have category detail pages - take spending chart/breakdown instead
  console.log('No category detail - checking for chart views...');
  
  // Navigate to dashboard and look for chart/stats tabs
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 1000));
  
  // Check bottom navigation for chart icon
  const navItems = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('nav button, nav a, [role="tablist"] button, footer button, footer a')];
    return btns.map(b => ({ text: b.innerText.substring(0, 30), aria: b.getAttribute('aria-label') }));
  });
  console.log('Nav items:', JSON.stringify(navItems));
  
  // Try clicking trends/chart tab  
  const chartClicked = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('button, a, [role="tab"]')];
    const chart = btns.find(b => {
      const t = (b.innerText + ' ' + (b.getAttribute('aria-label') || '')).toLowerCase();
      return t.includes('trend') || t.includes('chart') || t.includes('stats') || t.includes('analytics') || t.includes('insights');
    });
    if (chart) { chart.click(); return chart.innerText.substring(0, 30) || chart.getAttribute('aria-label'); }
    return null;
  });
  console.log('Chart clicked:', chartClicked);
  await new Promise(r => setTimeout(r, 2000));
  
  // Take the spending breakdown from scrolled dashboard showing categories + stats
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 500));
  // Scroll to show stats + categories section (middle area)
  await page.evaluate(() => window.scrollBy(0, 450));
  await new Promise(r => setTimeout(r, 1000));
  console.log(await page.evaluate(() => document.body.innerText.substring(0, 300)));
  await shot('spendbot-07-category.png');
}

await browser.close();

// Final verification
console.log('\n=== ALL FILES ===');
const { readdirSync } = await import('fs');
const files = readdirSync(OUTPUT).filter(f => f.startsWith('spendbot-0')).sort();
for (const f of files) {
  console.log(`  ${f}: ${(statSync(path.join(OUTPUT, f)).size/1024).toFixed(0)}KB`);
}
