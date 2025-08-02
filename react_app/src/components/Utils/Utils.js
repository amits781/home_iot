import config from '../../config.json';
import CryptoJS from 'crypto-js';


export const hostUrl = config.apiHostUrl;
export const pixbayKey = config.pixbayKey;
export const navbarHeight = 64;




export function getHeadersFromToken(authToken) {

    const headerValues = new Headers({
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
    });
    return headerValues;
}


// Encryption function
export const encryptData = (data) => {
    const ciphertext = CryptoJS.AES.encrypt(data, config.secretKey).toString();
    return ciphertext;
};

// Decryption function
export const decryptData = (ciphertext) => {
    if (ciphertext===null || ciphertext === ''){
        return null;
    }
    const bytes = CryptoJS.AES.decrypt(ciphertext, config.secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
};




