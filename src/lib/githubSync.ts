export interface GitConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
  autoSync: boolean;
}

/**
 * Encodes string to UTF-8 base64 properly for GitHub API content submission
 */
export function b64EncodeUnicode(str: string): string {
  try {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      })
    );
  } catch (error) {
    console.error("Base64 unicode encoding error:", error);
    return btoa(str);
  }
}

/**
 * Dynamically generates the content of `src/lib/supabase.ts` based on current state
 */
export function generateSupabaseFileCode(
  apps: any[],
  settings: any,
  news: any[],
  blogs: any[],
  videos: any[]
): string {
  // Let us clean up and default any potential circular refs or undef values by round-tripping
  const cleanApps = JSON.parse(JSON.stringify(apps));
  const cleanSettings = JSON.parse(JSON.stringify(settings));
  const cleanNews = JSON.parse(JSON.stringify(news));
  const cleanBlogs = JSON.parse(JSON.stringify(blogs));
  const cleanVideos = JSON.parse(JSON.stringify(videos));

  return `import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
// @ts-ignore
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

const savedApps = localStorage.getItem('yonostore_apps');
export const mockApps: AppConfig[] = savedApps ? (() => {
  try {
    const parsed = JSON.parse(savedApps);
    const defaultApps = ${JSON.stringify(cleanApps, null, 2)};
    defaultApps.forEach(defApp => {
      const idx = parsed.findIndex((a: any) => a.id === defApp.id);
      if (idx === -1) {
        parsed.push(defApp);
      } else {
        // Upgrade cache if compiling default app is newer or modified
        parsed[idx] = { ...parsed[idx], ...defApp };
      }
    });
    return parsed;
  } catch (e) {
    return ${JSON.stringify(cleanApps, null, 2)};
  }
})() : ${JSON.stringify(cleanApps, null, 2)};

export const saveMockApps = (apps: AppConfig[]) => {
  localStorage.setItem('yonostore_apps', JSON.stringify(apps));
  mockApps.splice(0, mockApps.length, ...apps);
};

const savedSettings = localStorage.getItem('yonostore_settings');
export const mockSettings: GlobalSettings = savedSettings ? JSON.parse(savedSettings) : ${JSON.stringify(cleanSettings, null, 2)};

export const saveMockSettings = (settings: GlobalSettings) => {
  localStorage.setItem('yonostore_settings', JSON.stringify(settings));
  Object.assign(mockSettings, settings);
};

const savedNews = localStorage.getItem('yonostore_news');
export const mockNews: NewsItem[] = savedNews ? JSON.parse(savedNews) : ${JSON.stringify(cleanNews, null, 2)};

export const saveMockNews = (newsList: NewsItem[]) => {
  localStorage.setItem('yonostore_news', JSON.stringify(newsList));
  mockNews.splice(0, mockNews.length, ...newsList);
};

const savedBlogs = localStorage.getItem('yonostore_blogs');
export const mockBlogs: BlogPost[] = savedBlogs ? JSON.parse(savedBlogs) : ${JSON.stringify(cleanBlogs, null, 2)};

export const saveMockBlogs = (blogs: BlogPost[]) => {
  localStorage.setItem('yonostore_blogs', JSON.stringify(blogs));
  mockBlogs.splice(0, mockBlogs.length, ...blogs);
};

const savedVideos = localStorage.getItem('yonostore_videos');
export const mockVideos: VideoItem[] = savedVideos ? JSON.parse(savedVideos) : ${JSON.stringify(cleanVideos, null, 2)};

export const saveMockVideos = (videos: VideoItem[]) => {
  localStorage.setItem('yonostore_videos', JSON.stringify(videos));
  mockVideos.splice(0, mockVideos.length, ...videos);
};
`;
}

/**
 * Commits a file content update directly to Github via REST API
 */
export async function commitFileToGitHub({
  owner,
  repo,
  token,
  branch,
  path,
  content,
  message
}: {
  owner: string;
  repo: string;
  token: string;
  branch: string;
  path: string;
  content: string;
  message: string;
}) {
  const cleanBranch = branch ? branch.trim() : 'main';
  const cleanPath = path.replace(/^\/+/g, ''); // strip leading slashes

  console.log(`GitHub Sync: Fetching SHA of ${cleanPath} on repo ${owner}/${repo} [branch: ${cleanBranch}]...`);
  
  let sha: string | undefined = undefined;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}?ref=${cleanBranch}`,
      {
        headers: {
          'Authorization': `Bearer ${token.trim()}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (res.ok) {
      const data = await res.json();
      sha = data.sha;
      console.log(`GitHub Sync: Existing file SHA found: ${sha}`);
    } else if (res.status === 404) {
      console.log(`GitHub Sync: No existing file found at ${cleanPath}, creating fresh new file page!`);
    } else {
      const errRes = await res.json().catch(() => ({}));
      console.warn("GitHub Fetch SHA status warning:", res.status, errRes);
    }
  } catch (e) {
    console.warn("GitHub SHA Fetch error (will assume new file):", e);
  }

  const encodedContent = b64EncodeUnicode(content);

  const payload = {
    message,
    content: encodedContent,
    branch: cleanBranch,
    ...(sha ? { sha } : {})
  };

  console.log(`GitHub Sync: Initiating commit for ${cleanPath}...`);

  const saveRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify(payload)
    }
  );

  if (!saveRes.ok) {
    const errText = await saveRes.text();
    let errMsg = errText;
    try {
      const errJSON = JSON.parse(errText);
      errMsg = errJSON.message || errText;
    } catch (_) {}
    throw new Error(errMsg);
  }

  const result = await saveRes.json();
  console.log("GitHub Sync: Commit verified & published success!", result.commit?.sha);
  return result;
}
