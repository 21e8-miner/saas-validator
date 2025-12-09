#!/bin/bash

# 🍎 AUTO-SUBMIT TO APP STORE (Improved v3)
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

# Check if Fastlane is installed
if ! command -v fastlane &> /dev/null; then
    echo -e "${RED}Error: Fastlane is not installed.${NC}"
    echo "Please install it with:"
    echo "  brew install fastlane"
    exit 1
fi

# Check for credentials in Appfile
if grep -q "YOUR_APPLE_ID_EMAIL" fastlane/Appfile; then
    echo -e "${YELLOW}First time setup: configuring credentials...${NC}"
    echo ""
    
    # 1. Apple ID
    echo "Please enter your Apple ID email (e.g. yourname@icloud.com):"
    read apple_id
    
    # 2. Team ID (Optional)
    echo ""
    echo "Tip: You can find your Team ID at https://developer.apple.com/account"
    echo "Press Enter to skip if you don't know it (Fastlane might find it auto-magically)."
    read team_id
    
    if [ -n "$apple_id" ]; then
        # Use | as delimiter to avoid issues with / in input
        sed -i '' "s|YOUR_APPLE_ID_EMAIL|$apple_id|" fastlane/Appfile
        
        # Replace Team ID
        if [ -n "$team_id" ]; then
            sed -i '' "s|YOUR_ITC_TEAM_ID|$team_id|" fastlane/Appfile
            sed -i '' "s|YOUR_TEAM_ID|$team_id|" fastlane/Appfile
        fi
        
        echo -e "${GREEN}✓ Appfile updated!${NC}"
    else
        echo "Aborted."
        exit 1
    fi
fi

# AUTO-FIX: Commit changes so Fastlane doesn't complain about dirty git status
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${YELLOW}Committing configuration changes to satisfy Fastlane...${NC}"
    git add fastlane/Appfile auto-submit-appstore.sh
    git commit -m "🍎 Configure App Store credentials" || echo "Nothing to commit"
fi

# Run Fastlane
echo ""
echo -e "${BLUE}Starting Fastlane deployment...${NC}"
echo "You may be asked for:"
echo "1. Your Apple ID Password"
echo "2. A 6-digit 2FA code"
echo ""

fastlane ios release

echo ""
echo -e "${GREEN}🎉 Deployment pipeline completed!${NC}"
