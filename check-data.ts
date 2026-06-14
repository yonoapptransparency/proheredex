import fetch from 'node-fetch';
import fs from 'fs';

async function check() {
  const cfg = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
  const projectId = cfg.projectId;
  const firestoreDatabaseId = cfg.firestoreDatabaseId;
  const apiKey = cfg.apiKey;
  const db = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${firestoreDatabaseId}/documents`;
  
  const r = await fetch(`${db}/store_data/sec_vault?key=${apiKey}`);
  const d = await r.json();
  console.log("Fields:", JSON.stringify(d.fields, null, 2));
}
check();
