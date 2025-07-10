# Scripts Directory

This directory contains scripts for managing the dual-repository setup between the private GitLab repository and the public GitHub repository.

## sync-to-github.sh

Synchronizes changes from the `main` branch (private) to the `github` branch (public) with necessary transformations for public release.

### What it does:

1. **Validates clean state** - Ensures no uncommitted changes before starting
2. **Backs up** the current `github` branch with timestamped name
3. **Replaces** the `github` branch content with `main` branch content
4. **Removes** private files and directories:
   - `deployment/` - Kubernetes/Helm configurations
   - `nginx/` - Nginx configuration
   - `CODEOWNERS` - Internal code ownership file
   - `.gitlab-ci.yml` - GitLab CI configuration
   - `.amazonq` - Amazon Q configuration
   - `Dockerfile` - Internal Docker configuration
5. **Replaces README** - Copies `scripts/github-README.md` to `README.md` (public version)
6. **Updates .gitignore** - Creates public-appropriate .gitignore that excludes `scripts/`
7. **Applies transformations** - Runs `scripts/apply-transforms.js` if it exists
8. **Commits changes** - Single commit referencing the original main branch commit

### Prerequisites:

- Clean working directory (no uncommitted changes)
- Both `main` and `github` branches must exist
- `scripts/github-README.md` file must exist for README replacement
- Node.js installed (if using `scripts/apply-transforms.js`)

### Usage:

```bash
# Make sure you're in the repository root
cd /path/to/managed-returns-reference-app

# Ensure working directory is clean
git status

# Run the sync script
./scripts/sync-to-github.sh

# Switch git user if pushing to different remote
git config user.name "Your GitHub Name"
git config user.email "your-github-email@example.com"

# Push to GitHub
git push github-remote github:main
```

### Required Files:

1. **`scripts/github-README.md`** - Public version of README that will replace the private README
2. **`scripts/apply-transforms.js`** (optional) - JavaScript transformations for code cleanup

### Safety Features:

- **Clean state validation** - Won't run if there are uncommitted changes
- **Backup branches** - Creates timestamped backup before making changes (format: `github-backup-YYYYMMDD-HHMMSS`)
- **Error handling** - Exits immediately on any error (`set -e`)
- **Clear progress messages** - Shows exactly what's happening at each step
- **Abort cleanup** - Cleans up any existing merge conflicts before starting

### Optional Transformations:

If you need code transformations (like updating dependencies, removing private methods, etc.), create `scripts/apply-transforms.js`:

```javascript
const fs = require('fs');

console.log('🔧 Applying transformations...');

// Example: Update package.json dependencies
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (pkg.dependencies) {
    pkg.dependencies['@ant-design/icons'] = '^6.0.0';
    pkg.dependencies['antd'] = '^5.24.6';
  }
  
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
  console.log('✅ Updated package.json');
}

// Add more transformations as needed...
console.log('🎉 All transformations applied!');
```

### Troubleshooting:

**Script fails with "Working directory is not clean":**
- Run `git status` to see uncommitted changes
- Commit or stash changes before running the script

**Script fails during file operations:**
- Ensure you have write permissions in the repository
- Check that both `main` and `github` branches exist

**Missing `scripts/github-README.md`:**
- Create this file with the public version of your README
- This file will replace the private README in the public repository

**Transformations not applied:**
- Check if `scripts/apply-transforms.js` exists
- Verify Node.js is installed and accessible
- Check the transformation script for syntax errors

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

### How It Avoids Merge Conflicts:

This script uses a **replacement strategy** instead of merging:
1. Completely replaces the `github` branch content with `main` branch content
2. Applies transformations to make it suitable for public release
3. Creates a single clean commit

This approach avoids the "refusing to merge unrelated histories" error and merge conflicts that occur when trying to merge two repositories with different origins.

### Integration with CI/CD:

You can integrate this script into your workflow:

```bash
# Example: Run after merging to main
git checkout main
git pull origin main
./scripts/sync-to-github.sh
git push github-remote github:main
```

### Best Practices:

1. **Test the script** in a separate repository first
2. **Review changes** before pushing to GitHub
3. **Keep backups** - Don't delete backup branches immediately
4. **Document transformations** - Comment your `apply-transforms.js` file
5. **Version control** - Keep transformation scripts in version control
6. **Regular syncs** - Run regularly to avoid large divergences between branches 