import React from 'react';


const Footer: React.FC = () => {
  return (
    <footer className="bg-black relative z-10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-white grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Column 1: Logo + Motto */}
        <div>
          <h2 className="text-3xl font-extrabold text-green-400 mb-2">
            TourVista
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            Travel far, explore deeply, and create stories that last a
            lifetime. TourVista makes your journey magical.
          </p>
        </div>

        {/* Column 2: Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/packages"
                className="hover:text-green-400 transition-all"
              >
                Packages
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-green-400 transition-all">
                Home
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-green-400 transition-all">
                About Us
              </a>
            </li>
            <li>
              <a href="/" className="hover:text-green-400 transition-all">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact + Social */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <p className="text-sm text-gray-300 mb-3">
            📧 support@tourvista.com
          </p>
          <p className="text-sm text-gray-300 mb-6">📞 +977 9812345678</p>

          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-green-400">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-green-400">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-green-400">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-green-400">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} TourVista. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;