# GitHub Actions CI/CD Setup Guide

This guide explains how to set up and use the GitHub Actions workflow for continuous integration and deployment of your Purple Bitcoin Project website.

## What This Workflow Does

The workflow automatically deploys your website to GitHub Pages whenever you push changes to the `main` branch of your repository. This ensures your live site is always up-to-date with your latest code.

## Workflow File Location

The workflow file should be placed at:
```
.github/workflows/deploy.yml
```

## Workflow Configuration

```yaml
name: Deploy Website

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: .
          branch: gh-pages
          clean: true
```

## How It Works

1. **Trigger**: The workflow runs automatically when:
   - You push code to the `main` branch
   - You manually trigger it using the "Actions" tab in GitHub

2. **Process**:
   - GitHub spins up an Ubuntu environment
   - Checks out your code
   - Sets up Node.js
   - Deploys your website to the `gh-pages` branch

3. **Result**:
   - GitHub Pages serves your website from the `gh-pages` branch
   - Your site is automatically updated with the latest changes

## GitHub Pages Configuration

For this workflow to function properly, you need to configure GitHub Pages to deploy from the `gh-pages` branch:

1. Go to your repository on GitHub
2. Click on "Settings"
3. Navigate to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Select "gh-pages" branch and "/ (root)" folder
6. Click "Save"

## Troubleshooting

### Workflow Not Running

If the workflow isn't running when you push changes:

1. Check the "Actions" tab in your GitHub repository
2. Verify that workflows aren't disabled for the repository
3. Ensure your workflow file is correctly placed at `.github/workflows/deploy.yml`

### Deployment Failures

If the workflow runs but deployment fails:

1. Check the workflow logs in the "Actions" tab
2. Verify that the `gh-pages` branch exists (it will be created automatically on first run)
3. Ensure GitHub Pages is configured to deploy from the `gh-pages` branch
4. Check that your repository permissions allow GitHub Actions to create and push to branches

### Site Not Updating

If your site isn't reflecting the latest changes:

1. Check that your changes were pushed to the `main` branch
2. Verify the workflow completed successfully
3. Allow a few minutes for GitHub Pages to update after the workflow completes
4. Clear your browser cache to ensure you're seeing the latest version

## Advanced Customization

You can enhance this workflow with additional steps:

### Add Testing

```yaml
- name: Install dependencies
  run: npm ci

- name: Run tests
  run: npm test
```

### Add Build Step

```yaml
- name: Install dependencies
  run: npm ci

- name: Build
  run: npm run build

- name: Deploy to GitHub Pages
  uses: JamesIves/github-pages-deploy-action@v4
  with:
    folder: build  # Change to your build output directory
    branch: gh-pages
    clean: true
```

## Monitoring and Notifications

You can set up notifications for workflow runs:

1. Go to your GitHub profile settings
2. Navigate to "Notifications"
3. Configure your preferences for "Actions" notifications

This will keep you informed about the status of your deployments.

## Need Help?

If you encounter issues with your CI/CD setup:

1. Check the [GitHub Actions documentation](https://docs.github.com/en/actions)
2. Review the [GitHub Pages documentation](https://docs.github.com/en/pages)
3. Search for specific error messages on Stack Overflow
4. Reach out to the GitHub community for assistance
