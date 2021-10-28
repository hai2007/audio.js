/*!
 * 🔇 audio.js - 🔇 前端处理音频的核心模块。 
 * git+https://github.com/hai2007/audio.js.git
 *
 * author 你好2007 < https://hai2007.gitee.io/sweethome >
 *
 * version 0.2.1
 *
 * Copyright (c) 2021-present hai2007 走一步，再走一步。
 * Released under the MIT license
 *
 * Date:Thu Oct 28 2021 10:49:09 GMT+0800 (中国标准时间)
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

  function audiobufferToWav (buffer) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var numChannels = buffer.numberOfChannels;
    var sampleRate = opt.sampleRate || buffer.sampleRate;
    var format = opt.float32 ? 3 : 1;
    var bitDepth = format === 3 ? 32 : 16;
    var result;

    if (numChannels === 2) {
      result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
    } else {
      result = buffer.getChannelData(0);
    }

    return encodeWAV(result, format, sampleRate, numChannels, bitDepth);
  }

  function encodeWAV(samples, format, sampleRate, numChannels, bitDepth) {
    var bytesPerSample = bitDepth / 8;
    var blockAlign = numChannels * bytesPerSample;
    var buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
    var view = new DataView(buffer);
    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + samples.length * bytesPerSample, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, "data");
    view.setUint32(40, samples.length * bytesPerSample, true);

    if (format === 1) {
      floatTo16BitPCM(view, 44, samples);
    } else {
      writeFloat32(view, 44, samples);
    }

    return buffer;
  }

  function interleave(inputL, inputR) {
    var length = inputL.length + inputR.length;
    var result = new Float32Array(length);
    var index = 0;
    var inputIndex = 0;

    while (index < length) {
      result[index++] = inputL[inputIndex];
      result[index++] = inputR[inputIndex];
      inputIndex++;
    }

    return result;
  }

  function writeFloat32(output, offset, input) {
    for (var i = 0; i < input.length; i++, offset += 4) {
      output.setFloat32(offset, input[i], true);
    }
  }

  function floatTo16BitPCM(output, offset, input) {
    for (var i = 0; i < input.length; i++, offset += 2) {
      var s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
  }

  function writeString(view, offset, string) {
    for (var i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  var AudioJS = function AudioJS(arrayBuffer) {
    return new Promise(function (resolve) {
      // 创建一个audio上下文
      var context = new AudioContext(); // 把传入的arrayBuffer编程audioBuffer

      context.decodeAudioData(arrayBuffer, function (audioBuffer) {
        var extractAudioBuffer = []; // 声道数量和采样率

        var channels = audioBuffer.numberOfChannels;
        var rate = audioBuffer.sampleRate;
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
            // 确定截取的边界
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

            extractAudioBuffer.push({
              value: newAudioBuffer,
              // 帧数
              count: frameCount
            });
            return audioJS;
          },
          // 播放
          play: function play() {
            var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
            var source = context.createBufferSource();
            source.buffer = index == -1 ? audioBuffer : extractAudioBuffer[index].value;
            source.connect(context.destination);
            source.start();
            return audioJS;
          },
          // 合并（indexs里面记录的是提取的序号）
          merge: function merge() {
            // 先获取需要合并的整个的长度
            var allCount = 0;

            for (var _len = arguments.length, indexs = new Array(_len), _key = 0; _key < _len; _key++) {
              indexs[_key] = arguments[_key];
            }

            for (var _i = 0, _indexs = indexs; _i < _indexs.length; _i++) {
              var index = _indexs[_i];
              allCount += extractAudioBuffer[index].count;
            } // 空的AudioBuffer


            var newAudioBuffer = new AudioContext().createBuffer(channels, allCount, rate);
            var offset = 0;

            for (var _i2 = 0, _indexs2 = indexs; _i2 < _indexs2.length; _i2++) {
              var _index = _indexs2[_i2];
              var extractAudio = extractAudioBuffer[_index];
              var anotherArray = new Float32Array(extractAudio.count);

              for (var channel = 0; channel < channels; channel++) {
                extractAudio.value.copyFromChannel(anotherArray, channel, 0);
                newAudioBuffer.copyToChannel(anotherArray, channel, offset);
              }

              offset += extractAudio.count;
            }

            extractAudioBuffer.push({
              value: newAudioBuffer,
              // 帧数
              count: allCount
            });
            return audioJS;
          },
          // 下载
          download: function download() {
            var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
            // 需要下载的AudioBuffer变成ArrayBuffer
            var buffer = audiobufferToWav(index == -1 ? audioBuffer : extractAudioBuffer[index].value, {
              sampleRate: rate
            });
            var aNode = document.createElement('a');
            aNode.setAttribute('href', URL.createObjectURL(new Blob([buffer])));
            aNode.setAttribute('download', 'audio.wav');
            aNode.click();
            return audioJS;
          },
          // 重置内部维护的片段
          reset: function reset() {
            extractAudioBuffer = [];
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
