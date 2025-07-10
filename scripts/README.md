# Scripts Directory

This directory contains scripts for managing the dual-repository setup between the private GitLab repository and the public GitHub repository.

## sync-to-github.sh

Synchronizes changes from the `main` branch (private) to the `github` branch (public) with necessary transformations.

### What it does:

1. **Backs up** the current `github` branch
2. **Replaces** the `github` branch content with `main` branch content
3. **Removes** private files and directories:
   - `deployment/` - Kubernetes/Helm configurations
   - `nginx/` - Nginx configuration
   - `CODEOWNERS` - Internal code ownership file
   - `.gitlab-ci.yml` - GitLab CI configuration
   - `.amazonq` - Amazon Q configuration
4. **Applies transformations** for public version:
   - Updates package.json dependencies
   - Removes private authentication methods
   - Cleans up GraphQL queries
   - Updates .gitignore for public repository
   - Replaces README.md with GitHub-specific version
   - Removes Dockerfile

### Usage:

```bash
# Make sure you're in the repository root
cd /path/to/managed-returns-reference-app

# Run the sync script
./scripts/sync-to-github.sh

# After sync completes, push to GitHub
git push github-remote github:main
```

### Prerequisites:

- Clean working directory (no uncommitted changes)
- Both `main` and `github` branches should exist
- Node.js installed (for transformation scripts)

### Safety Features:

- Creates backup branches before making changes
- Validates clean working directory before starting
- Exits on any error (`set -e`)
- Provides clear status messages throughout the process

### Customizing Transformations:

The script uses `scripts/apply-transforms.js` for code transformations. You can customize this script to add more transformations specific to your needs. The script handles:

- Package.json dependency updates
- Removal of private authentication methods
- GraphQL query cleanup
- Merge conflict resolution

### Troubleshooting:

If the script fails:
1. Check that you have a clean working directory
2. Ensure both branches exist
3. Verify Node.js is installed
4. Look for the backup branch created (format: `github-backup-YYYYMMDD-HHMMSS`)

### Recovery:

If something goes wrong, you can restore from the backup:

```bash
# List backup branches
git branch | grep github-backup

# Restore from a backup
git checkout github
git reset --hard github-backup-YYYYMMDD-HHMMSS
``` 