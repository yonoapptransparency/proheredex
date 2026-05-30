require('dotenv').config();
const fs = require('fs');
const CryptoJS = require('crypto-js');

async function test() {
    const AES_SECRET = process.env.AES_SECRET || 'RUMMY_APP_SECRET_2026';
    const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));

    // test chunk 0
    let targetUrl = '';
    const chunkResponse = await fetch(`https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${config.firestoreDatabaseId}/documents/store_data/apps_chunk_0`);
    const chunkData = await chunkResponse.json();
    if (!chunkData.error && chunkData.fields?.items?.arrayValue?.values) {
        const values = chunkData.fields.items.arrayValue.values;
        for (let item of values) {
            let encryptedUrlField = item.mapValue.fields.more_information_url?.stringValue || item.mapValue.fields.download_url?.stringValue;
            if (encryptedUrlField) {
                 if (encryptedUrlField.startsWith('U2FsdGVkX1')) {
                      const bytes = CryptoJS.AES.decrypt(encryptedUrlField, AES_SECRET);
                      targetUrl = bytes.toString(CryptoJS.enc.Utf8);
                      console.log("Decrypted from chunk: ", targetUrl, "using secret", AES_SECRET, "for id", item.mapValue.fields.id.stringValue);
                 } else {
                      console.log("Plaintext from chunk: ", encryptedUrlField, "for id", item.mapValue.fields.id.stringValue);
                 }
            }
        }
    }
}
test().catch(console.error);
