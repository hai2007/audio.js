const fs = require('fs');
const path = require('path');

module.exports = {

    // 当前配置文件的相对路径上下文
    path: __dirname,

    // package.json路径
    pkg: '.',

    // 定义任务
    task(hai2007_nodejs, pkg, rootPath) {

        [
            'audio.js',
            'audio.min.js'
        ].forEach(item => {

            let filePath = path.join(rootPath, "./dist/" + item);

            let banner =
                `/*!
 * 🔇 audio.js - ${pkg.description}
 * ${pkg.repository.url}
 *
 * author ${pkg.author} < https://hai2007.gitee.io/sweethome >
 *
 * version ${pkg.version}
 *
 * Copyright (c) 2021-present hai2007 走一步，再走一步。
 * Released under the ${pkg.license} license
 *
 * Date:${new Date()}
 */`;

            fs.writeFileSync(filePath, banner + "\n" + fs.readFileSync(filePath));

        });

    }

};
