#!/bin/bash

# 🍎 AUTO-SUBMIT TO APP STORE (Robust V5)
# Wrapper for Fastlane deployment

set -e

echo "🍎 SaaS Validator - App Store Submission"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 1. CHECK XCODE PATH (Crucial Fix)
# The user's system often defaults to CommandLineTools which breaks xcodebuild
expected_path="/Applications/Xcode.app/Contents/Developer"
current_path=$(xcode-select -p)

if [[ "$current_path" != *"/Applications/Xcode.app"* ]]; then
    echo -e "${RED}Error: Your Xcode path is incorrect.${NC}"
    echo "Current: $current_path"
    echo "Required: $expected_path"
    echo ""
    echo -e "${YELLOW}Please run this command in a new terminal window to fix it:${NC}"
    echo ""
    echo "    sudo xcode-select -s /Applications/Xcode.app/Contents/Developer"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# 2. PREPARE WEB ASSETS
echo "Preparing web assets..."
rm -rf www
mkdir -p www
cp index.html style.css script.js auth.html auth.js pricing.html pricing.js www/
cp -r assets www/ 2>/dev/null || true

# 3. CHECK FOR IOS PROJECT
if [ ! -d "ios/App/App.xcodeproj" ]; then
    echo -e "${YELLOW}iOS project missing. Generating...${NC}"
    
    # Ensure plugins are installed
    npm install @capacitor/ios @capacitor/cli
    
    # Create iOS project
    npx cap add ios
    
    echo -e "${GREEN}✓ iOS project generated!${NC}"
fi

# 4. SYNC ASSETS
echo "Syncing latest changes to iOS..."
npx cap sync ios

# 5. CREDENTIALS CHECK
if grep -q "YOUR_APPLE_ID_EMAIL" fastlane/Appfile; then
    echo -e "${YELLOW}Configuring credentials...${NC}"
    echo "Please enter your Apple ID email:"
    read apple_id
    echo "Press Enter to skip Team ID:"
    read team_id
    
    if [ -n "$apple_id" ]; then
        sed -i '' "s|YOUR_APPLE_ID_EMAIL|$apple_id|" fastlane/Appfile
        if [ -n "$team_id" ]; then
            sed -i '' "s|YOUR_ITC_TEAM_ID|$team_id|" fastlane/Appfile
            sed -i '' "s|YOUR_TEAM_ID|$team_id|" fastlane/Appfile
        fi
    fi
fi

# 6. CLEAN GIT STATE
if [[ -n $(git status --porcelain) ]]; then
    echo "Committing final changes..."
    git add .
    git commit -m "🍎 Ready for takeoff" || echo "Clean"
fi

# 7. LAUNCH FASTLANE
echo ""
echo -e "${BLUE}🚀 Launching Fastlane release pipeline...${NC}"
fastlane ios release
