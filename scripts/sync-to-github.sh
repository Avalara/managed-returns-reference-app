#!/bin/bash
# sync-to-github.sh - Sync main branch to github branch with transformations

set -e  # Exit on any error

echo "🔄 Syncing main to github branch..."

# Abort current merge if any
git merge --abort 2>/dev/null || true

# Make sure we're in a clean state
if [[ -n $(git status --porcelain) ]]; then
    echo "❌ Working directory is not clean. Please commit or stash changes first."
    exit 1
fi

# Switch to github branch
git checkout github

# Create a backup branch first (safety net)
BACKUP_BRANCH="github-backup-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_BRANCH"
echo "📦 Created backup branch: $BACKUP_BRANCH"

# Get the current github branch's transformation config (if it exists)
git show HEAD:.github/public-config.json > /tmp/public-config.json 2>/dev/null || echo "{}" > /tmp/public-config.json

# Replace github branch content with main branch content
echo "🔄 Replacing content with main branch..."
git rm -rf . 2>/dev/null || true
git checkout main -- .

# Remove private files immediately
echo "🧹 Removing private files..."
rm -rf deployment/ nginx/
rm -f CODEOWNERS .gitlab-ci.yml .amazonq Dockerfile
cp scripts/github-README.md README.md

# Restore transformation config
mkdir -p .github
cp /tmp/public-config.json .github/public-config.json 2>/dev/null || true

# Apply transformations
echo "🔧 Applying public transformations..."

# Update .gitignore for public version
echo "📝 Updating .gitignore..."
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
    node scripts/apply-transforms.js
fi

# Get the last commit message from main for reference
LAST_COMMIT_MSG=$(git log main -1 --pretty=format:'%s')

# Commit everything
git add -A
git commit -m "Sync from main: $LAST_COMMIT_MSG"

echo "✅ Sync complete!"
echo "📋 Summary:"
echo "   - Backup created: $BACKUP_BRANCH"
echo "   - Private files removed: deployment/, nginx/, CODEOWNERS, .gitlab-ci.yml, .amazonq"
echo "   - Transformations applied"
echo "   - Ready to push to GitHub remote"
echo ""
echo "🚀 To push to GitHub:"
echo "   - switch git user, if necessary"
echo "   git push github-remote github:main"