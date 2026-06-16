import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, ArrowLeft, ShieldCheck, Loader2, Check, AlertCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

export default function Contact() {
  const { settings: mockSettings } = useData();
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [msgText, setMsgText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);
  return (
    <div className="max-w-7xl mx-auto py-16 px-6 sm:px-10 animate-fade-in pb-20">
      <div className="mb-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors group"
        >
          <div className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 group-hover:-translate-x-1 transition-transform">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Home
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start"
      >
        <div className="lg:col-span-12 xl:col-span-5 space-y-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6">Contact Us</h1>
            <div 
              className="markdown-body text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium"
              dangerouslySetInnerHTML={{ __html: mockSettings.contact_content || '' }}
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-white dark:bg-zinc-900 rounded-[24px] border border-black/5 dark:border-white/5 shadow-sm">
              <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                <Mail className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400 mb-1">Email</h3>
                <p className="text-zinc-900 dark:text-zinc-100 font-semibold text-base">{mockSettings.support_email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white dark:bg-zinc-900 rounded-[24px] border border-black/5 dark:border-white/5 shadow-sm">
              <div className="bg-pink-500/10 p-3 rounded-xl border border-pink-500/20">
                <MessageSquare className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400 mb-1">Live Chat</h3>
                <p className="text-zinc-900 dark:text-zinc-100 font-semibold text-base">Available Mon-Fri, 9am - 6pm EST</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white dark:bg-zinc-900 rounded-[24px] border border-black/5 dark:border-white/5 shadow-sm">
              <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-500/20">
                <MapPin className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400 mb-1">Office</h3>
                <p className="text-zinc-900 dark:text-zinc-100 font-semibold text-base">123 Tech Avenue, Silicon Valley, CA</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={async (e) => {
          e.preventDefault();
          setErrorText('');
          setSuccess(false);
          if (!user) {
            setErrorText('Please sign in with Google first.');
            return;
          }
          if (!msgText.trim()) {
            setErrorText('Please type a message first.');
            return;
          }
          setSubmitting(true);
          try {
            const cleanComment = msgText.trim().replace(/<[^>]*>?/gm, '');
            const payload = {
              username: user.displayName || 'Anonymous User',
              email: user.email || 'no-email@google.com',
              comment: cleanComment,
              created_at: new Date().toISOString(),
              status: 'pending',
              source: 'contact_page'
            };

            if (isFirebaseConfigured && db) {
              const ticketsCol = collection(db, 'support_tickets');
              await addDoc(ticketsCol, payload);
            } else {
              console.warn('Firebase connection is simulated or local only.');
            }
            setSuccess(true);
            setMsgText('');
          } catch (err: any) {
            console.error('Failed to submit formal ticket payload:', err);
            setErrorText('Failed to transmit message safely. Please try again.');
          } finally {
            setSubmitting(false);
          }
        }} className="lg:col-span-12 xl:col-span-7 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[32px] p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Send a Message</h2>
            {user && (
              <button
                type="button"
                onClick={() => signOut(auth)}
                className="text-xs text-rose-500 hover:underline font-semibold cursor-pointer"
              >
                Disconnect
              </button>
            )}
          </div>

          {authLoading ? (
            <div className="py-20 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : !user ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
              <div className="p-3.5 bg-blue-500/10 rounded-full text-blue-500 animate-pulse">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                Sign in with Google to send a message
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-sm leading-relaxed">
                We protect our support channels from automated messages by requiring user verification through Google.
              </p>
              {errorText && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-500">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorText}</span>
                </div>
              )}
              <button
                type="button"
                onClick={async () => {
                  setErrorText('');
                  const provider = new GoogleAuthProvider();
                  try {
                    await signInWithPopup(auth, provider);
                  } catch (e: any) {
                    setErrorText("Login failed: " + e.message);
                  }
                }}
                className="flex items-center gap-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-800 dark:text-zinc-100 font-bold px-5 py-3 rounded-xl transition-all shadow-sm cursor-pointer text-xs active:scale-95"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                   <path fill="#EA4335" d="M12.24 10.285V14.4h6.887C18.2 16.63 15.645 18 12.24 18c-3.18 0-5.85-2.15-6.812-5.043l-3.237 2.49A11.964 11.964 0 0012.24 24c6.64 0 11.76-4.66 11.76-11.715 0-.49-.044-.96-.128-1.41l-11.632-.59z"/>
                   <path fill="#4285F4" d="M24 12c0-.79-.07-1.54-.19-2.27H12v4.51h6.72c-.29 1.5-.14 2.76 1.13 3.65L23 14.35C21.84 13.1 24 12 24 12z"/>
                   <path fill="#FBBC05" d="M5.428 12.957a7.15 7.15 0 010-1.913l-3.237-2.492a11.964 11.964 0 000 6.896l3.237-2.49z"/>
                   <path fill="#34A853" d="M12.24 6c1.8 0 3.42.62 4.69 1.83l3.43-3.43C18.17 2.31 15.42 1.2 12.24 1.2a11.964 11.964 0 00-10.05 5.34l3.23 2.5C6.39 6.15 9.06 6 12.24 6z"/>
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-zinc-750 dark:text-zinc-300 mb-2">Verified Name</label>
                <div className="flex items-center gap-3 w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-black/5 dark:border-white/5 text-zinc-500 dark:text-zinc-400 font-medium cursor-not-allowed">
                  {user.photoURL && <img src={user.photoURL} alt={user.displayName || 'Google User'} referrerPolicy="no-referrer" className="w-6 h-6 rounded-full" />}
                  <span>{user.displayName || 'Google User'}</span>
                  <span className="ml-auto text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded shrink-0">Verified</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Verified Email</label>
                <input type="email" readOnly disabled className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-black/5 dark:border-white/5 text-zinc-500 dark:text-zinc-400 font-medium cursor-not-allowed" value={user.email || 'your@email.com'} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Message</label>
                <textarea required value={msgText} onChange={(e) => setMsgText(e.target.value)} className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-black/5 dark:border-white/5 h-44 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-zinc-900 dark:text-zinc-100 font-medium resize-none" placeholder="How can we help?"></textarea>
              </div>

              {errorText && (
                <div className="flex items-center gap-1 text-xs font-semibold text-rose-500 pt-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorText}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Message sent successfully! Our support agents will contact you shortly.</span>
                </div>
              )}

              <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] text-sm flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending message...</span>
                  </>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </>
          )}
        </form>
      </motion.div>
    </div>
  );
}
