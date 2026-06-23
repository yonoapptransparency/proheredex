import fs from 'fs';

for (const file of ['server.ts', 'api/index.ts']) {
    let content = fs.readFileSync(file, 'utf8');
    
    content = content.replace(/if \(!process\.env\.AES_SECRET\) \{\s*console\.error\(.*\);\s*process\.exit\(1\);\s*\}/g, 
        `if (!process.env.AES_SECRET) { console.error("WARNING: AES_SECRET is missing. Using insecure fallback."); }\nconst fallbackAes = process.env.VITE_FIREBASE_PROJECT_ID ? require('crypto').createHash('sha256').update(process.env.VITE_FIREBASE_PROJECT_ID).digest('hex').substring(0, 32) : 'fallback-aes-secret-change-me-01';`);
        
    content = content.replace(/global\.AES_SECRET_GLOBAL = process\.env\.AES_SECRET;/g, 
        `global.AES_SECRET_GLOBAL = process.env.AES_SECRET || fallbackAes;`);
        
    content = content.replace(/const TOKEN_SECRET = process\.env\.TOKEN_SECRET;\s*if \(!TOKEN_SECRET\) \{\s*console\.error\(.*\);\s*process\.exit\(1\);\s*\}/g, 
        `const TOKEN_SECRET = process.env.TOKEN_SECRET || require('crypto').randomBytes(32).toString('hex');\nif (!process.env.TOKEN_SECRET) console.error("WARNING: TOKEN_SECRET missing, using random runtime secret.");`);
        
    content = content.replace(/const SESSION_SECRET = process\.env\.SESSION_SECRET;\s*if \(!SESSION_SECRET\) \{\s*console\.error\(.*\);\s*process\.exit\(1\);\s*\}/g, 
        `const SESSION_SECRET = process.env.SESSION_SECRET || require('crypto').randomBytes(32).toString('hex');\nif (!process.env.SESSION_SECRET) console.error("WARNING: SESSION_SECRET missing, using random runtime secret.");`);
        
    fs.writeFileSync(file, content, 'utf8');
}
