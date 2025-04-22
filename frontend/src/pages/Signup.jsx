// import React, { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import authService from '../services/authService';

// export default function Signup() {
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirm, setConfirm] = useState('');
//   const [isAdmin, setIsAdmin] = useState(false); // New state for admin checkbox
//   const [adminKey, setAdminKey] = useState(''); // New state for admin key
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (password !== confirm) {
//       setError('Passwords do not match');
//       return;
//     }

//     if (isAdmin && !adminKey) {
//       setError('Admin key is required for admin registration');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     try {
//       const userData = await authService.signup(name, email, password, isAdmin ? adminKey : null);
//       login(userData);
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Registration failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen pt-20 px-4 bg-gray-100 dark:bg-zinc-900 transition-colors duration-300">
//       <div className="flex justify-center items-center">
//         <div className="bg-white dark:bg-zinc-800 shadow-2xl rounded-2xl p-8 w-full max-w-md animate-fade-in">
//           <h3 className="text-3xl font-bold text-center mb-6 text-zinc-800 dark:text-white">
//             Create Your Account
//           </h3>
//           {error && <div className="text-red-500 text-center mb-4">{error}</div>}
//           <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
//             <div className="flex flex-col">
//               <label htmlFor="name" className="font-semibold text-zinc-700 dark:text-zinc-200">Name</label>
//               <input
//                 type="text"
//                 id="name"
//                 value={name}
//                 onChange={e => setName(e.target.value)}
//                 required
//                 className="p-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white"
//               />
//             </div>
//             <div className="flex flex-col">
//               <label htmlFor="email" className="font-semibold text-zinc-700 dark:text-zinc-200">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 required
//                 className="p-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white"
//               />
//             </div>
//             <div className="flex flex-col">
//               <label htmlFor="password" className="font-semibold text-zinc-700 dark:text-zinc-200">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 value={password}
//                 onChange={e => setPassword(e.target.value)}
//                 required
//                 className="p-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white"
//               />
//             </div>
//             <div className="flex flex-col">
//               <label htmlFor="confirm" className="font-semibold text-zinc-700 dark:text-zinc-200">Confirm Password</label>
//               <input
//                 type="password"
//                 id="confirm"
//                 value={confirm}
//                 onChange={e => setConfirm(e.target.value)}
//                 required
//                 className="p-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white"
//               />
//             </div>
//             <div className="flex items-center space-x-2">
//               <input
//                 type="checkbox"
//                 id="isAdmin"
//                 checked={isAdmin}
//                 onChange={e => setIsAdmin(e.target.checked)}
//                 className="w-4 h-4"
//               />
//               <label htmlFor="isAdmin" className="text-zinc-700 dark:text-zinc-200">Register as Admin</label>
//             </div>
//             {isAdmin && (
//               <div className="flex flex-col">
//                 <label htmlFor="adminKey" className="font-semibold text-zinc-700 dark:text-zinc-200">Admin Key</label>
//                 <input
//                   type="password"
//                   id="adminKey"
//                   value={adminKey}
//                   onChange={e => setAdminKey(e.target.value)}
//                   required
//                   className="p-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white"
//                 />
//               </div>
//             )}
//             <button
//               type="submit"
//               disabled={loading}
//               className={`bg-black dark:bg-white dark:text-black text-white p-2 rounded-lg mt-4 font-semibold transition hover:scale-105 duration-200 ${
//                 loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800 dark:hover:bg-gray-200'
//               }`}
//             >
//               {loading ? 'Signing up...' : 'Register'}
//             </button>
//             <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
//               Already have an account?{' '}
//               <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
//                 Login
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // State for screen reader announcements
  const [announcement, setAnnouncement] = useState('');
  
  // For password validation feedback
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Check password match on confirm password change
  useEffect(() => {
    if (confirm && password !== confirm) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  }, [confirm, password]);

  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength('');
      return;
    }
    
    let strength = '';
    if (password.length < 8) {
      strength = 'weak';
    } else if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      strength = 'strong';
    } else {
      strength = 'medium';
    }
    
    setPasswordStrength(strength);
  }, [password]);

  // Clear announcements after they've been read
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => {
        setAnnouncement('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      setAnnouncement('Error: Passwords do not match');
      return;
    }

    if (isAdmin && !adminKey) {
      setError('Admin key is required for admin registration');
      setAnnouncement('Error: Admin key is required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const userData = await authService.signup(name, email, password, isAdmin ? adminKey : null);
      login(userData);
      setAnnouncement('Registration successful, redirecting to home page');
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      setAnnouncement(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 bg-gray-100 dark:bg-zinc-900 transition-colors duration-300">
      {/* Screen reader announcement */}
      <div 
        aria-live="assertive" 
        className="sr-only" 
        role="status"
      >
        {announcement}
      </div>
      
      <div className="flex justify-center items-center">
        <div className="bg-white dark:bg-zinc-800 shadow-2xl rounded-2xl p-8 w-full max-w-md animate-fade-in">
          <h1 className="text-3xl font-bold text-center mb-6 text-zinc-800 dark:text-white">
            Create Your Account
          </h1>
          
          {error && <div className="text-red-500 text-center mb-4" role="alert">{error}</div>}
          
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4" noValidate>
            <div className="flex flex-col">
              <label htmlFor="name" className="font-semibold text-zinc-700 dark:text-zinc-200">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                aria-required="true"
                className="p-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white"
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="email" className="font-semibold text-zinc-700 dark:text-zinc-200">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                aria-required="true"
                aria-describedby="email-format"
                className="p-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white"
              />
              <span id="email-format" className="sr-only">Email must be a valid format like example@domain.com</span>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="password" className="font-semibold text-zinc-700 dark:text-zinc-200">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                aria-required="true"
                aria-describedby="password-help"
                className="p-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white"
              />
              <div id="password-help" className="mt-1 text-xs">
                {passwordStrength && (
                  <div className="flex items-center" role="status">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                      passwordStrength === 'weak' ? 'bg-red-500' : 
                      passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} aria-hidden="true"></span>
                    <span className={`${
                      passwordStrength === 'weak' ? 'text-red-500' : 
                      passwordStrength === 'medium' ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {passwordStrength === 'weak' ? 'Weak password (use at least 8 characters)' : 
                       passwordStrength === 'medium' ? 'Medium password' : 'Strong password'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="confirm" className="font-semibold text-zinc-700 dark:text-zinc-200">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                aria-required="true"
                aria-invalid={!passwordsMatch}
                aria-describedby="confirm-help"
                className={`p-2 border ${!passwordsMatch ? 'border-red-500' : 'border-gray-300 dark:border-zinc-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white`}
              />
              {!passwordsMatch && (
                <div id="confirm-help" className="text-red-500 text-xs mt-1" role="alert">
                  Passwords do not match
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={e => setIsAdmin(e.target.checked)}
                className="w-4 h-4"
                aria-controls="adminKeySection"
              />
              <label htmlFor="isAdmin" className="text-zinc-700 dark:text-zinc-200">
                Register as Admin
              </label>
            </div>
            
            {isAdmin && (
              <div id="adminKeySection" className="flex flex-col">
                <label htmlFor="adminKey" className="font-semibold text-zinc-700 dark:text-zinc-200">
                  Admin Key
                </label>
                <input
                  type="password"
                  id="adminKey"
                  value={adminKey}
                  onChange={e => setAdminKey(e.target.value)}
                  required
                  aria-required="true"
                  className="p-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white"
                />
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className={`bg-black dark:bg-white dark:text-black text-white p-2 rounded-lg mt-4 font-semibold transition hover:scale-105 duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800 dark:hover:bg-gray-200'
              }`}
            >
              {loading ? 'Signing up...' : 'Register'}
            </button>
            
            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}