import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Privacy() {
  const { settings: mockSettings } = useData();
  
  return (
    <div className="max-w-5xl mx-auto plain-content px-4 animate-fade-in">
      <div className="mb-20">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 premium-subheading opacity-100 hover:text-red-600 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Gateway Protocol
        </Link>
      </div>
      <Helmet>
        <title>Privacy Policy | {mockSettings.site_title}</title>
      </Helmet>

      <motion.div>
        <h1 className="text-6xl sm:text-[10rem] premium-heading mb-16">
          <span className="text-slate-200">Data</span><br/>Privacy
        </h1>
        
        <div className="grid lg:grid-cols-[1fr,2fr] gap-12 sm:gap-20">
          <aside className="space-y-8 sticky top-32">
            <div className="p-8 bg-slate-50 rounded-3xl border border-black/5">
              <ShieldCheck className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="premium-subheading mb-2">Security Status</h3>
              <p className="text-xl font-black italic">Active</p>
            </div>
            <div className="px-4">
              <h3 className="premium-subheading mb-4">Support Email</h3>
              <p className="text-sm font-black uppercase tracking-widest text-red-600 italic underline">{mockSettings.support_email}</p>
            </div>
          </aside>
          
          <article className="p-12 sm:p-20 bg-white border border-black/5 rounded-[4rem] shadow-sm">
            <div 
              className="space-y-10 text-lg sm:text-xl leading-relaxed text-slate-600 font-medium"
              dangerouslySetInnerHTML={{ __html: (mockSettings.privacy_content || '').replace(/\n/g, '<br/>') }}
            />
          </article>
        </div>
      </motion.div>
    </div>
  );
}
