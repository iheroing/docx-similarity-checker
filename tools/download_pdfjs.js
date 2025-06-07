const https = require('https');
const fs = require('fs');
const path = require('path');

const PDFJS_VERSION = '3.11.174';
const BASE_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}`;

const files = [
    { url: `${BASE_URL}/pdf.min.js`, output: 'pdf.min.js' },
    { url: `${BASE_URL}/pdf.worker.min.js`, output: 'pdf.worker.min.js' }
];

const libDir = path.join(__dirname, '..', 'lib');
if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
}

console.log('开始下载 PDF.js 库文件...');

let downloadCount = 0;
files.forEach(file => {
    const outputPath = path.join(libDir, file.output);
    
    console.log(`正在下载 ${file.output}...`);
    https.get(file.url, (response) => {
        if (response.statusCode !== 200) {
            console.error(`下载 ${file.output} 失败，状态码: ${response.statusCode}`);
            return;
        }
        
        const fileStream = fs.createWriteStream(outputPath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
            fileStream.close();
            downloadCount++;
            console.log(`✓ ${file.output} 下载完成！`);
            
            if (downloadCount === files.length) {
                console.log('\n所有 PDF.js 库文件下载完成！');
            }
        });
    }).on('error', (err) => {
        console.error(`下载 ${file.output} 时出错：`, err.message);
    });
});