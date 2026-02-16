# GitHub Pages Deployment Setup

This repository is configured with GitHub Actions to automatically deploy to GitHub Pages.

## Automatic Deployment

The workflow (`.github/workflows/deploy.yml`) will automatically:
- Trigger on every push to the `main` branch
- Trigger on pull requests to the `main` branch  
- Can be manually triggered via the Actions tab
- Deploy the static website to GitHub Pages

## One-Time Setup Required

To enable GitHub Pages for this repository, you need to configure it once in your repository settings:

1. Go to your repository on GitHub
2. Click on **Settings** (top menu)
3. Click on **Pages** (left sidebar under "Code and automation")
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
   - (No need to select a branch, as GitHub Actions will handle deployment)
5. Click **Save**

That's it! The next time you push to the `main` branch, the workflow will run automatically and deploy your site.

## Viewing Your Deployed Site

After the first successful deployment:
- Your site will be available at: `https://alexou8.github.io/shop-demo/`
- The deployment status badge in README.md will show the current deployment status
- You can view deployment history in the "Actions" tab

## Manual Deployment

You can also trigger a deployment manually:
1. Go to the **Actions** tab in your repository
2. Click on "Deploy to GitHub Pages" workflow
3. Click "Run workflow" button
4. Select the branch and click "Run workflow"

## Workflow Features

- ✅ Deploys on every push to `main`
- ✅ Deploys on pull requests (for preview)
- ✅ Manual deployment trigger available
- ✅ Proper permissions configured for GitHub Pages
- ✅ Concurrent deployment protection
- ✅ Uses latest GitHub Actions (v4)

## Troubleshooting

### Workflow not running?
- Check that the workflow file exists at `.github/workflows/deploy.yml`
- Ensure you have enabled GitHub Actions in repository settings
- Check the Actions tab for any error messages

### Deployment failing?
- Verify GitHub Pages is configured to use "GitHub Actions" as source
- Check the workflow logs in the Actions tab
- Ensure the repository is public or you have GitHub Pro/Enterprise for private repos

### Site not accessible?
- Wait a few minutes after the first deployment
- Check that the URL matches: `https://alexou8.github.io/shop-demo/`
- Clear your browser cache
