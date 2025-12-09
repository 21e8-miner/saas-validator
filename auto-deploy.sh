#!/bin/bash

# 🚀 AUTO-DEPLOY SCRIPT - SaaS Validator
# This script automates the entire deployment process

set -e  # Exit on error

echo "🚀 SaaS Validator - Automated Deployment"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: Must run from saas-validator directory"
    exit 1
fi

# 1. Install dependencies
print_status "Installing dependencies..."
npm install > /dev/null 2>&1
print_success "Dependencies installed"

# 2. Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_status "Installing Vercel CLI..."
    npm install -g vercel
    print_success "Vercel CLI installed"
else
    print_success "Vercel CLI already installed"
fi

# 3. Build/prepare assets
print_status "Preparing assets..."
# Create necessary directories
mkdir -p assets/icons assets/marketing assets/screenshots
print_success "Asset directories created"

# 4. Commit latest changes to git
print_status "Committing latest changes..."
git add .
git commit -m "Auto-deploy: $(date +%Y-%m-%d-%H%M%S)" || echo "No changes to commit"
print_success "Git commit complete"

# 5. Deploy to Vercel
print_status "Deploying to Vercel..."
echo ""
echo "⚡ Starting Vercel deployment..."
echo "   You may need to login if this is your first time"
echo ""

# Deploy to production
vercel --prod

echo ""
print_success "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Your SaaS Validator is now LIVE! 🚀"
echo ""
echo "Next steps:"
echo "  1. Visit your URL and test the app"
echo "  2. Add custom domain in Vercel dashboard"
echo "  3. Set up Stripe for payments"
echo "  4. Configure analytics"
echo "  5. Launch on Product Hunt!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
