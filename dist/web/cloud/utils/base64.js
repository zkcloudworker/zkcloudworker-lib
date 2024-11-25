// URL friendly base64 encoding
const TABLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
export function bigintToBase56(value) {
    const digits = toBase(value, 56n);
    //console.log("digits:", digits);
    const str = digits.map((x) => TABLE[Number(x)]).join("");
    //console.log("str:", str);
    return str;
}
export function bigintFromBase56(str) {
    const base56Digits = str.split("").map((x) => BigInt(TABLE.indexOf(x)));
    const x = fromBase(base56Digits, 56n);
    return x;
}
export function bigintToBase64(value) {
    const digits = toBase(value, 64n);
    //console.log("digits:", digits);
    const str = digits.map((x) => TABLE[Number(x)]).join("");
    //console.log("str:", str);
    return str;
}
export function bigintFromBase64(str) {
    const base64Digits = str.split("").map((x) => BigInt(TABLE.indexOf(x)));
    const x = fromBase(base64Digits, 64n);
    return x;
}
export function fromBase(digits, base) {
    if (base <= 0n)
        throw Error("fromBase: base must be positive");
    // compute powers base, base^2, base^4, ..., base^(2^k)
    // with largest k s.t. n = 2^k < digits.length
    let basePowers = [];
    for (let power = base, n = 1; n < digits.length; power **= 2n, n *= 2) {
        basePowers.push(power);
    }
    let k = basePowers.length;
    // pad digits array with zeros s.t. digits.length === 2^k
    digits = digits.concat(Array(2 ** k - digits.length).fill(0n));
    // accumulate [x0, x1, x2, x3, ...] -> [x0 + base*x1, x2 + base*x3, ...] -> [x0 + base*x1 + base^2*(x2 + base*x3), ...] -> ...
    // until we end up with a single element
    for (let i = 0; i < k; i++) {
        let newDigits = Array(digits.length >> 1);
        let basePower = basePowers[i];
        for (let j = 0; j < newDigits.length; j++) {
            newDigits[j] = digits[2 * j] + basePower * digits[2 * j + 1];
        }
        digits = newDigits;
    }
    console.assert(digits.length === 1);
    let [digit] = digits;
    return digit;
}
export function toBase(x, base) {
    if (base <= 0n)
        throw Error("toBase: base must be positive");
    // compute powers base, base^2, base^4, ..., base^(2^k)
    // with largest k s.t. base^(2^k) < x
    let basePowers = [];
    for (let power = base; power <= x; power **= 2n) {
        basePowers.push(power);
    }
    let digits = [x]; // single digit w.r.t base^(2^(k+1))
    // successively split digits w.r.t. base^(2^j) into digits w.r.t. base^(2^(j-1))
    // until we arrive at digits w.r.t. base
    let k = basePowers.length;
    for (let i = 0; i < k; i++) {
        let newDigits = Array(2 * digits.length);
        let basePower = basePowers[k - 1 - i];
        for (let j = 0; j < digits.length; j++) {
            let x = digits[j];
            let high = x / basePower;
            newDigits[2 * j + 1] = high;
            newDigits[2 * j] = x - high * basePower;
        }
        digits = newDigits;
    }
    // pop "leading" zero digits
    while (digits[digits.length - 1] === 0n) {
        digits.pop();
    }
    return digits;
}
//# sourceMappingURL=base64.js.map