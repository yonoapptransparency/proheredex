import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { Link, useNavigate } from 'react-router-dom';

export default function GlobalSearch({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const { apps } = useData();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
    }
  }, [isOpen]);

  const results = query.length > 0 
    ? apps.filter(app => {
        const searchLower = query.toLowerCase();
        return app.name.toLowerCase().includes(searchLower) || 
               app.seo_title?.toLowerCase().includes(searchLower) ||
               app.category?.toLowerCase().includes(searchLower);
      }).sort((a, b) => {
        // Direct matches first
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const q = query.toLowerCase();
        if (aName === q) return -1;
        if (bName === q) return 1;
        if (aName.startsWith(q)) return -1;
        if (bName.startsWith(q)) return 1;
        return 0;
      }).slice(0, 8)
    : [];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && results.length > 0) {
      navigate(`/app/${results[0].slug}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col pt-20 px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/80 backdrop-blur-xl"
          />
          
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="w-full max-w-2xl mx-auto relative z-10"
          >
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (results.length > 0) {
                  navigate(`/app/${results[0].slug}`);
                  onClose();
                }
              }}
              className="relative group block"
            >
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                {query.length > 0 ? (
                  <Zap className="w-6 h-6 text-blue-500 animate-pulse" />
                ) : (
                  <Search className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
                )}
              </div>
              <input
                ref={inputRef}
                type="search"
                enterKeyHint="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find anything... (Apps, Tools, Games)"
                className="w-full h-20 pl-16 pr-20 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-[2.5rem] shadow-xl text-xl font-medium focus:outline-none focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 dark:text-white"
              />
              <button 
                type="button"
                onClick={onClose}
                className="absolute inset-y-4 right-4 w-12 h-12 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center rounded-2xl hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-all active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            <AnimatePresence>
              {query.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 rounded-3xl shadow-xl overflow-hidden py-4"
                >
                  <div className="flex items-center justify-between mb-4 px-6">
                    <span className="text-xs font-semibold text-zinc-500 tracking-wide uppercase">Results ({results.length})</span>
                    <span className="text-xs font-semibold text-blue-500 animate-pulse tracking-wide uppercase">Live Search</span>
                  </div>

                  <div className="space-y-1 px-3">
                    {results.length > 0 ? results.map((app) => (
                      <Link 
                        key={app.id} 
                        to={`/app/${app.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-4 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-2xl transition-all group"
                      >
                        <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-black/5 dark:border-white/5 overflow-hidden shrink-0">
                          {app.icon_url && <img src={app.icon_url} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate mb-0.5">{app.name}</h4>
                          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">{app.category || 'Premium Service'}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-500 mr-2" />
                      </Link>
                    )) : (
                      <div className="py-12 text-center">
                        <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Loader2 className="w-6 h-6 text-zinc-300 dark:text-zinc-600 animate-spin" />
                        </div>
                        <p className="text-sm text-zinc-400 dark:text-zinc-500">Searching...</p>
                      </div>
                    )}
                  </div>

                  {results.length > 0 && (
                     <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 text-center">
                      <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">Press Enter to select the top result</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
