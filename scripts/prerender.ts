// prerender.ts
import fs from 'fs';
import path from 'path';
import { injectSeoTags } from '../src/seoHelper';

async function prerender() {
  console.log('Static Prerendering started...');
  const distPath = path.resolve(process.cwd(), 'dist');
  const indexHtmlPath = path.join(distPath, 'index.html');
  
  if (!fs.existsSync(indexHtmlPath)) {
    console.warn('dist/index.html not found, skipping prerender.');
    return;
  }
  
  try {
    let template = fs.readFileSync(indexHtmlPath, 'utf-8');
    
    // Inject the root pre-rendered body directly into the static index.html at build time.
    // This allows basic scrapers (like Claude, OpenAI) to read the home page content easily
    // without running a React SPA or pointing to a Cloud Run node server.
    template = await injectSeoTags(template, '/', 'https://rummyapp.online');
    
    fs.writeFileSync(indexHtmlPath, template, 'utf-8');
    console.log('Successfully injected static HTML and metadata into dist/index.html');
  } catch (err) {
    console.error('Error during prerender:', err);
  }
}

prerender();
