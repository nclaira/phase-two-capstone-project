"use client";

import Link from "next/link";
import Container from "@/components/Container";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30 py-16">
      <Container>
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-teal-100 via-cyan-100 to-teal-100 px-6 py-2">
              <span className="text-sm font-semibold text-teal-700">
                About Medium Clone
              </span>
            </div>
            <h1 className="mb-4 bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl">
              Medium Clone Project
            </h1>
            <p className="text-lg text-slate-600">
              A modern publishing platform inspired by Medium
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Project Overview */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-3xl font-bold text-slate-800">
                Project Overview
              </h2>
              <p className="mb-4 text-slate-600 leading-relaxed">
                Medium Clone is a full-stack web application that replicates the core
                functionality of Medium, a popular online publishing platform. This
                project demonstrates modern web development practices using Next.js,
                React, TypeScript, and MongoDB.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Built as a capstone project, this platform allows users to create
                accounts, publish articles, interact with content through comments and
                likes, and discover stories through tags and search functionality.
              </p>
            </div>

            {/* Technology Stack */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-3xl font-bold text-slate-800">
                Technology Stack
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 text-white flex-shrink-0">
                    <span className="text-xl">⚛️</span>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-slate-800">
                      Frontend
                    </h3>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Next.js 16 (React Framework)</li>
                      <li>• TypeScript</li>
                      <li>• Tailwind CSS</li>
                      <li>• React Query (TanStack Query)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 text-white flex-shrink-0">
                    <span className="text-xl">🗄️</span>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-slate-800">
                      Backend
                    </h3>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Next.js API Routes</li>
                      <li>• MongoDB (Database)</li>
                      <li>• Mongoose (ODM)</li>
                      <li>• bcryptjs (Password Hashing)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 text-white flex-shrink-0">
                    <span className="text-xl">🔐</span>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-slate-800">
                      Authentication
                    </h3>
                    <ul className="space-y-1 text-slate-600">
                      <li>• User Registration & Login</li>
                      <li>• Password Encryption</li>
                      <li>• Session Management</li>
                      <li>• Protected Routes</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 text-white flex-shrink-0">
                    <span className="text-xl">📝</span>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-slate-800">
                      Features
                    </h3>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Rich Text Editor (Jodit)</li>
                      <li>• Post Publishing & Drafts</li>
                      <li>• Comments & Likes</li>
                      <li>• Tags & Search</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-3xl font-bold text-slate-800">
                Key Features
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-teal-500 pl-4">
                  <h3 className="mb-2 text-xl font-bold text-slate-800">
                    User Management
                  </h3>
                  <p className="text-slate-600">
                    Complete user authentication system with signup, login, and profile
                    management. User data is securely stored in MongoDB with encrypted
                    passwords.
                  </p>
                </div>
                <div className="border-l-4 border-cyan-500 pl-4">
                  <h3 className="mb-2 text-xl font-bold text-slate-800">
                    Content Publishing
                  </h3>
                  <p className="text-slate-600">
                    Rich text editor for creating formatted articles with support for
                    images, code blocks, and more. Posts can be saved as drafts or
                    published immediately.
                  </p>
                </div>
                <div className="border-l-4 border-teal-500 pl-4">
                  <h3 className="mb-2 text-xl font-bold text-slate-800">
                    Social Features
                  </h3>
                  <p className="text-slate-600">
                    Users can comment on posts, like content, follow authors, and
                    discover new stories through tags and personalized feeds.
                  </p>
                </div>
                <div className="border-l-4 border-cyan-500 pl-4">
                  <h3 className="mb-2 text-xl font-bold text-slate-800">
                    Content Discovery
                  </h3>
                  <p className="text-slate-600">
                    Advanced search functionality, tag-based filtering, and
                    recommendation system to help users find content that interests
                    them.
                  </p>
                </div>
              </div>
            </div>

            {/* Database Structure */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-3xl font-bold text-slate-800">
                Database Structure
              </h2>
              <div className="space-y-4">
                <div className="rounded-lg bg-slate-50 p-4">
                  <h3 className="mb-2 font-bold text-slate-800">Users Collection</h3>
                  <p className="mb-2 text-sm text-slate-600">
                    Stores user account information including name, email, password
                    (hashed), bio, and avatar.
                  </p>
                  <code className="text-xs text-teal-600">
                    Collection: auth_app
                  </code>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <h3 className="mb-2 font-bold text-slate-800">Posts Collection</h3>
                  <p className="mb-2 text-sm text-slate-600">
                    Stores published articles and drafts with title, content, tags,
                    author information, and metadata.
                  </p>
                  <code className="text-xs text-teal-600">
                    Collection: posts
                  </code>
                </div>
              </div>
            </div>

            {/* Project Goals */}
            <div className="rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 p-8 text-center shadow-lg">
              <h2 className="mb-4 text-3xl font-bold text-white">
                Project Goals
              </h2>
              <p className="mb-6 text-teal-100">
                This project demonstrates proficiency in full-stack development,
                database design, user authentication, and modern web application
                architecture. It showcases the ability to build a production-ready
                application with clean code, proper error handling, and responsive
                design.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex flex-col gap-4 text-center sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center text-teal-600 hover:text-teal-700 font-semibold"
            >
              ← Back to Home
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center text-teal-600 hover:text-teal-700 font-semibold"
            >
              Learn More About Us →
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
