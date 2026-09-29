# Review24 - Mobile App Deployment Guide

This guide explains how to build and deploy Review24 as an Android/iOS mobile app using Capacitor.

## Prerequisites

### Required Software
- Node.js 16+ 
- npm or yarn
- Java Development Kit (JDK) 11 or higher
- Android Studio (for Android builds)
- Xcode (for iOS builds - Mac only)

### Installation

1. **Install JDK:**
   - Download from: https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html
   - Or: `brew install openjdk@11` (on Mac)

2. **Install Android Studio:**
   - Download from: https://developer.android.com/studio
   - Complete the setup wizard
   - Create/update Android Virtual Device (AVD)

3. **Set JAVA_HOME environment variable:**
   ```bash
   export JAVA_HOME=/path/to/jdk
   export PATH=$JAVA_HOME/bin:$PATH
   ```

## Project Structure

```
review24/
├── client/               # React web app (converted to mobile)
│   ├── src/
│   ├── android/          # Android native project
│   ├── capacitor.config.json
│   └── package.json
├── server/              # Node.js backend
└── MOBILE_DEPLOYMENT.md
```

## Building for Android

### Step 1: Build the Web Assets
```bash
cd client
npm run build
```

This creates optimized production build in `dist/` folder.

### Step 2: Sync with Android
```bash
npm run sync:android
```

This copies the web assets to the Android project.

### Step 3: Build APK (for testing)
```bash
npm run build:apk
```

Creates: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 4: Build AAB (for Play Store)
```bash
npm run build:aab
```

Creates: `android/app/build/outputs/bundle/release/app-release.aab`

## Configuration

### API Server Configuration

1. **Development (Local):**
   - `.env.development` uses `http://localhost:5000`
   - Run server: `cd server && npm start`

2. **Production:**
   - Edit `.env.production`
   - Set your production server URL:
     ```
     REACT_APP_API_URL=https://api.yourdomain.com
     ```

### Android Configuration

Edit `capacitor.config.json` to customize:
```json
{
  "appId": "com.moviereview.review24",
  "appName": "Review24",
  "webDir": "dist",
  "server": {
    "androidScheme": "https"
  }
}
```

### App Signing Key

For Play Store, you need a signed APK:

1. **Generate signing key (one-time):**
   ```bash
   cd android/app
   keytool -genkey -v -keystore release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias review24
   ```

2. **Configure Gradle signing:**
   Edit `android/app/build.gradle`:
   ```gradle
   android {
       signingConfigs {
           release {
               keyAlias 'review24'
               keyPassword 'YOUR_PASSWORD'
               storeFile file('release.keystore')
               storePassword 'YOUR_PASSWORD'
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
           }
       }
   }
   ```

3. **Build signed AAB:**
   ```bash
   npm run build:aab
   ```

## Testing on Device

### Option 1: Using Android Emulator
```bash
# Open Android Studio and create Virtual Device
# Then:
npx cap open android
# Click Run > Run 'app'
```

### Option 2: Using Physical Device
1. Enable USB Debugging on your Android phone
2. Connect via USB
3. Run: `npx cap open android`
4. Click Run > Run 'app'

## Deploying to Google Play Store

### Step 1: Create Developer Account
- Go to: https://play.google.com/console
- Pay one-time fee: ₹500 (for India)
- Verify your identity

### Step 2: Create App
1. Click "Create app"
2. Enter app details:
   - App name: Review24
   - Choose type: App
   - Default language: English
   - Category: Entertainment / Movies
3. Fill out app store listing

### Step 3: Upload Build
1. Go to **Release > Production**
2. Click "Create release"
3. Upload AAB file from `android/app/build/outputs/bundle/release/app-release.aab`
4. Fill release notes

### Step 4: Set up App Details
1. **App details:**
   - Description
   - Short description
   - Screenshots (min 2, max 8)
   - Feature graphic (1024x500)
   - Icon (512x512)

2. **Content rating:**
   - Fill questionnaire

3. **Pricing & distribution:**
   - Free or paid
   - Select India as target country
   - Accept agreements

### Step 5: Submit for Review
- Click "Submit"
- Google reviews (usually 2-4 hours)
- App goes live on Play Store

## Production Deployment Checklist

- [ ] Backend server deployed to production
- [ ] API URL configured in `.env.production`
- [ ] Build tested on Android emulator
- [ ] Build tested on physical device
- [ ] Signing key generated and secured
- [ ] Privacy policy written and hosted
- [ ] Screenshots prepared (480x720 or 1440x2560)
- [ ] App icon prepared (512x512 PNG)
- [ ] Google Play Developer account created
- [ ] App listing completed
- [ ] Content rating submitted
- [ ] AAB uploaded to Play Store
- [ ] Release notes added
- [ ] Submitted for review

## Troubleshooting

### Build Issues
```bash
# Clean build
cd android
./gradlew clean
cd ..
npm run build:aab

# Clear Gradle cache
rm -rf ~/.gradle/caches/*
```

### API Connection Issues
- Verify `REACT_APP_API_URL` is correct
- Check backend server is running/deployed
- Check CORS settings on backend
- Check network permissions in `android/app/src/main/AndroidManifest.xml`

### Debug APK on Device
```bash
npx cap open android
# In Android Studio: Run > Run 'app'
```

## After Deployment

1. **Monitor app performance:** Google Play Console > Vitals
2. **Fix reported bugs:** Submit updates via Play Store
3. **Update app:** Increment version in `package.json` and repeat build process
4. **Keep server updated:** Ensure backend stays compatible

## Support & Resources

- Capacitor Docs: https://capacitorjs.com/docs
- Android Studio: https://developer.android.com/studio
- Google Play Console: https://play.google.com/console
- Capacitor Android Guide: https://capacitorjs.com/docs/android

## Building for iOS (Optional)

If you want to support iPhone:

1. **Add iOS platform (Mac only):**
   ```bash
   npm install @capacitor/ios
   npx cap add ios
   ```

2. **Build for iOS:**
   ```bash
   npm run build
   npx cap copy ios
   npx cap open ios
   ```

3. **Submit to App Store:**
   - Follow similar process as Google Play
   - Requires Apple Developer account ($99/year)
   - Use Xcode for building

---

**Questions?** Check the Capacitor documentation or Android Studio documentation.
