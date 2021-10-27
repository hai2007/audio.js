/*!
 * 🔇 audio.js - 🔇 前端处理音频的核心模块。 
 * git+https://github.com/hai2007/audio.js.git
 *
 * author 你好2007 < https://hai2007.gitee.io/sweethome >
 *
 * version 0.1.0
 *
 * Copyright (c) 2021-present hai2007 走一步，再走一步。
 * Released under the MIT license
 *
 * Date:Wed Oct 27 2021 23:01:06 GMT+0800 (GMT+08:00)
 */
(function () {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;

  var AudioJS = function AudioJS(arrayBuffer) {
    return new Promise(function (resolve, reject) {
      // 创建一个audio上下文
      var context = new AudioContext(); // 把传入的arrayBuffer编程audioBuffer

      context.decodeAudioData(arrayBuffer, function (audioBuffer) {
        var extractAudioBuffer = [];
        /**
         * AudioBuffer对象是一个音频专用Buffer对象，包含很多音频信息，包括：
         * 
         * 音频时长 duration
         * 声道数量 numberOfChannels
         * 采样率 sampleRate
         * 等。
         * 
         * 包括一些音频声道数据处理方法，例如：
         * 获取通道数据 getChannelData()
         * 复制通道数据 copyFromChannel()
         * 写入通道数据 copyToChannel()
         * 
         * 文档见这里：https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer
         */

        var audioJS = {
          // 提取声音中的一段(单位秒)
          extract: function extract(beginTime, endTime) {
            // 声道数量和采样率
            var channels = audioBuffer.numberOfChannels;
            var rate = audioBuffer.sampleRate; // 确定截取的边界

            var startOffset = rate * beginTime;
            var endOffset = rate * endTime; // 对应的帧数

            var frameCount = endOffset - startOffset; // 创建同样采用率、同样声道数量，长度是需要截取内容长度的空的AudioBuffer

            var newAudioBuffer = new AudioContext().createBuffer(channels, endOffset - startOffset, rate); // 创建临时的Array存放复制的buffer数据

            var anotherArray = new Float32Array(frameCount); // 声道的数据的复制和写入

            var offset = 0;

            for (var channel = 0; channel < channels; channel++) {
              audioBuffer.copyFromChannel(anotherArray, channel, startOffset);
              newAudioBuffer.copyToChannel(anotherArray, channel, offset);
            }

            extractAudioBuffer.push(newAudioBuffer);
            return audioJS;
          },
          // 播放
          play: function play() {
            var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
            var source = context.createBufferSource();
            source.buffer = index == -1 ? audioBuffer : extractAudioBuffer[index];
            source.connect(context.destination);
            source.start();
            return audioJS;
          }
        };
        resolve(audioJS);
      });
    });
  }; // 判断当前环境，如果不是浏览器环境


  if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
    module.exports = AudioJS;
  } // 浏览器环境下
  else {
    window.AudioJS = AudioJS;
  }

}());
