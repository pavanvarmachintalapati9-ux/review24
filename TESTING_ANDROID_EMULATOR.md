# Testing Review24 on Android Emulator - Complete Guide

This guide will help you test the Review24 app on an Android emulator on your local machine.

## 📋 Prerequisites

You need the following installed on your computer:

### 1. Java Development Kit (JDK) 11+
**Mac:**
```bash
brew install openjdk@11
```

**Windows:**
- Download from: https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html
- Run installer

**Linux:**
```bash
sudo apt-get install openjdk-11-jdk
```

### 2. Android Studio
- Download from: https://developer.android.com/studio
- Run installer
- Complete setup wizard

### 3. Set JAVA_HOME Environment Variable

**Mac/Linux:**
```bash
# Add to ~/.bashrc or ~/.zshrc
export JAVA_HOME=$(/usr/libexec/java_home -v 11)
export PATH=$JAVA_HOME/bin:$PATH

# Then:
source ~/.bashrc  # or ~/.zshrc
```

**Windows:**
1. Right-click "This PC" → Properties
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Add new variable:
   - Name: `JAVA_HOME`
   - Value: `C:\Program Files\Java\jdk-11.0.x` (adjust version)

## 🎬 Setup Android Emulator

### Step 1: Open Android Studio
```bash
# Mac
open /Applications/Android\ Studio.app

# Windows/Linux
# Click Android Studio icon
```

### Step 2: Create Virtual Device
1. Welcome screen → "More Options" → "Virtual Device Manager"
2. Click "Create device"
3. Select: **Pixel 4** (or any Pixel device)
4. Click "Next"
5. Select **API Level 33** or higher (recommended)
6. Click "Next"
7. Name it: `Review24_Emulator`
8. Click "Finish"

### Step 3: Start the Emulator
1. In Virtual Device Manager, click **Play** button next to your device
2. Wait for emulator to fully start (2-3 minutes)
3. You should see Android home screen

## 🏗️ Build and Test the App

### Option A: Using Command Line (Fastest)

**1. Clone/pull latest code:**
```bash
cd /path/to/review24
git pull origin claude/movie-review-app-ai-qk2are
```

**2. Install dependencies:**
```bash
cd client
npm install
```

**3. Set Android SDK location:**

**Mac/Linux:**
```bash
# Create local.properties
cat > android/local.properties << EOF
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
EOF

# Or if installed elsewhere:
# Find SDK location: Android Studio > Preferences > Appearance & Behavior > System Settings > Android SDK
```

**Windows:**
```bash
echo sdk.dir=C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk > android\local.properties
```

**4. Build for emulator:**
```bash
npm run build:apk
```

Expected output:
```
✓ built in X.XXs
✔ Copying web assets from dist to android/app/src/main/assets/public
✔ Creating capacitor.config.json
```

**5. Install on emulator:**
```bash
# Make sure emulator is running, then:
cd android
./gradlew installDebug
```

Or using ADB directly:
```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

**6. Run the app:**
```bash
adb shell am start -n com.moviereview.review24/.MainActivity
```

### Option B: Using Android Studio (Visual)

**1. Open project in Android Studio:**
```bash
cd /path/to/review24/client
npx cap open android
```

**2. Build:**
- Menu: Build > Build Bundle(s) / APK(s) > Build APK(s)
- Wait for build to complete

**3. Run:**
- Menu: Run > Run 'app'
- Select your emulator
- Click OK

**4. Monitor logs:**
- View > Tool Windows > Logcat
- Filter by: `Review24` or `Capacitor`

## ✅ Testing Checklist

### App Launch
- [ ] App opens without crashing
- [ ] Logo and UI visible
- [ ] No error messages in logcat

### Login
- [ ] Login form appears
- [ ] Can enter phone number
- [ ] OTP verification works (use test code)
- [ ] Login successful

### Home Screen
- [ ] Movie carousel loads
- [ ] Popcorn grid displays movies
- [ ] Movie images load
- [ ] Like/dislike buttons work
- [ ] Ratings display

### Movie Details
- [ ] Click movie opens modal
- [ ] All movie details visible
- [ ] Comments section loads
- [ ] Can add comment
- [ ] Can add reply to comment
- [ ] Ratings work
- [ ] Like/dislike updates

### Menu
- [ ] Click hamburger menu
- [ ] Menu opens
- [ ] Click outside menu closes it
- [ ] Language filter works
- [ ] Genre filter works
- [ ] "Upcoming Releases" option works

### Search
- [ ] Type in search box
- [ ] Carousel hides when searching
- [ ] Movies filter by search
- [ ] Clear search shows carousel again

### Admin Features (if logged in as admin)
- [ ] Upload button visible
- [ ] Can upload new movie
- [ ] Movie appears in list
- [ ] Delete button appears on movie
- [ ] Can delete movie
- [ ] Movie removed immediately

## 🔧 Troubleshooting

### App Won't Install
```bash
# Clear previous installation
adb uninstall com.moviereview.review24

# Rebuild and install
npm run build:apk
adb install app/build/outputs/apk/debug/app-debug.apk
```

### Emulator Won't Start
```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd Review24_Emulator

# Or from Android Studio: Virtual Device Manager > Play button
```

### App Crashes on Launch
```bash
# Check logs
adb logcat | grep -i "review24\|capacitor\|error"

# Common fixes:
# 1. Clear app data:
adb shell pm clear com.moviereview.review24

# 2. Reinstall:
adb uninstall com.moviereview.review24
npm run build:apk
adb install app/build/outputs/apk/debug/app-debug.apk
```

### Can't Connect to Backend
```bash
# Check if backend is running
curl http://localhost:5000/api/movies

# If not, start backend:
cd server
npm start

# On emulator, localhost is the host machine:
# API should call: http://10.0.2.2:5000 (not localhost:5000)

# Update in client/src/config.js if needed:
# const API_URL = 'http://10.0.2.2:5000';
```

### Build Fails
```bash
# Clean build
cd android
./gradlew clean

# Update gradle
cd ..
npm run build:apk
```

## 📱 Useful ADB Commands

```bash
# List connected devices
adb devices

# Install app
adb install path/to/app-debug.apk

# Uninstall app
adb uninstall com.moviereview.review24

# View logs
adb logcat

# Clear logs
adb logcat -c

# Push file to device
adb push localfile /sdcard/

# Pull file from device
adb pull /sdcard/file localfile

# Take screenshot
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png

# Record video (30 sec)
adb shell screenrecord --time-limit=30 /sdcard/video.mp4
adb pull /sdcard/video.mp4
```

## 🚀 Testing on Real Device (Optional)

If you want to test on an actual Android phone:

1. **Enable USB Debugging:**
   - Settings > About phone > Build number (tap 7 times)
   - Settings > Developer options > USB Debugging (ON)

2. **Connect via USB:**
   ```bash
   # Verify connection
   adb devices
   # Should show your device
   ```

3. **Install app:**
   ```bash
   npm run build:apk
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

4. **Run on device:**
   - Same commands as emulator
   - App appears in app drawer with icon

## 📊 Performance Testing

### Check memory usage:
```bash
adb shell dumpsys meminfo | grep TOTAL
```

### Check CPU usage:
```bash
adb shell top
```

### Monitor network:
```bash
adb shell tcpdump -i any -n -s 0 -w - | grep -v "DHCP\|multicast"
```

## 🎯 Next Steps After Testing

1. **If app works:**
   - ✅ Ready for Play Store deployment
   - Follow MOBILE_DEPLOYMENT.md

2. **If app has issues:**
   - Check logcat for error messages
   - Look at network requests (backend must be running)
   - Verify API URL in config.js

3. **Performance optimizations:**
   - Profile with Android Studio Profiler
   - Check bundle size
   - Monitor memory leaks

## 📚 Additional Resources

- Capacitor Android: https://capacitorjs.com/docs/android
- Android Studio: https://developer.android.com/studio/intro
- ADB Guide: https://developer.android.com/studio/command-line/adb
- Gradle: https://gradle.org/

## 💡 Tips

- **Keep emulator running** during development - starts faster second time
- **Use breakpoints** in Android Studio to debug
- **Check logcat** first when app crashes
- **Test on different API levels** - some features need specific versions
- **Clear cache** if app behaves unexpectedly: `adb shell pm clear com.moviereview.review24`

---

**Ready to test?** Follow the steps above on your local machine and your app will be running on Android! 🚀

If you have any issues, check the Troubleshooting section or enable logcat to see detailed error messages.
