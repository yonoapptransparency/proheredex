import fs from 'fs';
import { injectSeoTags } from './src/seoHelper.ts';

async function t() {
  let template = fs.readFileSync('./index.html', 'utf8');
  const out = await injectSeoTags(template, '/', 'http://localhost:3000');
  
  // check if description exists and what it looks like
  const descMatch = out.match(/<meta[^>]*description[^>]*>/i);
  console.log("Found description:", !!descMatch);
  
  const robotsMatch = out.match(/<meta[^>]*robots[^>]*>/i);
  console.log("Found robots:", !!robotsMatch);
}
t().catch(console.error);
