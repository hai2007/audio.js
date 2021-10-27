<p align='center'>
    <a href='https://hai2007.github.io/audio.js' target='_blank'>
        <img src='./logo.png'>
    </a>
</p>

# audio.js
🔇 前端处理音频的核心模块。 

<p>
  <a href="https://hai2007.gitee.io/npm-downloads?interval=7&packages=@hai2007/audio"><img src="https://img.shields.io/npm/dm/@hai2007/audio.svg" alt="downloads"></a>
  <a href="https://packagephobia.now.sh/result?p=@hai2007/audio"><img src="https://packagephobia.now.sh/badge?p=@hai2007/audio" alt="install size"></a>
  <a href="https://www.jsdelivr.com/package/npm/@hai2007/audio"><img src="https://data.jsdelivr.com/v1/package/npm/@hai2007/audio/badge" alt="CDN"></a>
  <a href="https://www.npmjs.com/package/@hai2007/audio"><img src="https://img.shields.io/npm/v/@hai2007/audio.svg" alt="Version"></a>
  <a href="https://github.com/hai2007/audio.js/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/@hai2007/audio.svg" alt="License"></a>
  <a href="https://github.com/hai2007/audio.js">
        <img alt="GitHub repo stars" src="https://img.shields.io/github/stars/hai2007/audio.js?style=social">
    </a>
</p>

## Issues
使用的时候遇到任何问题或有好的建议，请点击进入[issue](https://github.com/hai2007/audio.js/issues)！

## 如何引入

我们推荐你使用npm的方式安装和使用：

```
npm install --save @hai2007/audio
```

当然，你也可以通过CDN的方式引入：

```html
<script src="https://cdn.jsdelivr.net/npm/@hai2007/audio@0"></script>
```

## 如何使用

首先，需要创建一个声音管理对象：

```
import AudioJS from '@hai2007/audio'; // 如果是CDN直接使用即可
new AudioJS(arrayBuffer).then(function(audioJS){

    // 然后，你就可以使用audioJS处理arrayBuffer记录的这段声音了

});
```

记录着声音的arrayBuffer如何获取，可以由很多方法，我们那本地文件举例子：

```html
<input type="file" id="source" onchange="doit()" accept="audio/*">
```

选择声音后，会回调doit方法：

```js
 var file = document.getElementById('source').files[0];
    var reader = new FileReader();
    reader.onload = function () {
        // reader.result 便是上面的arrayBuffer
    };
    reader.readAsArrayBuffer(file);
}
```

下面，我们来看看audioJS上面有哪些方法可以供使用。

- 提取片段

提取指定的片段记录在内部，按照序号编号（从0开始）：

```js
// 开始和结束秒
audioJS.extract(beginSecond,endSecond);
```

- 播放

通过传递一个index来表示播放上面提取的哪个片段，如果什么都不传递，表示播放当前维护的整个声音：

```js
audioJS.play(index);
```

开源协议
---------------------------------------
[MIT](https://github.com/hai2007/audio.js/blob/master/LICENSE)

Copyright (c) 2021 [hai2007](https://hai2007.gitee.io/sweethome/) 走一步，再走一步。
