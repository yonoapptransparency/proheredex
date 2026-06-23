import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useData } from '../contexts/DataContext';
import { Github, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Developers() {
  const { settings } = useData();

  if (!settings.developers || settings.developers.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="min-h-screen pt-32 px-4 pb-20 flex flex-col items-center justify-center text-center">
          <Helmet>
            <title>Meet Our Team | {settings.site_title}</title>
          </Helmet>
          <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-black/5 dark:border-white/5 p-12 rounded-[3rem] max-w-lg mx-auto shadow-2xl">
            <h1 className="text-3xl font-black mb-4 dark:text-white uppercase tracking-tight italic">Our Developers</h1>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Information about our developers is not available at this moment. Please check back later.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="min-h-screen pt-32 px-4 pb-20">
        <Helmet>
          <title>Meet Our Team | {settings.site_title}</title>
          <meta name="description" content={`Meet the brilliant developers behind ${settings.site_title}. Discover our team's expertise and passion.`} />
        </Helmet>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 dark:from-pink-400 dark:to-violet-400 tracking-tighter italic">
              Meet Our Team
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">
              The creative minds and technical experts building the future of {settings.site_title}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {settings.developers.map((dev, index) => (
              <div 
                key={index} 
                className="bg-white/70 dark:bg-zinc-900/70 border border-black/5 dark:border-white/5 rounded-[2rem] p-8 backdrop-blur-md shadow-lg transition-all hover:shadow-xl hover:-translate-y-2 flex flex-col items-center text-center group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white dark:border-zinc-800 shadow-xl group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src={dev.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(dev.name)}&background=random`} 
                    alt={dev.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight">{dev.name}</h3>
                
                <div className="bg-pink-500/10 text-pink-600 dark:text-pink-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                  {dev.role}
                </div>
                
                {dev.bio && (
                  <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow font-medium text-sm leading-relaxed">
                    {dev.bio}
                  </p>
                )}
                
                <div className="flex gap-4 mt-auto pt-6 border-t border-black/5 dark:border-white/5 w-full justify-center">
                  {dev.github && (
                    <a 
                      href={dev.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-3 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl transition-colors text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white"
                      title="GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {dev.twitter && (
                    <a 
                      href={dev.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-3 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl transition-colors text-zinc-700 dark:text-zinc-300 hover:text-blue-500 dark:hover:text-blue-400"
                      title="Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
