import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Shield, Mail, KeyRound } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged } from 'firebase/auth';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // setAuthenticated will be handled by onAuthStateChanged
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Please check your inbox.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authenticated) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="glass-panel p-10 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-pink-500/20 p-4 rounded-full">
            <Shield className="w-10 h-10 text-pink-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-8">Admin Access</h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="text-rose-400 text-sm text-center bg-rose-500/10 p-3 rounded">{error}</div>}
          {message && <div className="text-emerald-400 text-sm text-center bg-emerald-500/10 p-3 rounded">{message}</div>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg py-3 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={email}
                  placeholder="admin@example.com"
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                />
                <Mail className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg py-3 pl-10 pr-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                />
                <KeyRound className="w-5 h-5 absolute left-3 top-3.5 text-slate-400" />
              </div>
              <div className="flex justify-end mt-2">
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-sm text-pink-500 hover:text-pink-400 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition-all shadow-lg ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Processing...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
