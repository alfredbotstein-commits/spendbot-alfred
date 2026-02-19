# SpendBot Play Store Design Specifications

## Brand Identity
- **Personality:** Calm, organized, trustworthy. "I'm in control of my money."
- **Colors:** Blues + greens + white
- **Feel:** Safe, simple, empowering
- **Quality bar:** Mint, YNAB, Copilot Money level polish

## Color Palette
```
Primary Blue: #2563eb (blue-600)
Light Blue: #60a5fa (blue-400) 
Soft Blue: #dbeafe (blue-100)
Success Green: #22c55e (green-500)
Light Green: #bbf7d0 (green-200)
Background White: #ffffff
Text Dark: #1e293b (slate-800)
Text Medium: #64748b (slate-500)
```

## Typography
- **Font:** Inter (system fallback: -apple-system, BlinkMacSystemFont)
- **Weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Hierarchy:** H1: 32px/bold, H2: 24px/semibold, Body: 16px/regular, Caption: 14px/medium

---

# DELIVERABLE 1: Feature Graphic (1024×500px)

## Specifications
- **Dimensions:** 1024×500px exactly
- **Format:** 24-bit PNG or JPEG, no alpha
- **File size:** <1MB

## Layout
```
[Logo Area: 0-340px]    [Clear Center: 340-684px]    [Tagline Area: 684-1024px]
     SpendBot                [Play button zone]           "Expenses. Tracked.
   Logo/Wordmark                                            Effortlessly."
```

## Background
- **Style:** Soft linear gradient
- **Colors:** Light blue (#dbeafe) at left → White (#ffffff) at right
- **Direction:** 135 degrees (diagonal)

## Logo Area (Left Third: 0-340px)
- **SpendBot Logo:** 200×60px
- **Position:** Centered vertically, 70px from left edge
- **Logo Design:** 
  - "S" symbol in circle: 40×40px, Primary Blue (#2563eb) background, white "S" letterform
  - "SpendBot" wordmark: Inter Bold, 24px, Text Dark (#1e293b)
  - Spacing: 16px between symbol and wordmark

## Tagline Area (Right Third: 684-1024px)
- **Text:** "Expenses. Tracked. Effortlessly."
- **Font:** Inter Semibold, 28px
- **Color:** Text Dark (#1e293b)
- **Position:** Centered vertically, 40px from right edge
- **Line height:** 1.2
- **Alignment:** Right-aligned

## Clear Center Zone (340-684px)
- **Purpose:** Play button overlay area (if video added later)
- **Content:** Empty, gradient background only

## Export Settings
- **Resolution:** 72 DPI
- **Color space:** sRGB
- **Quality:** Maximum (if JPEG)

---

# DELIVERABLE 2: Screenshots (8 screens, 1080×1920px)

## Specifications
- **Dimensions:** 1080×1920px minimum (portrait)
- **Format:** 24-bit PNG
- **Device frame:** Google Pixel phone mockup
- **Caption style:** Bold, benefit-driven, max 5-6 words

## Device Mockup Specs
- **Phone frame:** Google Pixel 8 Pro mockup
- **Screen area:** 972×2160px (inner screen)
- **Frame color:** Obsidian black (#1c1c1e)
- **Screen corners:** 32px radius
- **Frame shadow:** 0 8px 32px rgba(0,0,0,0.12)

## Screenshot Backgrounds
- **Gradient backgrounds:** Each screenshot on colored gradient
- **Colors rotate through SpendBot palette:**
  1. Light Blue (#dbeafe) → White
  2. Light Green (#bbf7d0) → White  
  3. Soft Blue (#dbeafe) → Light Blue (#60a5fa)
  4. White → Light Green (#bbf7d0)
  5. Light Blue (#60a5fa) → Primary Blue (#2563eb)
  6. Light Green (#bbf7d0) → Success Green (#22c55e)
  7. Dark gradient: Primary Blue (#2563eb) → Slate-900 (#0f172a)
  8. White → Light Blue (#dbeafe)

## Caption Styling
- **Font:** Inter Bold, 48px
- **Color:** White text on dark areas, Dark text (#1e293b) on light
- **Position:** Below device, centered
- **Margin:** 64px from bottom of phone frame
- **Text shadow:** 0 2px 4px rgba(0,0,0,0.1) when on light backgrounds

## Screenshot Content Specifications

### Screenshot 1: Hero Dashboard
**Caption:** "Know exactly where your money goes"
**App Screen Content:**
- Header: "February 2026" (Inter Medium, 18px, Text Dark)
- Big number: "$2,847.32" (Inter Bold, 48px, Text Dark)
- Subtitle: "spent this month" (Inter Regular, 16px, Text Medium)
- Quick stats bar: 3 mini cards with real data
- Background: Clean white with subtle card shadows

### Screenshot 2: Category Breakdown  
**Caption:** "Every dollar, categorized instantly"
**App Screen Content:**
- Title: "Spending by Category" (Inter Semibold, 24px)
- Donut chart: Real categories with real amounts
  - Groceries: $687.45 (Success Green)
  - Restaurants: $423.18 (Orange)
  - Gas: $189.75 (Red) 
  - Shopping: $298.52 (Purple)
  - Others: $312.67 (Gray)
- List below chart with same data

### Screenshot 3: Add Expense Flow
**Caption:** "Add expenses in 3 seconds"
**App Screen Content:**
- Clean form with large touch targets
- Amount field: "$89.75" (large, bold)
- Category picker: Icon grid (coffee, food, gas icons)
- Description: "Starbucks Coffee"
- Date: "Today" 
- Large green "Save Expense" button

### Screenshot 4: Monthly Trends
**Caption:** "Spot patterns before you're broke"
**App Screen Content:**
- Line chart showing 6 months of data
- Y-axis: $0-$3,500
- Trend line in Primary Blue
- Data points: Jan $2,134, Feb $2,456, Mar $2,847, etc.
- Annotations showing spending spikes

### Screenshot 5: Budget vs Actual
**Caption:** "Set it. Track it. Own it."
**App Screen Content:**
- Progress bars for each category:
  - Groceries: $687/$700 (98%, Success Green)
  - Restaurants: $423/$350 (120%, Red - over budget)
  - Gas: $189/$200 (94%, Success Green)
- Overall budget: $2,800/$3,000 (93%, Success Green)

### Screenshot 6: Privacy/Security
**Caption:** "Your data stays on your device"
**App Screen Content:**
- Lock icon (large, centered)
- Clean explanation text about local data storage
- Trust indicators: "No cloud sync", "No data selling", "No ads"
- Minimal, trust-focused design

### Screenshot 7: Dark Mode
**Caption:** "Easy on the eyes, day or night"
**App Screen Content:**
- Same dashboard as Screenshot 1 but in dark mode
- Background: Rich dark (#0f172a)
- Text: Light (#f1f5f9)
- Cards: Dark gray (#1e293b) with subtle borders
- Numbers still prominent and readable

### Screenshot 8: App Overview
**Caption:** "Everything you need, nothing you don't"
**App Screen Content:**
- Multi-screen collage or single overview screen
- Shows main navigation: Dashboard, Categories, Trends, Settings
- Clean, organized layout demonstrating full app scope

---

# DELIVERABLE 3: App Icon (512×512px)

## Specifications
- **Dimensions:** 512×512px exactly
- **Format:** 32-bit PNG with alpha
- **Legible at:** 48px (Android adaptive icon minimum)
- **Style:** Flat design, no text, recognizable symbol

## Design Concept: "S" in Circle with Tracking Elements
- **Base circle:** 400×400px (centered, 56px margin on all sides)
- **Background:** Linear gradient Primary Blue (#2563eb) to Light Blue (#60a5fa)
- **Direction:** 135 degrees (top-left to bottom-right)

## Icon Elements
### Main "S" Symbol
- **Letter "S":** Custom drawn, 240×280px
- **Font inspiration:** Inter Bold but custom curves
- **Color:** White (#ffffff)
- **Position:** Centered in circle
- **Style:** Slightly condensed, modern sans-serif

### Tracking Accent
- **Small dots:** 3 dots in Success Green (#22c55e)
- **Size:** 24×24px each
- **Position:** Bottom-right of "S", suggesting movement/tracking
- **Purpose:** Hints at expense tracking without being literal

## Technical Specs
- **Resolution:** 72 DPI
- **Color space:** sRGB
- **Alpha channel:** Yes (for adaptive masking)
- **Safe area:** 384×384px (48px margin for system masking)
- **Export quality:** Maximum PNG compression

## Adaptive Icon Considerations
- **Foreground:** The "S" symbol and tracking dots
- **Background:** The gradient circle
- **Design works with:** Square, circle, rounded square, pebble masks
- **Contrast:** High contrast for accessibility

---

# IMPLEMENTATION TEMPLATES FOR ISAIAH

## HTML/CSS Template for Feature Graphic
```html
<div class="feature-graphic" style="width: 1024px; height: 500px; background: linear-gradient(135deg, #dbeafe 0%, #ffffff 100%); position: relative; font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;">
  
  <!-- Logo Area -->
  <div style="position: absolute; left: 70px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; gap: 16px;">
    <div style="width: 40px; height: 40px; background: #2563eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 24px;">S</div>
    <span style="font-weight: 700; font-size: 24px; color: #1e293b;">SpendBot</span>
  </div>
  
  <!-- Tagline Area -->
  <div style="position: absolute; right: 40px; top: 50%; transform: translateY(-50%); text-align: right; font-weight: 600; font-size: 28px; color: #1e293b; line-height: 1.2;">
    Expenses. Tracked.<br>Effortlessly.
  </div>
  
</div>
```

## JavaScript for Screenshot Generation
```javascript
// Isaiah: Use this with Puppeteer to generate screenshots
const generateScreenshot = async (screenshotNumber, content) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });
  
  const html = `
    <div style="width: 100%; height: 100%; background: ${backgrounds[screenshotNumber-1]}; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: Inter;">
      <!-- Device mockup -->
      <div class="phone-frame" style="width: 324px; height: 648px; background: #1c1c1e; border-radius: 32px; padding: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.12);">
        <div class="screen" style="width: 100%; height: 100%; background: white; border-radius: 24px; overflow: hidden;">
          ${content}
        </div>
      </div>
      <!-- Caption -->
      <div style="margin-top: 64px; font-weight: 700; font-size: 48px; color: ${screenshotNumber === 7 ? 'white' : '#1e293b'}; text-align: center;">
        ${captions[screenshotNumber-1]}
      </div>
    </div>
  `;
  
  await page.setContent(html);
  await page.screenshot({ path: `screenshot-${screenshotNumber}.png`, fullPage: true });
};
```

## SVG Template for App Icon
```svg
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb"/>
      <stop offset="100%" style="stop-color:#60a5fa"/>
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="256" cy="256" r="200" fill="url(#bg)"/>
  
  <!-- "S" letter path -->
  <path d="M180 180 Q180 140 220 140 L292 140 Q332 140 332 180 Q332 200 312 210 L220 230 Q180 240 180 280 Q180 320 220 320 L292 320 Q332 320 332 280" 
        stroke="white" stroke-width="24" fill="none" stroke-linecap="round"/>
  
  <!-- Tracking dots -->
  <circle cx="340" cy="300" r="12" fill="#22c55e"/>
  <circle cx="365" cy="315" r="8" fill="#22c55e" opacity="0.7"/>
  <circle cx="385" cy="325" r="6" fill="#22c55e" opacity="0.4"/>
</svg>
```

---

# QUALITY CHECKLIST

## Before Delivery:
- [ ] All dimensions exact to specifications
- [ ] Real data used throughout (no Lorem ipsum)
- [ ] SpendBot brand colors consistent
- [ ] Text readable at minimum sizes
- [ ] Screenshots show clear value propositions
- [ ] Icon recognizable at 48px
- [ ] All assets under file size limits
- [ ] Backgrounds complement, don't compete
- [ ] Would screenshot and share each asset? If not, iterate.

## Success Metrics:
- Looks like it belongs next to Mint and YNAB
- Users understand value in under 7 seconds
- Premium feel justifies paid app pricing
- Every asset drives toward download action