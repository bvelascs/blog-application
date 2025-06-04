# Blog Application E2E Testing

This document outlines the E2E testing setup for the Blog Application, focusing on the new functionalities:

1. Rich Text Editor (TinyMCE) with Markdown support
2. Infinite Scroll for blog posts
3. Image Uploads to AWS S3

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- PNPM 8 or higher
- A local or test database

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Generate Prisma client:
   ```bash
   cd packages/db
   npx prisma generate
   ```

3. Set up environment variables:
   Create a `.env` file in the `tests/playwright` directory with the following:
   ```
   DATABASE_URL="file:./dev.db"
   AWS_ACCESS_KEY_ID="your_aws_key"
   AWS_SECRET_ACCESS_KEY="your_aws_secret"
   AWS_REGION="your_region"
   AWS_S3_BUCKET="your_bucket_name"
   ```

### Running E2E Tests

To run all E2E tests:
```bash
cd tests/playwright
pnpm test-3
```

To run specific test suites:
- Rich Text Editor tests: `pnpm playwright test admin/rich-text-editor.spec.ts`
- Infinite Scroll tests: `pnpm playwright test web/pagination.test.ts`
- Image Upload tests: `pnpm playwright test admin/image-upload.spec.ts`

To debug tests using the Playwright UI:
```bash
cd tests/playwright
pnpm ui
```

## CI/CD Pipeline

The project uses GitHub Actions for automated testing. The workflow is defined in `.github/workflows/e2e-tests.yml` and runs automatically on push to main/master branches or on pull requests.

### CI Pipeline Features

1. **Automated Testing**: Runs all E2E tests on each code push or pull request
2. **Build Validation**: Ensures that the application builds correctly
3. **Test Reports**: Generates and stores test reports as artifacts
4. **Environment Setup**: Sets up the required environment variables

### Setting Up GitHub Actions Secrets

For the CI pipeline to work with AWS S3 image uploads, you need to set up these GitHub repository secrets:

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `AWS_ACCESS_KEY_ID`: Your AWS access key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
   - `AWS_REGION`: Your AWS region (e.g., us-east-1)
   - `AWS_S3_BUCKET`: Your S3 bucket name

## E2E Test Coverage

### Rich Text Editor Tests
- Verify TinyMCE editor loads correctly
- Test text formatting features (bold, italic, etc.)
- Test markdown support and rendering
- Verify saving posts with rich text content

### Infinite Scroll Tests
- Verify initial post loading
- Test loading more posts on scroll
- Verify multiple scroll-triggered loading
- Check loading indicators
- Test scroll position maintenance after viewing posts

### Image Upload Tests
- Verify image upload functionality to AWS S3
- Test image insertion into post content
- Validate S3 URL format
- Test error handling for invalid uploads

## Extending Tests

When adding new features to the blog application, follow these guidelines for E2E tests:

1. Create test files in the appropriate directory:
   - Admin features: `tests/playwright/tests/admin/`
   - Web features: `tests/playwright/tests/web/`

2. Follow the existing naming conventions and patterns

3. Add the `{ tag: "@a3" }` tag to ensure tests run in the CI pipeline

4. Use Playwright's built-in assertions and test utilities

5. Create meaningful test descriptions that document the feature behavior
