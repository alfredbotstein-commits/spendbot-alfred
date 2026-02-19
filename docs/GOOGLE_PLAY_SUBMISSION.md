# SpendBot — Google Play Store Submission Guide

## App Metadata

### App Title
**SpendBot — Smart Expense Tracker**

### Short Description (80 chars max)
Track spending, crush budgets & build better money habits with your AI buddy.

### Full Description (4000 chars max)
SpendBot is the expense tracker that actually makes managing money fun. No boring spreadsheets. No complicated setups. Just tap, track, and watch your spending habits transform.

**🤖 Meet Your Money Buddy**
SpendBot's friendly robot companion keeps you motivated with personalized roasts, challenges, and celebrations. It's like having a financially savvy friend in your pocket.

**💰 Effortless Expense Tracking**
Add expenses in seconds with the quick-add number pad. Categorize spending automatically and see where every dollar goes.

**📊 Beautiful Insights**
Gorgeous charts and spending breakdowns show your money patterns at a glance. Daily, weekly, and monthly views help you spot trends before they become problems.

**📅 Calendar View**
See your spending history on a visual calendar. Tap any day to see exactly what you spent and where.

**🏆 Spending Challenges**
Gamify your savings with daily challenges and no-spend streaks. Earn achievements and celebrate milestones.

**🔮 Smart Predictions**
SpendBot learns your patterns and predicts future spending so you can plan ahead and avoid budget surprises.

**😎 Spending Personality**
Discover your unique spending personality type based on your real habits.

**🎯 Budget Health Score**
Get a clear picture of your financial health with an easy-to-understand score that updates as you track.

**✨ Premium Features**
- Advanced insights & spending predictions
- Weekly reports with actionable advice
- Unlimited history & categories
- Financial fortune readings
- Mood tracking with spending correlation

**Privacy First**
Your financial data stays on YOUR device. We don't sell your data. Ever.

Download SpendBot today and start building better money habits — one expense at a time.

### Category
**Finance** (Primary)

### Content Rating
- **IARC:** Everyone / PEGI 3
- No violence, no sexual content, no gambling, no substances
- Contains: in-app purchases (subscription)
- No user-generated content
- Does not share location data
- Digital purchases only (no real-world goods)

### Tags/Keywords
expense tracker, budget planner, money manager, spending tracker, personal finance, budget tracker, money habits, financial health, spending insights

---

## Technical Details

### Package Name
`com.loopspur.spendbot`

### Version
- **versionCode:** 1
- **versionName:** 1.0

### Minimum SDK
Android 7.0 (API 24)

### Target SDK
Android 16 (API 36)

### Signing
- **Keystore:** `android/spendbot-release.keystore`
- **Key alias:** `spendbot`
- **Credentials:** See `~/clawd/.secrets/spendbot_keystore.json`
- **Signed AAB:** `android/app/build/outputs/bundle/release/app-release.aab` (3.4 MB)
- **Signed APK:** `android/app/build/outputs/apk/release/app-release.apk` (3.5 MB)

### Build Commands
```bash
# Prerequisites
export JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"
export ANDROID_HOME=$HOME/Library/Android/sdk

# Build web assets + sync
cd ~/clawd/spendbot
npm run build
npx cap sync android

# Build signed AAB (for Google Play)
cd android
./gradlew bundleRelease

# Build signed APK (for testing)
./gradlew assembleRelease
```

---

## Screenshots Needed

Google Play requires:
- **Phone:** Min 2, max 8 screenshots (16:9 or 9:16, min 320px, max 3840px)
- **Tablet (7"):** Optional but recommended
- **Tablet (10"):** Optional but recommended

### Recommended Screenshot List
1. **Onboarding** — Welcome screen with robot buddy
2. **Dashboard** — Main spending overview with budget health
3. **Add Expense** — Quick-add number pad in action
4. **Calendar View** — Monthly calendar with spending dots
5. **Insights** — Charts and spending breakdown
6. **Spending Challenges** — Gamification / achievements
7. **History** — Expense list with categories
8. **Settings / Premium** — Premium features showcase

### Feature Graphic
- Required: 1024 x 500 px
- Should show app brand + robot buddy + key value prop

### App Icon
- 512 x 512 px, 32-bit PNG
- Already configured in Android project (`@mipmap/ic_launcher`)

---

## Privacy & Legal

### Privacy Policy URL
**Required** — needs to be live before submission
- Suggested: `https://spendbot.app/privacy` or Netlify-hosted page
- App stores data on-device (Dexie/IndexedDB)
- Supabase used for auth and premium features only

### Data Safety Section
- **Data collected:** Email (for account/auth), purchase history (for subscriptions)
- **Data shared:** None
- **Security:** Data encrypted in transit
- **Deletion:** Users can delete account from Settings

---

## Pre-Submission Checklist

- [x] Web app builds cleanly (`npm run build`)
- [x] Capacitor sync works (`npx cap sync android`)
- [x] Gradle assembleRelease builds (signed APK)
- [x] Gradle bundleRelease builds (signed AAB)
- [x] Keystore created and credentials documented
- [ ] App tested on real Android device / emulator
- [ ] App icon verified at all sizes
- [ ] Screenshots captured
- [ ] Feature graphic designed
- [ ] Privacy policy URL live
- [ ] Google Play Developer account ready (Account ID: 7544306294964309727)
- [ ] In-app purchase products configured in Play Console
- [ ] Content rating questionnaire completed in Play Console
- [ ] App uploaded to internal testing track first

---

## Notes

- Google Play requires AAB format (not APK) for new app submissions
- Enable Google Play App Signing (recommended) — Google manages the signing key, you keep the upload key
- Start with Internal Testing track before Production release
- Review typically takes 1-3 days for new apps
