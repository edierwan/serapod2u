# Branching Strategy - Three-Stage Development

This repository follows a **three-stage branching strategy** to ensure smooth development, testing, and deployment cycles.

## Branch Overview

### 🚀 **Production** (`main`)
- **Purpose**: Production-ready code that is deployed to live environment
- **Stability**: Highest - only thoroughly tested and approved code
- **Access**: Protected branch, requires pull request reviews
- **Deployment**: Automatically deploys to production environment

### 🧪 **Staging** (`staging`)
- **Purpose**: Pre-production testing and quality assurance
- **Stability**: High - code ready for final testing before production
- **Access**: Merge from development branch via pull requests
- **Deployment**: Automatically deploys to staging environment for testing

### 🔧 **Development** (`development`)
- **Purpose**: Active development work and feature integration
- **Stability**: Medium - work-in-progress features and ongoing development
- **Access**: Default branch for new features and bug fixes
- **Deployment**: Automatically deploys to development environment

## Workflow Process

```
Feature Branches → Development → Staging → Production (main)
```

### 1. Feature Development
```bash
# Create feature branch from development
git checkout development
git pull origin development
git checkout -b feature/your-feature-name

# Work on your feature
# Commit changes
git add .
git commit -m "feat: add new feature"

# Push and create pull request to development
git push origin feature/your-feature-name
```

### 2. Development Integration
- Create pull request from feature branch to `development`
- Code review and approval required
- Merge to `development` branch
- Feature is deployed to development environment for testing

### 3. Staging Release
```bash
# Create pull request from development to staging
# After thorough testing in development environment
```
- Create pull request from `development` to `staging`
- QA testing in staging environment
- Bug fixes go back to development first, then re-promoted

### 4. Production Release
```bash
# Create pull request from staging to main (production)
# After successful staging validation
```
- Create pull request from `staging` to `main`
- Final approval and merge to production
- Production deployment triggered

## Branch Protection Rules (Recommended)

### Main Branch (Production)
- Require pull request reviews (minimum 2 reviewers)
- Require status checks to pass before merging
- Require up-to-date branches before merging
- Restrict pushes to main branch directly

### Staging Branch
- Require pull request reviews (minimum 1 reviewer)
- Require status checks to pass before merging
- Only allow merges from development branch

### Development Branch
- Require pull request reviews for feature branches
- Allow merges after code review approval

## Environment Mapping

| Branch | Environment | URL | Purpose |
|--------|-------------|-----|---------|
| `main` | Production | `https://serapod2u.com` | Live application |
| `staging` | Staging | `https://staging.serapod2u.com` | Pre-production testing |
| `development` | Development | `https://dev.serapod2u.com` | Development testing |

## Commands Reference

```bash
# Check current branch
git branch

# Switch to development for new features
git checkout development
git pull origin development

# Create feature branch
git checkout -b feature/feature-name

# Switch between branches
git checkout development
git checkout staging
git checkout main

# View all branches
git branch -a
```

## Best Practices

1. **Always start new features from `development` branch**
2. **Test thoroughly in each environment before promoting**
3. **Use descriptive commit messages and PR titles**
4. **Keep feature branches small and focused**
5. **Delete feature branches after merging**
6. **Never commit directly to `main` or `staging`**
7. **Use pull request templates for consistency**

## Hotfix Process

For critical production fixes:

```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# Make fix and test
# Create PR directly to main for critical fixes
# Then backport to staging and development
```

---

**Note**: This branching strategy ensures code quality, proper testing, and safe deployments across all environments.