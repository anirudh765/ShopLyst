// // src/pages/Login.jsx
// import React, { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import authService from '../services/authService';

// export default function Login() {
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     try {
//       const { user, token } = await authService.login(email, password);
//       login({ user, token });
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-zinc-900 dark:to-black transition-colors duration-300 px-4">
//       <div className="bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-200 dark:border-zinc-700 transition">
//         <h3 className="text-3xl font-bold text-center mb-6 tracking-tight">Welcome Back</h3>
//         {error && (
//           <div > {console.log(error)}
//           </div>
//         )}
//         <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
//           <div>
//             <label htmlFor="email" className="block text-sm font-semibold mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="block text-sm font-semibold mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2 px-4 rounded-lg bg-black dark:bg-white text-white dark:text-black font-semibold transition duration-200 ${
//               loading
//                 ? 'opacity-60 cursor-not-allowed'
//                 : 'hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-[1.02]'
//             }`}
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//           <p className="text-center text-sm text-gray-500 dark:text-gray-400">
//             Don't have an account?{' '}
//             <Link
//               to="/signup"
//               className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
//             >
//               Sign Up
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import authService from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { user, token } = await authService.login(email, password);
      login({ user, token });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-zinc-900 dark:to-black transition-colors duration-300 px-4">
      <div className="bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 shadow-xl rounded-2xl p-8 w-full max-w-md border border-gray-200 dark:border-zinc-700 transition">
        <h1 className="text-3xl font-bold text-center mb-6 tracking-tight">Welcome Back</h1>
        
        {error && (
          <div 
            role="alert" 
            aria-live="assertive" 
            className="p-3 mb-4 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-200 rounded-lg"
          >
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5" noValidate>
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-semibold mb-1"
              id="email-label"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
              aria-labelledby="email-label"
              aria-invalid={email === '' ? 'true' : 'false'}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
              autoComplete="email"
            />
          </div>
          
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-semibold mb-1"
              id="password-label"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-required="true"
              aria-labelledby="password-label"
              aria-invalid={password === '' ? 'true' : 'false'}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"
              autoComplete="current-password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            aria-disabled={loading}
            aria-busy={loading}
            className={`w-full py-2 px-4 rounded-lg bg-black dark:bg-white text-white dark:text-black font-semibold transition duration-200 ${
              loading
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-[1.02]'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-zinc-900"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}