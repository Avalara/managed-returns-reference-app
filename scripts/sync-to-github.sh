#!/bin/bash
# sync-to-github-v2.sh - Fork-friendly sync from main to github branch
# Uses merge + transform strategy instead of replacement

set -e  # Exit on any error

echo "🔄 Syncing main to github branch (fork-friendly approach)..."

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

# Merge from main branch
echo "🔄 Merging from main branch..."
if git merge main --no-edit; then
    echo "✅ Merge successful"
else
    echo "⚠️  Merge conflicts detected. Resolving automatically..."
    
    # Auto-resolve conflicts by preferring main branch for most files
    # but keeping github branch for public-specific files
    
    # For files that should come from main, take main's version
    git checkout --theirs package.json || true
    git checkout --theirs package-lock.json || true
    git checkout --theirs src/ || true
    git checkout --theirs public/ || true
    git checkout --theirs tests/ || true
    git checkout --theirs index.html || true
    git checkout --theirs vite.config.js || true
    git checkout --theirs eslint.config.js || true
    git checkout --theirs commitlint.config.js || true
    git checkout --theirs .prettierrc || true
    git checkout --theirs .nvmrc || true
    
    # For files that should stay as github version, take ours
    git checkout --ours .gitignore || true
    git checkout --ours README.md || true
    
    # Remove private files that may have been added
    git rm -rf deployment/ 2>/dev/null || true
    git rm -rf nginx/ 2>/dev/null || true
    git rm -f CODEOWNERS 2>/dev/null || true
    git rm -f .gitlab-ci.yml 2>/dev/null || true
    git rm -f .amazonq 2>/dev/null || true
    git rm -f Dockerfile 2>/dev/null || true
    
    # Mark conflicts as resolved
    git add -A
    
    # Complete the merge
    git commit --no-edit
    echo "✅ Merge conflicts resolved automatically"
fi

# Now apply public transformations
echo "🔧 Applying public transformations..."

# Ensure private files are removed (in case they were merged in)
echo "🧹 Ensuring private files are removed..."
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

# Check if we have any changes to commit after transformations
if [[ -n $(git status --porcelain) ]]; then
    echo "📝 Committing public transformations..."
    git add -A
    git commit -m "Apply public transformations after merge from main"
else
    echo "✅ No additional transformations needed"
fi

echo "✅ Sync complete!"
echo "📋 Summary:"
echo "   - Backup created: $BACKUP_BRANCH"
echo "   - Merged changes from main branch"
echo "   - Applied public transformations"
echo "   - Preserved git history for external contributors"
echo "   - Ready to push to GitHub remote"
echo ""
echo "🚀 To push to GitHub:"
echo "   - switch git user, if necessary"
echo "   git push github-remote github:main"
echo ""
echo "🔍 To review changes:"
echo "   git log --oneline $CURRENT_COMMIT..HEAD" 