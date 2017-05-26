"use strict";


class bigIntHolder {
    constructor(input, radix) {
        this.radix = radix || 10;
        this.data = this.convertInputDynamic(input); // array of 10 digit num



    }

    convertInputDynamic(input) {

        if (typeof input == "object") return input;

        if (typeof input == "string") {
            var exp = 0;
            if (input.indexOf("e") != -1) {
                var split = input.split("e")
                exp = parseInt(split[1]);
                input = split[0];
            }

            return this.convertStringToArray(input.split(""), exp)
        } else {
            return this.convertIntToArray(input)

        }
    }
    convertStringToArray(string, exp) {
        var out = [];

        if (exp) { // exponent (not very clean)

            for (var i = 1; i < exp; i++) {
                string.push("0");
            }

        } else if (string.length <= 10) {

            return [parseInt(string)]
        }


        string.join("").match(/.{1,10}/g).forEach((s) => {
            out.push(parseInt(s));
        })
        return out.reverse();
    }
    convertIntToArray(num) {
        if (num < 1e10) return [num]

        var out = [];


        var len = Math.floor(num.toString().length / 10);
        var mod = num.toString().length % 10;

        if (mod) {
            var pow = Math.pow(10, 4);

            var div = Math.floor(num / pow)
            out[0] = num - (div * pow);
            num = div;
        }

        for (var i = 0; i < len; i++) {
            var div = Math.floor(num / 1e10)
            out[len - i - (mod ? 0 : 1)] = num - (div * 1e10);
            num = div;
        }
        return out;

    }
    toString() {

        var final = [];
        final[this.data.length - 1] = this.data[0]

        for (var i = 1; i < this.data.length; i++) {
            var dt = this.data[i] + 1e10
            final[this.data.length - i - 1] = dt.toString().substr(1);

        }
        return final.join("");
    }

}

function addTwoBI(a, b) {

    if (b.length > a.length) b = [a, a = b][0]; // flip

    var final = []
    var carry = 0;
    for (var i = 0; i < a.data.length; i++) {
        var add = b.data[i] || 0;

        final[i] = a.data[i] + add + carry;

        if (final[i] >= 1e10) {
            carry = Math.floor(final[i] / 1e10);
            final[i] = final[i] - carry * 1e10
        } else carry = 0;
    }

    if (carry) final.push(carry);
    return new bigIntHolder(final);
}

function addBII(a, b) {
    var final = a.data.slice(0);

    final[0] += b;

    for (var i = 0; i < 5; i++) {
        if (final[i] >= 1e10) {
            var add = Math.floor(final[i] / 1e10);
            if (!final[i + 1]) final[i + 1] = 0;
            final[i + 1] += add;
            final[i] = final[i] - add * 1e10;
        } else break;
    }

    return new bigIntHolder(final);
}


function multiplyTwoBI(a, b) {


}

function bigInt(input, radix) {
    return new bigIntHolder(input, radix)
}

var a = bigInt("2345456789976543456787654657678967857478");

console.log(a, a.toString())
var r = addBII(a, 12383728);
console.log(r, r.toString())
