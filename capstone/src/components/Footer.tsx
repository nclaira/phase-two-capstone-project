export default function Footer() {
  return (
    <footer className="mt-auto border-t border-teal-100 bg-gradient-to-b from-white to-teal-50/30">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-6 md:gap-10 md:grid-cols-3">
          

          <div>
            <h3 className="mb-3 md:mb-4 text-lg md:text-xl font-bold text-slate-800">About</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              A modern publishing platform inspired by Medium. Share your
              thoughts and stories with the world. Join our community of
              writers and readers.
            </p>
          </div>

          <div>
            <h3 className="mb-3 md:mb-4 text-lg md:text-xl font-bold text-slate-800">Quick Links</h3>
            <ul className="space-y-2 md:space-y-3 text-sm">
              <li>
                <a href="/" className="text-slate-600 transition-colors hover:text-teal-600 hover:font-semibold">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-slate-600 transition-colors hover:text-teal-600 hover:font-semibold">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="text-slate-600 transition-colors hover:text-teal-600 hover:font-semibold">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 md:mb-4 text-lg md:text-xl font-bold text-slate-800">Contact</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              <span className="font-semibold text-teal-600">Email:</span>{" "}
              contact@mediumclone.com
              <br />
              <span className="font-semibold text-teal-600">Follow us</span> on
              social media
            </p>
          </div>
        </div>

      
        <div className="mt-8 md:mt-12 border-t border-teal-100 pt-6 md:pt-8 text-center">
          <p className="text-xs md:text-sm text-slate-600">
            &copy; {new Date().getFullYear()} Medium Clone. All rights reserved.
            Made with ❤️ for writers and readers.
          </p>
        </div>
      </div>
    </footer>
  );
}

