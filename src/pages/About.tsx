import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function About() {
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
      <motion.div>
        <h1 className="text-6xl sm:text-[10rem] premium-heading mb-16">
          <span className="text-slate-200">The</span><br/>Mission
        </h1>
        
        <div className="grid lg:grid-cols-2 gap-20 items-start mb-32">
          <div className="space-y-10">
            <h2 className="premium-subheading">Core Objective</h2>
            <div 
              className="text-2xl sm:text-3xl leading-snug font-semibold text-slate-800 italic"
              dangerouslySetInnerHTML={{ __html: (mockSettings.about_content || '').split('\n\n')[0].replace(/\n/g, '<br/>') }}
            />
          </div>
          <div className="p-12 bg-slate-50 rounded-[3rem] border border-black/5">
            <h2 className="premium-subheading mb-8">System Intel</h2>
            <div 
              className="space-y-6 text-lg leading-relaxed text-slate-600 font-medium"
              dangerouslySetInnerHTML={{ __html: (mockSettings.about_content || '').split('\n\n').slice(1).join('<br/><br/>').replace(/\n/g, '<br/>') }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32">
          {[
            { val: '100%', label: 'Verified Safe' },
            { val: 'Elite', label: 'Security Grade' },
            { val: 'Realtime', label: 'Threat Monitoring' },
            { val: 'Stable', label: 'Node Status' },
          ].map((stat, i) => (
            <div key={i} className="p-8 border border-black/5 rounded-[2rem] flex flex-col items-center text-center">
              <span className="text-4xl font-black tracking-tighter text-red-600 mb-2 italic">{stat.val}</span>
              <span className="premium-subheading text-[8px]">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
