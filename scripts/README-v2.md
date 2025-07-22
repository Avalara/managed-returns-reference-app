# Scripts Directory (v3 - Fork-Friendly with Clean History)

This directory contains scripts for managing the dual-repository setup between the private GitLab repository and the public GitHub repository using a **squash merge strategy** that preserves fork-friendliness while hiding private file history.

## sync-to-github-v3.sh

Synchronizes changes from the `main` branch (private) to the `github` branch (public) using a squash merge approach that combines the benefits of clean history (no private file exposure) with fork-friendly workflow for external contributors.

### What it does:

1. **Validates clean state** - Ensures no uncommitted changes before starting
2. **Backs up** the current `github` branch with timestamped name
3. **Squash merges** changes from `main` branch (hides individual commit history)
4. **Removes private files** immediately after merge:
   - `deployment/` - Kubernetes/Helm configurations
   - `nginx/` - Nginx configuration
   - `CODEOWNERS` - Internal code ownership file
   - `.gitlab-ci.yml` - GitLab CI configuration
   - `.amazonq` - Amazon Q configuration
   - `Dockerfile` - Internal Docker configuration
5. **Applies public transformations**:
   - Updates README with public version (if `scripts/github-README.md` exists)
   - Ensures .gitignore excludes `scripts/`
   - Runs `scripts/apply-transforms.js` if it exists
6. **Creates single clean commit** - One commit per sync with meaningful message

### Key Advantages:

#### **🔒 Security & Privacy:**
- ✅ **No private file history** - Squash merge hides individual commits from main
- ✅ **No infrastructure exposure** - Deployment configs never appear in GitHub history
- ✅ **Clean commit messages** - No references to internal systems or private files
- ✅ **Safe file recovery** - `git show commit:private-file` won't work

#### **👥 For External Contributors (GitHub Users):**
- ✅ **Forks stay synchronized** - Can `git pull` updates normally
- ✅ **PRs remain valid** - Pull requests don't become unmergeable
- ✅ **Logical commits** - See meaningful change summaries, not file operations
- ✅ **Standard workflow** - Familiar Git patterns work as expected

#### **🛠️ For Maintainers:**
- ✅ **Simple conflict resolution** - Squash merge handles conflicts automatically
- ✅ **Incremental syncs** - Only sync actual changes, not file operations
- ✅ **Clear audit trail** - Each sync is one logical commit
- ✅ **Easy rollbacks** - Can revert entire sync with one command

### Prerequisites:

- Clean working directory (no uncommitted changes)
- Both `main` and `github` branches must exist
- `scripts/github-README.md` file (optional) for README replacement
- Node.js installed (if using `scripts/apply-transforms.js`)

### Initial Setup (Clean Start):

For the first time setup or to blow away existing GitHub history:

```bash
# 1. Ensure you're on the github branch
git checkout github

# 2. Create a clean branch from current state
git checkout -b github-clean

# 3. Do a dry run
./scripts/sync-to-github-v2.sh --dry-run

# 4. Run the sync to prepare clean content
./scripts/sync-to-github-v3.sh

# 5. Force push to GitHub to replace existing history
git push github-remote github-clean:main --force

# 6. Update your local github branch to match
git checkout github
git reset --hard github-clean
git branch -D github-clean

# 7. Set up tracking for future pushes
git push --set-upstream github-remote github:main
```

### Regular Usage:

After initial setup, for ongoing syncs:

```bash
# Make sure you're in the repository root
cd /path/to/managed-returns-reference-app

# Ensure working directory is clean
git status

# Run the squash merge sync script
./scripts/sync-to-github-v3.sh

# Switch git user if pushing to different remote
git config user.name "Your GitHub Name"
git config user.email "your-github-email@example.com"

# Push to GitHub (no force needed after initial setup)
git push github-remote github:main
```

### Required Files:

1. **`scripts/github-README.md`** (optional) - Public version of README
2. **`scripts/apply-transforms.js`** (optional) - JavaScript transformations for code cleanup

### How Squash Merge Works:

The squash merge strategy combines all changes from main into a single commit:

```bash
# What happens internally:
git merge --squash main  # Combines all changes, doesn't create merge commit
# Remove private files
# Apply transformations  
git commit -m "Sync from main: [latest commit message]"

# Result: Single clean commit with only public changes
```

### Git History Comparison:

**Before (Regular Merge - v2):**
```
* abc123 - Merge branch 'main' into github
|\
| * def456 - Update deployment/helm-chart/values.yaml  # ❌ Private file visible
| * ghi789 - Fix nginx config                          # ❌ Private file visible  
| * jkl012 - Add new feature in src/
* mno345 - Previous sync
```

**After (Squash Merge - v3):**
```
* abc123 - Sync from main: Add new feature
  # ✅ Single commit with only public changes
  # ✅ No mention of private files
  # ✅ Clean, meaningful commit message
* def456 - Sync from main: Fix user authentication
* ghi789 - Sync from main: Update dependencies
```

### Safety Features:

- **Clean state validation** - Won't run if there are uncommitted changes
- **Backup branches** - Creates timestamped backup before making changes
- **Error handling** - Exits immediately on any error (`set -e`)
- **Automatic conflict resolution** - Squash merge handles conflicts gracefully
- **Progress tracking** - Shows current commit before and after sync
- **Review capability** - Provides commands to review changes

### Optional Transformations:

Create `scripts/apply-transforms.js` for code transformations:

```javascript
const fs = require('fs');

console.log('🔧 Applying transformations...');

// Example: Update package.json dependencies for public version
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (pkg.dependencies) {
    // Update to public-appropriate versions
    pkg.dependencies['@ant-design/icons'] = '^6.0.0';
    pkg.dependencies['antd'] = '^5.24.6';
  }
  
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
  console.log('✅ Updated package.json');
}

// Example: Remove private code sections
const authFile = 'src/graphql/auth/index.js';
if (fs.existsSync(authFile)) {
  let content = fs.readFileSync(authFile, 'utf8');
  
  // Remove private methods marked with comments
  content = content.replace(
    /\/\/ PRIVATE_START[\s\S]*?\/\/ PRIVATE_END\n?/g,
    ''
  );
  
  fs.writeFileSync(authFile, content);
  console.log('✅ Cleaned auth file');
}

console.log('🎉 All transformations applied!');
```

### Troubleshooting:

**Script fails with "Working directory is not clean":**
- Run `git status` to see uncommitted changes
- Commit or stash changes before running the script

**Squash merge fails:**
- This is rare with squash merges, but check for any Git errors
- Ensure both `main` and `github` branches exist
- Try running `git merge --abort` and retry

**Transformations not applied:**
- Check if `scripts/apply-transforms.js` exists and is valid JavaScript
- Verify Node.js is installed and accessible
- Check console output for transformation errors

**GitHub users report issues:**
- Verify the git history looks clean: `git log --oneline -10`
- Check that private files aren't in the commit: `git show --name-only HEAD`
- Ensure commit messages are meaningful and don't reference private systems

### Recovery:

If something goes wrong, you can restore from the backup:

```bash
# List available backup branches
git branch | grep github-backup

# Restore from a specific backup
git checkout github
git reset --hard github-backup-YYYYMMDD-HHMMSS

# Clean up backup branch (optional)
git branch -D github-backup-YYYYMMDD-HHMMSS
```

### Security Verification:

After each sync, verify no private information is exposed:

```bash
# Check what files are in the commit
git show --name-only HEAD

# Verify no private files in history
git log --name-only --oneline -5

# Check for any references to private systems
git show HEAD | grep -i "deployment\|nginx\|internal"
```

### Integration with CI/CD:

```bash
# Example: Automated sync after main branch updates
git checkout main
git pull origin main
./scripts/sync-to-github-v3.sh
git push github-remote github:main
```

### Best Practices:

1. **Initial clean setup** - Use force push for first sync to establish clean history
2. **Regular syncs** - Sync frequently to keep changes manageable
3. **Verify security** - Always check that no private files appear in commits
4. **Test transformations** - Ensure transformation scripts work correctly
5. **Monitor external PRs** - Ensure GitHub contributors can still merge cleanly
6. **Document public changes** - Use meaningful commit messages for public audience
7. **Keep backups** - Don't delete backup branches immediately

### Migration from v1/v2 to v3:

If you're switching from previous versions:

1. **Backup everything** - Create backups of both branches
2. **Use initial setup process** - Follow the "Initial Setup (Clean Start)" steps
3. **Force push once** - Replace existing GitHub history with clean version
4. **Inform contributors** - Let GitHub users know about the improved approach
5. **Monitor first few syncs** - Ensure everything works as expected

### Why v3 is the Sweet Spot:

- **Security**: No private file history exposure (like v1)
- **Fork-friendly**: External contributors can work normally (like v2)
- **Clean history**: Logical commits without internal noise
- **Simple workflow**: One command syncs everything
- **Future-proof**: Works well with external contributions 