class DocxParser {
    async parseDocx(file, progressCallback) {
        try {
            progressCallback?.('正在读取文件...', 10);
            const arrayBuffer = await this.readFileAsArrayBuffer(file);

            progressCallback?.('正在解析文档结构...', 30);
            const zip = await JSZip.loadAsync(arrayBuffer);
            const documentFile = zip.file('word/document.xml');
            if (!documentFile) {
                throw new Error('无效的 Word 文档格式');
            }

            const documentXml = await documentFile.async('string');
            progressCallback?.('正在提取段落...', 60);
            const paragraphs = await this.extractParagraphs(documentXml);

            progressCallback?.('正在整理内容...', 80);
            const cleaned = paragraphs
                .map(p => p.replace(/\s+/g, ' ').trim())
                .filter(p => p.replace(/\s+/g, '').length >= 20);

            if (cleaned.length === 0) {
                throw new Error('未找到有效内容段落');
            }

            progressCallback?.('完成解析', 100);
            return cleaned;

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

    async extractParagraphs(xmlContent) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

            // 基于 w:p 段落节点提取内容
            const wNs = 'w';
            const paragraphNodes = xmlDoc.getElementsByTagName(`${wNs}:p`).length
                ? xmlDoc.getElementsByTagName(`${wNs}:p`)
                : xmlDoc.getElementsByTagName('w:p');

            const paragraphs = [];
            for (let i = 0; i < paragraphNodes.length; i++) {
                const p = paragraphNodes[i];
                const runs = p.getElementsByTagName(`${wNs}:r`).length
                    ? p.getElementsByTagName(`${wNs}:r`)
                    : p.getElementsByTagName('w:r');

                let text = '';
                for (let j = 0; j < runs.length; j++) {
                    const r = runs[j];
                    const tNodes = r.getElementsByTagName(`${wNs}:t`).length
                        ? r.getElementsByTagName(`${wNs}:t`)
                        : r.getElementsByTagName('w:t');
                    for (let k = 0; k < tNodes.length; k++) {
                        const t = tNodes[k];
                        if (t && t.textContent) {
                            text += t.textContent;
                        }
                    }
                }

                if (text && text.trim().length > 0) {
                    paragraphs.push(text);
                }
            }

            return paragraphs;
        } catch (error) {
            throw new Error('提取段落失败: ' + error.message);
        }
    }
}

window.DocxParser = DocxParser;
