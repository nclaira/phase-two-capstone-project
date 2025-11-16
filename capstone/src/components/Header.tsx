"use client";

import { memo, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const Header = memo(function Header() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-teal-100/50 shadow-lg shadow-teal-50/50">
      <nav className="container mx-auto flex h-20 items-center justify-between px-6">
       
        <Link
          href="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent hover:from-teal-700 hover:via-cyan-600 hover:to-teal-700 transition-all duration-300"
        >
          Medium Clone
        </Link>

      
        <div className="flex items-center justify-end gap-8">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors duration-200 relative group"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/posts"
            className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors duration-200 relative group"
          >
            Posts
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
           
           
          {isAuthenticated ? (
            // If user is logged in, show editor, drafts, profile link and logout button
            <>
              <Link
                href="/editor"
                className="rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Write
              </Link>
              <Link
                href="/feed"
                className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors duration-200 relative group"
              >
                Feed
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/drafts"
                className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors duration-200 relative group"
              >
                Drafts
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/profile"
                className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors duration-200 relative group"
              >
                Profile
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Logout
              </button>
            </>
          ) : (
            // If user is not logged in, show login and signup buttons
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
        </header>
      );
});

Header.displayName = "Header";

export default Header;

