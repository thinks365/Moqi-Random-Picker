// ==========================================
// 工具模块：帮助文档 / 照片数据库 / 小组解析 / BetaBadge
// ==========================================

// ── 帮助文档模态框 ──
async function openHelpModal(docName) {
    const modal = showModal({
        title: t('加载中...'),
        bodyHTML: '<div style="text-align:center;padding:40px;color:#999;"><i class="fas fa-spinner fa-spin fa-2x"></i><br><br>' + t('正在加载帮助文档...') + '</div>',
        confirmText: t('关闭'),
        hideCancel: true,
        closeOnOverlay: true,
        closeOnEscape: true
    });
    try {
        const result = await window.electronAPI.readDocFile(docName + '.md');
        if (result.error) {
            modal.setTitle(t('错误'));
            modal.setBody(`<div style="text-align:center;padding:20px;color:#f56c6c;"><i class="fas fa-exclamation-circle fa-2x"></i><br><br>${result.error}</div>`);
            return;
        }
        // 使用 marked 渲染 Markdown
        const html = marked.parse(result.content);
        const titleMatch = result.content.match(/^#\s+(.+)/m);
        const docTitle = titleMatch ? titleMatch[1] : t('帮助文档');
        modal.setTitle(docTitle);
        modal.setBody(`<div class="help-modal-body">${html}</div>`);
    } catch (e) {
        modal.setTitle(t('错误'));
        modal.setBody(`<div style="text-align:center;padding:20px;color:#f56c6c;"><i class="fas fa-exclamation-circle fa-2x"></i><br><br>${t('无法加载帮助文档：')}${e.message}</div>`);
    }
}

// ── 照片 IndexedDB ──
async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('photos')) {
                db.createObjectStore('photos', { keyPath: 'name' });
            }
        };
        request.onsuccess = function(event) {
            db = event.target.result;
            resolve();
        };
        request.onerror = reject;
    });
}

async function loadPhotoFolder(folderPath) {
    if (!folderPath) return;

    const result = await window.electronAPI.scanPhotoFolder(folderPath);
    if (result.error) {
        showToast('error', t('读取照片失败'), result.error);
        return;
    }

    state.currentPhotoPath = folderPath;
    state.photos = result.images; // 仅存储文件名数组

    // UI 更新
    updateStatus('photos', t('{0}张照片 (本地链接)', state.photos.length));
    const pathDisplay = document.getElementById('currentPhotoPathDisplay');
    if(pathDisplay) {
        pathDisplay.style.display = 'block';
        pathDisplay.textContent = folderPath;
    }
    document.getElementById('clearPhotosBtn').style.display = 'inline-block';

    // 保存路径到 LocalStorage (如果是默认名单)
    if (state.currentListId === 'default') {
        localStorage.setItem(storageKeys.PHOTO_PATH, folderPath);
    }
}

// ── 小组数据解析 ──
function parseGroupData(text) {
    const groups = new Map();
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    for (const line of lines) {
        const match = line.match(/^(.*?)\[(.*?)\]$/);
        if (match) {
            const name = match[1].trim();
            const group = match[2].trim();
            if (!groups.has(group)) {
                groups.set(group, []);
            }
            groups.get(group).push(name);
        } else {
            const name = line.trim();
            if (!groups.has('未分组')) {
                groups.set('未分组', []);
            }
            groups.get('未分组').push(name);
        }
    }
    return groups;
}

// ── Beta 徽章 Web Component ──
class BetaBadge extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <span style="display:inline-flex;padding:1px;border-radius:4px;background:linear-gradient(to right, #60a5fa, #a855f7);box-shadow:0 1px 2px rgba(0,0,0,0.1);vertical-align:middle;margin-left:4px;">
                <span style="display:flex;align-items:center;background:#fff;border-radius:3px;padding:0.5px 6px;">
                    <span style="background:linear-gradient(to right, #60a5fa, #a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-size:10px;font-weight:700;letter-spacing:0.05em;line-height:1;">beta</span>
                </span>
            </span>`;
    }
}
customElements.define('beta-badge', BetaBadge);
