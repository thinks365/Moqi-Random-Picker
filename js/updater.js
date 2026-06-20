// 更新检查相关函数
function showUpdateModal() {
    modalManager.openModal('updateOverlay');
    setTimeout(() => {
        document.getElementById('updateModal').classList.add('show');
    }, 10);
    document.getElementById('updateStatus').style.display = 'block';
    document.getElementById('updateInfo').style.display = 'none';
    checkForUpdate();
}
function closeUpdateModal() {
    // 如果正在下载，提示用户
    if (downloadAbortController) {
        if (!confirm(t('下载正在进行中，确定要关闭吗？'))) return;
        cancelDownload();
    }
    document.getElementById('updateModal').classList.remove('show');
    setTimeout(() => {
        modalManager.closeModal('updateOverlay');
    }, 300);
}
document.getElementById('checkUpdateBtn').addEventListener('click', showUpdateModal);
document.getElementById('closeUpdateModal').addEventListener('click', closeUpdateModal);
document.getElementById('closeUpdateBtn').addEventListener('click', closeUpdateModal);
document.getElementById('retryBtn').addEventListener('click', checkForUpdate);

// 下载控制变量
let downloadAbortController = null;
let downloadedFilePath = null;
let currentDownloadUrl = null;
let downloadProgressTimer = null; // 10 秒无进展超时计时器

async function checkForUpdate() {
    document.getElementById('updateStatus').style.display = 'block';
    document.getElementById('updateInfo').style.display = 'none';
    try {
        const updateData = await window.electronAPI.checkForUpdate();
        if (updateData.error) {
            showUpdateError(updateData.error);
            return;
        }
        const currentVersion = await window.electronAPI.getAppVersion();
        document.getElementById('currentVersionText').textContent = currentVersion;
        if (updateData.version && compareVersions(updateData.version, currentVersion) > 0) {
            showUpdateAvailable(updateData);
        } else {
            showNoUpdate();
        }
    } catch (error) {
        showUpdateError(t('检查更新失败，请检查网络连接'));
    }
}

function showUpdateAvailable(updateData) {
    document.getElementById('updateStatus').style.display = 'none';
    document.getElementById('updateInfo').style.display = 'block';
    document.getElementById('updateAvailable').style.display = 'block';
    document.getElementById('noUpdate').style.display = 'none';
    document.getElementById('updateError').style.display = 'none';

    document.getElementById('newVersion').textContent = updateData.version;

    const releaseNotes = document.getElementById('releaseNotes');
    if (updateData.releaseNotes) {
        releaseNotes.innerHTML = `<h4>${t('更新内容：')}</h4>${updateData.releaseNotes}`;
    } else {
        releaseNotes.innerHTML = '<p>' + t('本次更新包含功能改进和错误修复') + '</p>';
    }

    // 重置下载状态
    resetDownloadUI();

    // "自动更新"按钮
    document.getElementById('autoUpdateBtn').onclick = () => {
        if (updateData.directdownloadUrl) {
            startAutoUpdate(updateData.directdownloadUrl);
        } else {
            showToast('error', t('无自动更新链接'), t('该版本暂不支持自动更新，请使用手动更新。'));
        }
    };

    // 如果没有 directdownloadUrl，禁用自动更新按钮
    if (!updateData.directdownloadUrl) {
        const autoBtn = document.getElementById('autoUpdateBtn');
        autoBtn.style.opacity = '0.5';
        autoBtn.style.cursor = 'not-allowed';
        autoBtn.title = t('该版本暂不支持自动更新');
    }

    // "手动更新"按钮
    document.getElementById('manualUpdateBtn').onclick = () => {
        if (updateData.downloadUrl) {
            window.electronAPI.openExternal(updateData.downloadUrl);
        }
    };
}

// 重置下载 UI 状态
function resetDownloadUI() {
    downloadAbortController = null;
    downloadedFilePath = null;
    currentDownloadUrl = null;
    clearDownloadTimeout();
    document.getElementById('downloadProgress').style.display = 'none';
    document.getElementById('updateButtons').style.display = 'flex';
    document.getElementById('releaseNotes').style.display = '';
    document.getElementById('progressBarFill').style.width = '0%';
    document.getElementById('downloadPercent').textContent = '0%';
    document.getElementById('downloadSpeed').textContent = t('准备下载...');
    document.getElementById('downloadStatus').textContent = t('正在连接服务器...');
    // 恢复取消按钮样式
    const cancelBtn = document.getElementById('cancelDownloadBtn');
    cancelBtn.innerHTML = '<i class="fas fa-times"></i> ' + t('取消下载');
    cancelBtn.style.background = 'linear-gradient(135deg, #999, #777)';
    cancelBtn.style.display = '';
}

// 清除下载超时计时器
function clearDownloadTimeout() {
    if (downloadProgressTimer) {
        clearTimeout(downloadProgressTimer);
        downloadProgressTimer = null;
    }
}

// 启动/重置 10 秒无进展超时检测
function resetDownloadTimeout() {
    clearDownloadTimeout();
    downloadProgressTimer = setTimeout(() => {
        if (!downloadAbortController) return; // 已取消
        window.electronAPI.removeDownloadProgressListener();
        downloadAbortController = null;
        document.getElementById('downloadStatus').textContent = t('下载无响应');
        document.getElementById('downloadSpeed').textContent = t('当前无法使用自动更新，请尝试手动更新或稍后再试。');
        document.getElementById('cancelDownloadBtn').innerHTML = '<i class="fas fa-redo"></i> ' + t('重试');
        document.getElementById('cancelDownloadBtn').style.background = 'linear-gradient(135deg, #e6a23c, #d4821f)';
        document.getElementById('cancelDownloadBtn').onclick = () => {
            resetDownloadUI();
            document.getElementById('releaseNotes').style.display = '';
            startAutoUpdate(currentDownloadUrl);
        };
    }, 10000);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// 格式化下载速度
function formatSpeed(bytesPerSecond) {
    if (bytesPerSecond === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k));
    return parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// 取消下载
function cancelDownload() {
    if (downloadAbortController) {
        downloadAbortController = null;
        window.electronAPI.removeDownloadProgressListener();
        resetDownloadUI();
        // 恢复更新信息显示
        document.getElementById('updateAvailable').style.display = 'block';
    }
}

// 自动更新：下载并安装
async function startAutoUpdate(directDownloadUrl) {
    currentDownloadUrl = directDownloadUrl;
    // 隐藏按钮，显示进度条
    document.getElementById('updateButtons').style.display = 'none';
    document.getElementById('downloadProgress').style.display = 'block';
    document.getElementById('releaseNotes').style.display = 'none';
    document.getElementById('downloadStatus').textContent = t('正在连接服务器...');

    // 绑定取消按钮
    document.getElementById('cancelDownloadBtn').onclick = cancelDownload;

    // 启动 10 秒无进展超时检测
    resetDownloadTimeout();

    // 注册下载进度监听
    window.electronAPI.onDownloadProgress((data) => {
        if (!downloadAbortController) return; // 已取消

        // 每次收到进度数据，重置超时计时器
        resetDownloadTimeout();

        const percent = data.percent || 0;
        document.getElementById('progressBarFill').style.width = percent + '%';
        document.getElementById('downloadPercent').textContent = percent + '%';
        document.getElementById('downloadSpeed').textContent =
            formatSpeed(data.speed) + '  |  ' + formatFileSize(data.downloaded) +
            (data.total > 0 ? ' / ' + formatFileSize(data.total) : '');
        document.getElementById('downloadStatus').textContent =
            t('正在下载... ') + formatFileSize(data.downloaded) +
            (data.total > 0 ? ' / ' + formatFileSize(data.total) : '');
    });

    try {
        downloadAbortController = {}; // 标记下载中
        const result = await window.electronAPI.downloadUpdate(directDownloadUrl);

        if (!downloadAbortController) return; // 用户取消

        clearDownloadTimeout();
        window.electronAPI.removeDownloadProgressListener();

        if (result.success) {
            downloadedFilePath = result.filePath;
            // 下载完成
            document.getElementById('downloadStatus').textContent = t('下载完成，正在启动安装程序...');
            document.getElementById('downloadSpeed').textContent = t('下载完成');
            document.getElementById('cancelDownloadBtn').style.display = 'none';

            // 短暂延迟让用户看到完成状态
            setTimeout(() => {
                window.electronAPI.runInstaller(downloadedFilePath);
                // 延迟退出应用，让安装程序有时间启动
                setTimeout(() => {
                    window.electronAPI.quitApp();
                }, 1000);
            }, 800);
        } else {
            showDownloadError(result.error || t('下载失败'));
        }
    } catch (error) {
        clearDownloadTimeout();
        window.electronAPI.removeDownloadProgressListener();
        showDownloadError(t('下载失败：') + (error.message || t('网络错误')));
    }
}

// 下载失败处理
function showDownloadError(message) {
    downloadAbortController = null;
    document.getElementById('downloadStatus').textContent = t('下载失败');
    document.getElementById('downloadSpeed').textContent = message;
    document.getElementById('cancelDownloadBtn').textContent = t('重新下载');
    document.getElementById('cancelDownloadBtn').innerHTML = '<i class="fas fa-redo"></i> ' + t('重新下载');
    document.getElementById('cancelDownloadBtn').style.background = 'linear-gradient(135deg, #e6a23c, #d4821f)';
    document.getElementById('cancelDownloadBtn').onclick = () => {
        // 恢复并重试
        resetDownloadUI();
        document.getElementById('releaseNotes').style.display = '';
        startAutoUpdate(currentDownloadUrl);
    };
}

function showNoUpdate() {
    document.getElementById('updateStatus').style.display = 'none';
    document.getElementById('updateInfo').style.display = 'block';
    document.getElementById('updateAvailable').style.display = 'none';
    document.getElementById('noUpdate').style.display = 'block';
    document.getElementById('updateError').style.display = 'none';
}
function showUpdateError(message) {
    document.getElementById('updateStatus').style.display = 'none';
    document.getElementById('updateInfo').style.display = 'block';
    document.getElementById('updateAvailable').style.display = 'none';
    document.getElementById('noUpdate').style.display = 'none';
    document.getElementById('updateError').style.display = 'block';
    document.getElementById('errorMessage').textContent = message;
}
// 版本比较函数
function compareVersions(a, b) {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aVal = aParts[i] || 0;
        const bVal = bParts[i] || 0;
        if (aVal > bVal) return 1;
        if (aVal < bVal) return -1;
    }
    return 0;
}

// 启动时自动静默检查更新
async function autoCheckUpdateSilent() {
    try {
        const updateData = await window.electronAPI.checkForUpdate();
        if (updateData.error) return;
        const currentVersion = await window.electronAPI.getAppVersion();
        if (updateData.version && compareVersions(updateData.version, currentVersion) > 0) {
            modalManager.openModal('updateOverlay');
            setTimeout(() => {
                document.getElementById('updateModal').classList.add('show');
            }, 10);
            document.getElementById('updateStatus').style.display = 'none';
            document.getElementById('updateInfo').style.display = 'block';
            showUpdateAvailable(updateData);
        } else {
            showToast('success', t('[自动更新]已是最新版本'), t('当前版本 {0} 已是最新，暂无更新。', currentVersion));
        }
    } catch (error) {
        // 网络错误静默忽略
    }
}
