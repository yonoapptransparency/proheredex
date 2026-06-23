import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { safeHtml } from '../lib/safeHtml';
import { cn } from '../lib/utils';

interface AccordionItemProps {
  question: string;
  answer: string;
  isWebsiteFaq?: boolean;
}

export default function AccordionItem({ question, answer, isWebsiteFaq }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn(
      "border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden transition-all duration-200",
      isWebsiteFaq ? "bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-sm hover:shadow-md" : "bg-white dark:bg-zinc-900 shadow-sm p-1"
    )}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full text-left font-bold cursor-pointer select-none flex items-center justify-between text-zinc-900 dark:text-white transition-colors",
          isWebsiteFaq ? "py-5 px-6 text-lg" : "p-4 text-base font-medium"
        )}
      >
        <span className="flex items-start gap-3 flex-1 pr-4">
          {isWebsiteFaq && <span className="text-blue-500 font-black mt-px shrink-0">Q.</span>}
          <span>{question}</span>
        </span>
        <div className={cn(
          "shrink-0 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 transition-transform duration-300",
          isOpen ? "rotate-180" : "rotate-0",
          isWebsiteFaq ? "w-8 h-8" : "w-8 h-8"
        )}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={cn(
              "text-slate-600 dark:text-slate-400 leading-relaxed",
              isWebsiteFaq ? "px-6 pb-6 pt-0 font-medium" : "px-4 pb-4 pt-0 text-sm"
            )}>
              <div className={cn("flex flex-col sm:flex-row items-start gap-3 w-full")}>
                {isWebsiteFaq && <span className="text-indigo-500 font-black mt-px shrink-0">A.</span>}
                <div 
                  className="prose prose-zinc dark:prose-invert prose-sm max-w-none w-full break-words break-all sm:break-normal overflow-wrap-anywhere whitespace-normal"
                  dangerouslySetInnerHTML={{ __html: safeHtml(answer) }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
