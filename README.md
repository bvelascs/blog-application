# Blog Application

![WSU Logo](apps/web/public/wsulogo.png)

## Overview

A blog application featuring both user-facing and administrative interfaces. This project implements a fully functional blog system with rich text editing, infinite scroll, and image uploads.

> **Note:** This project is currently configured for local development only. Please follow the installation steps below to run the application on your local machine.

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production)
- **Storage**: AWS S3 for image uploads
- **Testing**: Vitest, Playwright for E2E testing
- **Monorepo Management**: Turborepo, pnpm workspaces


## Installation & Setup

### Prerequisites
- Node.js 18 or higher
- pnpm 10.2.0 or higher

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blog-application.git
   cd blog-application
   ```

2. Install dependencies:
   ```bash
   pnpm i
   ```

3. Create a `.env` file in the root directory with the required environment variables:
 
4. Install turbo:
   ```bash
   npm i -g turbo
   ```

5. Start the development server:
   ```bash
   turbo dev
   ```

6. Access the applications:
   - Web: http://localhost:3001
   - Admin: http://localhost:3002

7. Run E2E tests:
   ```bash
   turbo test-3
   ```
   This command will run the Playwright E2E tests for the new features (Rich Text Editor, Infinite Scroll, and Image Uploads).

### Implemented Features

1. **Rich Text Editor**
   - Integrated rich text editing for creating and editing blog posts
   - Support for formatting, images, and code blocks

2. **Infinite Scroll Implementation**
   - Content loading as users scroll

3. **Image Upload System**
   - Direct image uploads to AWS S3 cloud storage
   - Image preview functionality

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

1. **CI Pipeline**: `.github/workflows/ci-cd.yml`
   - Automatically builds the application
   - Runs unit tests
   - Runs E2E tests for core functionality and new features
   - Sets up proper environment for AWS S3 testing
   - Generates test reports

2. **Testing Strategy**:
   - E2E tests with Playwright for critical user flows
   - Tagged tests (`@a3`) for new features:
     - Rich Text Editor
     - Infinite Scroll
     - Image Uploads
   - Run E2E tests with: `turbo test-3`

## Testing the Application

To fully test this application locally:

1. Follow the installation steps above to set up the project
2. Ensure you've set your `.env` file
3. Run both the web and admin applications using `turbo dev`
4. Test the new features:
   - **Rich Text Editor**: Create or edit a post in the admin interface
   - **Infinite Scroll**: Browse posts on the web interface and scroll down to load more
   - **Image Uploads**: Add an image when creating/editing posts in the admin interface
