import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Privacy() {
  const { settings: mockSettings } = useData();
  
  return (
    <div className="max-w-5xl mx-auto plain-content px-4 animate-fade-in pb-20">
      <div className="mb-12 pt-4">
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
      <Helmet>
        <title>Privacy Policy | {mockSettings.site_title}</title>
      </Helmet>

      <motion.div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-16">
          Privacy Policy
        </h1>
        
        <div className="grid lg:grid-cols-[1fr,2fr] gap-12 sm:gap-16">
          <aside className="space-y-6 lg:sticky lg:top-32 self-start">
            <div className="p-8 bg-zinc-50 dark:bg-zinc-800/30 border border-black/5 dark:border-white/5 rounded-[24px]">
              <ShieldCheck className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-1">Security Status</h3>
              <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Secured & Active</p>
            </div>
            <div className="p-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/20 rounded-[24px]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">Support Email</h3>
              <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100 break-all">{mockSettings.support_email}</p>
            </div>
          </aside>
          
          <article className="p-8 sm:p-12 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-[32px] shadow-sm">
            <div 
              className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed"
              dangerouslySetInnerHTML={{ __html: (mockSettings.privacy_content || '').replace(/\n/g, '<br/>') }}
            />
          </article>
        </div>
      </motion.div>
    </div>
  );
}
