import AudioContext from './polyfill/AudioContext';

let AudioJS = function (arrayBuffer) {
    return new Promise((resolve, reject) => {

        // 创建一个audio上下文
        let context = new AudioContext();

        // 把传入的arrayBuffer编程audioBuffer
        context.decodeAudioData(arrayBuffer, function (audioBuffer) {

            let extractAudioBuffer = [];

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

            let audioJS = {

                // 提取声音中的一段(单位秒)
                extract(beginTime, endTime) {

                    // 声道数量和采样率
                    let channels = audioBuffer.numberOfChannels;
                    let rate = audioBuffer.sampleRate;

                    // 确定截取的边界
                    let startOffset = rate * beginTime;
                    let endOffset = rate * endTime;

                    // 对应的帧数
                    let frameCount = endOffset - startOffset;

                    // 创建同样采用率、同样声道数量，长度是需要截取内容长度的空的AudioBuffer
                    let newAudioBuffer = new AudioContext().createBuffer(channels, endOffset - startOffset, rate);

                    // 创建临时的Array存放复制的buffer数据
                    let anotherArray = new Float32Array(frameCount);

                    // 声道的数据的复制和写入
                    let offset = 0;
                    for (let channel = 0; channel < channels; channel++) {
                        audioBuffer.copyFromChannel(anotherArray, channel, startOffset);
                        newAudioBuffer.copyToChannel(anotherArray, channel, offset);
                    }

                    extractAudioBuffer.push(newAudioBuffer);
                    return audioJS;
                },

                // 播放
                play(index = -1) {
                    let source = context.createBufferSource();
                    source.buffer = index == -1 ? audioBuffer : extractAudioBuffer[index];
                    source.connect(context.destination);
                    source.start();
                    return audioJS;
                }

            };

            resolve(audioJS);

        });

    });
};

// 判断当前环境，如果不是浏览器环境
if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = AudioJS;
}
// 浏览器环境下
else {
    window.AudioJS = AudioJS;
}
