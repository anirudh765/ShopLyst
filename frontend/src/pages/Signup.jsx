import React, { useState, useContext } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const userData = await authService.signup(name, email, password);
      login(userData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 bg-gray-100 dark:bg-zinc-900 transition-colors duration-300">
      <div className="flex justify-center items-center">
        <div className="bg-white dark:bg-zinc-800 shadow-2xl rounded-2xl p-8 w-full max-w-md animate-fade-in">
          <h3 className="text-3xl font-bold text-center mb-6 text-zinc-800 dark:text-white">
            Create Your Account
          </h3>
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="font-semibold text-zinc-700 dark:text-zinc-200">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="p-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="font-semibold text-zinc-700 dark:text-zinc-200">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="p-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="font-semibold text-zinc-700 dark:text-zinc-200">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="p-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="confirm" className="font-semibold text-zinc-700 dark:text-zinc-200">Confirm Password</label>
              <input
                type="password"
                id="confirm"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                className="p-2 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
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
