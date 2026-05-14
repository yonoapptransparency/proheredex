import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { ShieldCheck, Star, Download, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BannerProps {
  items: any[];
}

export function FlipkartBanner({ items }: BannerProps) {
  return (
    <div className="w-full overflow-hidden mb-8 -mx-4 sm:mx-0">
      <div className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x no-scrollbar">
        {items.map((item, i) => (
          <Link
            to={item.link || "/"}
            key={item.id || i}
            className="flex-shrink-0 w-[85vw] sm:w-[400px] h-[180px] rounded-2xl relative overflow-hidden snap-center group block"
          >
            <motion.div 
              whileHover={{ scale: 0.98 }}
              className="w-full h-full relative"
            >
              <img 
                src={item.image || `https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop`} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Banner"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-white text-2xl font-black mb-1 uppercase tracking-tighter drop-shadow-md">{item.title}</h3>
                <p className="text-white text-sm mb-3 font-bold drop-shadow-sm">{item.subtitle}</p>
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-[0.2em]">Ad</span>
                  <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Sponsored</span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}

import { useData } from '../contexts/DataContext';

interface TabProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function PlayStoreTabs({ activeTab, onTabChange }: TabProps) {
  const { settings } = useData();
  const tabs = settings.categories && settings.categories.length > 0 
    ? settings.categories 
    : ["All", "Yono app", "Sunali", "Jeet"];
  
  return (
    <div className="mb-8 sticky top-16 z-40">
      <div className="flex overflow-x-auto no-scrollbar gap-3 px-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              "whitespace-nowrap px-6 py-2.5 text-sm font-semibold transition-all rounded-full border",
              activeTab === tab 
                ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/30 font-black uppercase tracking-widest" 
                : "bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md text-black dark:text-slate-400 border-white dark:border-white/5 hover:bg-white dark:hover:bg-zinc-900/60 font-bold uppercase tracking-tight"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

interface TopChartItemProps {
  rank: number;
  app: any;
  key?: string | number;
}

export function AppListItem({ app, index }: { app: any, key?: string | number, index?: number }) {
  return (
    <Link 
      to={`/app/${app.slug}`}
      className="flex items-center gap-4 sm:gap-6 p-4 sm:p-6 mb-6 glass-panel transition-all active:scale-[0.98] group"
    >
      <div className="relative">
        <div className="absolute -top-3 -left-3 w-7 h-7 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-zinc-900 z-10">
          {index !== undefined ? index + 1 : (app.serial_number || 1)}
        </div>
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl overflow-hidden shrink-0 bg-white dark:bg-slate-800 shadow-2xl border border-white dark:border-white/5">
          <img 
            src={app.icon_url || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=128&h=128&fit=crop"} 
            alt={app.name} 
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
          />
        </div>
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
          <h3 className="font-black text-xl leading-tight text-black dark:text-white truncate uppercase tracking-tight">
            {app.name}
          </h3>
          <div className="flex items-center gap-2">
            {app.safety_status === 'Verified' && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-500 rounded-full text-[10px] font-black border border-green-500/20 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                Verified Safe
              </span>
            )}
            {app.is_new && <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest">New</span>}
          </div>
        </div>

        <div className="text-sm font-black text-black dark:text-slate-400 truncate mb-1 uppercase tracking-wide">{app.category}</div>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(app.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} />
            ))}
          </div>
          <span className="text-sm font-black text-black dark:text-slate-300 tracking-tighter">
            {app.rating ? app.rating.toFixed(1) : '10.0'}
          </span>
          <span className="text-xs font-black text-black dark:text-slate-500 uppercase tracking-widest">{app.rating && app.rating < 8 ? 'Ok' : 'Very good'}</span>
        </div>
      </div>
      
      <div className="shrink-0">
        <div className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
        </div>
      </div>
    </Link>
  );
}

export function TopChartItem({ rank, app }: TopChartItemProps) {
  return (
    <Link 
      to={`/app/${app.slug}`}
      className="flex items-center gap-4 p-4 mb-4 bg-white/60 dark:bg-slate-800/40 backdrop-blur-md hover:bg-white/90 dark:hover:bg-slate-800/60 transition-colors rounded-2xl active:scale-[0.98] border border-slate-200 dark:border-transparent shadow-xl shadow-slate-200/50 dark:shadow-none"
    >
      <div className="w-6 text-[15px] font-black text-black dark:text-slate-400 text-center shrink-0">
        {rank}
      </div>
      
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-white/5">
        <img 
          src={app.icon_url || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=128&h=128&fit=crop"} 
          alt={app.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-1.5 mb-0.5">
          <h3 className="font-black text-xl leading-tight text-black dark:text-white truncate uppercase tracking-tight">
            {app.name}
          </h3>
          {app.safety_status === 'Verified' && <ShieldCheck className="w-4 h-4 shrink-0 text-pink-500" />}
          {app.safety_status === 'Caution' && <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />}
          {app.safety_status === 'Unsafe' && <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />}
          {app.is_new && <span className="ml-1 shrink-0 inline-block bg-pink-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-tight align-middle -mt-1">New</span>}
        </div>
        <span className="text-[13px] font-black text-black dark:text-slate-400 mt-0.5 truncate uppercase tracking-wider">{app.category}</span>
        <div className="flex items-center gap-1 text-[11px] font-black text-black dark:text-slate-400 mt-0.5 uppercase tracking-tighter">
          <div className="flex items-center pt-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(app.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
            ))}
          </div>
          <span className="ml-1 leading-none">{app.rating ? app.rating.toFixed(1) : 'N/A'}</span>
        </div>
      </div>
      
      <div className="shrink-0 pl-2">
        <button className="bg-red-600 text-white hover:bg-red-500 px-6 py-2 text-[13px] font-black rounded-full transition-all truncate min-w-[80px] uppercase tracking-tight shadow-md shadow-red-600/20">
          Install
        </button>
      </div>
    </Link>
  );
}
