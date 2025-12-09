#!/bin/bash

# 🍎 AUTO-SUBMIT TO APP STORE
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
    echo "  OR"
    echo "  sudo gem install fastlane"
    exit 1
fi

# Check for credentials
if grep -q "YOUR_APPLE_ID_EMAIL" fastlane/Appfile; then
    echo -e "${YELLOW}Warning: Fastlane is not configured.${NC}"
    echo "Please edit 'fastlane/Appfile' with your Apple ID and Team IDs."
    
    # Attempt to prompt user
    read -p "Enter your Apple ID email: " apple_id
    if [ -n "$apple_id" ]; then
        sed -i '' "s/YOUR_APPLE_ID_EMAIL/$apple_id/" fastlane/Appfile
        echo -e "${GREEN}Updated Appfile with $apple_id${NC}"
    else
        echo "Aborted."
        exit 1
    fi
fi

# Run Fastlane
echo -e "${BLUE}Starting Fastlane deployment...${NC}"
echo "You may be asked for your Apple ID password and 2FA code."
echo ""

fastlane ios release

echo ""
echo -e "${GREEN}🎉 Deployment pipeline completed!${NC}"
