import { motion } from 'motion/react';
import { useData } from '../contexts/DataContext';
import { ShieldCheck, Info, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function Responsibility() {
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
        <title>Responsibility | {mockSettings.site_title}</title>
      </Helmet>

      <motion.div>
        <h1 className="text-6xl sm:text-[10rem] premium-heading mb-16">
          <span className="text-slate-200">Ethical</span><br/>Oversight
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-20 items-start mb-32">
          <div className="p-12 bg-red-600 text-white rounded-[3rem] shadow-2xl shadow-red-600/20">
            <ShieldCheck className="w-12 h-12 mb-8 opacity-50" />
            <h2 className="premium-subheading text-white opacity-80 mb-6">Integrity Baseline</h2>
            <div 
              className="text-xl sm:text-2xl leading-snug font-bold italic"
              dangerouslySetInnerHTML={{ __html: (mockSettings.responsibility_content || '').split('\n\n')[0].replace(/\n/g, '<br/>') }}
            />
          </div>
          <div className="space-y-10">
            <h2 className="premium-subheading">Operational Guardrails</h2>
            <div 
              className="space-y-6 text-lg leading-relaxed text-slate-600 font-medium"
              dangerouslySetInnerHTML={{ __html: (mockSettings.responsibility_content || '').split('\n\n').slice(1).join('<br/><br/>').replace(/\n/g, '<br/>') }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
