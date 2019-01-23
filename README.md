# base-coder
base64 and base32 converter

# install

npm npm i base-coder

# nodejs module

const BaseCoder = require('base-coder');

# es module

import BaseCoder from 'base-coder';

```javascript

console.log(BaseCoder.encode64('Hello world'));
console.log(BaseCoder.encode64('https://www.baidu.com'));
console.log(BaseCoder.encode64('中文'));

console.log(BaseCoder.decode64(BaseCoder.encode64('Hello world')));
console.log(BaseCoder.decode64(BaseCoder.encode64('https://www.baidu.com')));
console.log(BaseCoder.decode64(BaseCoder.encode64('中文')));

console.log(BaseCoder.encode32('Hello world'));
console.log(BaseCoder.encode32('https://www.baidu.com'));
console.log(BaseCoder.encode32('中文'));

console.log(BaseCoder.decode32(BaseCoder.encode32('Hello world')));
console.log(BaseCoder.decode32(BaseCoder.encode32('https://www.baidu.com')));
console.log(BaseCoder.decode32(BaseCoder.encode32('中文')));
