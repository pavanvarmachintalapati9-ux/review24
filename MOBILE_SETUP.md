# Review24 Mobile App - Quick Setup Guide

Convert your web app to Android/iOS mobile app and deploy to Play Store.

## 📱 What's Been Done

✅ Capacitor framework added  
✅ Android platform configured  
✅ Environment configuration setup  
✅ Mobile build scripts added  
✅ API configuration ready  

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd client
npm install
cd ../server
npm install
```

### 2. Start Backend Server
```bash
cd server
npm start
```

Server runs on: `http://localhost:5000`

### 3. Build Web Assets
```bash
cd client
npm run build
```

Output: `client/dist/`

### 4. Sync to Android
```bash
npm run sync:android
```

## 🏗️ Building APK for Testing

### Option A: Quick Debug Build (No Signing)
```bash
cd client
npm run build:apk
```

**Output:** `client/android/app/build/outputs/apk/debug/app-debug.apk`

**Use for:** Testing on emulator or device

### Option B: Test on Emulator
```bash
cd client
npm run sync:android
npx cap open android
```

Then in Android Studio:
- Click: Run > Run 'app'
- Select emulator
- App installs and runs

## 📦 Building for Play Store

### Step 1: Create Signing Key
```bash
cd client/android/app
keytool -genkey -v -keystore release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias review24
```

**Remember:** Save the password! (⚠️ Cannot recover if lost)

### Step 2: Configure Signing in Gradle
Edit `client/android/app/build.gradle`:

Find the `android {` block and add:

```gradle
android {
    signingConfigs {
        release {
            keyAlias 'review24'
            keyPassword 'YOUR_PASSWORD_HERE'
            storeFile file('release.keystore')
            storePassword 'YOUR_PASSWORD_HERE'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### Step 3: Build AAB for Play Store
```bash
cd client
npm run build:aab
```

**Output:** `client/android/app/build/outputs/bundle/release/app-release.aab`

This file is uploaded to Google Play Store.

## 🏪 Google Play Store Deployment

### Step 1: Create Account
1. Go to: https://play.google.com/console
2. Sign in with Google account
3. Pay ₹500 one-time fee (for India)
4. Complete identity verification

### Step 2: Create App
1. Click "Create app"
2. App name: **Review24**
3. Category: **Entertainment**
4. Click "Create"

### Step 3: Fill App Details
1. **Screenshots:** Add 2-8 screenshots (480x720 or 1440x2560)
2. **Icon:** Upload 512x512 PNG
3. **Short description:** Max 80 characters
4. **Full description:** Max 4000 characters
5. **Category:** Entertainment or Movies

### Step 4: Prepare Release
1. Go to: **Release > Production**
2. Click "Create release"
3. Upload AAB file (app-release.aab)
4. Add release notes
5. Click "Review release"

### Step 5: Content Rating
1. Go to: **App content > Content rating**
2. Answer the questionnaire
3. Submit

### Step 6: Set Pricing
1. Go to: **Setup > Pricing and distribution**
2. Select **Free**
3. Check **India** as target country
4. Accept Google Play policies
5. Click **Save**

### Step 7: Submit
1. Review all details
2. Click **Submit**
3. **Wait 2-4 hours** for Google review

## 🔄 Configuration for Production

### Backend Server

Deploy your backend to production:

**Popular options:**
- Render.com (free tier)
- Heroku
- AWS
- DigitalOcean

**Setup example (Render.com):**
1. Go to: https://render.com
2. Connect GitHub repo
3. Deploy `server` folder
4. Get production URL: `https://review24-api.render.com`

### Update Mobile App

Edit `client/.env.production`:
```
REACT_APP_API_URL=https://review24-api.render.com
REACT_APP_ENV=production
```

Rebuild:
```bash
cd client
npm run build:aab
```

## 📋 Deployment Checklist

- [ ] Backend deployed to production
- [ ] API URL configured in `.env.production`
- [ ] App tested on Android device/emulator
- [ ] Signing key generated (`release.keystore`)
- [ ] Gradle signing configured
- [ ] AAB built successfully
- [ ] Google Play Developer account created
- [ ] App listing completed
- [ ] Screenshots added
- [ ] Icon uploaded (512x512)
- [ ] Content rating submitted
- [ ] Pricing set to Free
- [ ] India selected as target country
- [ ] AAB uploaded to Play Store
- [ ] Submitted for review
- [ ] ✅ Live on Play Store!

## 🐛 Troubleshooting

### Build fails with "No Java"
```bash
# Set JAVA_HOME
export JAVA_HOME=/usr/libexec/java_home -v 11
```

### "Module not found" errors
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API connection issues
- Check `REACT_APP_API_URL` is correct
- Verify backend is running
- Check Android internet permission
- Check backend CORS settings

### Emulator won't run app
```bash
cd client
npm run sync:android
npx cap open android
# In Android Studio: Run > Run app
```

## 📚 File Structure

```
review24/
├── client/
│   ├── src/
│   │   ├── api.js                 # ← API configuration
│   │   ├── config.js              # ← App configuration
│   │   └── App.jsx
│   ├── android/                    # ← Android native code
│   │   └── app/build.gradle        # ← Signing config here
│   ├── capacitor.config.json       # ← Mobile app config
│   ├── .env.development            # ← Local API URL
│   ├── .env.production             # ← Production API URL
│   └── package.json                # ← Build scripts
├── server/
│   ├── src/index.js
│   └── package.json
├── MOBILE_DEPLOYMENT.md            # ← Detailed guide
└── MOBILE_SETUP.md                 # ← This file
```

## 🎯 Next Steps

1. **Deploy backend:**
   ```bash
   cd server
   # Deploy to Render.com or hosting service
   ```

2. **Update API URL:**
   ```bash
   # Edit client/.env.production with your server URL
   ```

3. **Build for Play Store:**
   ```bash
   cd client
   npm run build:aab
   ```

4. **Upload to Play Store:**
   - Go to: https://play.google.com/console
   - Upload AAB file
   - Submit for review
   - Wait for approval ✅

## 💡 Tips

- **Test first:** Always test on Android device before Play Store
- **Save signing key:** Backup `release.keystore` file safely
- **Update regularly:** Add new features by rebuilding APK/AAB
- **Monitor:** Use Google Play Console to track crashes and reviews

## ❓ Questions?

- Capacitor: https://capacitorjs.com/docs
- Android: https://developer.android.com
- Play Store: https://support.google.com/googleplay
- Render: https://render.com/docs

---

**Ready to deploy?** Follow the checklist above and you'll have your app on Play Store! 🎉
