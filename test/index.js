/**
 * Created by Bright on 2019/1/24.
 */

const baseCoder = require('../libs');
var uri=baseCoder.encode32('https://www.baidu.com'); // nb2hi4dthixs653xo4xgeyljmr2s4y3pnu
var abc=baseCoder.decode32(uri);
console.log(uri);
console.log(abc);