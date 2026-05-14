import { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { FileText, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Blogs() {
  const { settings: mockSettings, blogs: mockBlogs } = useData();

  useEffect(() => {
    document.title = `Blogs - ${mockSettings.site_title}`;
    window.scrollTo(0, 0);
  }, [mockSettings.site_title]);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-10 border-b border-slate-200 dark:border-white/5 pb-6">
        <div className="p-4 bg-red-600/10 rounded-2xl text-red-600">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-black dark:text-white">Our Portal Blogs</h1>
      </div>

      {mockBlogs.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          No blog posts available right now.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {mockBlogs.map(blog => (
            <div key={blog.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden glass-panel hover:border-pink-500/30 transition-colors group">
              <img src={blog.cover_url || undefined} alt={blog.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-pink-400 font-semibold mb-3">
                  <Calendar className="w-4 h-4" />
                  {new Date(blog.published_at).toLocaleDateString()}
                </div>
                <h3 className="text-xl font-black mb-2 text-black dark:text-white line-clamp-2 uppercase tracking-tight">{blog.title}</h3>
                <p className="text-sm text-black dark:text-slate-400 line-clamp-3 mb-4 font-medium uppercase tracking-tight">{blog.content}</p>
                <div className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-widest">By {blog.author}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
