#!/bin/bash
# sync-to-github-v3.sh - Fork-friendly sync with squashed history
# Uses squash merge to hide private file history while preserving workflow

set -e  # Exit on any error

echo "🔄 Syncing main to github branch (squash merge approach)..."

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

# Get current commit for reference
CURRENT_COMMIT=$(git rev-parse HEAD)
echo "📍 Current github branch at: $CURRENT_COMMIT"

# Get the commit message from the latest main commit
MAIN_COMMIT_MSG=$(git log main -1 --pretty=format:'%s')

# Squash merge from main branch (doesn't show individual commit history)
echo "🔄 Squash merging from main branch..."
if git merge --squash main; then
    echo "✅ Squash merge successful"
    
    # Remove private files immediately
    echo "🧹 Removing private files..."
    rm -rf deployment/ nginx/ 2>/dev/null || true
    rm -f CODEOWNERS .gitlab-ci.yml .amazonq Dockerfile 2>/dev/null || true
    
    # Update README if github-README.md exists
    if [[ -f "scripts/github-README.md" ]]; then
        echo "📝 Updating README with public version..."
        cp scripts/github-README.md README.md
    fi
    
    # Ensure .gitignore is appropriate for public repo
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
    fi
    
    # Commit the squashed changes
    git add -A
    git commit -m "Sync from main: $MAIN_COMMIT_MSG

This commit includes changes from main branch.
Private infrastructure files have been removed for public release."
    
else
    echo "❌ Squash merge failed"
    exit 1
fi

echo "✅ Sync complete!"
echo "📋 Summary:"
echo "   - Backup created: $BACKUP_BRANCH"
echo "   - Squash merged changes from main branch"
echo "   - Private file history not exposed"
echo "   - Applied public transformations"
echo "   - Ready to push to GitHub remote"
echo ""
echo "🚀 To push to GitHub:"
echo "   - switch git user, if necessary"
echo "   git push github-remote github:main"
echo ""
echo "🔍 To review changes:"
echo "   git log --oneline $CURRENT_COMMIT..HEAD"
echo "   git show --name-only HEAD  # See what files changed" 