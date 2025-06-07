class PdfParser {
    constructor() {
        // 确保 PDF.js 库已加载
        if (typeof pdfjsLib === 'undefined') {
            throw new Error('PDF.js 库未加载');
        }
        
        // 设置 PDF.js worker
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdf.worker.min.js';
    }

    async parsePdf(file, progressCallback) {
        try {
            progressCallback?.('正在读取PDF文件...', 10);
            const arrayBuffer = await this.readFileAsArrayBuffer(file);
            
            progressCallback?.('正在解析PDF文档...', 30);
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            progressCallback?.('正在提取文本内容...', 50);
            const textContent = await this.extractTextFromPdf(pdf, progressCallback);
            
            progressCallback?.('正在分析段落...', 90);
            return this.splitIntoParagraphs(textContent);
            
        } catch (error) {
            console.error('解析PDF时出错:', error);
            throw new Error('PDF解析失败: ' + error.message);
        }
    }

    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('读取文件失败'));
            reader.readAsArrayBuffer(file);
        });
    }

    async extractTextFromPdf(pdf, progressCallback) {
        let fullText = '';
        const numPages = pdf.numPages;
        
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            try {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                
                // 提取页面文本
                const pageText = textContent.items
                    .map(item => item.str)
                    .join(' ');
                
                fullText += pageText + ' ';
                
                // 更新进度
                const progress = 50 + (pageNum / numPages) * 40;
                progressCallback?.(`正在处理第 ${pageNum}/${numPages} 页...`, progress);
            } catch (pageError) {
                console.warn(`处理第 ${pageNum} 页时出错:`, pageError);
                // 继续处理下一页
            }
        }
        
        if (!fullText.trim()) {
            throw new Error('PDF文档中未找到可提取的文本内容，可能是扫描版PDF');
        }
        
        return fullText;
    }

    splitIntoParagraphs(text) {
        // 清理文本
        text = text.replace(/\s+/g, ' ').trim();
        
        // 使用标点符号分割段落
        const paragraphs = text.split(/[。！？.!?]+/)
            .map(p => p.trim())
            .filter(p => {
                // 移除空白字符后至少包含20个字符
                const cleaned = p.replace(/\s+/g, '');
                return cleaned.length >= 20;
            });

        if (paragraphs.length === 0) {
            throw new Error('未找到有效内容段落');
        }

        return paragraphs;
    }
}

window.PdfParser = PdfParser;