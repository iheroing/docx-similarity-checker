class DocumentParser {
    constructor() {
        this.docxParser = new DocxParser();
        this.pdfParser = new PdfParser();
    }

    async parseDocument(file, progressCallback) {
        const fileExtension = file.name.toLowerCase().split('.').pop();
        
        try {
            switch (fileExtension) {
                case 'docx':
                    progressCallback?.(`正在解析Word文档: ${file.name}`, 0);
                    return await this.docxParser.parseDocx(file, progressCallback);
                case 'pdf':
                    progressCallback?.(`正在解析PDF文档: ${file.name}`, 0);
                    return await this.pdfParser.parsePdf(file, progressCallback);
                default:
                    throw new Error(`不支持的文件格式: ${fileExtension}`);
            }
        } catch (error) {
            console.error(`解析文档 ${file.name} 失败:`, error);
            throw new Error(`解析文档 "${file.name}" 失败: ${error.message}`);
        }
    }

    getSupportedFormats() {
        return ['.docx', '.pdf'];
    }

    validateFileType(file) {
        const supportedFormats = this.getSupportedFormats();
        const fileExtension = '.' + file.name.toLowerCase().split('.').pop();
        
        if (!supportedFormats.includes(fileExtension)) {
            throw new Error(`文件 "${file.name}" 格式不支持，请上传 ${supportedFormats.join('、')} 格式的文件`);
        }
        return true;
    }

    getFileType(file) {
        const fileExtension = file.name.toLowerCase().split('.').pop();
        switch (fileExtension) {
            case 'docx':
                return 'Word文档';
            case 'pdf':
                return 'PDF文档';
            default:
                return '未知格式';
        }
    }
}

window.DocumentParser = DocumentParser;