# Blog Application

![WSU Logo](apps/web/public/wsulogo.png)

## 📋 Overview

A modern, responsive blog application built with Next.js, Tailwind CSS, and Prisma, featuring both user-facing and administrative interfaces. This project implements a fully functional blog system with rich text editing, pagination, and commenting capabilities.

## 🎯 Objectives

Develop a fully functional Blog application that meets the requirements from the three prior assignments, with additional enhancements and a polished user interface.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production)
- **Testing**: Vitest, Playwright for E2E testing
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions
- **Monorepo Management**: Turborepo, pnpm workspaces

## 🏗️ Project Structure

The project is organized as a monorepo using Turborepo and pnpm workspaces:

```
blog-application/
├── apps/
│   ├── admin/        # Admin dashboard for content management
│   └── web/          # User-facing blog website
├── packages/
│   ├── db/           # Database schema and Prisma client
│   ├── env/          # Environment variable handling
│   ├── eslint-config/ # Shared ESLint configurations
│   ├── tailwind-config/ # Shared Tailwind configuration
│   ├── typescript-config/ # Shared TypeScript configurations
│   ├── ui/           # Shared UI components
│   └── utils/        # Shared utility functions
├── src/              # Global source files
└── tests/            # E2E and Storybook tests
```

## ⚙️ Installation & Setup

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

3. Set up environment variables:
   ```bash
   USERNAME=admin
   PASSWORD=123
   JWT_SECRET=super-secret-password
   ```

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

## 📝 Requirements

### Complete All Three Assignments
- All code and functionality from Assignments 1, 2, and 3 fully implemented
- All associated tests pass successfully (unit tests, integration tests, etc.)
- The application handles edge cases appropriately

### User Interface (UI)
- Professional UI implemented with Tailwind CSS
- Responsive design works seamlessly on both desktop and mobile devices
- Consistent design language across all components

### Implemented Features

1. **Rich Text Editor**
   - Integrated rich text editing for creating and editing blog posts
   - Support for formatting, images, and code blocks

2. **Infinite Scroll Implementation**
   - Modern, seamless content loading as users scroll
   - Lazy-loading of blog posts for improved performance
   - Backend API support with skip/take pagination pattern
   - Optimised for handling large numbers of posts

3. **Comment System**
   - Users can comment on blog posts
   - Support for nested replies
   - Moderation capabilities in the admin interface

## 🔍 API Reference

### Blog Posts API

| Endpoint                | Method | Description                                        | Authentication |
|-------------------------|--------|----------------------------------------------------|----------------|
| `/api/posts`            | GET    | Get posts with infinite scroll support (paginated)  | Public         |
| `/api/posts/:urlId`     | GET    | Get a specific post by URL ID        | Public         |
| `/api/posts`            | POST   | Create a new post                    | Admin only     |
| `/api/posts/:id`        | PUT    | Update an existing post              | Admin only     |
| `/api/posts/:id`        | DELETE | Delete a post                        | Admin only     |

### Comments API

| Endpoint                        | Method | Description                     | Authentication |
|---------------------------------|--------|---------------------------------|----------------|
| `/api/posts/:postId/comments`   | GET    | Get all comments for a post     | Public         |
| `/api/posts/:postId/comments`   | POST   | Add a comment to a post         | Public         |
| `/api/comments/:id`             | DELETE | Delete a comment                | Admin only     |


## 📊 Design Decisions

### Architecture
The application follows a monorepo architecture to share code between the admin dashboard and user-facing website while maintaining separation of concerns. This approach allows for:
- Code reuse across applications
- Consistent styling and component behavior
- Simplified dependency management

### Database Schema
The Prisma schema is designed to support all blog features including:
- Posts with rich content storage
- Categorization and tagging system
- View tracking with unique IP detection
- Comment system with parent-child relationships

### Performance Optimisations
- Static Site Generation for blog posts
- Image optimization with Next.js Image component
- Infinite scroll with lazy loading to limit initial load size
- Intersection Observer API for efficient DOM updates
- Proper data fetching strategies to minimize waterfall requests

## 📋 Deliverables
- [ ] Source code in a GitHub/GitLab repository (provide the link)
- [ ] All new functionality accompanied by E2E tests
- [ ] CI pipeline executing the tests
- [ ] Deployed application URL
- [ ] A short demo video (3-5 minutes) showcasing the application's features and functionality
