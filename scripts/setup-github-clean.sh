#!/bin/bash
# setup-github-clean.sh - Clean setup for GitHub remote with fresh history
# This script blows away existing GitHub history and creates a clean baseline

set -e  # Exit on any error

echo "🧨 CLEAN SETUP - This will replace GitHub remote history!"
echo ""
echo "⚠️  WARNING: This will:"
echo "   - Abort any current merge"
echo "   - Reset github branch to main branch state"
echo "   - Remove private files"
echo "   - Force push to GitHub (overwrites remote history)"
echo ""

# Confirm with user
read -p "Are you sure you want to proceed? (yes/no): " confirm
if [[ "$confirm" != "yes" ]]; then
    echo "❌ Aborted by user"
    exit 1
fi

echo ""
echo "🔄 Starting clean setup..."

# Abort any current merge
echo "🧹 Cleaning up any merge in progress..."
git merge --abort 2>/dev/null || true
git reset --hard HEAD 2>/dev/null || true

# Make sure we're in a clean state
if [[ -n $(git status --porcelain) ]]; then
    echo "❌ Working directory is not clean. Please commit or stash changes first."
    exit 1
fi

# Switch to github branch
echo "📍 Switching to github branch..."
git checkout github

# Create a backup of current github branch
BACKUP_BRANCH="github-old-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_BRANCH"
echo "📦 Created backup of old github branch: $BACKUP_BRANCH"

# Reset github branch to main branch state
echo "🔄 Resetting github branch to main branch state..."
git reset --hard main

# Remove private files
echo "🧹 Removing private files..."
rm -rf deployment/ nginx/ 2>/dev/null || true
rm -f CODEOWNERS .gitlab-ci.yml .amazonq Dockerfile 2>/dev/null || true

# Update README if github-README.md exists
if [[ -f "scripts/github-README.md" ]]; then
    echo "📝 Updating README with public version..."
    cp scripts/github-README.md README.md
else
    echo "⚠️  No scripts/github-README.md found - keeping current README"
fi

# Update .gitignore for public repo
echo "📝 Updating .gitignore for public repository..."
cat > .gitignore << 'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

.env
scripts/
EOF

# Apply JavaScript transformations if the script exists
if [[ -f "scripts/apply-transforms.js" ]]; then
    echo "🔧 Running transformation script..."
    node scripts/apply-transforms.js
else
    echo "ℹ️  No scripts/apply-transforms.js found - skipping custom transformations"
fi

# Get the latest commit message from main for reference
MAIN_COMMIT_MSG=$(git log main -1 --pretty=format:'%s' 2>/dev/null || echo "Initial sync")

# Stage all changes
git add -A

# Commit the clean state
echo "📝 Creating initial clean commit..."
git commit -m "Initial clean sync from private repository

This establishes the baseline for the public repository.
Private infrastructure files have been removed.
Based on: $MAIN_COMMIT_MSG"

echo ""
echo "✅ Clean setup complete!"
echo "📋 Summary:"
echo "   - Old github branch backed up as: $BACKUP_BRANCH"
echo "   - Github branch reset to main branch state"
echo "   - Private files removed"
echo "   - Public transformations applied"
echo "   - Clean commit created"
echo ""
echo "🚀 Next steps:"
echo "   1. Review the changes: git log --oneline -3"
echo "   2. Force push to GitHub: git push github-remote github:main --force"
echo "   3. Future syncs: ./scripts/sync-to-github-v2.sh"
echo ""
echo "⚠️  Important: After force push, inform any external contributors"
echo "   that the repository history has been reset for a clean start." 