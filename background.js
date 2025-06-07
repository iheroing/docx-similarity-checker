// 监听扩展图标点击事件
chrome.action.onClicked.addListener(async (tab) => {
  // 打开侧边栏
  await chrome.sidePanel.open({ windowId: tab.windowId });
  
  // 设置侧边栏标题
  await chrome.sidePanel.setOptions({
    tabId: tab.id,
    path: 'sidepanel.html',
    enabled: true
  });
});

// 确保侧边栏在所有页面都可用
chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (info.status === 'complete') {
    await chrome.sidePanel.setOptions({
      tabId: tab.id,
      path: 'sidepanel.html',
      enabled: true
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'DOWNLOAD_REPORT') {
        chrome.downloads.download({
            url: message.url,
            filename: message.filename,
            saveAs: true
        }, (downloadId) => {
            sendResponse({ success: true, downloadId });
        });
        return true; // 保持消息通道打开
    }
}); 