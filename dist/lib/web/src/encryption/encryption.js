import { Field, PublicKey, PrivateKey, Encoding, Group, Encryption, initializeBindings, } from "o1js";
export class CipherText {
    static stringify(cipherText) {
        return JSON.stringify(cipherText);
    }
    static parse(jsonStr) {
        let obj = JSON.parse(jsonStr);
        return {
            publicKey: new Group(obj.publicKey),
            cipherText: (obj.cipherText || []).map((t) => Field(t)),
        };
    }
    static encrypt(message, publicId) {
        try {
            let fields = Encoding.stringToFields(message);
            let encrypted = Encryption.encrypt(fields, PublicKey.fromBase58(publicId));
            return CipherText.stringify(encrypted);
        }
        catch (err) {
            throw Error(`Could not encrypt message='${message}' using key='${publicId}'.` +
                ` Error ${err}`);
        }
    }
    static decrypt(cipherText, privateKey) {
        try {
            let fields = Encryption.decrypt(CipherText.parse(cipherText), PrivateKey.fromBase58(privateKey));
            let decrypted = Encoding.stringFromFields(fields);
            return decrypted;
        }
        catch (err) {
            throw Error(`Could not decrypt cipher='${cipherText}'.` + ` Error ${err}`);
        }
    }
    static async initialize() {
        await initializeBindings();
    }
}
//# sourceMappingURL=encryption.js.map