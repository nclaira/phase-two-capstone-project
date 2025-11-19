# Medium Clone - Publishing Platform

A full-stack web application inspired by Medium, built with Next.js, React, TypeScript, and MongoDB. This platform allows users to create accounts, publish articles, interact with content, and discover stories through tags and search.

## Features

- **User Authentication**: Secure signup/login with password encryption
- **Content Publishing**: Rich text editor for creating formatted articles
- **Social Features**: Comments, likes, and follow authors
- **Content Discovery**: Search, tags, and personalized feed
- **Draft Management**: Save and edit drafts before publishing
- **Responsive Design**: Works seamlessly on all devices

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Query** - Data fetching and caching
- **Jodit** - Rich text editor

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing

## Project Structure

```
capstone/-
-├── src/
-│   ├── app/
-│   │   ├── api/
-│   │   │   ├── auth/
-│   │   │   │   ├── login/
-│   │   │   │   │   └── route.ts
-│   │   │   │   └── signup/
-│   │   │   │       └── route.ts
-│   │   │   ├── posts/
-│   │   │   │   ├── [id]/
-│   │   │   │   │   └── route.ts
-│   │   │   │   ├── slug/
-│   │   │   │   │   └── [slug]/
-│   │   │   │   │       └── route.ts
-│   │   │   │   ├── tag/
-│   │   │   │   │   └── [tag]/
-│   │   │   │   │       └── route.ts
-│   │   │   │   └── route.ts
-│   │   │   └── test-db/
-│   │   │       └── route.ts
-│   │   ├── about/
-│   │   │   └── page.tsx
-│   │   ├── contact/
-│   │   │   └── page.tsx
-│   │   ├── drafts/
-│   │   │   └── page.tsx
-│   │   ├── editor/
-│   │   │   └── page.tsx
-│   │   ├── feed/
-│   │   │   └── page.tsx
-│   │   ├── login/
-│   │   │   └── page.tsx
-│   │   ├── posts/
-│   │   │   ├── [slug]/
-│   │   │   │   └── page.tsx
-│   │   │   └── -page.tsx
-│   │   ├── prof-ile/
-│   │   │   └── -page.tsx
-│   │   ├── sear-ch/
-│   │   │   └── -page.tsx
-│   │   ├── sign-up/
-│   │   │   └── -page.tsx
-│   │   ├── tags-/-
-│   │   │   └── [tag]/-
-│   │   │       └── page.tsx
-│   │   ├── favicon.ico
-│   │   ├── globals.css
-│   │   ├── layout.tsx
-│   │   ├── metadata.ts
-│   │   └── page.tsx
-│   ├── components-/
-│   │   ├── memoized-/
-│   │   │   ├── PostCard.tsx
-│   │   │   └── SearchBar.tsx
-│   │   ├── AuthProvider.tsx
-│   │   ├── Comment.tsx
-│   │   ├── CommentsSection.tsx
-│   │   ├── Container.tsx
-│   │   ├── Footer.tsx
-│   │   ├── Header.tsx
-│   │   ├── LoadingSkeleton.tsx
-│   │   ├── ProtectedRoute.tsx
-│   │   ├── QueryProvider.tsx
-│   │   ├── RichTextEditor.tsx
-│   │   └── SearchBar.tsx
-│   ├── contexts/
-│   │   ├── AuthContext.tsx
-│   │   └── ModalContext.tsx
-│   ├── hooks/
-│   │   ├── useComments.ts
-│   │   ├── useFollows.ts
-│   │   ├── useLikes.ts
-│   │   └── usePosts.ts
-│   ├── lib/
-│   │   ├── auth.ts
-│   │   ├── comments.ts
-│   │   ├── db.ts
-│   │   ├── drafts.ts
-│   │   ├── follows.ts
-│   │   ├── imageUpload.ts
-│   │   ├── likes.ts
-│   │   ├── performance.ts
-│   │   ├── posts.ts
-│   │   └── search.ts
-│   └── models/
-│       ├── Post.ts
-│       └── User.ts
-├── public/
-│   ├── file.svg
-│   ├── globe.svg
-│   ├── next.svg
-│   ├── vercel.svg
-│   └── window.svg
-├── .env.local
-├── eslint.config.mjs
-├── next.config.ts
-├── next-env.d.ts
-├── package.json
-├── package-lock.json
-├── postcss.config.mjs
-├── README.md
-└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd capstone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the `capstone` folder:
   ```env
   MONGODB_URI=mongodb://localhost:27017/auth_app
   ```
   
   For MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth_app?retryWrites=true&w=majority
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Structure

- **Database**: `auth_app` (or as specified in MONGODB_URI)
- **Collections**:
  - `auth_app` - User accounts
  - `posts` - Published articles and drafts

## Key Features Explained

### Authentication
- Users can sign up and log in
- Passwords are hashed using bcryptjs
- Session management with localStorage
- Protected routes for authenticated users

### Content Management
- Create, edit, and delete posts
- Save drafts before publishing
- Rich text editor with formatting options
- Tag posts for better discoverability

### Social Interactions
- Comment on posts
- Like posts
- Follow authors
- View personalized feed

## Testing the API

Visit `http://localhost:3000/api/test-db` to test MongoDB connection and view database information.

##  Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - User login

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/[id]` - Get post by ID
- `PUT /api/posts/[id]` - Update post
- `GET /api/posts/slug/[slug]` - Get post by slug
- `GET /api/posts/tag/[tag]` - Get posts by tag


## screenshots



