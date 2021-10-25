let AudioJS = '设计中，敬请期待！';

// 判断当前环境，如果不是浏览器环境
if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = AudioJS;
}
// 浏览器环境下
else {
    window.AudioJS = AudioJS;
}
