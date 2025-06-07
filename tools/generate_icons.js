const fs = require('fs');
const { createCanvas } = require('canvas');

// 生成不同尺寸的图标
const sizes = [16, 48, 128];

sizes.forEach(size => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // 设置背景
    ctx.fillStyle = '#4a90e2';
    ctx.fillRect(0, 0, size, size);

    // 绘制简单的"查"字
    ctx.fillStyle = 'white';
    ctx.font = `${size * 0.6}px "Microsoft YaHei"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('查', size/2, size/2);

    // 保存图片
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`images/icon${size}.png`, buffer);
}); 