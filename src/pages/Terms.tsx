import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Terms() {
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
        <title>Terms & Conditions | {mockSettings.site_title}</title>
      </Helmet>

      <motion.div>
        <h1 className="text-6xl sm:text-[10rem] premium-heading mb-16">
          <span className="text-slate-200">Legal</span><br/>Charter
        </h1>
        
        <div className="bg-slate-50 rounded-[4rem] p-12 sm:p-24 border border-black/5">
          <div 
            className="space-y-10 text-xl font-medium leading-relaxed text-slate-700"
            dangerouslySetInnerHTML={{ __html: (mockSettings.terms_content || '').replace(/\n/g, '<br/>') }}
          />
        </div>
        
        <div className="mt-20 text-center">
          <p className="premium-subheading">End of Charter</p>
        </div>
      </motion.div>
    </div>
  );
}
