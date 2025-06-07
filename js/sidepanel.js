// 定义全局变量
let currentDocuments = [];
let similarityThreshold = 0.8; // 默认相似度阈值 80%
let documentParser = null; // 文档解析器实例，将在初始化时创建
let textSimilarity = null; // 文本相似度分析器实例，将在初始化时创建
let uploadedFiles = []; // 存储上传的文件

// 在文件开头添加新的辅助函数
function showResultsSection() {
    const resultsSection = document.querySelector('.results-section');
    if (resultsSection) {
        resultsSection.classList.add('show');
    }
}

function hideResultsSection() {
    const resultsSection = document.querySelector('.results-section');
    if (resultsSection) {
        resultsSection.classList.remove('show');
    }
}

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM加载完成，开始初始化...');
    try {
        // 初始化核心组件
        initializeComponents();
        initializeUI();
        setupEventListeners();
        // 通知后台脚本侧边栏已加载
        chrome.runtime.sendMessage({ type: 'SIDEPANEL_LOADED' });
        console.log('初始化完成');
    } catch (error) {
        console.error('初始化失败:', error);
        showError('初始化失败: ' + error.message);
    }
});

// 初始化核心组件
function initializeComponents() {
    try {
        console.log('正在初始化核心组件...');
        
        // 检查必要的类是否已加载
        if (typeof DocumentParser === 'undefined') {
            throw new Error('DocumentParser 类未加载');
        }
        if (typeof TextSimilarity === 'undefined') {
            throw new Error('TextSimilarity 类未加载');
        }
        
        // 创建实例
        documentParser = new DocumentParser();
        textSimilarity = new TextSimilarity();
        
        console.log('核心组件初始化完成');
    } catch (error) {
        console.error('核心组件初始化失败:', error);
        throw new Error('核心组件初始化失败: ' + error.message);
    }
}

// 添加错误处理
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Error: ', message, error);
    console.error('Source:', source);
    console.error('Line:', lineno);
    console.error('Column:', colno);
    const results = document.getElementById('results');
    if (results) {
        results.innerHTML = `
            <div class="error-message">
                <p>发生错误：${message}</p>
                <p>位置：第 ${lineno} 行，第 ${colno} 列</p>
                <p>来源：${source}</p>
                <button class="retry-btn">
                    刷新页面
                </button>
            </div>
        `;
    }
};

// 初始化UI
function initializeUI() {
    console.log('初始化UI开始');
    // 添加相似度设置滑块
    const settingsHtml = `
        <div class="settings-section">
            <label>
                相似度阈值
                <span id="thresholdValue" style="color: #ffbb33; background: #fff9f0">80%</span>
            </label>
            <input type="range" 
                   id="similarityThreshold" 
                   class="similarity-slider"
                   min="0" 
                   max="100" 
                   value="80"
                   style="--value: 80%; --slider-color: #ffbb33; background: linear-gradient(90deg, #ffbb33 80%, #e0e0e0 80%)">
        </div>
    `;
    
    const modeSection = document.querySelector('.mode-section');
    console.log('找到mode-section:', !!modeSection);
    if (modeSection) {
        modeSection.insertAdjacentHTML('afterend', settingsHtml);
        console.log('添加相似度滑块成功');
        
        // 初始化滑块背景色和值
        const slider = document.getElementById('similarityThreshold');
        const thresholdValue = document.getElementById('thresholdValue');
        if (slider && thresholdValue) {
            // 设置初始值
            const initialValue = 80;
            slider.value = initialValue;
            
            // 设置初始颜色
            const color = initialValue >= 90 ? '#ff4444' : 
                         initialValue >= 70 ? '#ffbb33' : '#00C851';
                         
            // 设置滑块样式
            slider.style.setProperty('--value', `${initialValue}%`);
            slider.style.setProperty('--slider-color', color);
            slider.style.background = `linear-gradient(90deg, ${color} ${initialValue}%, #e0e0e0 ${initialValue}%)`;
            
            // 设置值显示的样式
            thresholdValue.style.color = color;
            thresholdValue.style.background = initialValue >= 90 ? '#fff5f5' : 
                                            initialValue >= 70 ? '#fff9f0' : '#f5fff7';
        }
    } else {
        throw new Error('找不到mode-section元素');
    }
}

// 设置事件监听器
function setupEventListeners() {
    console.log('开始设置事件监听器');
    
    const uploadBtn = document.getElementById('uploadBtn');
    const docxFile = document.getElementById('docxFile');
    const similaritySlider = document.getElementById('similarityThreshold');
    const startBtn = document.getElementById('startBtn');
    const exportBtn = document.getElementById('exportBtn');
    const modeInputs = document.querySelectorAll('input[name="mode"]');

    // 验证所有必要的元素都存在
    if (!uploadBtn) throw new Error('找不到上传按钮');
    if (!docxFile) throw new Error('找不到文件输入框');
    if (!similaritySlider) throw new Error('找不到相似度滑块');
    if (!startBtn) throw new Error('找不到开始按钮');
    if (!exportBtn) throw new Error('找不到导出按钮');
    if (!modeInputs.length) throw new Error('找不到模式选择按钮');

    // 文件上传相关
    uploadBtn.addEventListener('click', () => {
        console.log('点击上传按钮');
        docxFile.click();
    });
    
    docxFile.addEventListener('change', (event) => {
        console.log('文件选择变化');
        handleFileSelect(event);
    });

    // 相似度滑块
    similaritySlider.addEventListener('input', updateSimilarityThreshold);
    
    // 开始按钮
    startBtn.addEventListener('click', () => {
        console.log('点击开始查重按钮');
        startAnalysis().catch(error => {
            console.error('查重过程出错:', error);
            showError(error.message);
        });
    });
    
    // 导出按钮
    exportBtn.addEventListener('click', () => {
        console.log('点击导出按钮');
        exportResults();
    });

    // 模式切换
    modeInputs.forEach(input => {
        input.addEventListener('change', () => {
            console.log('切换模式:', input.value);
            const isSingleMode = input.value === 'single';
            if (isSingleMode && uploadedFiles.length > 1) {
                uploadedFiles = [uploadedFiles[0]];
                updateFilesList();
            }
            updateStartButton();
        });
    });

    // 添加事件委托处理删除按钮和清空按钮
    document.addEventListener('click', (event) => {
        // 处理删除文件按钮
        if (event.target.classList.contains('remove-file-btn')) {
            const fileName = event.target.getAttribute('data-filename');
            if (fileName) {
                removeFile(fileName);
            }
        }
        
        // 处理清空列表按钮
        if (event.target.classList.contains('clear-files-btn')) {
            clearFiles();
        }
        
        // 处理管理文件按钮
        if (event.target.classList.contains('manage-files-btn')) {
            event.preventDefault();
            showFileList();
        }
        
        // 处理重新查重按钮
        if (event.target.classList.contains('recheck-btn')) {
            event.preventDefault();
            restartAnalysis();
        }
        
        // 处理添加文件按钮
        if (event.target.classList.contains('add-files-btn')) {
            event.preventDefault();
            document.getElementById('docxFile').click();
        }
        
        // 处理隐藏文件列表按钮
        if (event.target.classList.contains('hide-files-btn')) {
            event.preventDefault();
            hideFileList();
        }
        
        // 处理重试按钮
        if (event.target.classList.contains('retry-btn')) {
            event.preventDefault();
            if (event.target.textContent.includes('重新加载')) {
                location.reload();
            } else if (event.target.textContent.includes('选择文件')) {
                document.getElementById('docxFile').click();
            } else if (event.target.textContent.includes('开始查重')) {
                startAnalysis();
            }
        }
        
        // 处理阈值调整
        if (event.target.classList.contains('threshold-value')) {
            event.preventDefault();
            adjustThreshold();
        }
        
        // 处理阈值对话框按钮
        if (event.target.classList.contains('close-threshold-btn')) {
            event.preventDefault();
            closeThresholdDialog();
        }
        
        if (event.target.classList.contains('apply-threshold-btn')) {
            event.preventDefault();
            applyNewThreshold();
        }
    });

    console.log('事件监听器设置完成');
}

// 修改文件选择处理函数
function handleFileSelect(event) {
    console.log('处理文件选择', event.target.files);
    const files = event.target.files;
    const mode = document.querySelector('input[name="mode"]:checked').value;

    try {
        if (!files || files.length === 0) {
            throw new Error('请选择要上传的文档');
        }

        // 检查文件类型
        if (!documentParser) {
            throw new Error('文档解析器未初始化，请刷新页面重试');
        }
        
        for (let file of files) {
            try {
                documentParser.validateFileType(file);
            } catch (error) {
                throw error;
            }
        }

        // 处理文件选择
        if (mode === 'single') {
            // 单文档模式只保留最新选择的文件
            uploadedFiles = [files[0]];
        } else {
            // 多文档模式，将新文件添加到现有文件列表中
            const newFiles = Array.from(files);
            // 检查文件是否已经存在
            newFiles.forEach(newFile => {
                const isDuplicate = uploadedFiles.some(existingFile => 
                    existingFile.name === newFile.name
                );
                if (!isDuplicate) {
                    uploadedFiles.push(newFile);
                }
            });
        }

        console.log('已选择文件:', uploadedFiles.map(f => f.name));
        updateFilesList();
        updateStartButton();
        
        // 清空文件输入框的值，允许重复选择相同文件
        event.target.value = '';
        
        // 显示成功提示
        showSuccess(`已选择 ${uploadedFiles.length} 个文件`);
        
    } catch (error) {
        console.error('文件选择失败:', error);
        showError(error.message);
        // 清空文件输入框的值
        event.target.value = '';
    }
}

// 更新文件列表显示
function updateFilesList() {
    const results = document.getElementById('results');
    if (uploadedFiles.length === 0) {
        // 没有文件时隐藏结果区域
        hideResultsSection();
        return;
    }

    // 有文件时显示结果区域
    showResultsSection();
    
    let html = `
        <div class="file-list-container">
            <h3>已选择的文件：</h3>
            <ul class="file-list">
    `;
    uploadedFiles.forEach((file, index) => {
        const fileType = documentParser ? documentParser.getFileType(file) : '未知格式';
        const escapedFileName = file.name.replace(/'/g, "\\'").replace(/"/g, '\\"');
        html += `
            <li style="animation: slideIn 0.3s ease-out ${index * 0.1}s backwards">
                <span class="file-name">${file.name}</span>
                <span class="file-type">(${fileType})</span>
                <button class="remove-file-btn" data-filename="${file.name}">×</button>
            </li>
        `;
    });
    html += `
            </ul>
            <div class="file-list-actions">
                <button class="clear-files-btn">清空列表</button>
            </div>
        </div>
    `;
    results.innerHTML = html;
}

// 显示文件列表
function showFileList() {
    // 检查是否已经有文件管理区域
    let fileManagementArea = document.getElementById('fileManagementArea');
    
    if (!fileManagementArea) {
        // 如果不存在，创建文件管理区域
        const results = document.getElementById('results');
        const managementHtml = `
            <div id="fileManagementArea" class="file-management-area">
                <div class="file-list-container">
                    <h3>文件管理：</h3>
                    <ul class="file-list">
                        ${uploadedFiles.map((file, index) => {
                            const fileType = documentParser ? documentParser.getFileType(file) : '未知格式';
                            const escapedFileName = file.name.replace(/'/g, "\\'").replace(/"/g, '\\"');
                            return `
                                <li style="animation: slideIn 0.3s ease-out ${index * 0.1}s backwards">
                                    <span class="file-name">${file.name}</span>
                                    <span class="file-type">(${fileType})</span>
                                    <button class="remove-file-btn" data-filename="${file.name}">×</button>
                                </li>
                            `;
                        }).join('')}
                    </ul>
                    <div class="file-list-actions">
                        <button class="clear-files-btn">清空列表</button>
                        <button class="add-files-btn">添加文件</button>
                        <button class="hide-files-btn">隐藏</button>
                    </div>
                </div>
            </div>
        `;
        results.insertAdjacentHTML('beforeend', managementHtml);
        fileManagementArea = document.getElementById('fileManagementArea');
    } else {
        // 如果存在，更新文件列表内容
        const fileList = fileManagementArea.querySelector('.file-list');
        if (fileList) {
            fileList.innerHTML = uploadedFiles.map((file, index) => {
                const fileType = documentParser ? documentParser.getFileType(file) : '未知格式';
                const escapedFileName = file.name.replace(/'/g, "\\'").replace(/"/g, '\\"');
                return `
                    <li style="animation: slideIn 0.3s ease-out ${index * 0.1}s backwards">
                        <span class="file-name">${file.name}</span>
                        <span class="file-type">(${fileType})</span>
                        <button class="remove-file-btn" data-filename="${file.name}">×</button>
                    </li>
                `;
            }).join('');
        }
    }
    
    // 显示文件管理区域
    fileManagementArea.style.display = 'block';
    fileManagementArea.scrollIntoView({ behavior: 'smooth' });
}

// 隐藏文件列表
function hideFileList() {
    const fileManagementArea = document.getElementById('fileManagementArea');
    if (fileManagementArea) {
        fileManagementArea.style.display = 'none';
    }
}

// 添加移除单个文件的功能
function removeFile(fileName) {
    console.log('移除文件:', fileName);
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    updateFilesList();
    updateStartButton();
    
    // 如果没有文件了，清除查重结果
    if (uploadedFiles.length === 0) {
        const results = document.getElementById('results');
        results.innerHTML = '<p>请选择要查重的文档。</p>';
        const exportBtn = document.getElementById('exportBtn');
        exportBtn.disabled = true;
    }
}

// 添加清空文件列表的功能
function clearFiles() {
    console.log('清空文件列表');
    uploadedFiles = [];
    updateFilesList();
    updateStartButton();
    
    // 清除查重结果
    const results = document.getElementById('results');
    results.innerHTML = '<p>请选择要查重的文档。</p>';
    const exportBtn = document.getElementById('exportBtn');
    exportBtn.disabled = true;
    
    // 清空全局查重结果
    window.lastCheckResults = null;
    currentDocuments = [];
}

// 更新开始按钮状态
function updateStartButton() {
    const startBtn = document.getElementById('startBtn');
    const exportBtn = document.getElementById('exportBtn');
    const mode = document.querySelector('input[name="mode"]:checked').value;
    const hasValidFiles = uploadedFiles.length > 0 && 
        (mode === 'single' || uploadedFiles.length > 1);
    
    startBtn.disabled = !hasValidFiles;
    // 如果没有文件，导出按钮也应该禁用
    if (!hasValidFiles) {
        exportBtn.disabled = true;
    }
}

// 添加进度显示函数
function updateProgress(message, percent) {
    const results = document.getElementById('results');
    results.innerHTML = `
        <div class="progress-container">
            <div class="progress-message">${message}</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percent}%"></div>
            </div>
            <div class="progress-percent">${percent}%</div>
        </div>
    `;
}

// 设置按钮加载状态
function setButtonLoading(buttonId, isLoading, loadingText = '处理中') {
    const button = document.getElementById(buttonId);
    const originalContent = button.innerHTML;
    
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = `
            <div class="btn-content">
                <span class="loading-dots">${loadingText}</span>
            </div>
        `;
        button.dataset.originalContent = originalContent;
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalContent || originalContent;
        delete button.dataset.originalContent;
    }
}

// 修改开始分析函数
async function startAnalysis() {
    try {
        setButtonLoading('startBtn', true, '查重中');
        currentDocuments = [];
        const totalFiles = uploadedFiles.length;
        
        // 处理每个文件
        for (let i = 0; i < uploadedFiles.length; i++) {
            const file = uploadedFiles[i];
            const paragraphs = await parseDocument(file, (message, percent) => {
                const baseProgress = (i / totalFiles) * 70;
                const fileProgress = baseProgress + (percent / 100) * (70 / totalFiles);
                updateProgress(
                    `正在处理文件 ${i + 1}/${totalFiles}: ${file.name} - ${message}`,
                    Math.round(fileProgress)
                );
            });
            currentDocuments.push({
                name: file.name,
                paragraphs: paragraphs
            });
        }

        updateProgress('正在进行查重分析...', 75);
        const mode = document.querySelector('input[name="mode"]:checked').value;
        
        const duplicates = mode === 'single' ? 
            findDuplicatesInSingleDoc(currentDocuments[0]) :
            findDuplicatesAcrossDocuments(currentDocuments);

        updateProgress('正在生成报告...', 95);
        displayResults(duplicates);
        
    } catch (error) {
        console.error('Error processing document:', error);
        // 显示错误但保持文件列表
        showErrorWithFileList(error.message);
    } finally {
        setButtonLoading('startBtn', false);
    }
}

// 显示错误信息
function showError(message) {
    const results = document.getElementById('results');
    results.innerHTML = `
        <div class="error-message">
            <p>处理文档时出错：${message}</p>
            <p>请确保：</p>
            <ul>
                <li>上传的是有效的 .docx 或 .pdf 文档</li>
                <li>文档中包含可识别的试题</li>
                <li>文档未被加密或损坏</li>
                <li>文档中的试题格式正确（包含题号）</li>
                <li>文档是使用 Microsoft Word 创建的（某些第三方软件创建的文档可能无法解析）</li>
            </ul>
            <p>支持的题号格式：</p>
            <ul>
                <li>数字题号：1. 1、 1） 1. </li>
                <li>中文题号：一、 二、 </li>
                <li>字母题号：A. A、 A） </li>
            </ul>
            <button class="retry-btn">
                重新选择文件
            </button>
        </div>
    `;
}

// 显示成功信息
function showSuccess(message) {
    const results = document.getElementById('results');
    
    // 创建成功提示元素
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-icon">✓</div>
        <div class="success-text">${message}</div>
    `;
    
    // 如果results区域有内容，在顶部插入成功提示
    if (results.children.length > 0) {
        results.insertBefore(successDiv, results.firstChild);
    } else {
        // 如果results区域为空，直接添加
        results.appendChild(successDiv);
    }
    
    // 3秒后自动移除成功提示
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.style.opacity = '0';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
            }, 300);
        }
    }, 3000);
}

// 显示错误信息但保持文件列表
function showErrorWithFileList(message) {
    const results = document.getElementById('results');
    
    // 如果有文件，显示文件列表和错误信息
    if (uploadedFiles.length > 0) {
        let html = `
            <div class="file-list-container">
                <h3>已选择的文件：</h3>
                <ul class="file-list">
        `;
        uploadedFiles.forEach((file, index) => {
            const fileType = documentParser ? documentParser.getFileType(file) : '未知格式';
            const escapedFileName = file.name.replace(/'/g, "\\'").replace(/"/g, '\\"');
            html += `
                <li style="animation: slideIn 0.3s ease-out ${index * 0.1}s backwards">
                    <span class="file-name">${file.name}</span>
                    <span class="file-type">(${fileType})</span>
                    <button class="remove-file-btn" data-filename="${file.name}">×</button>
                </li>
            `;
        });
        html += `
                </ul>
                <div class="file-list-actions">
                    <button class="clear-files-btn">清空列表</button>
                </div>
            </div>
            <div class="error-message">
                <p>查重过程中出错：${message}</p>
                <p>请检查文档格式或重新尝试。</p>
                <button class="retry-btn">
                    重新查重
                </button>
            </div>
        `;
        results.innerHTML = html;
    } else {
        // 如果没有文件，显示普通错误信息
        showError(message);
    }
}

// 解析文档文件
async function parseDocument(file, progressCallback) {
    if (!documentParser) {
        throw new Error('文档解析器未初始化，请刷新页面重试');
    }
    try {
        return await documentParser.parseDocument(file, progressCallback);
    } catch (error) {
        throw new Error(`解析文件 ${file.name} 失败: ${error.message}`);
    }
}

// 计算文本相似度
function calculateSimilarity(str1, str2) {
    if (!textSimilarity) {
        console.warn('文本相似度计算器未初始化，使用默认值');
        return 0;
    }
    return textSimilarity.calculateSimilarity(str1, str2);
}

// 更新相似度阈值
function updateSimilarityThreshold(event) {
    const value = event.target.value;
    similarityThreshold = value / 100;
    
    // 更新显示的值并添加动画效果
    const thresholdValue = document.getElementById('thresholdValue');
    thresholdValue.textContent = `${value}%`;
    thresholdValue.classList.add('updating');
    setTimeout(() => thresholdValue.classList.remove('updating'), 300);
    
    // 更新滑块背景色
    const slider = event.target;
    slider.style.setProperty('--value', `${value}%`);
    
    // 更新滑块颜色
    let color;
    if (value >= 90) {
        color = '#ff4444';
        thresholdValue.style.color = '#ff4444';
        thresholdValue.style.background = '#fff5f5';
    } else if (value >= 70) {
        color = '#ffbb33';
        thresholdValue.style.color = '#ffbb33';
        thresholdValue.style.background = '#fff9f0';
    } else {
        color = '#00C851';
        thresholdValue.style.color = '#00C851';
        thresholdValue.style.background = '#f5fff7';
    }
    
    // 设置滑块颜色变量和背景
    slider.style.setProperty('--slider-color', color);
    slider.style.background = `linear-gradient(90deg, ${color} ${value}%, #e0e0e0 ${value}%)`;
    
    // 更新滑块值提示
    slider.setAttribute('value', `${value}%`);
}

// 在单个文档中查找重复
function findDuplicatesInSingleDoc(document) {
    const duplicates = [];
    const paragraphs = document.paragraphs;
    
    // 更新进度信息
    const totalComparisons = (paragraphs.length * (paragraphs.length - 1)) / 2;
    let currentComparison = 0;

    for (let i = 0; i < paragraphs.length; i++) {
        for (let j = i + 1; j < paragraphs.length; j++) {
            currentComparison++;
            if (currentComparison % 100 === 0) {
                const progress = Math.round(75 + (currentComparison / totalComparisons) * 15);
                updateProgress('正在比较段落...', progress);
            }

            const similarity = calculateSimilarity(
                paragraphs[i],
                paragraphs[j]
            );

            if (similarity >= similarityThreshold) {
                duplicates.push({
                    paragraph1: paragraphs[i],
                    paragraph2: paragraphs[j],
                    similarity: similarity,
                    document: document.name
                });
            }
        }
    }

    return duplicates;
}

// 在多个文档之间查找重复
function findDuplicatesAcrossDocuments(documents) {
    const duplicates = [];
    const totalComparisons = documents.length * (documents.length + 1) / 2;
    let currentComparison = 0;
    
    // 遍历所有文档对
    for (let i = 0; i < documents.length; i++) {
        for (let j = i; j < documents.length; j++) {
            currentComparison++;
            const progress = Math.round(75 + (currentComparison / totalComparisons) * 15);
            updateProgress(
                `正在比较文档 ${i + 1} 和 ${j + 1}`,
                progress
            );

            // 如果是同一个文档，使用单文档查重
            if (i === j) {
                duplicates.push(...findDuplicatesInSingleDoc(documents[i]));
                continue;
            }
            
            // 比较两个不同文档
            const doc1 = documents[i];
            const doc2 = documents[j];
            
            for (let p1 of doc1.paragraphs) {
                for (let p2 of doc2.paragraphs) {
                    const similarity = calculateSimilarity(p1, p2);
                    if (similarity >= similarityThreshold) {
                        duplicates.push({
                            paragraph1: p1,
                            paragraph2: p2,
                            similarity: similarity,
                            document1: doc1.name,
                            document2: doc2.name
                        });
                    }
                }
            }
        }
    }
    
    return duplicates;
}

// 显示查重结果
function displayResults(duplicates) {
    const results = document.getElementById('results');
    const exportBtn = document.getElementById('exportBtn');
    
    if (duplicates.length === 0) {
        let html = `
            <div class="no-duplicates">
                <div class="success-icon">✓</div>
                <p>未发现重复内容</p>
                <div class="hint-text">
                    您可以：
                    <ul>
                        <li>调整相似度阈值后重新查重</li>
                        <li>选择新的文件进行查重</li>
                    </ul>
                </div>
                <div class="results-actions">
                    <button class="action-btn manage-files-btn">📁 管理文件</button>
                    <button class="action-btn recheck-btn">🔄 重新查重</button>
                </div>
            </div>
        `;
        
        // 添加文件管理区域
        html += `
            <div id="fileManagementArea" class="file-management-area" style="display: none;">
                <div class="file-list-container">
                    <h3>文件管理：</h3>
                    <ul class="file-list">
        `;
        uploadedFiles.forEach((file, index) => {
            const fileType = documentParser ? documentParser.getFileType(file) : '未知格式';
            const escapedFileName = file.name.replace(/'/g, "\\'").replace(/"/g, '\\"');
            html += `
                <li style="animation: slideIn 0.3s ease-out ${index * 0.1}s backwards">
                    <span class="file-name">${file.name}</span>
                    <span class="file-type">(${fileType})</span>
                    <button class="remove-file-btn" data-filename="${file.name}">×</button>
                </li>
            `;
        });
        html += `
                    </ul>
                    <div class="file-list-actions">
                        <button class="clear-files-btn">清空列表</button>
                        <button class="add-files-btn">添加文件</button>
                        <button class="hide-files-btn">隐藏</button>
                    </div>
                </div>
            </div>
        `;
        
        results.innerHTML = html;
        exportBtn.disabled = true;
        return;
    }

    // 启用导出按钮
    exportBtn.disabled = false;
    
    // 保存查重结果到全局变量，供导出使用
    window.lastCheckResults = duplicates;
    
    // 按相似度从高到低排序
    duplicates.sort((a, b) => b.similarity - a.similarity);

    let html = `
        <div class="results-header">
            <div class="results-summary">
                <h2>查重结果</h2>
                <div class="results-stats">
                    <span class="stat-item">
                        <span class="stat-label">检测文档</span>
                        <span class="stat-value">${currentDocuments.length}</span>
                    </span>
                    <span class="stat-item">
                        <span class="stat-label">重复内容</span>
                        <span class="stat-value highlight">${duplicates.length}</span>
                    </span>
                    <span class="stat-item">
                        <span class="stat-label">相似度阈值</span>
                        <span class="stat-value threshold-value">
                            ${(similarityThreshold * 100).toFixed(0)}%
                            <span class="edit-hint">点击调整</span>
                        </span>
                    </span>
                </div>
                <div class="results-actions">
                    <button class="action-btn manage-files-btn">📁 管理文件</button>
                    <button class="action-btn recheck-btn">🔄 重新查重</button>
                </div>
            </div>
        </div>
        <div class="similarity-legend">
            <span class="legend-item">
                <span class="legend-color high"></span>
                <span>90%以上</span>
            </span>
            <span class="legend-item">
                <span class="legend-color medium"></span>
                <span>70-90%</span>
            </span>
            <span class="legend-item">
                <span class="legend-color low"></span>
                <span>70%以下</span>
            </span>
        </div>
    `;

    duplicates.forEach((item, index) => {
        const similarityClass = item.similarity >= 0.9 ? 'similarity-high' :
                              item.similarity >= 0.7 ? 'similarity-medium' : 
                              'similarity-low';

        html += `
            <div class="duplicate-item ${similarityClass}">
                <div class="duplicate-header">
                    <span class="duplicate-index">#${index + 1}</span>
                    <span class="similarity-badge">
                        相似度: ${(item.similarity * 100).toFixed(1)}%
                    </span>
                </div>
                <p><strong>段落1:</strong> ${item.paragraph1}</p>
                <p><strong>来自文档:</strong> ${item.document1 || item.document}</p>
                <p><strong>段落2:</strong> ${item.paragraph2}</p>
                <p><strong>来自文档:</strong> ${item.document2 || item.document}</p>
            </div>
        `;
    });

    // 添加文件管理区域（默认隐藏）
    html += `
        <div id="fileManagementArea" class="file-management-area" style="display: none;">
            <div class="file-list-container">
                <h3>文件管理：</h3>
                <ul class="file-list">
    `;
    uploadedFiles.forEach((file, index) => {
        const fileType = documentParser ? documentParser.getFileType(file) : '未知格式';
        const escapedFileName = file.name.replace(/'/g, "\\'").replace(/"/g, '\\"');
        html += `
            <li style="animation: slideIn 0.3s ease-out ${index * 0.1}s backwards">
                <span class="file-name">${file.name}</span>
                <span class="file-type">(${fileType})</span>
                <button class="remove-file-btn" data-filename="${file.name}">×</button>
            </li>
        `;
    });
    html += `
                </ul>
                <div class="file-list-actions">
                    <button class="clear-files-btn">清空列表</button>
                    <button class="add-files-btn">添加文件</button>
                    <button class="hide-files-btn">隐藏</button>
                </div>
            </div>
        </div>
    `;

    results.innerHTML = html;
}

// 复制查重结果
function copyResults() {
    const results = document.getElementById('results');
    
    // 创建一个临时的文本区域来存放要复制的内容
    const textArea = document.createElement('textarea');
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    
    // 构建报告文本
    let reportText = '查重报告\n';
    reportText += '=================\n\n';
    
    // 添加基本信息
    reportText += `检测时间：${new Date().toLocaleString()}\n`;
    reportText += `相似度阈值：${(similarityThreshold * 100).toFixed(0)}%\n`;
    reportText += `检测文档数：${currentDocuments.length}\n`;
    reportText += `发现重复内容：${document.querySelectorAll('.duplicate-item').length} 处\n\n`;
    
    // 添加文档列表
    reportText += '检测文档：\n';
    currentDocuments.forEach(doc => {
        reportText += `- ${doc.name}\n`;
    });
    reportText += '\n';
    
    // 添加重复内容
    document.querySelectorAll('.duplicate-item').forEach((item, index) => {
        reportText += `重复项 ${index + 1}\n`;
        reportText += `相似度: ${item.querySelector('h3').textContent.match(/\d+\.?\d*%/)[0]}\n`;
        const paragraphs = item.querySelectorAll('p');
        reportText += `段落1: ${paragraphs[0].textContent.replace('段落1:', '')}\n`;
        reportText += `来自文档: ${paragraphs[1].textContent.replace('来自文档:', '')}\n`;
        reportText += `段落2: ${paragraphs[2].textContent.replace('段落2:', '')}\n`;
        reportText += `来自文档: ${paragraphs[3].textContent.replace('来自文档:', '')}\n`;
        reportText += '=================\n\n';
    });
    
    textArea.value = reportText;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        // 显示成功提示
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = '查重结果已复制到剪贴板！';
        results.insertBefore(successMessage, results.firstChild);
        setTimeout(() => successMessage.remove(), 3000);
    } catch (err) {
        console.error('复制失败:', err);
        showError('复制失败，请手动选择文本并复制');
    }
    
    document.body.removeChild(textArea);
}

// 清空结果
function clearResults() {
    updateFilesList();
}

// 调整阈值对话框
function adjustThreshold() {
    const results = document.getElementById('results');
    const currentThreshold = Math.round(similarityThreshold * 100);
    
    const dialog = document.createElement('div');
    dialog.className = 'threshold-dialog';
    dialog.innerHTML = `
        <div class="threshold-content">
            <h3>调整相似度阈值</h3>
            <div class="threshold-setting">
                <input type="range" 
                       id="newThreshold" 
                       min="0" 
                       max="100" 
                       value="${currentThreshold}"
                       class="similarity-slider">
                <span id="newThresholdValue">${currentThreshold}%</span>
            </div>
            <div class="threshold-hint">
                <p>提示：</p>
                <ul>
                    <li>建议设置在 60-90% 之间</li>
                    <li>低于 60% 可能会产生大量不相关结果</li>
                    <li>高于 90% 可能会遗漏部分相似内容</li>
                </ul>
            </div>
            <div class="dialog-buttons">
                <button class="action-btn close-threshold-btn">取消</button>
                <button class="action-btn primary apply-threshold-btn">应用并重新查重</button>
            </div>
        </div>
    `;
    
    results.insertBefore(dialog, results.firstChild);
    
    // 添加滑块事件监听
    document.getElementById('newThreshold').addEventListener('input', (e) => {
        const value = e.target.value;
        document.getElementById('newThresholdValue').textContent = `${value}%`;
        // 更新滑块背景色
        e.target.style.setProperty('--value', `${value}%`);
    });
    
    // 初始化滑块背景色
    const newThresholdSlider = document.getElementById('newThreshold');
    newThresholdSlider.style.setProperty('--value', `${currentThreshold}%`);
}

// 关闭阈值对话框
function closeThresholdDialog() {
    const dialog = document.querySelector('.threshold-dialog');
    if (dialog) {
        dialog.remove();
    }
}

// 应用新阈值并重新查重
function applyNewThreshold() {
    const newThreshold = document.getElementById('newThreshold').value;
    similarityThreshold = newThreshold / 100;
    
    // 更新主滑块的值和视觉效果
    const mainSlider = document.getElementById('similarityThreshold');
    const thresholdValue = document.getElementById('thresholdValue');
    
    if (mainSlider) {
        mainSlider.value = newThreshold;
        // 更新滑块背景色
        mainSlider.style.setProperty('--value', `${newThreshold}%`);
    }
    
    if (thresholdValue) {
        thresholdValue.textContent = `${newThreshold}%`;
        // 添加更新动画效果
        thresholdValue.classList.add('updating');
        setTimeout(() => thresholdValue.classList.remove('updating'), 300);
    }
    
    closeThresholdDialog();
    restartAnalysis();
}

// 重新开始查重分析
function restartAnalysis() {
    console.log('重新开始查重分析');
    
    // 检查是否有文件
    if (!uploadedFiles || uploadedFiles.length === 0) {
        showError('请先选择要查重的文档');
        return;
    }
    
    // 清除之前的结果状态
    window.lastCheckResults = null;
    currentDocuments = [];
    
    // 隐藏文件管理区域
    hideFileList();
    
    // 重置结果区域显示
    const results = document.getElementById('results');
    results.innerHTML = '<div class="loading-message">正在重新分析文档...</div>';
    
    // 重置导出按钮状态
    const exportBtn = document.getElementById('exportBtn');
    exportBtn.disabled = true;
    
    // 开始新的查重分析
    startAnalysis().catch(error => {
        console.error('重新查重失败:', error);
        showError('重新查重失败: ' + error.message);
    });
}

// 导出查重结果
function exportResults() {
    console.log('开始导出结果...');
    
    try {
        if (!window.lastCheckResults || window.lastCheckResults.length === 0) {
            throw new Error('没有可导出的查重结果');
        }

        if (typeof XLSX === 'undefined') {
            throw new Error('Excel导出组件未正确加载，请刷新页面重试');
        }

        const mode = document.querySelector('input[name="mode"]:checked').value;
        console.log('当前模式:', mode);
        
        setButtonLoading('exportBtn', true, '导出中');
        
        // 准备导出数据
        console.log('准备导出数据...');
        const data = window.lastCheckResults.map((item, index) => ({
            '序号': index + 1,
            '相似度': (item.similarity * 100).toFixed(1) + '%',
            '段落1': item.paragraph1,
            '来源文档1': item.document1 || item.document,
            '段落2': item.paragraph2,
            '来源文档2': item.document2 || item.document
        }));
        console.log(`处理了 ${data.length} 条记录`);

        // 使用 SheetJS 导出 Excel
        console.log('开始生成Excel文件...');
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        
        // 设置列宽
        const colWidths = [
            { wch: 6 },  // 序号
            { wch: 10 }, // 相似度
            { wch: 50 }, // 段落1
            { wch: 20 }, // 来源文档1
            { wch: 50 }, // 段落2
            { wch: 20 }  // 来源文档2
        ];
        ws['!cols'] = colWidths;
        
        // 设置样式
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = range.s.r; R <= range.e.r; R++) {
            for (let C = range.s.c; C <= range.e.c; C++) {
                const cell_address = {c: C, r: R};
                const cell_ref = XLSX.utils.encode_cell(cell_address);
                if (!ws[cell_ref]) continue;
                
                // 设置单元格样式
                ws[cell_ref].s = {
                    font: { name: "微软雅黑" },
                    alignment: { vertical: "center", horizontal: "left", wrapText: true }
                };
                
                // 为标题行设置特殊样式
                if (R === 0) {
                    ws[cell_ref].s.font.bold = true;
                    ws[cell_ref].s.fill = { fgColor: { rgb: "f2f2f2" } };
                }
            }
        }
        
        XLSX.utils.book_append_sheet(wb, ws, '查重结果');
        
        // 生成文件名
        const now = new Date();
        const timeStr = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).replace(/[\/\s:]/g, '');
        
        // 获取原文档名（去除扩展名）
        let docName = '';
        const currentMode = document.querySelector('input[name="mode"]:checked').value;
        const modeText = currentMode === 'single' ? '单文档' : '多文档';
        
        if (currentMode === 'single') {
            docName = uploadedFiles[0].name.replace('.docx', '');
        } else {
            // 多文档模式使用第一个文件名加数量标识
            docName = `${uploadedFiles[0].name.replace('.docx', '')}等${uploadedFiles.length}个文件`;
        }
        
        const fileName = `${modeText}-${docName}-${timeStr}.xlsx`;
        console.log('正在写入文件:', fileName);
        
        // 导出文件
        XLSX.writeFile(wb, fileName);
        console.log('Excel文件生成完成');

        // 显示成功提示
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-icon">✓</div>
            <div class="success-text">
                <div>导出成功！</div>
                <div class="success-detail">文件已保存为：${fileName}</div>
            </div>
        `;
        const results = document.getElementById('results');
        results.insertBefore(successMessage, results.firstChild);
        setTimeout(() => {
            successMessage.style.opacity = '0';
            setTimeout(() => successMessage.remove(), 300);
        }, 3000);
        console.log('导出完成');

    } catch (error) {
        console.error('导出失败:', error);
        showError('导出失败: ' + error.message);
        if (error.message.includes('XLSX is not defined')) {
            showError('Excel导出组件加载失败。请尝试：\n1. 刷新页面\n2. 清除浏览器缓存后重试\n3. 检查网络连接');
        }
    } finally {
        setButtonLoading('exportBtn', false);
    }
}