#!/bin/bash
# sync-to-github-v3.sh - Fork-friendly sync with squashed history
# Uses squash merge to hide private file history while preserving workflow
#
# Usage:
#   ./scripts/sync-to-github-v2.sh           # Run the sync
#   ./scripts/sync-to-github-v2.sh --dry-run # Preview what would happen

set -e  # Exit on any error

# Parse command line arguments
DRY_RUN=false
if [[ "$1" == "--dry-run" ]]; then
    DRY_RUN=true
    echo "🔍 DRY RUN MODE - No changes will be made"
    echo ""
fi

if [[ "$DRY_RUN" == "true" ]]; then
    echo "🔄 [DRY RUN] Syncing main to github branch (squash merge approach)..."
else
    echo "🔄 Syncing main to github branch (squash merge approach)..."
fi

# Abort current merge if any (unless dry run)
if [[ "$DRY_RUN" == "false" ]]; then
    git merge --abort 2>/dev/null || true
fi

# Make sure we're in a clean state
if [[ -n $(git status --porcelain) ]]; then
    echo "❌ Working directory is not clean. Please commit or stash changes first."
    if [[ "$DRY_RUN" == "true" ]]; then
        echo "   [DRY RUN] Would exit here in real run"
        echo ""
    else
        exit 1
    fi
fi

# Switch to github branch
if [[ "$DRY_RUN" == "true" ]]; then
    echo "📍 [DRY RUN] Would switch to github branch"
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    echo "   Currently on: $CURRENT_BRANCH"
    if [[ "$CURRENT_BRANCH" != "github" ]]; then
        echo "   Would run: git checkout github"
    fi
else
    git checkout github
fi

# Create a backup branch first (safety net)
BACKUP_BRANCH="github-backup-$(date +%Y%m%d-%H%M%S)"
if [[ "$DRY_RUN" == "true" ]]; then
    echo "📦 [DRY RUN] Would create backup branch: $BACKUP_BRANCH"
else
    git branch "$BACKUP_BRANCH"
    echo "📦 Created backup branch: $BACKUP_BRANCH"
fi

# Get current commit for reference
CURRENT_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
if [[ "$DRY_RUN" == "true" ]]; then
    echo "📍 [DRY RUN] Current github branch at: $CURRENT_COMMIT"
else
    echo "📍 Current github branch at: $CURRENT_COMMIT"
fi

# Get the commit message from the latest main commit
MAIN_COMMIT_MSG=$(git log main -1 --pretty=format:'%s' 2>/dev/null || echo "unknown")

# Show what changes would be included
echo ""
echo "📋 Changes to be synced from main branch:"
if [[ "$DRY_RUN" == "true" ]]; then
    echo "   Latest main commit: $MAIN_COMMIT_MSG"
    echo ""
    echo "🔍 Files that would be affected by squash merge:"
    git diff --name-only github..main 2>/dev/null | head -20 || echo "   Unable to show diff (branches may not exist)"
    
    DIFF_COUNT=$(git diff --name-only github..main 2>/dev/null | wc -l || echo "0")
    if [[ $DIFF_COUNT -gt 20 ]]; then
        echo "   ... and $(($DIFF_COUNT - 20)) more files"
    fi
    echo ""
fi

# Squash merge from main branch (doesn't show individual commit history)
if [[ "$DRY_RUN" == "true" ]]; then
    echo "🔄 [DRY RUN] Would squash merge from main branch..."
    echo "   Would run: git merge --squash --allow-unrelated-histories main"
    echo "✅ [DRY RUN] Squash merge would be successful"
    
    # Show what private files would be removed
    echo ""
    echo "🧹 [DRY RUN] Private files that would be removed:"
    for file in "deployment/" "nginx/" "CODEOWNERS" ".gitlab-ci.yml" ".amazonq" "Dockerfile"; do
        if [[ -e "$file" ]]; then
            echo "   ❌ $file (exists - would be removed)"
        else
            echo "   ✅ $file (doesn't exist - no action needed)"
        fi
    done
else
    echo "🔄 Squash merging from main branch..."
    if git merge --squash --allow-unrelated-histories main; then
        echo "✅ Squash merge successful"
        
        # Remove private files immediately
        echo "🧹 Removing private files..."
        rm -rf deployment/ nginx/ 2>/dev/null || true
        rm -f CODEOWNERS .gitlab-ci.yml .amazonq Dockerfile 2>/dev/null || true
    else
        echo "❌ Squash merge failed"
        exit 1
    fi
fi
    
# Apply transformations
echo ""
if [[ "$DRY_RUN" == "true" ]]; then
    echo "🔧 [DRY RUN] Transformations that would be applied:"
    
    # Check README update
    if [[ -f "scripts/github-README.md" ]]; then
        echo "   📝 README.md would be updated with public version"
        echo "      Source: scripts/github-README.md"
    else
        echo "   ⚠️  No scripts/github-README.md found - README would not be updated"
    fi
    
    # Show .gitignore update
    echo "   📝 .gitignore would be updated for public repository"
    echo "      Would exclude: scripts/ and other private patterns"
    
    # Check transformation script
    if [[ -f "scripts/apply-transforms.js" ]]; then
        echo "   🔧 Custom transformations would be applied"
        echo "      Script: scripts/apply-transforms.js"
    else
        echo "   ℹ️  No scripts/apply-transforms.js found - no custom transformations"
    fi
    
    echo ""
    echo "📝 [DRY RUN] Final commit that would be created:"
    echo "   Message: Sync from main: $MAIN_COMMIT_MSG"
    echo "   Content: Changes from main branch with private files removed"
    
else
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
fi

if [[ "$DRY_RUN" == "true" ]]; then
    echo ""
    echo "🔍 DRY RUN COMPLETE!"
    echo "📋 Summary of what would happen:"
    echo "   - Backup branch would be created: $BACKUP_BRANCH"
    echo "   - Changes from main branch would be squash merged"
    echo "   - Private files would be removed (deployment/, nginx/, etc.)"
    echo "   - Public transformations would be applied"
    echo "   - Single commit would be created with clean history"
    echo "   - No private file history would be exposed"
    echo ""
    echo "🚀 To actually run the sync:"
    echo "   ./scripts/sync-to-github-v2.sh"
    echo ""
    echo "🔍 To see detailed diff of changes:"
    echo "   git diff github..main --name-only"
    echo "   git diff github..main --stat"
else
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
fi 