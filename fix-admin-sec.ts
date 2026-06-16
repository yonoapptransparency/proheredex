import * as fs from 'fs';

for (const file of ['server.ts', 'api/index.ts']) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. safeDecrypt
    content = content.replace(/function safeDecrypt[\s\S]*?(?=function safeEncrypt)/, `function safeDecrypt(ciphertext: string, secret: string): string {
    if (!secret || secret.trim() === '') return '';
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
        const text = bytes.toString(CryptoJS.enc.Utf8);
        return (text && text.trim().length > 0) ? text : '';
    } catch (e) {
        return '';
    }
}

`);

    // 2. safeEncrypt
    content = content.replace(/function safeEncrypt[\s\S]*?\{[\s\S]*?\n\}/, `function safeEncrypt(text: string, secret: string): string {
    if (!text || !secret || secret.trim() === '') {
        throw new Error('Cannot encrypt: AES_SECRET is required');
    }
    return CryptoJS.AES.encrypt(text, secret).toString();
}`);

    // 3. remove fallback getters for TOKEN_SECRET and SESSION_SECRET if any
    content = content.replace(/function getFallbackTokenSecret[\s\S]*?\}\n/, '');
    content = content.replace(/function getFallbackSessionSecret[\s\S]*?\}\n/, '');
    
    // 4. Update TOKEN_SECRET to throw if not present
    if (file === 'server.ts') {
        content = content.replace(/const TOKEN_SECRET = process\.env\.TOKEN_SECRET \|\| getFallbackTokenSecret\(\);\n/g, '');
        content = content.replace(/const SESSION_SECRET = process\.env\.SESSION_SECRET \|\| getFallbackSessionSecret\(\);\n/g, '');
        
        // Remove duplicated checks if they exist elsewhere
        content = content.replace(/if \(!process\.env\.AES_SECRET\) \{\n\s*console\.error\("FATAL: AES_SECRET environment variable is not set[\s\S]*?\n\}\n/g, '');

        content = content.replace('async function startServer() {\n  if (!process.env.AES_SECRET) {', `const TOKEN_SECRET = process.env.TOKEN_SECRET || '';
const SESSION_SECRET = process.env.SESSION_SECRET || '';

async function startServer() {\n  if (!process.env.AES_SECRET) {`);
        
        content = content.replace(`if (!process.env.AES_SECRET) {
    console.error('FATAL: AES_SECRET is not set. Download links cannot be decrypted. Set it in your environment and restart.');
    process.exit(1);
  }`, `if (!process.env.AES_SECRET) {
    console.error('FATAL: AES_SECRET is not set. Download links cannot be decrypted. Set it in your environment and restart.');
    process.exit(1);
  }
  if (!process.env.TOKEN_SECRET) {
    console.error('FATAL: TOKEN_SECRET is not set. Tokens are not secure. Set it and restart.');
    process.exit(1);
  }`);
    } else if (file === 'api/index.ts') {
        content = content.replace(/const TOKEN_SECRET = process\.env\.TOKEN_SECRET \|\| getFallbackTokenSecret\(\);\n/g, '');
        content = content.replace(/const SESSION_SECRET = process\.env\.SESSION_SECRET \|\| '.*';\n/g, ''); // if present
        
        content = content.replace(/if \(!process\.env\.AES_SECRET\) \{\n\s*console\.error\("FATAL: AES_SECRET environment variable is not set[\s\S]*?\n\}\n/g, '');
        
        content = content.replace(`if (!process.env.AES_SECRET) {
  console.error('FATAL: AES_SECRET is not set. Download links cannot be decrypted. Set it in your environment and restart.');
  process.exit(1);
}`, `const TOKEN_SECRET = process.env.TOKEN_SECRET || '';
const SESSION_SECRET = process.env.SESSION_SECRET || '';

if (!process.env.AES_SECRET) {
  console.error('FATAL: AES_SECRET is not set. Download links cannot be decrypted. Set it in your environment and restart.');
  process.exit(1);
}
if (!process.env.TOKEN_SECRET) {
  console.error('FATAL: TOKEN_SECRET is not set. Tokens are not secure. Set it and restart.');
  process.exit(1);
}`);
    }

    // 5. Update session cookie secure
    content = content.replace(/res\.cookie\("__sid",\s*sid,\s*\{[\s\S]*?\}\);/g, 
        `res.cookie("__sid", sid, { httpOnly: true, sameSite: "lax", maxAge: 300000, secure: process.env.NODE_ENV === 'production' });`);

    // 6. Delete debug.log writes
    content = content.replace(/fs\.appendFileSync\([\s\S]*?'targetUrl': targetUrl\}[\s\S]*?\n\s+\};\n/g, '');

    fs.writeFileSync(file, content);
}
