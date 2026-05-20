class VigenereCipher extends Cipher {
    constructor(alph, alphLow='') {
        super(alph, alphLow);
    }

    set key(v) { super.key = Cipher.processString(v, this.alph, this.alphLow); }
    get key() { return super.key; }

    set msg(v) { super.msg = Cipher.processString(v, this.alph, this.alphLow); }
    get msg() { return super.msg; }

    // Получение самогенерирущегося ключа
    static getKey(key, msg) {
        let keyStr = '';
        if (key.length < msg.length) {
            keyStr += key;
            for (let i = key.length; i < msg.length; i++) {
                keyStr += msg[i - key.length];
            }
        } else {
            for (let i = 0; i < msg.length; i++) {
                keyStr += key[i];
            }
        }
        return keyStr;
    }

    encrypt() {
        let key = VigenereCipher.getKey(this.key, this.msg);
        const n = this.alph.length;
        let res = '';
        for (let i = 0; i < this.msg.length; i++) {
            let k = Cipher.posInAlph(key[i], this.alph);
            res += this.alph[(Cipher.posInAlph(this.msg[i], this.alph) + k) % n];
        }
        return res;
    }

    decrypt() {
        if (this.key.length != this.msg.length) return null;
        let key = VigenereCipher.getKey(this.key, this.msg);
        const n = this.alph.length;
        let res = '';
        for (let i = 0; i < this.msg.length; i++) {
            let k = Cipher.posInAlph(key[i], this.alph);
            res += this.alph[(Cipher.posInAlph(this.msg[i], this.alph) - k + n) % n];
        }
        return res;
    }
}