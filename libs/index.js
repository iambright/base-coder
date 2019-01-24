/**
 * Created by Bright on 2019/1/23.
 */
/**
 * UTF16和UTF8转换对照表
 * U+00000000 – U+0000007F    0xxxxxxx
 * U+00000080 – U+000007FF    110xxxxx 10xxxxxx
 * U+00000800 – U+0000FFFF    1110xxxx 10xxxxxx 10xxxxxx
 * U+00010000 – U+001FFFFF    11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
 * U+00200000 – U+03FFFFFF    111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
 * U+04000000 – U+7FFFFFFF    1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
 */
var BaseCoder = {
    // 转码表
    table: [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z', '0', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '+', '/'
    ],
    table32: 'abcdefghijklmnopqrstuvwxyz234567',
    UTF16ToUTF8: function (str) {
        var res = [], len = str.length;
        for (var i = 0; i < len; i++) {
            var code = str.charCodeAt(i);
            if (code > 0x0000 && code <= 0x007F) {
                // 单字节，这里并不考虑0x0000，因为它是空字节
                // U+00000000 – U+0000007F 	0xxxxxxx
                res.push(str.charAt(i));
            } else if (code >= 0x0080 && code <= 0x07FF) {
                // 双字节
                // U+00000080 – U+000007FF 	110xxxxx 10xxxxxx
                // 110xxxxx
                var byte1 = 0xC0 | ((code >> 6) & 0x1F);
                // 10xxxxxx
                var byte2 = 0x80 | (code & 0x3F);
                res.push(
                    String.fromCharCode(byte1),
                    String.fromCharCode(byte2)
                );
            } else if (code >= 0x0800 && code <= 0xFFFF) {
                // 三字节
                // U+00000800 – U+0000FFFF 	1110xxxx 10xxxxxx 10xxxxxx
                // 1110xxxx
                var byte1 = 0xE0 | ((code >> 12) & 0x0F);
                // 10xxxxxx
                var byte2 = 0x80 | ((code >> 6) & 0x3F);
                // 10xxxxxx
                var byte3 = 0x80 | (code & 0x3F);
                res.push(
                    String.fromCharCode(byte1),
                    String.fromCharCode(byte2),
                    String.fromCharCode(byte3)
                );
            } else if (code >= 0x00010000 && code <= 0x001FFFFF) {
                // 四字节
                // U+00010000 – U+001FFFFF 	11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else if (code >= 0x00200000 && code <= 0x03FFFFFF) {
                // 五字节
                // U+00200000 – U+03FFFFFF 	111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else /** if (code >= 0x04000000 && code <= 0x7FFFFFFF)*/ {
                // 六字节
                // U+04000000 – U+7FFFFFFF 	1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            }
        }

        return res.join('');
    },
    UTF8ToUTF16: function (str) {
        var res = [], len = str.length;
        var i = 0;
        for (var i = 0; i < len; i++) {
            var code = str.charCodeAt(i);
            // 对第一个字节进行判断
            if (((code >> 7) & 0xFF) == 0x0) {
                // 单字节
                // 0xxxxxxx
                res.push(str.charAt(i));
            } else if (((code >> 5) & 0xFF) == 0x6) {
                // 双字节
                // 110xxxxx 10xxxxxx
                var code2 = str.charCodeAt(++i);
                var byte1 = (code & 0x1F) << 6;
                var byte2 = code2 & 0x3F;
                var utf16 = byte1 | byte2;
                res.push(String.fromCharCode(utf16));
            } else if (((code >> 4) & 0xFF) == 0xE) {
                // 三字节
                // 1110xxxx 10xxxxxx 10xxxxxx
                var code2 = str.charCodeAt(++i);
                var code3 = str.charCodeAt(++i);
                var byte1 = (code << 4) | ((code2 >> 2) & 0x0F);
                var byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3F);
                var utf16 = ((byte1 & 0x00FF) << 8) | byte2
                res.push(String.fromCharCode(utf16));
            } else if (((code >> 3) & 0xFF) == 0x1E) {
                // 四字节
                // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else if (((code >> 2) & 0xFF) == 0x3E) {
                // 五字节
                // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else /** if (((code >> 1) & 0xFF) == 0x7E)*/ {
                // 六字节
                // 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            }
        }

        return res.join('');
    },
    encode64: function (str) {
        if (!str) {
            return '';
        }
        var utf8 = this.UTF16ToUTF8(str); // 转成UTF8
        var i = 0; // 遍历索引
        var len = utf8.length;
        var res = [];
        while (i < len) {
            var c1 = utf8.charCodeAt(i++) & 0xFF;
            res.push(this.table[c1 >> 2]);
            // 需要补2个=
            if (i == len) {
                res.push(this.table[(c1 & 0x3) << 4]);
                res.push('==');
                break;
            }
            var c2 = utf8.charCodeAt(i++);
            // 需要补1个=
            if (i == len) {
                res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
                res.push(this.table[(c2 & 0x0F) << 2]);
                res.push('=');
                break;
            }
            var c3 = utf8.charCodeAt(i++);
            res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
            res.push(this.table[((c2 & 0x0F) << 2) | ((c3 & 0xC0) >> 6)]);
            res.push(this.table[c3 & 0x3F]);
        }

        return res.join('');
    },
    encode32: function (str) {
        if (!str) {
            return '';
        }
        var at = [0, 1, 3, 7, 15, 31, 63, 127, 255];
        var utf8 = this.UTF16ToUTF8(str); // 转成UTF8
        var i = 0; // 遍历索引
        var len = utf8.length;
        var res = [];
        var s = 0, lastCode = 0;
        while (i < len) {
            var move = 8 - (5 - s);
            var code = utf8.charCodeAt(i++) & 0xFF;
            res.push(this.table32[((lastCode & at[s]) << (5 - s)) | ((code >> move) & 0x3F)]);
            s = move;
            lastCode = code;
            if (move > 4) {
                move = move - 5;
                res.push(this.table32[((code & at[s]) >> move) & 0x3F]);
                s = move;
            }
            if (i == len) {
                if (s) {
                    res.push(this.table32[((code & at[s]) << (5 - move)) & 0x3F]);
                }
            }
        }
        return res.join('');
    },
    decode64: function (str) {
        if (!str) {
            return '';
        }

        var len = str.length;
        var i = 0;
        var res = [];

        while (i < len) {
            var code1 = this.table.indexOf(str.charAt(i++));
            var code2 = this.table.indexOf(str.charAt(i++));
            var code3 = this.table.indexOf(str.charAt(i++));
            var code4 = this.table.indexOf(str.charAt(i++));

            var c1 = (code1 << 2) | (code2 >> 4);
            res.push(String.fromCharCode(c1));

            if (code3 != -1) {
                var c2 = ((code2 & 0xF) << 4) | (code3 >> 2);
                res.push(String.fromCharCode(c2));
            }
            if (code4 != -1) {
                var c3 = ((code3 & 0x3) << 6) | code4;
                res.push(String.fromCharCode(c3));
            }

        }

        return this.UTF8ToUTF16(res.join(''));
    },
    decode32: function (str) {
        if (!str) {
            return '';
        }
        str = str.toLowerCase();
        var at = [0, 1, 3, 7, 15, 31, 63, 127, 255];
        var len = str.length;
        var i = 0;
        var res = [];
        var s = 0, lastCode = 0;
        while (i < len) {
            var code = this.table32.indexOf(str.charAt(i++));
            if (i == len) {
                code = (code << 5);
            } else {
                code = (code << 5) | this.table32.indexOf(str.charAt(i++));
            }
            var move = 10 - (8 - s);
            res.push(String.fromCharCode((lastCode & at[s]) << (8 - s) | (code >> move)));
            s = move;
            lastCode = code;
            if (move > 7) {
                move = move - 8;
                res.push(String.fromCharCode((code >> move) & at[8]));
                s = move;
            }
        }
        return this.UTF8ToUTF16(res.join(''));
    }
};
module.exports = BaseCoder;