import CryptoJS from "crypto-js";


export const encrypt = ( content : string ) => {

    const secret_key = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY!;    
    const encryptedText = CryptoJS.AES.encrypt(content, secret_key).toString();
    return encryptedText;
}


export const decrypt = (encrypted: string) => {

    const secret_key = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY!;
    const bytes = CryptoJS.AES.decrypt(encrypted, secret_key);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedText
};

