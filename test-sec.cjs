require('dotenv').config();
const fs = require('fs');
const CryptoJS = require('crypto-js');

async function test() {
    const AES_SECRET = process.env.AES_SECRET || 'RUMMY_APP_SECRET_2026';
    const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));

    const urlResponse = await fetch(`https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${config.firestoreDatabaseId}/documents/store_data/secure_links`);
    let secureData = await urlResponse.json();
    
    // Fallback to sec_vault if secure_links is empty
    if (secureData.error || (!secureData.fields?.encryptedData && !secureData.fields?.items)) {
        const vaultRes = await fetch(`https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${config.firestoreDatabaseId}/documents/store_data/sec_vault`);
        const vaultData = await vaultRes.json();
        if (!vaultData.error) {
            secureData = vaultData;
        }
    }
    
    if (!secureData.error) {
        const fields = secureData.fields;
        
        console.log("Got secure links doc. EncryptedData field:", !!fields?.encryptedData);
        if (fields?.encryptedData?.stringValue) {
            const encryptedBlob = fields.encryptedData.stringValue;
            console.log("Blob starts with: ", encryptedBlob.substring(0, 10));
            
            try {
                const bytes = CryptoJS.AES.decrypt(encryptedBlob, AES_SECRET);
                const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
                console.log("Decrypted text length:", decryptedText ? decryptedText.length : 0);
                if (decryptedText) {
                    const linksArray = JSON.parse(decryptedText);
                    console.log("Parsed", linksArray.length, "links array items");
                    console.log("First item url:", linksArray[0]?.url);
                }
            } catch (e) {
                console.error("AES Decrypt Error:", e);
            }
        }
    } else {
        console.log("Error fetching:", secureData.error);
    }
}
test().catch(console.error);
