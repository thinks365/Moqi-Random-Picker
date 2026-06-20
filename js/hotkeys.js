// ── 快捷键功能 (重构版: 5方案上限, 模态框捕获, 总开关控制) ──
const MAX_SCHEMES = 5;
let capturingIndex = -1;
let captureModal = null;
let captureResolve = null;

function renderHotkeySchemes() {
    const container = document.getElementById('hotkeySchemesContainer');
    const countEl = document.getElementById('hkSchemeCount');
    const addBtn = document.getElementById('hkAddSchemeBtn');
    const enabledUI = document.getElementById('hotkeyEnabledUI');
    const disabledHint = document.getElementById('hotkeyDisabledHint');
    if (!container) return;

    window.electronAPI.getHotkeySchemes().then(({ enabled, schemes: raw }) => {
        const schemes = Array.isArray(raw) ? raw : [];
        document.getElementById('hotkeyEnable').checked = enabled;
        toggleHotkeyUI(enabled);

        if (enabled) {
            // 只显示已设置的非空方案，记录原数组索引
            const activeSchemes = [];
            for (let i = 0; i < schemes.length; i++) {
                if (schemes[i] && schemes[i].trim()) {
                    activeSchemes.push({ val: schemes[i], originalIndex: i });
                }
            }
            countEl.textContent = `(${activeSchemes.length}/${MAX_SCHEMES})`;
            container.innerHTML = '';
            activeSchemes.forEach((item, i) => {
                const div = document.createElement('div');
                div.className = 'hotkey-scheme-card';
                div.innerHTML = `
                    <span class="scheme-index">${i + 1}</span>
                    <div class="scheme-key" data-index="${item.originalIndex}" title="${t('点击编辑')}">
                        ${item.val}
                    </div>
                    <div class="scheme-actions">
                        <button class="hk-btn hk-btn-edit" data-index="${item.originalIndex}" title="${t('编辑快捷键')}">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="hk-btn hk-btn-delete" data-index="${item.originalIndex}" title="${t('清除快捷键')}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;
                container.appendChild(div);
            });
            addBtn.disabled = activeSchemes.length >= MAX_SCHEMES;
            addBtn.style.display = activeSchemes.length >= MAX_SCHEMES ? 'none' : 'inline-flex';
            bindHotkeyCardEvents();
        }
    });
}

function bindHotkeyCardEvents() {
    document.querySelectorAll('.hotkey-scheme-card .scheme-key').forEach(el => {
        el.addEventListener('click', () => {
            const idx = parseInt(el.dataset.index);
            startHotkeyCapture(idx);
        });
    });
    document.querySelectorAll('.hk-btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index);
            startHotkeyCapture(idx);
        });
    });
    document.querySelectorAll('.hk-btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index);
            clearScheme(idx);
        });
    });
}

function toggleHotkeyUI(enabled) {
    const enabledUI = document.getElementById('hotkeyEnabledUI');
    const disabledHint = document.getElementById('hotkeyDisabledHint');
    if (enabled) {
        enabledUI.style.display = 'block';
        disabledHint.style.display = 'none';
    } else {
        enabledUI.style.display = 'none';
        disabledHint.style.display = 'block';
    }
}

function clearScheme(index) {
    window.electronAPI.getHotkeySchemes().then(({ enabled, schemes: raw }) => {
        const schemes = Array.isArray(raw) ? [...raw] : Array(MAX_SCHEMES).fill('');
        schemes[index] = '';
        saveHotkeySchemes(schemes).then(() => {
            renderHotkeySchemes();
            showToast('info', t('已清除'), t('方案 {0} 的快捷键已清除', index + 1));
        });
    });
}

async function startHotkeyCapture(index) {
    const { enabled, schemes: raw } = await window.electronAPI.getHotkeySchemes();
    const schemes = Array.isArray(raw) ? [...raw] : Array(MAX_SCHEMES).fill('');
    const currentVal = schemes[index] || '';

    capturingIndex = index;
    showToast('info', t('快捷键录入'), t('请按下您要使用的组合键...'));

    captureModal = showModal({
        title: t('快捷键录入'),
        bodyHTML: `
            <div class="hotkey-capture-area">
                <p class="capture-prompt">${t('请按下快捷键以录入方案 {0}', index + 1)}</p>
                <p class="capture-hint">${t('支持 Ctrl、Shift、Alt、Win/Cmd 组合键或功能键')}</p>
                <div class="capture-display" id="captureDisplay">
                    ${currentVal || t('等待按键...')}
                </div>
            </div>
        `,
        confirmText: t('确认 (√)'),
        cancelText: t('取消 (×)'),
        onConfirm: () => {
            const display = document.getElementById('captureDisplay');
            const captured = display ? display.textContent.trim() : '';
            document.removeEventListener('keydown', captureHandler);
            if (captured && captured !== t('等待按键...')) {
                if (captured !== currentVal) {
                    schemes[capturingIndex] = captured;
                    saveHotkeySchemes(schemes).then(() => {
                        renderHotkeySchemes();
                        showToast('success', t('设置成功'), t('快捷键已设置为: {0}', captured));
                    });
                }
            }
            capturingIndex = -1;
            captureModal = null;
        },
        onCancel: () => {
            document.removeEventListener('keydown', captureHandler);
            capturingIndex = -1;
            captureModal = null;
            showToast('info', t('已取消'), t('取消录入快捷键'));
        }
    });
    document.addEventListener('keydown', captureHandler);
}

function captureHandler(e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.key === 'Escape') {
        document.removeEventListener('keydown', captureHandler);
        capturingIndex = -1;
        if (captureModal) { captureModal.close(); captureModal = null; }
        return;
    }

    if (e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt' || e.key === 'Meta') return;

    const parts = [];
    if (e.ctrlKey) parts.push('Ctrl');
    if (e.shiftKey) parts.push('Shift');
    if (e.altKey) parts.push('Alt');
    if (e.metaKey) parts.push('Command');

    let key = e.key;
    const specialMap = {
        ' ': 'Space',
        'ArrowUp': 'Up', 'ArrowDown': 'Down', 'ArrowLeft': 'Left', 'ArrowRight': 'Right',
        'Escape': 'Escape', 'Enter': 'Enter', 'Tab': 'Tab',
        'Backspace': 'Backspace', 'Delete': 'Delete', 'Insert': 'Insert',
        'Home': 'Home', 'End': 'End', 'PageUp': 'PageUp', 'PageDown': 'PageDown',
        'F1':'F1','F2':'F2','F3':'F3','F4':'F4','F5':'F5','F6':'F6',
        'F7':'F7','F8':'F8','F9':'F9','F10':'F10','F11':'F11','F12':'F12',
        'AudioVolumeUp':'VolumeUp','AudioVolumeDown':'VolumeDown','AudioVolumeMute':'VolumeMute',
        'MediaTrackNext':'MediaNextTrack','MediaTrackPrevious':'MediaPreviousTrack',
        'MediaStop':'MediaStop','MediaPlayPause':'MediaPlayPause',
        'BrowserBack':'BrowserBack','BrowserForward':'BrowserForward',
        'BrowserRefresh':'BrowserRefresh','BrowserStop':'BrowserStop',
        'BrowserSearch':'BrowserSearch','BrowserFavorites':'BrowserFavorites',
        'BrowserHome':'BrowserHome'
    };
    if (specialMap[key]) {
        key = specialMap[key];
    } else if (key.length === 1) {
        key = key.toUpperCase();
    } else {
        showToast('warning', t('无效快捷键'), t('按键 "{0}" 暂不支持作为全局快捷键，请选择其他有效组合键。', key));
        return;
    }

    const allowedFunctionKeys = [
        'F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12',
        'PageUp','PageDown','Up','Down','Left','Right','Escape',
        'VolumeUp','VolumeDown','VolumeMute','MediaNextTrack','MediaPreviousTrack',
        'MediaStop','MediaPlayPause','BrowserBack','BrowserForward','BrowserRefresh',
        'BrowserStop','BrowserSearch','BrowserFavorites','BrowserHome'
    ];
    if (parts.length === 0 && !allowedFunctionKeys.includes(key)) {
        showToast('warning', t('无效快捷键'), t('字母、数字、符号等常用键必须与 Ctrl、Alt 或 Shift 组合使用，以免干扰正常输入。'));
        return;
    }

    const accelerator = [...parts, key].join('+');
    const display = document.getElementById('captureDisplay');
    if (display) {
        display.textContent = accelerator;
        display.classList.add('captured');
    }
}

async function saveHotkeySchemes(schemes) {
    const enabled = document.getElementById('hotkeyEnable').checked;
    const normalized = Array(MAX_SCHEMES).fill('').map((_, i) => schemes[i] || '');
    await window.electronAPI.updateHotkeySchemes({ enabled, schemes: normalized });
}

// 初始化: 总开关事件 & 添加方案按钮
document.addEventListener('DOMContentLoaded', () => {
    const enableCheck = document.getElementById('hotkeyEnable');
    if (enableCheck) {
        enableCheck.addEventListener('change', async () => {
            const enabled = enableCheck.checked;
            toggleHotkeyUI(enabled);
            if (enabled) {
                const { schemes: raw } = await window.electronAPI.getHotkeySchemes();
                const schemes = Array.isArray(raw) ? raw : Array(MAX_SCHEMES).fill('');
                await saveHotkeySchemes(schemes);
                renderHotkeySchemes();
            } else {
                // 仅关闭总开关，保留已设置的方案
                await window.electronAPI.updateHotkeySchemes({ enabled: false, schemes: [] });
            }
        });
    }
    const addBtn = document.getElementById('hkAddSchemeBtn');
    if (addBtn) {
        addBtn.addEventListener('click', async () => {
            const { enabled, schemes: raw } = await window.electronAPI.getHotkeySchemes();
            const schemes = Array.isArray(raw) ? [...raw] : Array(MAX_SCHEMES).fill('');
            const filled = schemes.filter(s => s && s.trim()).length;
            if (filled >= MAX_SCHEMES) {
                showToast('warning', t('已达上限'), t('快捷键方案数量上限为 {0} 个', MAX_SCHEMES));
                return;
            }
            const emptyIdx = schemes.findIndex(s => !s || !s.trim());
            if (emptyIdx >= 0) {
                startHotkeyCapture(emptyIdx);
            }
        });
    }
});
// ── 快捷键功能结束 ──
