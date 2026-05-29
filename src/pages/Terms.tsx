import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Terms() {
  const { settings: mockSettings } = useData();
  
  return (
    <div className="max-w-4xl mx-auto plain-content px-4 animate-fade-in pb-20">
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
        <title>Terms & Conditions | {mockSettings.site_title}</title>
      </Helmet>

      <motion.div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-12">
          Terms & Conditions
        </h1>
        
        <div className="bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm rounded-[32px] p-8 sm:p-12 mb-16">
          <div 
            className="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed"
            dangerouslySetInnerHTML={{ __html: (mockSettings.terms_content || '').replace(/\n/g, '<br/>') }}
          />
        </div>
        
      </motion.div>
    </div>
  );
}
