#!/bin/bash

# Ensure the script stops on first error
set -e

echo "Starting deployment process..."

# Generate Prisma client with the correct binary targets
echo "Generating Prisma client..."
npx prisma generate

# Commit changes
echo "Committing changes..."
git add .
git commit -m "Fix 404 error in production deployment"

# Push changes to GitHub
echo "Pushing changes to GitHub..."
git push

echo "Deployment process completed successfully!"
echo "The CI/CD pipeline will now build and deploy the application to Vercel."
echo "Check the GitHub Actions tab for the status of the deployment." 