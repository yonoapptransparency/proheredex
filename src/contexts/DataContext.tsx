import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, getDoc, getDocFromServer } from 'firebase/firestore';
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
  isConnected: boolean | null;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [apps, setApps] = useState<AppConfig[]>(() => {
    const saved = localStorage.getItem('yonostore_apps');
    return saved ? JSON.parse(saved) : mockApps;
  });
  const [settings, setSettings] = useState<GlobalSettings>(() => {
    const saved = localStorage.getItem('yonostore_settings');
    return saved ? JSON.parse(saved) : mockSettings;
  });
  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('yonostore_news');
    return saved ? JSON.parse(saved) : mockNews;
  });
  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('yonostore_blogs');
    return saved ? JSON.parse(saved) : mockBlogs;
  });
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem('yonostore_videos');
    return saved ? JSON.parse(saved) : mockVideos;
  });
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    let initialCount = 0;
    const totalListen = 5;
    const checkLoaded = () => {
      initialCount++;
    };

    // Test connectivity
    const testDoc = doc(db, 'store_data', 'connectivity_test');
    setDoc(testDoc, { last_check: new Date().toISOString() }, { merge: true })
      .then(() => setIsConnected(true))
      .catch((err) => {
        console.error("Connectivity Test Failed:", err);
        setIsConnected(false);
      });

    const unsubs = [
      onSnapshot(doc(db, 'store_data', 'apps'), { includeMetadataChanges: true }, (snap) => {
        const isServerUpdate = !snap.metadata.hasPendingWrites && !snap.metadata.fromCache;
        console.log("Sync [Apps]: Server Confirmed =", isServerUpdate);
        
        if (snap.exists()) {
          const data = snap.data().items || [];
          setApps(data);
          localStorage.setItem('yonostore_apps', JSON.stringify(data));
          if (isServerUpdate) setIsConnected(true);
        }
        checkLoaded();
      }, (err) => {
        console.error("Sync Error [Apps]:", err);
        setIsConnected(false);
        checkLoaded();
      }),
      onSnapshot(doc(db, 'store_data', 'settings'), { includeMetadataChanges: true }, (snap) => {
        const isServerUpdate = !snap.metadata.hasPendingWrites && !snap.metadata.fromCache;
        console.log("Sync [Settings]: Server Confirmed =", isServerUpdate);
        
        if (snap.exists()) {
          const data = snap.data() as GlobalSettings;
          setSettings(data);
          localStorage.setItem('yonostore_settings', JSON.stringify(data));
          if (isServerUpdate) setIsConnected(true);
        }
        checkLoaded();
      }, (err) => {
        console.error("Sync Error [Settings]:", err);
        setIsConnected(false);
        checkLoaded();
      }),
      onSnapshot(doc(db, 'store_data', 'news'), (snap) => {
        if (snap.exists()) {
          const data = snap.data().items || [];
          setNews(data);
          localStorage.setItem('yonostore_news', JSON.stringify(data));
        }
        checkLoaded();
      }, (err) => {
        console.error("Firestore Sync Error (news):", err);
        checkLoaded();
      }),
      onSnapshot(doc(db, 'store_data', 'blogs'), (snap) => {
        if (snap.exists()) {
          const data = snap.data().items || [];
          setBlogs(data);
          localStorage.setItem('yonostore_blogs', JSON.stringify(data));
        }
        checkLoaded();
      }, (err) => {
        console.error("Firestore Sync Error (blogs):", err);
        checkLoaded();
      }),
      onSnapshot(doc(db, 'store_data', 'videos'), (snap) => {
        if (snap.exists()) {
          const data = snap.data().items || [];
          setVideos(data);
          localStorage.setItem('yonostore_videos', JSON.stringify(data));
        }
        checkLoaded();
      }, (err) => {
        console.error("Firestore Sync Error (videos):", err);
        checkLoaded();
      })
    ];
    
    return () => {
      unsubs.forEach(u => u());
    };
  }, []);

  const saveApps = async (newApps: AppConfig[]) => {
    try {
      console.log("Attempting to save apps to Firestore...");
      localStorage.setItem('yonostore_apps', JSON.stringify(newApps));
      setApps(newApps);
      
      const docRef = doc(db, 'store_data', 'apps');
      await setDoc(docRef, { items: newApps });
      
      // Use getDocFromServer to bypass local cache and see if it actually hit the server
      const verify = await getDocFromServer(docRef);
      if (verify.exists()) {
        console.log("Apps verified on SERVER after save.");
      } else {
        console.warn("Apps NOT found on SERVER after save! This usually means the write is queued but hasn't reached Firestore yet.");
      }
    } catch (err) {
      console.error("Save Apps Error:", err);
      handleFirestoreError(err, OperationType.WRITE, 'store_data/apps');
    }
  };
  const saveSettings = async (newSettings: GlobalSettings) => {
    try {
      console.log("Attempting to save settings to Firestore...");
      localStorage.setItem('yonostore_settings', JSON.stringify(newSettings));
      setSettings(newSettings);
      
      const docRef = doc(db, 'store_data', 'settings');
      await setDoc(docRef, newSettings);
      
      // Use getDocFromServer to bypass local cache
      const verify = await getDocFromServer(docRef);
      if (verify.exists()) {
        console.log("Settings verified on SERVER after save.");
      } else {
        console.warn("Settings NOT found on SERVER after save!");
      }
    } catch (err) {
      console.error("Save Settings Error:", err);
      handleFirestoreError(err, OperationType.WRITE, 'store_data/settings');
    }
  };
  const saveNews = async (newNews: NewsItem[]) => {
    try {
      console.log("Attempting to save news to Firestore...");
      localStorage.setItem('yonostore_news', JSON.stringify(newNews));
      setNews(newNews);
      await setDoc(doc(db, 'store_data', 'news'), { items: newNews });
      console.log("News saved successfully to Firestore.");
    } catch (err) {
      console.error("Save News Error:", err);
      handleFirestoreError(err, OperationType.WRITE, 'store_data/news');
    }
  };
  const saveBlogs = async (newBlogs: BlogPost[]) => {
    try {
      console.log("Attempting to save blogs to Firestore...");
      localStorage.setItem('yonostore_blogs', JSON.stringify(newBlogs));
      setBlogs(newBlogs);
      await setDoc(doc(db, 'store_data', 'blogs'), { items: newBlogs });
      console.log("Blogs saved successfully to Firestore.");
    } catch (err) {
      console.error("Save Blogs Error:", err);
      handleFirestoreError(err, OperationType.WRITE, 'store_data/blogs');
    }
  };
  const saveVideos = async (newVideos: VideoItem[]) => {
    try {
      console.log("Attempting to save videos to Firestore...");
      localStorage.setItem('yonostore_videos', JSON.stringify(newVideos));
      setVideos(newVideos);
      await setDoc(doc(db, 'store_data', 'videos'), { items: newVideos });
      console.log("Videos saved successfully to Firestore.");
    } catch (err) {
      console.error("Save Videos Error:", err);
      handleFirestoreError(err, OperationType.WRITE, 'store_data/videos');
    }
  };

  return (
    <DataContext.Provider value={{
      apps, 
      settings, 
      news, 
      blogs, 
      videos, 
      loading, 
      saveApps, 
      saveSettings, 
      saveNews, 
      saveBlogs, 
      saveVideos,
      isConnected
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};
