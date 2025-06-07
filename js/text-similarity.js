class TextSimilarity {
    constructor() {
        this.vocabulary = new Map();
    }

    // 分词（针对中文和英文）
    tokenize(text) {
        // 将文本转换为小写
        text = text.toLowerCase();
        
        // 提取中文字符和英文单词
        const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
        const englishWords = text.match(/[a-z]+/g) || [];
        
        return [...chineseChars, ...englishWords];
    }

    // 计算两段文本的相似度
    calculateSimilarity(text1, text2) {
        const tokens1 = this.tokenize(text1);
        const tokens2 = this.tokenize(text2);

        // 创建词频向量
        const vector1 = this.createVector(tokens1);
        const vector2 = this.createVector(tokens2);

        // 计算余弦相似度
        return this.cosineSimilarity(vector1, vector2);
    }

    // 创建词频向量
    createVector(tokens) {
        const vector = new Map();
        tokens.forEach(token => {
            vector.set(token, (vector.get(token) || 0) + 1);
        });
        return vector;
    }

    // 计算余弦相似度
    cosineSimilarity(vector1, vector2) {
        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;

        // 计算点积和向量模长
        for (const [token, count1] of vector1) {
            const count2 = vector2.get(token) || 0;
            dotProduct += count1 * count2;
            norm1 += count1 * count1;
        }

        for (const [_, count2] of vector2) {
            norm2 += count2 * count2;
        }

        // 计算相似度
        if (norm1 === 0 || norm2 === 0) return 0;
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }
}

// 导出类
window.TextSimilarity = TextSimilarity; 