// import React, { useContext, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FiBell, FiMenu, FiX } from 'react-icons/fi';
// import { AuthContext } from '../context/AuthContext';
// import { ThemeContext } from '../context/ThemeContext';

// export default function Navbar() {
//   const navigate = useNavigate();
//   const { user, logout } = useContext(AuthContext);
//   const { darkMode, toggleTheme } = useContext(ThemeContext);
//   const [menuOpen, setMenuOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const notificationCount = 0;

//   return (
//     <header className="bg-white dark:bg-[#0d0d0d] shadow-sm fixed w-full z-50 border-b border-slate-100 dark:border-[#2c2c2c] transition-colors">
//       <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
//         {/* Logo */}
//         <Link
//           to="/"
//           className="text-3xl font-bold tracking-tight text-slate-900 dark:text-[#feffff] hover:text-sky-600 dark:hover:text-sky-400 transition"
//         >
//           SHOPLYST
//         </Link>


//         <nav className="hidden md:flex items-center space-x-8 text-lg text-slate-700 dark:text-slate-300">
//           {
//             user && <Link
//               to="/wishlist"
//               className="hover:text-sky-600 dark:hover:text-sky-400 transition"
//             >
//               Wishlist
//             </Link>
//           }


//           <button
//             onClick={() => navigate('/alerts')}
//             className="relative hover:text-sky-600 dark:hover:text-sky-400 transition"
//             aria-label="View notifications"
//           >
//             <FiBell className="w-7 h-7" />
//             {notificationCount > 0 && (
//               <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
//                 {notificationCount}
//               </span>
//             )}
//           </button>

//           <button
//             onClick={toggleTheme}
//             className="hover:text-sky-600 dark:hover:text-sky-400 text-lg transition"
//           >
//             {darkMode ? '☀️ Light' : '🌙 Dark'}
//           </button>

//           {user ? (
//             <div className="flex items-center gap-4">
//               <span className="text-slate-800 dark:text-slate-200 text-lg">{user.username}</span>
//               <button
//                 onClick={handleLogout}
//                 className="text-red-500 text-base hover:underline"
//               >
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <Link
//               to="/login"
//               className="bg-sky-600 hover:bg-sky-700 text-white text-base px-5 py-2.5 rounded-lg transition"
//             >
//               Sign In
//             </Link>
//           )}
//         </nav>

//         {/* Mobile Toggle */}
//         <button
//           className="md:hidden text-slate-700 dark:text-slate-300 focus:outline-none"
//           onClick={() => setMenuOpen(!menuOpen)}
//           aria-label={menuOpen ? 'Close menu' : 'Open menu'}
//         >
//           {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <div className="md:hidden px-4 pb-4 pt-2 space-y-4 bg-white dark:bg-[#0d0d0d] shadow border-t border-slate-100 dark:border-[#2c2c2c] text-lg text-slate-700 dark:text-slate-300 transition-colors">
//           <Link
//             to="/wishlist"
//             onClick={() => setMenuOpen(false)}
//             className="block hover:text-sky-600 dark:hover:text-sky-400"
//           >
//             Wishlist
//           </Link>

//           <button
//             onClick={() => {
//               setMenuOpen(false);
//               navigate('/alerts');
//             }}
//             className="flex items-center gap-2 hover:text-sky-600 dark:hover:text-sky-400 transition"
//           >
//             <FiBell className="w-6 h-6" />
//             <span>Alerts</span>
//             {notificationCount > 0 && (
//               <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                 {notificationCount}
//               </span>
//             )}
//           </button>

//           <button
//             onClick={toggleTheme}
//             className="w-full text-left hover:text-sky-600 dark:hover:text-sky-400 transition"
//           >
//             {darkMode ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
//           </button>

//           {/* {user ? (
//             <>
//               <span className="block text-slate-800 dark:text-slate-200 text-lg">{user.username}</span>
//               <button
//                 onClick={handleLogout}
//                 className="text-red-500 hover:underline"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <Link
//               to="/login"
//               onClick={() => setMenuOpen(false)}
//               className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg text-center block transition"
//             >
//               Sign In
//             </Link>
//           )} */}
//           {user ? (
//             <div className="relative" ref={menuRef}>
//               <button
//                 onClick={() => setMenuOpen((prev) => !prev)}
//                 className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
//               >
//                 <span className="text-slate-800 dark:text-slate-200 text-lg">
//                   Hi, {user}
//                 </span>
//                 <FiChevronDown className="w-4 h-4 text-slate-600" />
//               </button>
//               {menuOpen && (
//                 <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-10">
//                   <button
//                     onClick={handleLogout}
//                     className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <Link
//               to="/login"
//               onClick={() => setMenuOpen(false)}
//               className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg text-center block transition"
//             >
//               Sign In
//             </Link>
//           )}

//         </div>
//       )}
//     </header>
//   );
// }

import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation for dropdown
  useEffect(() => {
    if (!dropdownOpen) return;
    
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dropdownOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!menuOpen) return;
    
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const notificationCount = 0;

  const toggleMobileMenu = () => {
    setMenuOpen(!menuOpen);
    // Announce menu state to screen readers
    const announcement = !menuOpen ? 'Navigation menu opened' : 'Navigation menu closed';
    announceToScreenReader(announcement);
  };

  const toggleUserDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    // Announce dropdown state to screen readers
    const announcement = !dropdownOpen ? 'User menu opened' : 'User menu closed';
    announceToScreenReader(announcement);
  };

  // Helper function for screen reader announcements
  const announceToScreenReader = (message) => {
    const announcer = document.getElementById('sr-announcer');
    if (announcer) {
      announcer.textContent = message;
    }
  };

  return (
    <>
      {/* Screen reader announcement region */}
      <div 
        id="sr-announcer" 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      ></div>
      
      <header className="bg-white dark:bg-[#0d0d0d] shadow-sm fixed w-full z-50 border-b border-slate-100 dark:border-[#2c2c2c] transition-colors" role="banner">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-bold tracking-tight text-slate-900 dark:text-[#feffff] hover:text-sky-600 dark:hover:text-sky-400 transition"
            aria-label="SHOPLYST, go to home page"
          >
            SHOPLYST
          </Link>

          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex items-center space-x-8 text-lg text-slate-700 dark:text-slate-300" 
            aria-label="Main navigation"
          >
            {user && !user.isadmin && (
              <Link
                to="/wishlist"
                className="hover:text-sky-600 dark:hover:text-sky-400 transition"
                aria-label="Go to wishlist"
              >
                Wishlist
              </Link>
            )}

            {user && !user.isadmin && (
              <button
                onClick={() => navigate('/alerts')}
                className="relative flex items-center gap-2 hover:text-sky-600 dark:hover:text-sky-400 transition"
                aria-label={`Alerts ${notificationCount > 0 ? `, ${notificationCount} new notifications` : ''}`}
              >
                <FiBell className="w-6 h-6" aria-hidden="true" />
                <span>Alerts</span>
                {notificationCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" aria-hidden="true">
                    {notificationCount}
                  </span>
                )}
              </button>
            )}

            {user && user.isadmin && (
              <button
                onClick={() => navigate('/product/add')}
                className="hover:text-sky-600 dark:hover:text-sky-400 transition"
                aria-label="Add new product"
              >
                Add Product
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="hover:text-sky-600 dark:hover:text-sky-400 text-lg transition"
              aria-pressed={darkMode}
              aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>

            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 transition"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                  aria-controls="user-dropdown"
                >
                  <span className="text-slate-800 dark:text-white text-lg">
                    Hi, {user.name}
                  </span>
                  <FiChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-300" aria-hidden="true" />
                </button>
                {dropdownOpen && (
                  <div 
                    id="user-dropdown"
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-md z-10"
                    role="menu"
                    aria-labelledby="user-menu-button"
                  >
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-sky-600 hover:bg-sky-700 text-white text-base px-5 py-2.5 rounded-lg transition"
                aria-label="Sign in to your account"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 rounded-md p-1"
            onClick={toggleMobileMenu}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <FiX size={28} aria-hidden="true" /> : <FiMenu size={28} aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden px-4 pb-4 pt-2 space-y-4 bg-white dark:bg-[#0d0d0d] shadow border-t border-slate-100 dark:border-[#2c2c2c] text-lg text-slate-700 dark:text-slate-300 transition-colors"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <Link
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-sky-600 dark:hover:text-sky-400"
              aria-label="Go to wishlist"
            >
              Wishlist
            </Link>

            <button
              onClick={() => {
                setMenuOpen(false);
                navigate('/alerts');
              }}
              className="flex items-center gap-2 hover:text-sky-600 dark:hover:text-sky-400 transition"
              aria-label={`Alerts ${notificationCount > 0 ? `, ${notificationCount} new notifications` : ''}`}
            >
              <FiBell className="w-6 h-6" aria-hidden="true" />
              <span>Alerts</span>
              {notificationCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" aria-hidden="true">
                  {notificationCount}
                </span>
              )}
            </button>

            <button
              onClick={toggleTheme}
              className="w-full text-left hover:text-sky-600 dark:hover:text-sky-400 transition"
              aria-pressed={darkMode}
              aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            >
              {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>

            {user ? (
              <>
                <span className="block text-slate-800 dark:text-slate-200 text-lg">
                  Hi, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:underline focus:outline-none focus:ring-2 focus:ring-red-400 rounded px-2"
                  aria-label="Logout from your account"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg text-center block transition"
                aria-label="Sign in to your account"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}