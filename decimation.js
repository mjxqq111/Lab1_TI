class DecimationCipher extends Cipher {
    #error;
    #mut_pr;

    constructor(alph, alphLow='') {
        super(alph, alphLow);
    }

    set key(value) {
        this.#mut_pr = false;
        if (!Number.isInteger(value)) {
            if (typeof value === 'string' || value instanceof String) {
                let v = Cipher.processString(value, '0123456789', '');
                super.key = parseInt(v);
            } else {
                this.#error = true;
                super.key = 0;
                return;
            }
        } else {
            super.key = value;
        }
        if (Number.isNaN(super.key)) {
            this.#error = true;
            super.key = 0;
            return;
        }
        if (super.key <= 0) {
            this.#error = true;
            super.key = 0;
            return;
        }
        this.#error = false;
        let n = this.alph.length;
        if (DecimationCipher.#areMutuallyPrime(super.key, n))
            this.#mut_pr = true;
    }

    get key() { return super.key; }

    set msg(value) { super.msg = Cipher.processString(value, this.alph, this.alphLow); }
    get msg() { return super.msg; }

    hasError() { return this.#error; };
    keyMutPrime() { return this.#mut_pr; };

    encrypt() {
        if (this.#error || !this.#mut_pr) return null;

        const n = this.alph.length;
        let res = '';
        for (let i = 0; i < this.msg.length; i++) {
            res += this.alph[(Cipher.posInAlph(this.msg[i], this.alph) * this.key) % n];
        }

        return res;
    }

    decrypt() {
        if (this.#error || !this.#mut_pr) return null;
        const n = this.alph.length;

        // Находим обратное число ко ключу по модулю n
        let inv = this.#modMultInv(this.key, n);
        while (inv < 0) {
            inv += n;
        }

        let res = '';
        for (let i = 0; i < this.msg.length; i++) {
            res += this.alph[(inv * Cipher.posInAlph(this.msg[i], this.alph)) % n];
        }

        return res;
    }

    // Расширенный алгоритм Евклида
    #extendedEuclidean(a, b) {
        let res = {'gcd': 0, 'x': 0, 'y': 0};
        if (a == 0) {
            res.x = 0;
            res.y = 1;
            res.gcd = b;
            return res;
        }
        let g = this.#extendedEuclidean(b % a, a);
        res.x = g.y - Math.floor(b / a) * g.x;
        res.y = g.x;
        res.gcd = g.gcd;
        return res;
    }

    // Нахождение обратного к a числа по модулю m
    #modMultInv(a, m) {
        if (!DecimationCipher.#areMutuallyPrime(a, m)) return 0;
        let r = this.#extendedEuclidean(a, m);
        return r.x;
    }

    // Проверка на то, являются ли числа взаимно простыми
    static #areMutuallyPrime(n1, n2) {
        while (n2 > 0) {
            n1 %= n2;
            let temp = n1;
            n1 = n2;
            n2 = temp;
        }
        return n1 == 1;
    }
}