class Cipher {
    #msg;
    #key;
    alph;
    alphLow;

    constructor(alph, alphLow='') {
        this.alph = alph;
        this.alphLow = alphLow;
    }

    set msg(v) { this.#msg = v; }
    get msg()  { return this.#msg; }

    set key(v) { this.#key = v; }
    get key()  { return this.#key; }

    encrypt() {}
    decrypt() {}

    // Обработка строки
    static processString(str, alph, alphLow) {
        let res = '';
        for (let i = 0; i < str.length; i++) {
            let pos = Cipher.posInAlph(str[i], alph);
            if (pos != -1) {
                res += alph[pos];
                continue;
            }
            pos = Cipher.posInAlph(str[i], alphLow);
            if (pos != -1) res += alph[pos];
        }
        return res;
    }

    // Позиция символа в алфавите
    static posInAlph(c, al) {
        for (let i = 0; i < al.length; i++) {
            if (c == al[i]) return i;
        }
        return -1;
    }
}