import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { AppConfig, GlobalSettings, NewsItem, BlogPost, VideoItem } from '../lib/supabase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const user = auth.currentUser;
  const userEmail = user?.email || 'Anonymous/Not logged in';
  const userId = user?.uid || 'No UID';
  
  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: userId,
      email: userEmail,
      emailVerified: user?.emailVerified,
      isAnonymous: user?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error Details: ', errInfo);
  
  if (errorMessage.includes('permissions') || errorMessage.includes('permission-denied')) {
    const dbId = (auth.app.options as any).projectId;
    const fullMsg = `Permission Denied!
Path: ${path}
Op: ${operationType}
User: ${userEmail} (${userId})
Verified: ${user?.emailVerified}
Project: ${dbId}
Raw Error: ${errorMessage}`;
    
    console.warn(`PERMISSION DENIED DEBUG: ${fullMsg}`);
    throw new Error(fullMsg);
  }
  
  throw new Error(errorMessage);
}

// Providing fallback data immediately helps avoid layout shifts
import { mockApps, mockSettings, mockNews, mockBlogs, mockVideos } from '../lib/supabase';

interface DataContextType {
  apps: AppConfig[];
  settings: GlobalSettings;
  news: NewsItem[];
  blogs: BlogPost[];
  videos: VideoItem[];
  loading: boolean;
  saveApps: (apps: AppConfig[]) => Promise<void>;
  saveSettings: (settings: GlobalSettings) => Promise<void>;
  saveNews: (news: NewsItem[]) => Promise<void>;
  saveBlogs: (blogs: BlogPost[]) => Promise<void>;
  saveVideos: (videos: VideoItem[]) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [apps, setApps] = useState<AppConfig[]>(mockApps);
  const [settings, setSettings] = useState<GlobalSettings>(mockSettings);
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [blogs, setBlogs] = useState<BlogPost[]>(mockBlogs);
  const [videos, setVideos] = useState<VideoItem[]>(mockVideos);
  const [loading, setLoading] = useState(false); // Start with false to show mock data immediately

  useEffect(() => {
    let initialCount = 0;
    const totalListen = 5;
    const checkLoaded = () => {
      initialCount++;
      // No longer force-hiding the app behind a loading screen
    };

    // We still want to track if we've synced at least once if needed, 
    // but we'll show pages immediately.
    
    // Set a small safety timeout to ensure any critical data is fetched, 
    // but the UI is already active.
    const timeoutId = setTimeout(() => {
      // Any logic that depends on 'sync complete' can go here
    }, 2000);

    const unsubs = [
      onSnapshot(doc(db, 'store_data', 'apps'), (snap) => {
        if (snap.exists()) {
          const data = snap.data().items || [];
          setApps(data);
          localStorage.setItem('yonostore_apps', JSON.stringify(data));
        }
        checkLoaded();
      }, (err) => {
        checkLoaded();
        console.error(err);
      }),
      onSnapshot(doc(db, 'store_data', 'settings'), (snap) => {
        if (snap.exists()) {
          const data = snap.data() as GlobalSettings;
          setSettings(data);
          localStorage.setItem('yonostore_settings', JSON.stringify(data));
        }
        checkLoaded();
      }, (err) => {
        checkLoaded();
        console.error(err);
      }),
      onSnapshot(doc(db, 'store_data', 'news'), (snap) => {
        if (snap.exists()) {
          const data = snap.data().items || [];
          setNews(data);
          localStorage.setItem('yonostore_news', JSON.stringify(data));
        }
        checkLoaded();
      }, (err) => {
        checkLoaded();
        console.error(err);
      }),
      onSnapshot(doc(db, 'store_data', 'blogs'), (snap) => {
        if (snap.exists()) {
          const data = snap.data().items || [];
          setBlogs(data);
          localStorage.setItem('yonostore_blogs', JSON.stringify(data));
        }
        checkLoaded();
      }, (err) => {
        checkLoaded();
        console.error(err);
      }),
      onSnapshot(doc(db, 'store_data', 'videos'), (snap) => {
        if (snap.exists()) {
          const data = snap.data().items || [];
          setVideos(data);
          localStorage.setItem('yonostore_videos', JSON.stringify(data));
        }
        checkLoaded();
      }, (err) => {
        checkLoaded();
        console.error(err);
      })
    ];
    
    return () => {
      clearTimeout(timeoutId);
      unsubs.forEach(u => u());
    };
  }, []);

  const saveApps = async (newApps: AppConfig[]) => {
    try {
      localStorage.setItem('yonostore_apps', JSON.stringify(newApps));
      setApps(newApps);
      await setDoc(doc(db, 'store_data', 'apps'), { items: newApps });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'store_data/apps');
    }
  };
  const saveSettings = async (newSettings: GlobalSettings) => {
    try {
      localStorage.setItem('yonostore_settings', JSON.stringify(newSettings));
      setSettings(newSettings);
      await setDoc(doc(db, 'store_data', 'settings'), newSettings);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'store_data/settings');
    }
  };
  const saveNews = async (newNews: NewsItem[]) => {
    try {
      localStorage.setItem('yonostore_news', JSON.stringify(newNews));
      setNews(newNews);
      await setDoc(doc(db, 'store_data', 'news'), { items: newNews });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'store_data/news');
    }
  };
  const saveBlogs = async (newBlogs: BlogPost[]) => {
    try {
      localStorage.setItem('yonostore_blogs', JSON.stringify(newBlogs));
      setBlogs(newBlogs);
      await setDoc(doc(db, 'store_data', 'blogs'), { items: newBlogs });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'store_data/blogs');
    }
  };
  const saveVideos = async (newVideos: VideoItem[]) => {
    try {
      localStorage.setItem('yonostore_videos', JSON.stringify(newVideos));
      setVideos(newVideos);
      await setDoc(doc(db, 'store_data', 'videos'), { items: newVideos });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'store_data/videos');
    }
  };

  return (
    <DataContext.Provider value={{ apps, settings, news, blogs, videos, loading, saveApps, saveSettings, saveNews, saveBlogs, saveVideos }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};
