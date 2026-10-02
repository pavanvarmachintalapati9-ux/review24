#!/bin/bash

# Review24 - Quick Test on Android Emulator Script
# This script automates the build and test process

set -e

echo "🚀 Review24 Android Emulator Testing Script"
echo "==========================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running from project root
if [ ! -f "package.json" ] || [ ! -d "client" ] || [ ! -d "server" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Step 1: Check dependencies
echo -e "\n${BLUE}Step 1: Checking dependencies...${NC}"

if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Install JDK 11+ first"
    exit 1
fi
echo -e "${GREEN}✓ Java found${NC}"

if ! command -v adb &> /dev/null; then
    echo "❌ ADB not found. Install Android Studio first"
    exit 1
fi
echo -e "${GREEN}✓ ADB found${NC}"

# Check if emulator is running
if ! adb devices | grep -q "emulator"; then
    echo -e "${YELLOW}⚠ No emulator running. Starting one...${NC}"
    echo "Please start emulator from Android Studio or run:"
    echo "  emulator -avd Review24_Emulator &"
    exit 1
fi
echo -e "${GREEN}✓ Emulator running${NC}"

# Step 2: Start backend server (optional)
echo -e "\n${BLUE}Step 2: Backend Server${NC}"
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${GREEN}✓ Backend server already running on port 5000${NC}"
else
    echo -e "${YELLOW}⚠ Backend not running on port 5000${NC}"
    echo "Optional: Start it with:"
    echo "  cd server && npm start &"
fi

# Step 3: Build web assets
echo -e "\n${BLUE}Step 3: Building web assets...${NC}"
cd client
npm run build > /dev/null 2>&1
echo -e "${GREEN}✓ Web assets built${NC}"

# Step 4: Sync to Android
echo -e "\n${BLUE}Step 4: Syncing to Android...${NC}"
npx cap copy android > /dev/null 2>&1
echo -e "${GREEN}✓ Synced to Android${NC}"

# Step 5: Configure Android SDK (if local.properties doesn't exist)
if [ ! -f "android/local.properties" ]; then
    echo -e "\n${BLUE}Step 5: Configuring Android SDK...${NC}"

    # Try to find SDK location
    if [ -d "$ANDROID_HOME" ]; then
        SDK_PATH="$ANDROID_HOME"
    elif [ -d "$HOME/Library/Android/sdk" ]; then
        SDK_PATH="$HOME/Library/Android/sdk"
    elif [ -d "$HOME/AppData/Local/Android/Sdk" ]; then
        SDK_PATH="$HOME/AppData/Local/Android/Sdk"
    else
        echo -e "${YELLOW}⚠ Android SDK not found automatically${NC}"
        echo "Create android/local.properties manually:"
        echo "  sdk.dir=/path/to/android/sdk"
        exit 1
    fi

    echo "sdk.dir=$SDK_PATH" > android/local.properties
    echo -e "${GREEN}✓ Android SDK configured${NC}"
fi

# Step 6: Build APK
echo -e "\n${BLUE}Step 6: Building APK...${NC}"
cd android
./gradlew assembleDebug > /dev/null 2>&1
APK_PATH="app/build/outputs/apk/debug/app-debug.apk"

if [ -f "$APK_PATH" ]; then
    echo -e "${GREEN}✓ APK built: $APK_PATH${NC}"
else
    echo -e "❌ APK build failed"
    exit 1
fi

# Step 7: Install on emulator
echo -e "\n${BLUE}Step 7: Installing on emulator...${NC}"
cd ../..
adb uninstall com.moviereview.review24 2>/dev/null || true
adb install client/android/app/build/outputs/apk/debug/app-debug.apk > /dev/null 2>&1
echo -e "${GREEN}✓ App installed${NC}"

# Step 8: Launch app
echo -e "\n${BLUE}Step 8: Launching app...${NC}"
adb shell am start -n com.moviereview.review24/.MainActivity > /dev/null 2>&1
echo -e "${GREEN}✓ App launched${NC}"

# Step 9: Show live logs
echo -e "\n${BLUE}Showing app logs (Ctrl+C to stop):${NC}"
sleep 2
adb logcat | grep -i "review24\|capacitor\|error\|warning" &
LOGCAT_PID=$!

echo -e "\n${GREEN}==========================================="
echo "✅ App is running on emulator!"
echo "==========================================="
echo ""
echo "📱 To stop logs, press Ctrl+C"
echo "📊 View full logs: adb logcat"
echo "🔄 To reinstall: adb install client/android/app/build/outputs/apk/debug/app-debug.apk"
echo "🔌 To uninstall: adb uninstall com.moviereview.review24"
echo ""

wait $LOGCAT_PID 2>/dev/null || true
