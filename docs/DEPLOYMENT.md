# Deployment Guide for Blog Application

This document outlines how to deploy the Blog Application (including both web and admin interfaces) to various platforms.

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Vercel Deployment](#vercel-deployment)
3. [Railway Deployment](#railway-deployment)
4. [Render Deployment](#render-deployment)
5. [AWS Deployment](#aws-deployment)
6. [Custom Server Deployment](#custom-server-deployment)
7. [Troubleshooting](#troubleshooting)

## Environment Setup

Before deploying, create a proper `.env` file based on the `.env.example` template:

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your actual values
```

Required environment variables:
- `DATABASE_URL`: Connection string for your PostgreSQL database
- `JWT_SECRET`: Secret key for JWT authentication
- AWS credentials (if using S3 for image storage)

## Vercel Deployment

### Option 1: Vercel Dashboard (GUI)

1. Sign up/log in at [vercel.com](https://vercel.com)
2. Connect your GitHub/GitLab repository
3. Import your project
4. Configure each app separately:
   - For web app: Set root directory to `apps/web`
   - For admin app: Set root directory to `apps/admin`
5. Add environment variables from your `.env` file
6. Deploy

### Option 2: Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```bash
   vercel login
   ```

3. Deploy each app:
   ```bash
   # Deploy web app
   cd apps/web
   vercel --prod

   # Deploy admin app
   cd ../admin
   vercel --prod
   ```

4. Alternatively, use our deployment script:
   ```powershell
   # Run from the project root
   .\deploy.ps1
   ```

## Railway Deployment

1. Create a Railway account and install the CLI:
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. Initialize Railway project:
   ```bash
   railway init
   ```

3. Provision a PostgreSQL database:
   ```bash
   railway add
   # Select PostgreSQL from the options
   ```

4. Deploy the apps:
   ```bash
   cd apps/web
   railway up
   
   cd ../admin
   railway up
   ```

5. Set environment variables in the Railway dashboard

## Render Deployment

1. Sign up at [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new "Blueprint" using the `render.yaml` in your repository
4. This will create all the required services (web app, admin app, database)
5. Configure environment variables in the Render dashboard

## AWS Deployment

For advanced users who prefer Amazon Web Services:

1. Create an Elastic Beanstalk application
2. Set up your database in RDS
3. Deploy your applications using the AWS CLI or console
4. Configure S3 for static asset storage

## Custom Server Deployment

For deployment on your own server:

1. Set up a server with Node.js (v18+)
2. Clone the repository
3. Install dependencies:
   ```bash
   npm install -g pnpm
   pnpm install
   ```

4. Build the applications:
   ```bash
   pnpm build
   ```

5. Set up a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start apps/web/.next/standalone/server.js --name blog-web
   pm2 start apps/admin/.next/standalone/server.js --name blog-admin
   ```

6. Configure Nginx as a reverse proxy

## Troubleshooting

### Database Connection Issues

Check your `DATABASE_URL` format and ensure your database is accessible from your deployment environment.

### Build Failures

- Ensure Node.js version is 18 or higher
- Check for type errors in your code
- Verify all dependencies are correctly installed

### E2E Test Failures in CI

- Ensure test database is properly configured
- Check that environment variables are set correctly in CI

### Useful Commands

```bash
# Check deployed app status
vercel ls

# View logs
vercel logs

# Pull environment variables
vercel env pull
```

For more help, refer to the documentation of your chosen deployment platform.
