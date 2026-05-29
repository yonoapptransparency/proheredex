export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

export interface GlobalSettings {
  site_title: string;
  meta_description: string;
  logo_url: string;
  favicon_url: string;
  helpline_whatsapp: string;
  helpline_telegram: string;
  support_email: string;
  disclaimer_text: string;
  disclaimer_heading?: string;
  ethics_discrimination_text: string;
  ethics_heading?: string;
  portal_heading?: string;
  important_notice_heading?: string;
  ticker_text: string;
  animations_enabled: boolean;
  seo_keywords?: string;
  about_content?: string;
  contact_content?: string;
  privacy_content?: string;
  terms_content?: string;
  responsibility_content?: string;
  important_notice?: string;
  categories: string[];
  banners: Banner[];
  last_updated?: string;
  secure_index_title?: string;
  secure_index_subtitle?: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  logo_url: string;
  description: string;
  ceo_name: string;
  ceo_description: string;
  seo_title: string;
  seo_description: string;
  seo_keywords?: string;
  og_image_url?: string;
  canonical_url?: string;
  target_region?: string;
  content: string;
  published_at?: string;
  link: string;
}

export interface AppConfig {
  id: string;
  name: string;
  slug: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  og_image_url?: string;
  canonical_url?: string;
  target_region?: string;
  category: string;
  version: string;
  file_size: string;
  developer: string;
  icon_url: string;
  screenshots: string[];
  encrypted_download_url: string;
  description_html: string;
  red_box_msg: string;
  yellow_box_msg: string;
  idea_box_msg: string;
  safety_status: 'Verified' | 'Caution' | 'Unsafe';
  serial_number: number;
  is_featured: boolean;
  is_new: boolean;
  release_notes: string;
  rating: number;
  created_at: string;
  custom_admin_box_html?: string;
  custom_admin_box_heading?: string;
  faqs?: {question: string; answer: string}[];
}

export interface Review {
  id: string;
  app_id: string;
  username: string;
  rating: number;
  comment: string;
  is_approved: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  author: string;
  cover_url: string;
  published_at: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  canonical_url?: string;
  target_region?: string;
}

export interface NewsUpdate {
  id: string;
  title: string;
  content_html: string;
  category: string;
  published_at: string;
}

export interface VideoItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  youtube_url: string;
  seo_title: string;
  seo_description: string;
  seo_keywords?: string;
  created_at: string;
}

const savedApps = typeof window !== 'undefined' ? localStorage.getItem('rummystore_apps') : null;
export const mockApps: AppConfig[] = savedApps ? (() => {
  try { return JSON.parse(savedApps); } catch { return []; }
})() : [];

export const saveMockApps = (apps: AppConfig[]) => {
  localStorage.setItem('rummystore_apps', JSON.stringify(apps));
  mockApps.splice(0, mockApps.length, ...apps);
};

const savedSettings = typeof window !== 'undefined' ? localStorage.getItem('rummystore_settings') : null;
export const mockSettings: GlobalSettings = savedSettings ? ((): GlobalSettings => {
  try { return JSON.parse(savedSettings); } catch { return {} as GlobalSettings; }
})() : {
  site_title: 'RUMMY STORE. Virtual E-Sports Store',
  meta_description: 'Play classic Rummy online with friends! Enjoy smooth gameplay, custom tables, and free daily tournaments. Download the official app on the Play Store and start playing instantly.',
  logo_url: '',
  favicon_url: '',
  helpline_whatsapp: '+1234567890',
  helpline_telegram: '@rummystore',
  support_email: 'support@rummystore.com',
  disclaimer_text: 'Rummy Store is an e-sports gaming review platform. We focus on providing high quality app reviews.',
  disclaimer_heading: 'APP REVIEW PLATFORM',
  ethics_discrimination_text: 'We are committed to providing equal access to safe and free virtual gaming applications.',
  ethics_heading: 'ETHICS & PLATFORM POLICY',
  portal_heading: 'Virtual e-Sports <br/><span class="text-red-600">Review Portal</span>',
  important_notice_heading: 'VIRTUAL REVIEW HUB',
  ticker_text: 'WELCOME TO RUMMY STORE • Enjoy free e-sports gaming reviews • Join our Telegram for updates •',
  animations_enabled: true,
  seo_keywords: 'rummy store, e-sports review, virtual games, safe gaming',
  about_content: '<p>Rummy Store is built with a single mission: to provide a transparent environment for discovering the best e-sports gaming applications.</p><p>Explore our vast catalog of top-rated apps and secure downloads.</p>',
  contact_content: '<p>Have questions or feedback about our virtual gaming reviews? We\'d love to hear from you. Our team typically responds within 24-48 hours.</p>',
  privacy_content: '<h2>1. Information We Collect</h2><p>We collect basic information required for account creation to grant virtual access. No sensitive information is ever collected or requested.</p>',
  terms_content: '<h2>1. General Terms</h2><p>By accessing Rummy Store, you acknowledge that all gaming reviews and applications listed operate purely for entertainment.</p>',
  responsibility_content: '<p>Our website is dedicated to maintaining the highest standards of gaming transparency. We take our responsibility seriously to ensure that every application featured is safe.</p><p>Users can enjoy our e-sports reviews and gameplay descriptions with complete peace of mind.</p>',
  important_notice: 'Please note: Rummy Store is purely for entertainment and review purposes.',
  categories: ['All Apps', 'Categories', 'Top Charts', 'Games', 'Tools'],
  secure_index_title: 'Catalog Index',
  secure_index_subtitle: 'Verified E-Sports Gaming Reviews',
  banners: [
    { id: "1", title: "Virtual Pro Gaming", subtitle: "Top rated app of the week", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80", link: "/" },
    { id: "2", title: "E-Sports Tournaments", subtitle: "Learn strategy and gameplay", image: "https://images.unsplash.com/photo-1606167668511-22c64ee0fce6?auto=format&fit=crop&q=80&w=800", link: "/" },
    { id: "3", title: "Gaming Enthusiasts", subtitle: "Join our top community", image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=800", link: "/" }
  ]
};

export const saveMockSettings = (settings: GlobalSettings) => {
  localStorage.setItem('rummystore_settings', JSON.stringify(settings));
  Object.assign(mockSettings, settings);
};

const savedNews = typeof window !== 'undefined' ? localStorage.getItem('rummystore_news') : null;
export const mockNews: NewsItem[] = savedNews ? (() => {
  try { return JSON.parse(savedNews); } catch { return []; }
})() : [];

export const saveMockNews = (newsList: NewsItem[]) => {
  localStorage.setItem('rummystore_news', JSON.stringify(newsList));
  mockNews.splice(0, mockNews.length, ...newsList);
};

const savedBlogs = typeof window !== 'undefined' ? localStorage.getItem('rummystore_blogs') : null;
export const mockBlogs: BlogPost[] = savedBlogs ? (() => {
  try { return JSON.parse(savedBlogs); } catch { return []; }
})() : [];

export const saveMockBlogs = (blogs: BlogPost[]) => {
  localStorage.setItem('rummystore_blogs', JSON.stringify(blogs));
  mockBlogs.splice(0, mockBlogs.length, ...blogs);
};

const savedVideos = typeof window !== 'undefined' ? localStorage.getItem('rummystore_videos') : null;
export const mockVideos: VideoItem[] = savedVideos ? (() => {
  try { return JSON.parse(savedVideos); } catch { return []; }
})() : [];

export const saveMockVideos = (videos: VideoItem[]) => {
  localStorage.setItem('rummystore_videos', JSON.stringify(videos));
  mockVideos.splice(0, mockVideos.length, ...videos);
};
