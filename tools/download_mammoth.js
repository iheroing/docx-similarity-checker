const https = require('https');
const fs = require('fs');
const path = require('path');

const MAMMOTH_URL = 'https://raw.githubusercontent.com/mwilliamson/mammoth.js/master/mammoth.browser.js';
const OUTPUT_PATH = path.join(__dirname, '..', 'lib', 'mammoth.browser.js');

// 确保 lib 目录存在
const libDir = path.dirname(OUTPUT_PATH);
if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
}

// 下载文件
https.get(MAMMOTH_URL, (response) => {
    const file = fs.createWriteStream(OUTPUT_PATH);
    response.pipe(file);
    
    file.on('finish', () => {
        file.close();
        console.log('mammoth.js 下载完成！');
    });
}).on('error', (err) => {
    fs.unlink(OUTPUT_PATH);
    console.error('下载 mammoth.js 时出错：', err.message);
}); 