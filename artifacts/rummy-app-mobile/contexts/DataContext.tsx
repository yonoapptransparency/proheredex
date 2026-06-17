import React, { createContext, useContext, useEffect, useState } from "react";

export interface AppConfig {
  id: string;
  name: string;
  slug: string;
  category: string;
  version: string;
  file_size: string;
  developer: string;
  icon_url: string;
  screenshots: string[];
  description_html: string;
  red_box_msg?: string;
  yellow_box_msg?: string;
  idea_box_msg?: string;
  safety_status: "Verified" | "Caution" | "Unsafe";
  serial_number: number;
  is_featured: boolean;
  is_new: boolean;
  is_coming_soon?: boolean;
  release_notes: string;
  rating: number;
  created_at: string;
  features_html?: string;
  faqs?: { question: string; answer: string }[];
  link_configured?: boolean;
  seo_title?: string;
  seo_description?: string;
  custom_admin_box_html?: string;
  custom_admin_box_heading?: string;
}

export interface GlobalSettings {
  site_title: string;
  meta_description?: string;
  logo_url?: string;
  favicon_url?: string;
  helpline_whatsapp?: string;
  helpline_telegram?: string;
  support_email?: string;
  disclaimer_text?: string;
  categories: string[];
  banners?: { id: string; title: string; subtitle: string; image: string; link: string }[];
  ticker_text?: string;
  animations_enabled?: boolean;
  trending_searches?: string[];
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  logo_url?: string;
  description?: string;
  description_html?: string;
  date?: string;
  published_at?: string;
  author?: string;
  read_time?: string;
  tags?: string[];
  link?: string;
}

interface DataContextType {
  apps: AppConfig[];
  settings: GlobalSettings;
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const defaultSettings: GlobalSettings = {
  site_title: "RummyApp",
  categories: [],
};

const DataContext = createContext<DataContextType>({
  apps: [],
  settings: defaultSettings,
  news: [],
  loading: true,
  error: null,
  refresh: async () => {},
});

function getApiBase(): string {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) return `https://${domain}`;
  return "";
}

async function fetchData(): Promise<{ apps: AppConfig[]; settings: GlobalSettings; news: NewsItem[] }> {
  const base = getApiBase();
  if (!base) return { apps: [], settings: defaultSettings, news: [] };

  const res = await fetch(`${base}/api/v1/public/backup-data`, {
    headers: { "Cache-Control": "no-cache" },
    signal: AbortSignal.timeout(12000),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json();

  const apps: AppConfig[] = Array.isArray(data.apps) ? data.apps : [];
  const settings: GlobalSettings = data.settings && data.settings.site_title
    ? data.settings
    : defaultSettings;
  const news: NewsItem[] = Array.isArray(data.news) ? data.news : [];

  return { apps, settings, news };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [apps, setApps] = useState<AppConfig[]>([]);
  const [settings, setSettings] = useState<GlobalSettings>(defaultSettings);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchData();
      setApps(data.apps.sort((a, b) => (a.serial_number || 0) - (b.serial_number || 0)));
      setSettings(data.settings);
      setNews(data.news);
    } catch (e: any) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <DataContext.Provider value={{ apps, settings, news, loading, error, refresh: load }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
