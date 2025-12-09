#!/bin/bash

# 📱 AUTO-IOS SCRIPT (Cloud-Aware)
# This script automates iOS app creation, falling back to Cloud Build if Xcode is missing

set -e

echo "📱 SaaS Validator - Automated iOS App Setup"
echo "============================================="
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 1. CHECK XCODE STATUS
print_status() { echo -e "${BLUE}==>${NC} $1"; }
print_status "Checking build environment..."

# Check active developer directory
current_path=$(xcode-select -p)

# DETECT MISSING XCODE
if [[ "$current_path" == *"/Library/Developer/CommandLineTools"* ]]; then
    echo -e "${YELLOW}⚠ Full Xcode not found (using Command Line Tools)${NC}"
    echo ""
    echo "Local build is impossible without the 12GB Xcode app."
    echo "But don't worry! I have prepared a CLOUD BUILD pipeline for you."
    echo ""
    echo "Instead of building here, we will push code to GitHub,"
    echo "and GitHub's servers will build the iOS app for us."
    echo ""
    
    read -p "🚀 Push to GitHub to start Cloud Build? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Pushing to GitHub..."
        git add .
        git commit -m "☁️ Trigger Cloud Build" 2>/dev/null || true
        
        # Check if remote exists
        if git remote get-url origin > /dev/null 2>&1; then
            git push
            echo ""
            echo -e "${GREEN}✓ Code pushed! Cloud build starting...${NC}"
            echo "Visit your GitHub repository 'Actions' tab to download your App."
        else
            echo -e "${RED}Error: No GitHub remote found.${NC}"
            echo "Run this to link your repo:"
            echo "  git remote add origin https://github.com/YOUR_USERNAME/saas-validator.git"
            echo "  git push -u origin main"
        fi
    fi
    exit 0
fi

# ... Original verify logic for users WHO HAVE Xcode ...
if ! command -v xcodebuild &> /dev/null; then
    echo "Xcode not found."
    exit 1
fi

print_status "Installing Capacitor..."
npm install >/dev/null 2>&1
npm install @capacitor/core @capacitor/cli @capacitor/ios --save >/dev/null 2>&1

print_status "Initializing iOS project..."
# Initialize if needed
if [ ! -f "capacitor.config.json" ]; then
    npx cap init "SaaS Validator" "com.saasvalidator.app" --web-dir www
fi

# Build www folder
print_status "Building web assets..."
rm -rf www
mkdir -p www
cp index.html style.css script.js auth.html auth.js pricing.html pricing.js www/
cp -r assets www/ 2>/dev/null || true

# Add/Sync iOS
print_status "Syncing to iOS..."
if [ ! -d "ios" ]; then
    npx cap add ios
fi
npx cap sync ios

echo ""
echo -e "${GREEN}✓ iOS Project Ready (Local)${NC}"
echo "Opening Xcode..."
npx cap open ios
