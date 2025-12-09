#!/bin/bash

# 📱 AUTO-IOS SCRIPT - SaaS Validator
# This script automates iOS app creation as much as possible

set -e

echo "📱 SaaS Validator - Automated iOS App Setup"
echo "============================================="
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check requirements
print_status "Checking requirements..."

# Check macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    print_error "This script requires macOS to build iOS apps"
    exit 1
fi
print_success "Running on macOS"

# Check Xcode
if ! command -v xcodebuild &> /dev/null; then
    print_warning "Xcode not found. Please install from App Store"
    echo "  Download: https://apps.apple.com/app/xcode/id497799835"
    exit 1
fi
print_success "Xcode installed"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Must run from saas-validator directory"
    exit 1
fi

# 1. Install Capacitor dependencies
print_status "Installing Capacitor..."
npm install @capacitor/core@latest @capacitor/cli@latest @capacitor/ios@latest --save

print_success "Capacitor installed"

# 2. Initialize Capacitor (if not already done)
if [ ! -f "capacitor.config.json" ]; then
    print_status "Initializing Capacitor..."
    npx cap init "SaaS Validator" "com.saasvalidator.app" --web-dir .
else
    print_success "Capacitor already initialized"
fi

# 3. Add iOS platform
print_status "Adding iOS platform..."
if [ ! -d "ios" ]; then
    npx cap add ios
    print_success "iOS platform added"
else
    print_success "iOS platform already exists"
fi

# 4. Sync web assets to iOS
print_status "Syncing web assets to iOS..."
npx cap sync ios
print_success "Assets synced"

# 5. Copy app icon if it exists
if [ -f "assets/icons/app-icon-1024.png" ]; then
    print_status "App icon found, manual installation required in Xcode"
    print_warning "Copy assets/icons/app-icon-1024.png to Xcode Assets folder"
fi

# 6. Open Xcode
print_status "Opening project in Xcode..."
npx cap open ios

echo ""
print_success "🎉 iOS PROJECT READY!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps in Xcode:"
echo ""
echo "  1. Select your Team (Apple Developer account)"
echo "  2. Set Bundle Identifier: com.saasvalidator.app"
echo "  3. Add app icons to Assets.xcassets"
echo "  4. Build → Archive"
echo "  5. Distribute to App Store"
echo ""
echo "See APP_STORE_GUIDE.md for detailed instructions"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
