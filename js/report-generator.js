class ReportGenerator {
    static generateExcel(results, mode) {
        // 使用 SheetJS 库生成 Excel
        const wb = XLSX.utils.book_new();
        
        const data = results.map(item => ({
            '相似度': (item.similarity * 100).toFixed(1) + '%',
            '试题1': item.question1.content,
            '题号1': item.question1.number,
            '来源文档1': item.document1 || item.document,
            '试题2': item.question2.content,
            '题号2': item.question2.number,
            '来源文档2': item.document2 || item.document
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, '查重结果');

        // 生成文件名
        const fileName = `查重报告_${mode === 'single' ? '单文档' : '多文档'}_${new Date().toISOString().slice(0,10)}.xlsx`;
        
        // 保存文件
        XLSX.writeFile(wb, fileName);
    }
} 