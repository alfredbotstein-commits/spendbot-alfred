# SpendBot Play Store Assets - Implementation Guide for Isaiah

## Overview
This guide provides exact steps to generate the three required Play Store assets from the provided templates.

## Required Assets
1. **Feature Graphic:** 1024×500px (JPEG/PNG, <1MB)
2. **Screenshots:** 8 screens, 1080×1920px (PNG)
3. **App Icon:** 512×512px (32-bit PNG with alpha)

---

## ASSET 1: Feature Graphic

### Source File
`~/clawd/spendbot/marketing/play-store/feature-graphic.html`

### Generation Command (Puppeteer)
```javascript
const puppeteer = require('puppeteer');

async function generateFeatureGraphic() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Load the HTML file
  await page.goto('file://' + __dirname + '/feature-graphic.html');
  
  // Set viewport to exact dimensions
  await page.setViewport({ width: 1024, height: 500 });
  
  // Screenshot the specific element
  const element = await page.$('.feature-graphic');
  await element.screenshot({
    path: '~/clawd/spendbot/marketing/play-store/feature-graphic.png',
    type: 'png'
  });
  
  await browser.close();
}
```

### Export Specifications
- **Dimensions:** Exactly 1024×500px
- **Format:** PNG (highest quality)
- **File size:** Must be under 1MB
- **Color space:** sRGB
- **DPI:** 72

---

## ASSET 2: Screenshots

### Source File
`~/clawd/spendbot/marketing/play-store/screenshot-templates.html`

### Generation Command (Puppeteer)
```javascript
async function generateScreenshots() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Load the HTML file
  await page.goto('file://' + __dirname + '/screenshot-templates.html');
  
  // Set viewport to exact dimensions
  await page.setViewport({ width: 1080, height: 1920 });
  
  // Get all screenshot containers
  const screenshots = await page.$$('.screenshot-container');
  
  for (let i = 0; i < screenshots.length; i++) {
    await screenshots[i].screenshot({
      path: `~/clawd/spendbot/marketing/play-store/screenshot-${i + 1}.png`,
      type: 'png'
    });
  }
  
  await browser.close();
}
```

### Screenshot Naming Convention
- `screenshot-1.png` - Hero Dashboard
- `screenshot-2.png` - Category Breakdown
- `screenshot-3.png` - Add Expense Flow
- `screenshot-4.png` - Monthly Trends
- `screenshot-5.png` - Budget vs Actual
- `screenshot-6.png` - Privacy/Security
- `screenshot-7.png` - Dark Mode
- `screenshot-8.png` - App Overview

### Export Specifications
- **Dimensions:** Exactly 1080×1920px (portrait)
- **Format:** 24-bit PNG
- **Color space:** sRGB
- **DPI:** 72

---

## ASSET 3: App Icon

### Source File
`~/clawd/spendbot/marketing/play-store/app-icon.svg`

### Generation Options

#### Option A: Puppeteer SVG Screenshot
```javascript
async function generateAppIcon() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const svgContent = fs.readFileSync('./app-icon.svg', 'utf8');
  const html = `
    <html>
      <body style="margin: 0; padding: 0; background: transparent;">
        ${svgContent}
      </body>
    </html>
  `;
  
  await page.setContent(html);
  await page.setViewport({ width: 512, height: 512 });
  
  await page.screenshot({
    path: '~/clawd/spendbot/marketing/play-store/app-icon.png',
    type: 'png',
    omitBackground: false
  });
  
  await browser.close();
}
```

#### Option B: Sharp/Canvas (Node.js)
```javascript
const sharp = require('sharp');

async function convertSvgToPng() {
  await sharp('./app-icon.svg')
    .resize(512, 512)
    .png()
    .toFile('~/clawd/spendbot/marketing/play-store/app-icon.png');
}
```

### Export Specifications
- **Dimensions:** Exactly 512×512px
- **Format:** 32-bit PNG with alpha channel
- **Color space:** sRGB
- **DPI:** 72
- **Alpha:** Preserved (important for adaptive icons)

---

## COMPLETE GENERATION SCRIPT

Create `~/clawd/spendbot/marketing/play-store/generate-assets.js`:

```javascript
const puppeteer = require('puppeteer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateAllAssets() {
  console.log('🎨 Generating SpendBot Play Store assets...');
  
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  // 1. Generate Feature Graphic
  console.log('📊 Generating feature graphic...');
  const featurePage = await browser.newPage();
  await featurePage.goto('file://' + path.join(__dirname, 'feature-graphic.html'));
  await featurePage.setViewport({ width: 1024, height: 500 });
  
  const featureElement = await featurePage.$('.feature-graphic');
  await featureElement.screenshot({
    path: path.join(__dirname, 'feature-graphic.png'),
    type: 'png'
  });
  await featurePage.close();
  
  // 2. Generate Screenshots
  console.log('📱 Generating screenshots...');
  const screenshotPage = await browser.newPage();
  await screenshotPage.goto('file://' + path.join(__dirname, 'screenshot-templates.html'));
  await screenshotPage.setViewport({ width: 1080, height: 1920 });
  
  const screenshots = await screenshotPage.$$('.screenshot-container');
  
  for (let i = 0; i < screenshots.length; i++) {
    await screenshots[i].screenshot({
      path: path.join(__dirname, `screenshot-${i + 1}.png`),
      type: 'png'
    });
    console.log(`  ✅ Generated screenshot-${i + 1}.png`);
  }
  await screenshotPage.close();
  
  await browser.close();
  
  // 3. Generate App Icon from SVG
  console.log('🎯 Generating app icon...');
  await sharp(path.join(__dirname, 'app-icon.svg'))
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, 'app-icon.png'));
  
  console.log('✨ All assets generated successfully!');
  
  // Verify file sizes
  console.log('\n📏 Asset verification:');
  const assets = [
    'feature-graphic.png',
    'screenshot-1.png',
    'screenshot-2.png', 
    'screenshot-3.png',
    'screenshot-4.png',
    'screenshot-5.png',
    'screenshot-6.png',
    'screenshot-7.png',
    'screenshot-8.png',
    'app-icon.png'
  ];
  
  for (const asset of assets) {
    const filePath = path.join(__dirname, asset);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`  ${asset}: ${sizeKB}KB`);
    }
  }
}

// Run the generation
generateAllAssets().catch(console.error);
```

## INSTALLATION & DEPENDENCIES

Install required packages:
```bash
cd ~/clawd/spendbot/marketing/play-store
npm init -y
npm install puppeteer sharp
```

Run generation:
```bash
node generate-assets.js
```

---

## QUALITY VALIDATION

After generation, validate each asset:

### Feature Graphic Checklist
- [ ] Dimensions exactly 1024×500px
- [ ] File size under 1MB  
- [ ] SpendBot logo clear and readable
- [ ] Tagline legible and well-positioned
- [ ] Background gradient smooth
- [ ] Center area clear for play button overlay

### Screenshots Checklist
- [ ] All 8 screenshots generated
- [ ] Dimensions exactly 1080×1920px each
- [ ] Phone frames consistent
- [ ] Captions bold and readable
- [ ] Real data used (no Lorem ipsum)
- [ ] Brand colors consistent
- [ ] Dark mode screenshot properly styled

### App Icon Checklist
- [ ] Dimensions exactly 512×512px
- [ ] 32-bit PNG with alpha channel
- [ ] "S" symbol clear at small sizes
- [ ] Gradient renders properly
- [ ] Tracking dots visible but subtle
- [ ] Works with various mask shapes

---

## FINAL DELIVERABLES

After successful generation, you should have:

```
~/clawd/spendbot/marketing/play-store/
├── feature-graphic.png     (1024×500px)
├── screenshot-1.png        (1080×1920px) - Hero Dashboard  
├── screenshot-2.png        (1080×1920px) - Category Breakdown
├── screenshot-3.png        (1080×1920px) - Add Expense Flow
├── screenshot-4.png        (1080×1920px) - Monthly Trends
├── screenshot-5.png        (1080×1920px) - Budget vs Actual
├── screenshot-6.png        (1080×1920px) - Privacy/Security
├── screenshot-7.png        (1080×1920px) - Dark Mode
├── screenshot-8.png        (1080×1920px) - App Overview
└── app-icon.png           (512×512px)
```

These files are ready for direct upload to Google Play Console.

## TROUBLESHOOTING

### Common Issues
1. **File size too large:** Optimize PNG compression or use JPEG for feature graphic
2. **Fonts not rendering:** Ensure Inter font loads properly in Puppeteer
3. **SVG conversion fails:** Verify Sharp can handle the gradient definitions
4. **Screenshots cut off:** Check viewport dimensions match container sizes

### Performance Tips
- Run generation on a machine with sufficient RAM for Puppeteer
- Use `--no-sandbox` flag if running in Docker/CI
- Close browser pages after each screenshot to free memory