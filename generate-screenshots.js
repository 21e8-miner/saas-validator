const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// iPhone screen sizes for App Store
const DEVICES = [
  { name: 'iPhone 14 Pro Max', width: 1290, height: 2796, scale: 3 },
  { name: 'iPhone 11 Pro Max', width: 1242, height: 2688, scale: 3 },
  { name: 'iPhone 8 Plus', width: 1242, height: 2208, scale: 3 }
];

// Pages to screenshot
const PAGES = [
  { url: 'index.html', name: 'landing' },
  { url: 'index.html#results', name: 'results' },
  { url: 'pricing.html', name: 'pricing' },
  { url: 'auth.html', name: 'auth' }
];

async function generateScreenshots() {
  const browser = await puppeteer.launch({ headless: 'new' });

  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'assets', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  for (const device of DEVICES) {
    console.log(`Generating screenshots for ${device.name}...`);

    const page = await browser.newPage();
    await page.setViewport({
      width: Math.floor(device.width / device.scale),
      height: Math.floor(device.height / device.scale),
      deviceScaleFactor: device.scale
    });

    for (const pageInfo of PAGES) {
      const url = `file://${path.join(__dirname, pageInfo.url)}`;
      await page.goto(url, { waitUntil: 'networkidle0' });

      // Wait for animations
      await new Promise(r => setTimeout(r, 1000));

      const filename = `${device.name.replace(/\s+/g, '_')}_${pageInfo.name}.png`;
      const filepath = path.join(screenshotsDir, filename);

      await page.screenshot({
        path: filepath,
        fullPage: false
      });

      console.log(`  ✓ Generated ${filename}`);
    }

    await page.close();
  }

  await browser.close();
  console.log('\n✅ All screenshots generated!');
  console.log(`📁 Saved to: ${screenshotsDir}`);
}

generateScreenshots().catch(console.error);
