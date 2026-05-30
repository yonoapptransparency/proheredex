import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { ShieldCheck, Star, AlertTriangle, ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import React from 'react';

interface BannerProps {
  items: any[];
}

export const FeaturedBanner = React.memo(({ items }: BannerProps) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    if (!items || items.length <= 1) return;
    
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { clientWidth } = scrollRef.current;
        const firstItem = scrollRef.current.querySelector('a');
        const itemWidth = firstItem ? firstItem.offsetWidth + 12 : clientWidth * 0.8;

        let nextIndex = activeIndex + 1;
        if (nextIndex >= items.length) {
          nextIndex = 0;
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          setActiveIndex(0);
        } else {
          scrollRef.current.scrollTo({ left: nextIndex * itemWidth, behavior: 'smooth' });
          setActiveIndex(nextIndex);
        }
      }
    }, 2000); // Set automatically scrolling every 2 seconds after

    return () => clearInterval(interval);
  }, [items, activeIndex]);

  // Sync index on manual scroll
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const firstItem = scrollRef.current.querySelector('a');
      const itemWidth = firstItem ? firstItem.offsetWidth + 12 : clientWidth * 0.8;
      const index = Math.round(scrollLeft / itemWidth);
      if (index !== activeIndex && index < items.length) setActiveIndex(index);
    }
  };

  return (
    <div className="w-full overflow-hidden mb-6 -mx-4 sm:mx-0 relative group">
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto gap-4 px-4 pb-6 snap-x no-scrollbar scroll-smooth"
      >
        {items.map((item, i) => {
          const isExternal = item.link && (item.link.startsWith('http://') || item.link.startsWith('https://') || item.link.startsWith('//'));
          const classes = "flex-shrink-0 w-[85vw] sm:w-[500px] h-[200px] sm:h-[240px] rounded-[24px] relative overflow-hidden snap-center group block shadow-md border border-black/5 dark:border-white/5";
          const content = (
            <motion.div 
              whileHover={{ scale: 0.99 }}
              className="w-full h-full relative will-change-transform"
            >
              <img 
                src={item.image || `https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=400&fit=crop`} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Banner"
                decoding="async"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                <div className="flex flex-col gap-1 w-full text-left">
                  <span className="text-white/80 text-[10px] font-semibold uppercase tracking-wider">Featured</span>
                  <div className="mt-1">
                    <h3 className="text-white text-xl sm:text-2xl font-bold tracking-tight mb-1">
                      {item.title}
                    </h3>
                    <p className="text-white/90 text-sm font-medium">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );

          if (isExternal) {
            return (
              <a 
                href={item.link} 
                key={item.id || i}
                target="_blank" 
                rel="noopener noreferrer" 
                className={classes}
              >
                {content}
              </a>
            );
          }

          return (
            <Link
              to={item.link || "/"}
              key={item.id || i}
              className={classes}
            >
              {content}
            </Link>
          );
        })}
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 py-2 pointer-events-none">
        {items.map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === activeIndex ? "w-6 bg-blue-500 shadow-sm" : "w-1.5 bg-zinc-300 dark:bg-zinc-700"
            )}
          />
        ))}
      </div>
    </div>
  );
});

export const PromotionSection = React.memo(() => {
  return (
    <div className="mx-2 mb-10 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Video Card */}
        <div className="aspect-video rounded-[32px] overflow-hidden bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm relative group min-h-[200px] w-full">
          <iframe 
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&mute=1" 
            title="Promotional Video" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            loading="eager"
          ></iframe>
        </div>

        {/* Secure Access Hub Card */}
        <div className="bg-blue-600 rounded-[32px] p-8 flex flex-col justify-between text-white relative overflow-hidden shadow-md group min-h-[200px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          
          <div className="relative z-10 w-full max-w-[280px]">
            <h3 className="text-2xl font-bold tracking-tight mb-2">Editor's Choice</h3>
            <p className="text-blue-100 text-sm font-medium leading-relaxed mb-6">Discover the most innovative and carefully crafted applications curated by our team.</p>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold text-sm shadow-sm hover:bg-blue-50 transition-all active:scale-95 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Explore Selection
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
});

import { useData } from '../contexts/DataContext';

interface TabProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hideOnSearch?: boolean;
}

export const PlayStoreTabs = React.memo(({ activeTab, onTabChange, hideOnSearch }: TabProps) => {
  const { settings } = useData();
  
  if (hideOnSearch) return null;

  const tabs = settings.categories && settings.categories.length > 0 
    ? settings.categories 
    : ["All", "Games", "Apps", "Entertainment"];
  
  return (
    <div className="mb-6 sticky top-16 z-40 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex overflow-x-auto no-scrollbar gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={cn(
              "whitespace-nowrap px-4 py-2 text-sm font-medium transition-all rounded-full border",
              activeTab === tab 
                ? "bg-blue-500 text-white border-blue-500 shadow-sm" 
                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-black/5 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
});

interface TopChartItemProps {
  rank: number;
  app: any;
  key?: string | number;
}

export const AppListItem = React.memo(({ app, index }: { app: any; index?: number }) => {
  const displayIndex = index !== undefined ? index : (app.serial_number || 1);
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-2px" }}
      transition={{ duration: 0.1, delay: (index || 0) % 6 * 0.005 }}
      className="will-change-[opacity,transform]"
    >
      <Link 
        to={`/${app.slug}`}
        onClick={() => {
          if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(10);
          }
        }}
        className="flex items-center gap-4 p-4 mb-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200 group rounded-2xl relative active:scale-[0.98]"
      >
        <div className="w-6 sm:w-8 text-sm font-bold text-zinc-400 dark:text-zinc-500 text-center shrink-0">
          {displayIndex}
        </div>

        <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0">
          <div className="w-full h-full rounded-[18px] overflow-hidden bg-white shadow-sm border border-black/5 dark:border-white/10 relative z-10 transition-transform group-hover:-translate-y-0.5 duration-300">
            <img 
              src={app.icon_url || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=128&h=128&fit=crop"} 
              alt={app.name} 
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-semibold text-base sm:text-[17px] tracking-tight text-zinc-900 dark:text-zinc-100 truncate w-full">
              {app.name}
            </h3>
          </div>

          <div className="text-xs sm:text-[13px] font-normal text-zinc-500 dark:text-zinc-400 truncate">
            {app.category}
          </div>

          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">
            <span>{app.rating ? app.rating.toFixed(1) : '10.0'}</span>
            <Star className="w-3 h-3 fill-current text-zinc-400" />
            {app.safety_status === 'Verified' && (
              <ShieldCheck className="w-3 h-3 text-blue-500 shrink-0 ml-1" />
            )}
          </div>
        </div>
        
        <div className="shrink-0 pr-1">
          <div className="bg-black/5 dark:bg-white/10 text-zinc-900 dark:text-zinc-100 px-4 py-1 text-[11px] font-bold rounded-full transition-all duration-300 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-900 shadow-sm border border-transparent group-hover:border-black/5 dark:group-hover:border-white/5">
            MORE
          </div>
        </div>
        
        <div className="absolute bottom-0 right-4 left-[104px] border-b border-black/5 dark:border-white/5 opacity-50 transition-opacity group-hover:opacity-0" />
      </Link>
    </motion.div>
  );
});

export const TopChartItem = React.memo(({ rank, app }: TopChartItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.15, delay: (rank % 8) * 0.01 }}
      className="will-change-[opacity,transform]"
    >
      <Link 
        to={`/${app.slug}`}
        onClick={() => {
          if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(10);
          }
        }}
        className="flex items-center gap-4 p-4 mb-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200 group rounded-2xl relative active:scale-[0.98]"
      >
        <div className="w-6 sm:w-8 text-sm font-bold text-zinc-400 dark:text-zinc-500 text-center shrink-0">
          {rank}
        </div>
        
        <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0">
          <div className="w-full h-full rounded-[18px] overflow-hidden bg-white shadow-sm border border-black/5 dark:border-white/10 relative z-10 transition-transform group-hover:-translate-y-0.5 duration-300">
            <img 
              src={app.icon_url || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=128&h=128&fit=crop"} 
              alt={app.name} 
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-semibold text-base sm:text-[17px] tracking-tight text-zinc-900 dark:text-zinc-100 truncate w-full">
              {app.name}
            </h3>
          </div>
          <div className="text-xs sm:text-[13px] font-normal text-zinc-500 dark:text-zinc-400 truncate">
            {app.category}
          </div>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">
            <span>{app.rating ? app.rating.toFixed(1) : '10.0'}</span>
            <Star className="w-3 h-3 fill-current text-zinc-400" />
            {app.safety_status === 'Verified' && <ShieldCheck className="w-3 h-3 text-blue-500 shrink-0 ml-1" />}
          </div>
        </div>
        
        <div className="shrink-0 pr-1">
          <div className="bg-black/5 dark:bg-white/10 text-zinc-900 dark:text-zinc-100 px-4 py-1 text-[11px] font-bold rounded-full transition-all duration-300 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-900 shadow-sm border border-transparent group-hover:border-black/5 dark:group-hover:border-white/5">
            MORE
          </div>
        </div>
        
        <div className="absolute bottom-0 right-4 left-[104px] border-b border-black/5 dark:border-white/5 opacity-50 transition-opacity group-hover:opacity-0" />
      </Link>
    </motion.div>
  );
});
