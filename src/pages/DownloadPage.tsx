import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useData } from '../contexts/DataContext';
import { Shield, ShieldAlert, ShieldCheck, Download, MessageSquare, AlertTriangle, Info, CheckCircle2, ChevronRight, ChevronLeft, Fingerprint, Lock, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SecureDownloadButton from '../components/SecureDownloadButton';

export default function DownloadPage() {
  const { apps: mockApps, settings: mockSettings, news: mockNews, blogs: mockBlogs, videos: mockVideos, saveApps: saveMockApps, saveSettings: saveMockSettings, saveNews: saveMockNews, saveBlogs: saveMockBlogs, saveVideos: saveMockVideos } = useData();
  const { slug } = useParams();
  const app = mockApps.find(a => a.slug === slug);
  const [downloading, setDownloading] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [progress, setProgress] = useState(0);

  const playSoftClick = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.volume = 0.4;
    audio.play().catch(e => console.log("Audio play blocked", e));
  };

  const handleVerifyStart = () => {
    playSoftClick();
    setIsVerifying(true);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsVerified(true);
          setIsVerifying(false);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
  };

  const handleVerifyCancel = () => {
    if (!isVerified) {
      setIsVerifying(false);
      setProgress(0);
    }
  };

  if (!app) {
    return <Navigate to="/" />;
  }

  const faqSchema = app.faqs && app.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": app.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": app.name,
    "description": app.seo_description || `${app.name} - Download`,
    "applicationCategory": app.category,
    "operatingSystem": "All",
    "softwareVersion": app.version,
    "image": app.og_image_url || app.icon_url,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const handleDownload = () => {
    setDownloading(true);
    // Ping API route which will do redirect, here we just mock that delay
    setTimeout(() => {
      if (app.encrypted_download_url) {
        window.location.href = app.encrypted_download_url;
      } else {
        alert("Download URL not configured for " + app.name);
      }
      setDownloading(false);
    }, 1500);
  };

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert("Review submitted and awaiting moderation.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="animate-fade-in select-none pb-20">
      <div className="px-4 mb-6 max-w-4xl mx-auto">
        <Link 
          to={`/app/${app.slug}`} 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors group"
        >
          <div className="p-2 rounded-full bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 group-hover:scale-110 transition-transform">
            <ArrowLeft className="w-3.5 h-3.5" />
          </div>
          Back to details
        </Link>
      </div>
      <Helmet>
        <title>{`Download ${app.name} - Verified ${app.version} Security Handshake`}</title>
        <meta name="description" content={`Safe download portal for ${app.name}. Technical size: ${app.file_size}. Verified safety status: ${app.safety_status}. Access secure link after identity verification.`} />
        {app.seo_keywords && <meta name="keywords" content={`${app.seo_keywords}, download ${app.name}, ${app.name} safe install, secure ${app.name}`} />}
        <meta property="og:title" content={`Secure Link: ${app.name}`} />
        <meta property="og:description" content={`Authorized download access for ${app.name}. Verified by Transparency Portal.`} />
        <meta property="og:image" content={app.og_image_url || app.icon_url} />
        <meta name="robots" content="noindex, follow" />
        {app.canonical_url && <link rel="canonical" href={app.canonical_url} />}
        <script type="application/ld+json">
          {JSON.stringify(softwareSchema)}
        </script>
        {faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
      </Helmet>
      
      {/* Header section */}
      <div className="text-center mb-8 max-w-xl mx-auto px-4">
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-xl mb-4 font-black uppercase text-[10px] tracking-widest shadow-lg italic",
          app.safety_status === 'Verified' ? "bg-green-500/10 text-green-500 border border-green-500/10" :
          app.safety_status === 'Caution' ? "bg-amber-500/10 text-amber-500 border border-amber-500/10" :
          "bg-rose-500/10 text-rose-500 border border-rose-500/10"
        )}>
          {app.safety_status === 'Verified' ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
          Security Status: {app.safety_status}
        </div>
        <h1 className="text-2xl sm:text-3xl font-black mb-3 uppercase tracking-tighter dark:text-white italic flex flex-wrap items-center justify-center gap-3">
          <ShieldCheck className="w-6 h-6 text-red-600" />
          <span>Security</span>
          <span className="text-red-600">Portal</span>
          <Sparkles className="w-6 h-6 text-red-600 animate-pulse" />
        </h1>
        <p className="font-bold uppercase tracking-tight text-[10px] sm:text-[11px] text-slate-400 dark:text-zinc-500 max-w-md mx-auto leading-relaxed">
          Technical handshake in progress. Verify <span className="text-red-600 underline decoration-red-600/30 underline-offset-4">{app.name}</span> identity below to authorize final data extraction.
        </p>
      </div>

      {/* Main Download Action with Stealth Gate */}
      <div className="glass-panel p-6 sm:p-10 text-center mb-10 border border-white/20 dark:border-white/5 rounded-[3rem] max-w-3xl mx-auto shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-[0_45px_100px_-20px_rgba(0,0,0,0.8)] backdrop-blur-3xl overflow-hidden relative">
        {/* Decorative Glossy Highlight */}
        <div className="absolute top-0 left-0 w-full h-[0.5px] bg-gradient-to-r from-transparent via-red-600/40 text-transparent"></div>
        
        {!isVerified ? (
          <div className="flex flex-col items-center gap-10">
            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="absolute -inset-1.5 bg-gradient-to-tr from-rose-500 to-red-600 rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white dark:bg-black/40 rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 shrink-0">
                    {app.icon_url ? <img src={app.icon_url} alt="" className="w-full h-full object-cover"/> : null}
                  </div>
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-black uppercase tracking-tighter mb-2.5 dark:text-white italic leading-none">{app.name}</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[8px] px-2 py-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5 font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                      ID: {app.serial_number}
                    </span>
                    <span className="text-[8px] px-2 py-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5 font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                      {app.file_size}
                    </span>
                    <span className="text-[8px] px-2 py-1 bg-black/5 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5 font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                      VER: {app.version}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center gap-4 px-5 py-3 bg-red-600/5 rounded-2xl border border-red-600/10 active:scale-95 transition-transform">
                <Fingerprint className="w-6 h-6 text-red-600 animate-pulse" />
                <div className="text-left">
                  <p className="text-[9px] font-black uppercase tracking-widest dark:text-zinc-200 leading-none mb-1">AUTH PROTOCOL</p>
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-600 italic leading-none">SYSTEM LOCK ACTIVE</p>
                </div>
              </div>
            </div>

            <div className="w-full max-w-sm relative" onClick={playSoftClick}>
              <div className="absolute -inset-4 bg-red-600/10 blur-[40px] rounded-[4rem] opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              
              <button
                onMouseDown={handleVerifyStart}
                onMouseUp={handleVerifyCancel}
                onMouseLeave={handleVerifyCancel}
                onTouchStart={handleVerifyStart}
                onTouchEnd={handleVerifyCancel}
                className="w-full relative h-[72px] bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-[2.5rem] overflow-hidden active:scale-95 transition-all cursor-pointer group/btn shadow-[0_20px_50px_rgba(220,38,38,0.3)] border-t border-white/20"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                <div 
                   className="absolute inset-y-0 left-0 bg-black/20 backdrop-blur-md transition-all duration-75 border-r border-white/20"
                   style={{ width: `${progress}%` }}
                ></div>

                <div className="absolute inset-0 flex items-center justify-center gap-5 px-6">
                  <div className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 flex items-center justify-center relative shrink-0">
                    <Lock className={cn("w-5 h-5 text-white transition-all", isVerifying ? "animate-pulse scale-110" : "")} />
                    {isVerifying && (
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="20" cy="20" r="18" fill="none" stroke="white" strokeWidth="2" strokeDasharray={113} strokeDashoffset={113 - (113 * progress) / 100} className="transition-all duration-75" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[12px] font-black text-white uppercase tracking-[0.3em] italic truncate">
                    {progress > 0 ? `LINKING ARCHIVE ${progress}%` : "Authorize Secure Extraction"}
                  </span>
                </div>
              </button>
              
              <div className="mt-5 flex flex-col items-center gap-2">
                <div className="flex gap-1.5">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={cn("w-1 h-1 rounded-full bg-red-600 transition-all duration-300", isVerifying ? "animate-bounce" : "opacity-20")} style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-zinc-600 italic">BIOMETRIC HANDSHAKE REQUIRED TO UNLOCK</p>
              </div>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-center justify-between w-full gap-10 py-4"
          >
            <div className="flex items-center gap-8">
              <div className="relative">
                <div className="absolute -inset-2 bg-green-500 rounded-[2.5rem] blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-white dark:bg-black/20 rounded-[2rem] overflow-hidden shadow-2xl border-2 border-green-500/30 shrink-0">
                  {app.icon_url ? <img src={app.icon_url} alt="" className="w-full h-full object-cover"/> : null}
                </div>
              </div>
              <div className="text-left">
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-3 dark:text-white italic leading-none">{app.name}</h2>
                <div className="flex items-center gap-2.5 bg-green-500/10 px-4 py-2 rounded-2xl border border-green-500/20 w-fit">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-[11px] font-black text-green-500 uppercase tracking-widest italic">Protocol Secured</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <SecureDownloadButton appId={app.id} status={app.safety_status as 'Verified' | 'Caution' | 'Unsafe'} downloadUrl={app.encrypted_download_url} />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-zinc-600 italic animate-pulse">Session Active: 15:00 Remaining</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* SEO Optimized FAQs - Repositioned below Get Now Button */}
      {app.faqs && app.faqs.length > 0 && (
        <div className="max-w-3xl mx-auto mb-10 px-2">
          <div className="bg-white/40 dark:bg-black/60 border border-white/20 dark:border-white/5 rounded-[2rem] p-5 sm:p-6 shadow-2xl backdrop-blur-3xl">
            <h2 className="text-lg font-black mb-6 flex items-center gap-2 uppercase tracking-tight px-2 dark:text-white italic">
              <Info className="w-5 h-5 text-pink-500" /> Intelligence Query
            </h2>
            <div className="space-y-2">
              {app.faqs.map((faq, idx) => (
                <div key={idx} className="group bg-white/20 dark:bg-white/5 border border-white/40 dark:border-white/10 rounded-[1.5rem] overflow-hidden transition-all hover:border-pink-500/20">
                  <details className="group">
                    <summary className="font-black p-4 cursor-pointer select-none flex items-center justify-between group-open:text-pink-500 min-h-[40px] uppercase tracking-tighter text-xs italic dark:text-zinc-100">
                      <span className="flex-1">{faq.question}</span>
                      <span className="text-xl leading-none transition-transform group-open:rotate-45 ml-4 bg-pink-500/10 rounded-full w-8 h-8 flex items-center justify-center text-pink-500 border border-pink-500/10 shadow-sm">+</span>
                    </summary>
                    <div 
                      className="px-5 pb-5 pt-0 prose prose-sm dark:prose-invert max-w-none text-left font-bold border-t border-white/10 dark:border-white/5 mt-1 pt-4 text-[10px] sm:text-[11px] tracking-tight leading-relaxed dark:text-zinc-400"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Strict Section Order 1: Admin Alert Boxes */}
      <div className="space-y-4 mb-12 max-w-4xl mx-auto flex flex-col gap-4 px-2">
        {app.red_box_msg && (
          <div className="bg-rose-500/10 dark:bg-rose-500/5 border-2 border-rose-500/30 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 bg-rose-500 h-full"></div>
            <h3 className="font-black text-rose-500 flex items-center gap-3 mb-3 uppercase tracking-[0.2em] italic text-xs">
              <ShieldAlert className="w-5 h-5 animate-pulse" /> Critical Warning
            </h3>
            <p className="text-rose-600 dark:text-rose-400 font-bold text-sm tracking-tight leading-relaxed italic">{app.red_box_msg}</p>
          </div>
        )}
        {app.yellow_box_msg && (
          <div className="bg-amber-500/10 dark:bg-amber-500/5 border-2 border-amber-500/30 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 bg-amber-500 h-full"></div>
            <h3 className="font-black text-amber-500 flex items-center gap-3 mb-3 uppercase tracking-[0.2em] italic text-xs">
              <AlertTriangle className="w-5 h-5" /> Operational Notice
            </h3>
            <p className="text-amber-600 dark:text-amber-500 font-bold text-sm tracking-tight leading-relaxed italic">{app.yellow_box_msg}</p>
          </div>
        )}
        {app.idea_box_msg && (
          <div className="bg-pink-500/10 dark:bg-pink-500/5 border-2 border-pink-500/30 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 bg-pink-500 h-full"></div>
            <h3 className="font-black text-pink-500 flex items-center gap-3 mb-3 uppercase tracking-[0.2em] italic text-xs">
              <Sparkles className="w-5 h-5" /> Efficiency Tip
            </h3>
            <p className="text-pink-500 font-bold text-sm tracking-tight leading-relaxed italic">{app.idea_box_msg}</p>
          </div>
        )}
        {app.custom_admin_box_html && (
          <div className="bg-white/40 dark:bg-black/60 border-2 border-white/20 dark:border-white/5 p-8 rounded-[2rem] shadow-2xl backdrop-blur-3xl">
            <h3 className="font-black flex items-center gap-3 mb-6 uppercase tracking-[0.2em] italic text-xs dark:text-white">
              <Info className="w-5 h-5 text-pink-500" /> {app.custom_admin_box_heading || 'App Encryption Details'}
            </h3>
            <div 
              className="prose prose-pink dark:prose-invert max-w-none text-xs font-bold leading-relaxed dark:text-zinc-300"
              dangerouslySetInnerHTML={{ __html: app.custom_admin_box_html }}
            />
          </div>
        )}
      </div>

      {/* Strict Section Order 2: Massive Description */}
      <div className="bg-white/40 dark:bg-black/60 border-2 border-white/20 dark:border-white/5 p-8 sm:p-12 mb-12 max-w-4xl mx-auto backdrop-blur-3xl rounded-[3rem] shadow-2xl">
        <h2 className="text-2xl font-black mb-8 border-b-4 border-pink-500/20 pb-4 uppercase tracking-tighter dark:text-white italic">Technical Analysis</h2>
        <div 
          className="prose prose-pink dark:prose-invert max-w-none leading-relaxed font-bold text-sm dark:text-zinc-300"
          dangerouslySetInnerHTML={{ __html: app.description_html || `<p>${app.seo_description}</p>` }}
        />
      </div>

      {/* Strict Section Order 3: Peer Reviews */}
      <div className="max-w-4xl mx-auto mb-12 px-2">
        <h2 className="text-2xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter dark:text-white italic">
          <MessageSquare className="w-6 h-6 text-pink-500" /> Transmission Reviews
        </h2>
        
        <form onSubmit={handleReviewSubmit} className="bg-white/40 dark:bg-black/60 border-2 border-white/20 dark:border-white/5 p-8 rounded-[2.5rem] mb-12 backdrop-blur-3xl shadow-2xl">
          <h3 className="font-black mb-6 uppercase tracking-widest text-[10px] text-slate-400 dark:text-zinc-500 italic">Open Channel Feedback</h3>
          
          <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-[10px] font-black opacity-60 mb-2 uppercase tracking-widest italic dark:text-white">Identity Alias</label>
              <input required type="text" className="w-full bg-black/5 dark:bg-white/5 border-2 border-black/10 dark:border-white/10 rounded-2xl p-4 focus:border-pink-500 transition-all outline-none font-bold dark:text-white" placeholder="Operator Name..." />
            </div>
            <div>
              <label className="block text-[10px] font-black opacity-60 mb-2 uppercase tracking-widest italic dark:text-white">Security Rating</label>
              <select required className="w-full bg-black/5 dark:bg-white/5 border-2 border-black/10 dark:border-white/10 rounded-2xl p-4 focus:border-pink-500 transition-all outline-none font-bold dark:text-white appearance-none">
                <option value="5">S-Rank: Maximum Security</option>
                <option value="4">A-Rank: Stable</option>
                <option value="3">B-Rank: Average</option>
                <option value="2">C-Rank: Vulnerable</option>
                <option value="1">F-Rank: Hazardous</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-black opacity-60 mb-2 uppercase tracking-widest italic dark:text-white">Transmission Message</label>
              <textarea required rows={4} className="w-full bg-black/5 dark:bg-white/5 border-2 border-black/10 dark:border-white/10 rounded-2xl p-4 focus:border-pink-500 transition-all outline-none font-bold dark:text-white" placeholder="Type review..."></textarea>
            </div>
          </div>
          <button type="submit" className="mt-8 bg-pink-500 hover:bg-pink-600 text-white px-10 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] transition-all shadow-xl shadow-pink-500/20 active:scale-95 italic">
            Broadcast Review
          </button>
        </form>

        <div className="text-center text-slate-400 font-black uppercase tracking-[0.4em] italic text-[10px] opacity-40">
          - End of Encrypted Feed -
        </div>
      </div>

      {/* Strict Section Order 4: Helpline Block */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-4xl mx-auto mt-24 mb-24 px-4">
        {mockSettings.helpline_whatsapp && (
          <a href={`https://wa.me/${mockSettings.helpline_whatsapp.replace('+','')}`} target="_blank" rel="noreferrer" className="w-full sm:w-auto flex items-center justify-center min-h-[64px] gap-3 bg-[#25D366]/10 text-[#25D366] px-10 py-4 rounded-[2rem] border-2 border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all font-black uppercase tracking-widest italic text-[10px] shadow-2xl shadow-[#25D366]/10">
            WhatsApp Command
          </a>
        )}
        {mockSettings.helpline_telegram && (
          <a href={`https://t.me/${mockSettings.helpline_telegram.replace('@','')}`} target="_blank" rel="noreferrer" className="w-full sm:w-auto flex items-center justify-center min-h-[64px] gap-3 bg-[#229ED9]/10 text-[#229ED9] px-10 py-4 rounded-[2rem] border-2 border-[#229ED9]/20 hover:bg-[#229ED9]/20 transition-all font-black uppercase tracking-widest italic text-[10px] shadow-2xl shadow-[#229ED9]/10">
            Telegram Directive
          </a>
        )}
      </div>

      {/* Discover More Slider */}
      <div className="max-w-6xl mx-auto mt-32 mb-10 px-4">
        <div className="flex items-center justify-between border-b-4 border-black/5 dark:border-white/5 pb-6 mb-10">
          <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter dark:text-white italic">Alternative Matrices</h2>
          <div className="flex gap-3">
             <button className="p-3 min-w-[56px] min-h-[56px] flex items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-pink-500 hover:text-white transition-all border-2 border-black/5 dark:border-white/5"><ChevronLeft className="w-5 h-5"/></button>
             <button className="p-3 min-w-[56px] min-h-[56px] flex items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-pink-500 hover:text-white transition-all border-2 border-black/5 dark:border-white/5"><ChevronRight className="w-5 h-5"/></button>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {mockApps.filter(a => a.is_new && a.id !== app.id).slice(0, 4).map(discoverApp => (
            <Link key={discoverApp.id} to={`/app/${discoverApp.slug}`} className="bg-white/40 dark:bg-black/60 backdrop-blur-3xl p-6 flex flex-col items-center text-center hover:-translate-y-2 transition-transform border-2 border-white/20 dark:border-white/5 rounded-[2.5rem] shadow-2xl">
              <div className="w-20 h-20 rounded-[1.8rem] overflow-hidden mb-4 bg-white/20 shadow-2xl border-4 border-white-10">
                 {discoverApp.icon_url && <img src={discoverApp.icon_url} alt="" className="w-full h-full object-cover"/>}
              </div>
              <h4 className="font-black text-xs uppercase tracking-tighter w-full dark:text-zinc-100">{discoverApp.name}</h4>
              <div className="text-[10px] font-black text-slate-400 dark:text-zinc-500 mt-1 uppercase tracking-widest">{discoverApp.developer}</div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* THE "SECURITY" INFORMATION SECTION */}
      <div className="w-screen relative left-1/2 -translate-x-1/2 mt-40 bg-[var(--bg-primary)] px-6 py-32 border-t-8 border-pink-600 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
          <div className="text-center relative z-10">
            <h2 className="text-4xl sm:text-6xl font-black mb-16 uppercase tracking-tighter text-[var(--text-primary)] italic drop-shadow-2xl">
              <span className="text-pink-600">Transparency</span> Review Portal
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-12 text-left mt-12 bg-[var(--card-bg)] p-10 sm:p-16 rounded-[4rem] border-2 border-black/5 dark:border-white/10 shadow-2xl dark:shadow-[0_0_100px_rgba(236,72,153,0.1)] transition-colors">
              <div className="space-y-6">
                <h3 className="font-black text-2xl mb-4 flex items-center gap-4 uppercase tracking-tighter text-white bg-pink-600 w-fit px-6 py-2 rounded-2xl italic">
                  Legal Directive
                </h3>
                <p className="leading-relaxed text-sm font-black uppercase tracking-tight text-[var(--text-primary)] opacity-70">
                  {mockSettings.disclaimer_text}
                </p>
              </div>
              
              <div className="space-y-6">
                <h3 className="font-black text-2xl mb-4 flex items-center gap-4 uppercase tracking-tighter text-white bg-blue-600 w-fit px-6 py-2 rounded-2xl italic">
                  Ethics Protocol
                </h3>
                <p className="leading-relaxed text-sm font-black uppercase tracking-tight text-[var(--text-primary)] opacity-70">
                  {mockSettings.ethics_discrimination_text}
                </p>
              </div>
            </div>
            
            <div className="mt-20">
              <p className="text-[10px] font-black uppercase tracking-[0.8em] text-[var(--text-primary)] opacity-30 italic">Encrypted Secure Link • High Speed Node {app.id}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Spacer to push content down because portal is absolute (wait, it's better to just use relative width viewport or negative margins) */}
      <div className="h-[400px] sm:h-[300px]"></div>
    </div>
  );
}
