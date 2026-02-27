const puppeteer = require('puppeteer');
const path = require('path');

async function generateScreenshots() {
  console.log('📱 Generating SpendBot screenshots...');
  
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Load the HTML template
  const htmlPath = path.join(__dirname, 'screenshot-templates.html');
  await page.goto(`file://${htmlPath}`);
  
  // Set viewport to match screenshot dimensions
  await page.setViewport({ width: 1080, height: 1920 });
  
  // Get all screenshot containers
  const screenshots = await page.$$('.screenshot-container');
  console.log(`Found ${screenshots.length} screenshot containers`);
  
  // Generate each screenshot
  for (let i = 0; i < screenshots.length; i++) {
    const outputPath = path.join(__dirname, 'output-v3', `screenshot-${i + 1}.png`);
    
    await screenshots[i].screenshot({
      path: outputPath,
      type: 'png'
    });
    
    console.log(`✅ Generated screenshot-${i + 1}.png`);
  }
  
  await browser.close();
  console.log('🎉 All screenshots generated successfully!');
}

generateScreenshots().catch(console.error);