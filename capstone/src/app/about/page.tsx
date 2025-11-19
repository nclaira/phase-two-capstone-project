"use client";

import Link from "next/link";
import Container from "@/components/Container";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50/30 py-16">
      <Container>
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-teal-100 via-cyan-100 to-teal-100 px-6 py-2">
              <span className="text-sm font-semibold text-teal-700">
                Our Story
              </span>
            </div>
            <h1 className="mb-4 bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 bg-clip-text text-4xl font-extrabold text-transparent md:text-5xl">
              About Us
            </h1>
            <p className="text-lg text-slate-600">
              A modern publishing platform for writers and readers
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Mission Section */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h2 className="mb-4 text-3xl font-bold text-slate-800">
                Our Mission
              </h2>
              <p className="mb-4 text-slate-600 leading-relaxed">
                We believe that everyone has a story to tell. Our platform empowers
                writers of all backgrounds to share their thoughts, ideas, and
                experiences with a global audience. We&apos;re building a community
                where creativity thrives and meaningful conversations happen.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Whether you&apos;re a seasoned author or just starting your writing
                journey, we provide the tools and platform you need to express
                yourself and connect with readers who matter.
              </p>
            </div>

            {/* Features Section */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-3xl font-bold text-slate-800">
                What We Offer
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 text-white flex-shrink-0">
                    <span className="text-xl">✍️</span>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-slate-800">
                      Rich Text Editor
                    </h3>
                    <p className="text-slate-600">
                      Create beautiful, formatted content with our powerful editor
                      that supports images, code blocks, and more.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 text-white flex-shrink-0">
                    <span className="text-xl">👥</span>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-slate-800">
                      Community Features
                    </h3>
                    <p className="text-slate-600">
                      Engage with readers through comments, likes, and following
                      your favorite authors.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 text-white flex-shrink-0">
                    <span className="text-xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-slate-800">
                      Discover Content
                    </h3>
                    <p className="text-slate-600">
                      Find stories that matter to you through tags, search, and
                      personalized recommendations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 text-white flex-shrink-0">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-slate-800">
                      Responsive Design
                    </h3>
                    <p className="text-slate-600">
                      Read and write seamlessly on any device - desktop, tablet, or
                      mobile.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-3xl font-bold text-slate-800">
                Our Values
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-teal-500 pl-4">
                  <h3 className="mb-2 text-xl font-bold text-slate-800">
                    Freedom of Expression
                  </h3>
                  <p className="text-slate-600">
                    We believe in giving writers the freedom to express their ideas
                    and opinions without restrictions.
                  </p>
                </div>
                <div className="border-l-4 border-cyan-500 pl-4">
                  <h3 className="mb-2 text-xl font-bold text-slate-800">
                    Quality Content
                  </h3>
                  <p className="text-slate-600">
                    We&apos;re committed to maintaining high standards and helping
                    writers create their best work.
                  </p>
                </div>
                <div className="border-l-4 border-teal-500 pl-4">
                  <h3 className="mb-2 text-xl font-bold text-slate-800">
                    Community First
                  </h3>
                  <p className="text-slate-600">
                    Our community is at the heart of everything we do. We build
                    features that bring writers and readers together.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 p-8 text-center shadow-lg">
              <h2 className="mb-4 text-3xl font-bold text-white">
                Ready to Start Writing?
              </h2>
              <p className="mb-6 text-teal-100">
                Join our community of writers and share your story with the world.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/signup"
                  className="inline-block rounded-lg bg-white px-8 py-3 font-semibold text-teal-600 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Get Started
                </Link>
                <Link
                  href="/posts"
                  className="inline-block rounded-lg border-2 border-white bg-transparent px-8 py-3 font-semibold text-white transition-all duration-300 hover:bg-white/10"
                >
                  Browse Stories
                </Link>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-teal-600 hover:text-teal-700 font-semibold"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

