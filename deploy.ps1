# Deploy script for Vercel monorepo
Write-Host "Starting deployment process..." -ForegroundColor Cyan

# Make sure Vercel CLI is installed
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Deploy the admin app
Write-Host "Deploying admin app..." -ForegroundColor Green
Set-Location -Path ".\apps\admin"
vercel --prod
Set-Location -Path "..\..\"

# Deploy the web app
Write-Host "Deploying web app..." -ForegroundColor Green
Set-Location -Path ".\apps\web"
vercel --prod
Set-Location -Path "..\..\"

Write-Host "Deployment completed! Check the URLs provided by Vercel." -ForegroundColor Cyan
