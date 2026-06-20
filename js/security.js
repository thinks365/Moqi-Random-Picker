// ── 6位数字密码功能 ──

// SHA-256 加密辅助函数
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── PIN 输入组件 ──
function renderNumpad(containerId, onDigit, onDelete, onCancel) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const bottomLeft = onCancel ? 'cancel' : 'empty';
    const keys = ['1','2','3','4','5','6','7','8','9', bottomLeft, '0', 'delete'];
    container.innerHTML = keys.map(k => {
        if (k === 'empty') return '<div class="pin-numpad-key key-empty"></div>';
        if (k === 'cancel') return '<button class="pin-numpad-key key-cancel" data-key="cancel"><i class="fas fa-times"></i></button>';
        if (k === 'delete') return '<button class="pin-numpad-key key-delete" data-key="delete"><i class="fas fa-delete-left"></i></button>';
        return `<button class="pin-numpad-key" data-key="${k}">${k}</button>`;
    }).join('');
    container.querySelectorAll('.pin-numpad-key[data-key]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const key = btn.dataset.key;
            if (key === 'delete') { onDelete(); }
            else if (key === 'cancel') { onCancel(); }
            else { onDigit(key); }
        });
    });
    const inputHandler = (e) => {
        if (/^[0-9]$/.test(e.key)) onDigit(e.key);
        else if (e.key === 'Backspace' || e.key === 'Delete') onDelete();
        else if (e.key === 'Enter') {
            // Enter handled by calling context
        }
    };
    return {
        bindKeyboard: () => document.addEventListener('keydown', inputHandler),
        unbindKeyboard: () => document.removeEventListener('keydown', inputHandler)
    };
}

function renderPinIndicator(containerId, digits, maxLen) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const len = maxLen || 6;
    container.innerHTML = '';
    for (let i = 0; i < len; i++) {
        const dot = document.createElement('div');
        dot.className = 'pin-dot' + (i < digits.length ? ' filled' : '') + (i === digits.length ? ' active' : '');
        container.appendChild(dot);
    }
}

// ── 安全功能核心逻辑 ──

function initSecurity() {
    const savedHash = localStorage.getItem(storageKeys.PASSWORD_HASH);
    const savedScopes = localStorage.getItem(storageKeys.SECURITY_SCOPES);
    if (savedHash) {
        state.security.isSet = true;
        updateSecurityUI(true);
    } else {
        updateSecurityUI(false); // updateSecurityUI 内部已调用 initSetupNumpad()，此处不再重复调用
    }
    if (savedScopes) {
        state.security.scopes = JSON.parse(savedScopes);
        document.getElementById('scopeSettings').checked = state.security.scopes.settings;
        document.getElementById('scopeData').checked = state.security.scopes.data;
        document.getElementById('scopeReset').checked = state.security.scopes.reset;
    }
}

let _setupDigits = [];
let _setupConfirmDigits = [];
let _setupPhase = 'enter'; // 'enter' | 'confirm'
let _setupKb = null; // 保存上一次的键盘绑定，防止重复绑定

function initSetupNumpad() {
    // 先解绑之前的键盘监听，防止多次调用导致事件重复触发
    if (_setupKb) _setupKb.unbindKeyboard();
    _setupDigits = [];
    _setupConfirmDigits = [];
    _setupPhase = 'enter';
    const label = document.getElementById('pinSetupLabel');
    if (label) label.textContent = t('设置 6 位数字密码');
    renderPinIndicator('pinSetupIndicator', [], 6);
    const kb = renderNumpad('pinSetupNumpad',
        (d) => {
            if (_setupPhase === 'enter') {
                if (_setupDigits.length < 6) { _setupDigits.push(d); }
                renderPinIndicator('pinSetupIndicator', _setupDigits, 6);
                if (_setupDigits.length === 6) {
                    // 自动进入确认阶段
                    setTimeout(() => {
                        _setupPhase = 'confirm';
                        _setupConfirmDigits = [];
                        if (label) label.textContent = t('请再次输入 6 位数字密码确认');
                        renderPinIndicator('pinSetupIndicator', [], 6);
                    }, 400);
                }
            } else {
                if (_setupConfirmDigits.length < 6) { _setupConfirmDigits.push(d); }
                renderPinIndicator('pinSetupIndicator', _setupConfirmDigits, 6);
                if (_setupConfirmDigits.length === 6) {
                    finalizeSetup();
                }
            }
        },
        () => {
            if (_setupPhase === 'enter') {
                if (_setupDigits.length > 0) { _setupDigits.pop(); }
                renderPinIndicator('pinSetupIndicator', _setupDigits, 6);
            } else {
                if (_setupConfirmDigits.length > 0) { _setupConfirmDigits.pop(); }
                renderPinIndicator('pinSetupIndicator', _setupConfirmDigits, 6);
            }
        }
    );
    _setupKb = kb; // 保存引用，供下次调用时解绑
    if (kb) kb.bindKeyboard();
}

async function finalizeSetup() {
    const pin1 = _setupDigits.join('');
    const pin2 = _setupConfirmDigits.join('');
    if (pin1 !== pin2) {
        showToast('error', t('密码不一致'), t('两次输入的密码不一致，请重新设置'));
        _setupDigits = [];
        _setupConfirmDigits = [];
        _setupPhase = 'enter';
        const label = document.getElementById('pinSetupLabel');
        if (label) label.textContent = t('设置 6 位数字密码');
        renderPinIndicator('pinSetupIndicator', [], 6);
        return;
    }
    const hash = await sha256(pin1);
    localStorage.setItem(storageKeys.PASSWORD_HASH, hash);
    state.security.isSet = true;
    _setupDigits = [];
    _setupConfirmDigits = [];
    _setupPhase = 'enter';
    updateSecurityUI(true);
    showToast('success', t('密码设置成功'), t('6 位数字密码已生效'));
}

function updateSecurityUI(isSet) {
    const dot = document.getElementById('securityStatusDot');
    const text = document.getElementById('securityStatusText');
    const setupArea = document.getElementById('passwordSetupArea');
    const changeBtn = document.getElementById('btnChangePassword');
    if (isSet) {
        if (dot) { dot.className = 'status-indicator active'; }
        if (text) { text.textContent = t('密码已设置 (保护中)'); text.style.color = '#67c23a'; }
        if (setupArea) setupArea.style.display = 'none';
        if (changeBtn) changeBtn.style.display = 'inline-block';
    } else {
        if (dot) { dot.className = 'status-indicator inactive'; }
        if (text) { text.textContent = t('未设置密码'); text.style.color = '#909399'; }
        if (setupArea) setupArea.style.display = 'block';
        if (changeBtn) changeBtn.style.display = 'none';
        initSetupNumpad();
    }
}

// ── 密码验证 ──
function verifyPassword(scopeName) {
    return new Promise((resolve) => {
        if (!state.security.isSet) return resolve(true);
        if (scopeName && !state.security.scopes[scopeName]) return resolve(true);

        const overlay = document.getElementById('authOverlay');
        const modal = document.getElementById('authModal');
        const err = document.getElementById('authError');
        if (!overlay || !modal) return resolve(false);

        let digits = [];
        overlay.classList.add('show');
        modal.classList.add('show');
        renderPinIndicator('authPinIndicator', [], 6);
        if (err) err.textContent = '';

        const handleCancel = () => { closeAuth(); resolve(false); };

        const closeAuth = () => {
            overlay.classList.remove('show');
            modal.classList.remove('show');
            if (kb) kb.unbindKeyboard();
            document.removeEventListener('keydown', escHandler);
        };

        const kb = renderNumpad('authPinNumpad',
            (d) => {
                if (digits.length < 6) { digits.push(d); }
                renderPinIndicator('authPinIndicator', digits, 6);
                if (digits.length === 6) {
                    doVerify();
                }
            },
            () => {
                if (digits.length > 0) { digits.pop(); }
                renderPinIndicator('authPinIndicator', digits, 6);
            },
            handleCancel
        );
        if (kb) kb.bindKeyboard();

        const doVerify = async () => {
            const pin = digits.join('');
            const savedHash = localStorage.getItem(storageKeys.PASSWORD_HASH);
            const inputHash = await sha256(pin);
            if (inputHash === savedHash) {
                closeAuth();
                resolve(true);
            } else {
                if (err) err.textContent = t('密码错误，请重试');
                digits = [];
                renderPinIndicator('authPinIndicator', [], 6);
                showToast('error', t('密码校验失败'), t('密码错误，请重试'));
            }
        };

        const escHandler = (e) => {
            if (e.key === 'Escape') { handleCancel(); }
        };
        document.addEventListener('keydown', escHandler);
    });
}

// ── 修改密码流程 ──
let _changeDigits = [];
let _changeNewDigits = [];
let _changeConfirmDigits = [];
let _changeStep = 0; // 0=verify old, 1=enter new, 2=confirm new

function handleChangePassword() {
    _changeStep = 0;
    _changeDigits = [];
    _changeNewDigits = [];
    _changeConfirmDigits = [];
    const overlay = document.getElementById('authOverlay');
    const modal = document.getElementById('changePassModal');
    const label = document.getElementById('changePinStepLabel');
    const err = document.getElementById('changePinError');
    overlay.classList.add('show');
    modal.classList.add('show');
    if (label) label.textContent = t('请输入原 6 位数字密码');
    if (err) err.textContent = '';
    renderPinIndicator('changePinIndicator', [], 6);
    let kb = renderNumpad('changePinNumpad',
        (d) => {
            const curDigits = _changeStep === 0 ? _changeDigits : (_changeStep === 1 ? _changeNewDigits : _changeConfirmDigits);
            if (curDigits.length < 6) { curDigits.push(d); }
            renderPinIndicator('changePinIndicator', curDigits, 6);
            if (curDigits.length === 6) {
                changeNextStep();
            }
        },
        () => {
            const curDigits = _changeStep === 0 ? _changeDigits : (_changeStep === 1 ? _changeNewDigits : _changeConfirmDigits);
            if (curDigits.length > 0) { curDigits.pop(); }
            renderPinIndicator('changePinIndicator', curDigits, 6);
        }
    );
    if (kb) kb.bindKeyboard();
}

async function changeNextStep() {
    const label = document.getElementById('changePinStepLabel');
    const err = document.getElementById('changePinError');
    if (_changeStep === 0) {
        // 验证原密码
        const oldPin = _changeDigits.join('');
        const savedHash = localStorage.getItem(storageKeys.PASSWORD_HASH);
        const inputHash = await sha256(oldPin);
        if (inputHash !== savedHash) {
            if (err) err.textContent = t('原密码错误');
            _changeDigits = [];
            renderPinIndicator('changePinIndicator', [], 6);
            showToast('error', t('验证失败'), t('原密码错误'));
            return;
        }
        _changeStep = 1;
        _changeNewDigits = [];
        if (label) label.textContent = t('请输入新 6 位数字密码');
        if (err) err.textContent = '';
        renderPinIndicator('changePinIndicator', [], 6);
    } else if (_changeStep === 1) {
        _changeStep = 2;
        _changeConfirmDigits = [];
        if (label) label.textContent = t('请再次输入新密码确认');
        if (err) err.textContent = '';
        renderPinIndicator('changePinIndicator', [], 6);
    } else {
        // 确认新密码
        const newPin = _changeNewDigits.join('');
        const confirmPin = _changeConfirmDigits.join('');
        if (newPin !== confirmPin) {
            if (err) err.textContent = t('两次输入不一致');
            _changeConfirmDigits = [];
            renderPinIndicator('changePinIndicator', [], 6);
            showToast('error', t('不一致'), t('两次输入的密码不一致'));
            return;
        }
        const newHash = await sha256(newPin);
        localStorage.setItem(storageKeys.PASSWORD_HASH, newHash);
        closeChangeModal();
        showToast('success', t('成功'), t('密码修改成功'));
    }
}

function closeChangeModal() {
    const overlay = document.getElementById('authOverlay');
    const modal = document.getElementById('changePassModal');
    overlay.classList.remove('show');
    modal.classList.remove('show');
    _changeStep = 0;
    _changeDigits = [];
    _changeNewDigits = [];
    _changeConfirmDigits = [];
}

// 监听 Scope Checkbox 变化
function handleScopeChange(e, type) {
    if (!state.security.isSet) {
        e.preventDefault();
        e.target.checked = false;
        showToast('warning', t('提示'), t('请先设置密码，才能开启保护选项'));
        return;
    }
    state.security.scopes[type] = e.target.checked;
    localStorage.setItem(storageKeys.SECURITY_SCOPES, JSON.stringify(state.security.scopes));
}

// 绑定修改密码、scope变化、取消按钮事件
document.addEventListener('DOMContentLoaded', () => {
    const btnChange = document.getElementById('btnChangePassword');
    if (btnChange) btnChange.addEventListener('click', handleChangePassword);
    const btnChangeCancel = document.getElementById('btnChangeCancel');
    if (btnChangeCancel) btnChangeCancel.addEventListener('click', closeChangeModal);
    ['scopeSettings','scopeData','scopeReset'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', (e) => handleScopeChange(e, id.replace('scope','').toLowerCase()));
        }
    });
});
// ── 安全功能结束 ──
