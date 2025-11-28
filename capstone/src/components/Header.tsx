"use client";

import { memo, useCallback, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const Header = memo(function Header() {
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = useCallback(() => {
    logout();
    setIsMenuOpen(false);
  }, [logout]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-teal-100/50 shadow-lg shadow-teal-50/50">
      <nav className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-teal-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent hover:from-teal-700 hover:via-cyan-600 hover:to-teal-700 transition-all duration-300"
          onClick={closeMenu}
        >
          Medium Clone
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-end gap-8">
          <Link href="/" className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors duration-200 relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/posts" className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors duration-200 relative group">
            Posts
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          {isAuthenticated ? (
            <>
              <Link href="/editor" className="rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Write
              </Link>
              <Link href="/feed" className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors duration-200 relative group">
                Feed
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/drafts" className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors duration-200 relative group">
                Drafts
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/profile" className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors duration-200 relative group">
                Profile
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <button onClick={handleLogout} className="rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors duration-200">
                Login
              </Link>
              <Link href="/signup" className="rounded-lg bg-gradient-to-r from-teal-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button onClick={toggleMenu} className="md:hidden p-2">
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-slate-700 mt-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-slate-700 mt-1 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-teal-100">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" onClick={closeMenu} className="block py-2 text-slate-700 hover:text-teal-600">
              Home
            </Link>
            <Link href="/posts" onClick={closeMenu} className="block py-2 text-slate-700 hover:text-teal-600">
              Posts
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/editor" onClick={closeMenu} className="block py-2 text-slate-700 hover:text-teal-600">
                  Write
                </Link>
                <Link href="/feed" onClick={closeMenu} className="block py-2 text-slate-700 hover:text-teal-600">
                  Feed
                </Link>
                <Link href="/drafts" onClick={closeMenu} className="block py-2 text-slate-700 hover:text-teal-600">
                  Drafts
                </Link>
                <Link href="/profile" onClick={closeMenu} className="block py-2 text-slate-700 hover:text-teal-600">
                  Profile
                </Link>
                <button onClick={handleLogout} className="block w-full text-left py-2 text-slate-700 hover:text-teal-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMenu} className="block py-2 text-slate-700 hover:text-teal-600">
                  Login
                </Link>
                <Link href="/signup" onClick={closeMenu} className="block py-2 text-slate-700 hover:text-teal-600">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
});

Header.displayName = "Header";

export default Header;

