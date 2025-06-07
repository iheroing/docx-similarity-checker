class DocxParser {
    async parseDocx(file, progressCallback) {
        try {
            progressCallback?.('正在读取文件...', 10);
            const arrayBuffer = await this.readFileAsArrayBuffer(file);
            
            progressCallback?.('正在解析文档...', 30);
            const zip = await JSZip.loadAsync(arrayBuffer);
            const documentFile = zip.file('word/document.xml');
            if (!documentFile) {
                throw new Error('无效的 Word 文档格式');
            }

            const documentXml = await documentFile.async('string');
            progressCallback?.('正在提取文本...', 50);
            const content = await this.extractDocumentContent(documentXml);
            
            progressCallback?.('正在分析段落...', 70);
            return this.splitIntoParagraphs(content);

        } catch (error) {
            console.error('解析文档时出错:', error);
            throw new Error('文档解析失败: ' + error.message);
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

    async extractDocumentContent(xmlContent) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
            
            // 获取所有文本节点
            const textNodes = xmlDoc.getElementsByTagName('w:t');
            let content = '';
            
            // 直接提取文本内容
            for (let t of textNodes) {
                if (t.textContent) {
                    content += t.textContent + ' ';
                }
            }

            return content;
        } catch (error) {
            throw new Error('提取文档内容失败: ' + error.message);
        }
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

window.DocxParser = DocxParser; 