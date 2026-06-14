
import CryptoJS from 'crypto-js';

const ciphertext = "U2FsdGVkX19iqS1Ysynumq6ExRUaWZbsC/SOKPO//yhq31AKRKl9Bn+nrnfmEnCrhLv/dDhmTNQS6nYvZ7Wl0Ja5ZsQyzfbYEdVKrnUY5QZ+FMB8jhKm0mDXgA2hcJ6Sr6UfPEBaXRXqQU9pznwF5UinWXFeYxmJ3+sESBWNlsa/1lMA3ViEpVkpiQMgoX0bEkm085lTUlQWsyoA2tMX5TafpsRYl60U4F36GT/9iHs=";
const secret = "Shehzad@4874";
const fallbackKey = ["fallback", "secure", "store", "key", "19482"].join("-");

try {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
  const text = bytes.toString(CryptoJS.enc.Utf8);
  console.log("Decrypted with secret:", text);
} catch(e) {
  console.log("Failed with secret");
}

try {
  const bytes = CryptoJS.AES.decrypt(ciphertext, fallbackKey);
  const text = bytes.toString(CryptoJS.enc.Utf8);
  console.log("Decrypted with fallback:", text);
} catch(e) {
  console.log("Failed with fallback");
}
