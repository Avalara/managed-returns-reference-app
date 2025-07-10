# Scripts Directory (v2 - Fork-Friendly Approach)

This directory contains scripts for managing the dual-repository setup between the private GitLab repository and the public GitHub repository using a **fork-friendly merge+transform strategy**.

## sync-to-github-v2.sh

Synchronizes changes from the `main` branch (private) to the `github` branch (public) using a merge+transform approach that preserves git history and is friendly to external contributors who fork the public repository.

### What it does:

1. **Validates clean state** - Ensures no uncommitted changes before starting
2. **Backs up** the current `github` branch with timestamped name
3. **Merges** changes from `main` branch (preserving git history)
4. **Resolves conflicts intelligently**:
   - Takes main branch version for: `src/`, `package.json`, `package-lock.json`, `public/`, `tests/`, etc.
   - Keeps github branch version for: `.gitignore`, `README.md`
   - Removes private files: `deployment/`, `nginx/`, `CODEOWNERS`, `.gitlab-ci.yml`, `.amazonq`, `Dockerfile`
5. **Applies public transformations** after merge:
   - Updates README with public version (if `scripts/github-README.md` exists)
   - Ensures .gitignore excludes `scripts/`
   - Runs `scripts/apply-transforms.js` if it exists
6. **Creates logical commits** - Merge commit + optional transformation commit

### Key Advantages Over Replacement Strategy:

#### **For External Contributors (GitHub Users):**
- ✅ **Forks stay synchronized** - Can `git pull` updates normally
- ✅ **PRs remain valid** - Pull requests don't become unmergeable
- ✅ **Clear git history** - See logical commits, not file replacements
- ✅ **Standard workflow** - Familiar Git merge/rebase patterns work

#### **For Maintainers:**
- ✅ **Better conflict resolution** - Git handles most conflicts automatically
- ✅ **Incremental syncs** - Only sync what actually changed
- ✅ **Easier rollbacks** - Can revert specific changes more easily
- ✅ **Clear audit trail** - Logical history of changes

### Prerequisites:

- Clean working directory (no uncommitted changes)
- Both `main` and `github` branches must exist
- Branches should share some common history (after first sync)
- `scripts/github-README.md` file (optional) for README replacement
- Node.js installed (if using `scripts/apply-transforms.js`)

### Usage:

```bash
# Make sure you're in the repository root
cd /path/to/managed-returns-reference-app

# Ensure working directory is clean
git status

# Run the fork-friendly sync script
./scripts/sync-to-github-v2.sh

# Switch git user if pushing to different remote
git config user.name "Your GitHub Name"
git config user.email "your-github-email@example.com"

# Push to GitHub
git push github-remote github:main
```

### Required Files:

1. **`scripts/github-README.md`** (optional) - Public version of README
2. **`scripts/apply-transforms.js`** (optional) - JavaScript transformations for code cleanup

### How Conflict Resolution Works:

The script automatically resolves merge conflicts using an intelligent strategy:

```bash
# Files that come from main branch (latest changes):
- src/ (all source code)
- package.json, package-lock.json (dependencies)
- public/, tests/ (assets and tests)
- vite.config.js, eslint.config.js (build configs)

# Files that stay from github branch (public-specific):
- .gitignore (excludes scripts/)
- README.md (public version)

# Files that are always removed (private):
- deployment/, nginx/ (infrastructure)
- CODEOWNERS, .gitlab-ci.yml, .amazonq, Dockerfile
```

### Safety Features:

- **Clean state validation** - Won't run if there are uncommitted changes
- **Backup branches** - Creates timestamped backup before making changes
- **Error handling** - Exits immediately on any error (`set -e`)
- **Conflict auto-resolution** - Handles expected conflicts automatically
- **Progress tracking** - Shows current commit before and after sync
- **Review capability** - Provides git log command to review changes

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
  
  // Remove private methods
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

**Merge conflicts that can't be auto-resolved:**
- The script handles expected conflicts automatically
- If new conflicts arise, the script will exit with an error
- Check the specific files causing conflicts and update the script's conflict resolution logic

**Transformations not applied:**
- Check if `scripts/apply-transforms.js` exists and is valid JavaScript
- Verify Node.js is installed and accessible
- Check console output for transformation errors

**GitHub users report broken forks:**
- This shouldn't happen with the merge approach
- If it does, check that the script is actually merging (not replacing)
- Verify the git history looks logical: `git log --oneline -10`

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

### Git History Comparison:

**Before (Replacement Strategy):**
```
* abc123 - Sync from main: Add new feature
  - Deleted: 50 files, Added: 52 files
* def456 - Sync from main: Fix bug
  - Deleted: 50 files, Added: 50 files
```

**After (Merge+Transform Strategy):**
```
* abc123 - Apply public transformations after merge from main
* def456 - Merge branch 'main' into github
|\
| * ghi789 - Add new feature
| * jkl012 - Fix bug
* mno345 - Apply public transformations after merge from main
```

### Integration with CI/CD:

```bash
# Example: Automated sync after main branch updates
git checkout main
git pull origin main
./scripts/sync-to-github-v2.sh
git push github-remote github:main
```

### Best Practices:

1. **Test thoroughly** - Test the merge approach with your specific conflicts
2. **Monitor external PRs** - Ensure GitHub contributors can still merge cleanly
3. **Keep backups** - Don't delete backup branches immediately
4. **Document transformations** - Comment your transformation scripts
5. **Regular syncs** - Sync frequently to minimize conflict complexity
6. **Review changes** - Use the provided git log command to review what changed
7. **Communicate with contributors** - Let GitHub users know about the improved workflow

### Migration from v1 to v2:

If you're switching from the replacement strategy:

1. **Backup everything** - Create backups of both branches
2. **Test in a separate repo** - Clone and test the new approach
3. **Expect one-time conflicts** - The first v2 sync may have more conflicts
4. **Inform contributors** - Let GitHub users know about the improved approach
5. **Monitor the first few syncs** - Ensure everything works as expected 