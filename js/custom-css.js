// ==========================================
// 自定义 CSS 系统 (替代旧版主题商店)
// ==========================================
const CustomCSS = {

    init() {
        const saved = localStorage.getItem('mq_custom_css');
        const tag = document.getElementById('custom-css');
        const ta = document.getElementById('customCssInput');

        if (saved) {
            tag.textContent = saved;
            if (ta) ta.value = saved;
        }

        this.renderPresets();
        this.updateStatus();

        document.getElementById('applyCustomCssBtn').addEventListener('click', () => this.apply());
        document.getElementById('resetCustomCssBtn').addEventListener('click', () => this.reset());

        // 监听 textarea 改动，更新状态提示
        if (ta) {
            ta.addEventListener('input', () => this.updateStatus());
        }
    },

    apply() {
        const ta = document.getElementById('customCssInput');
        const css = ta.value.trim();

        // 空输入 = 等同重置
        if (!css) {
            this.reset();
            return;
        }

        // 弹出 Beta 警告模态框，由用户确认后再实际注入
        this._showBetaModal(() => {
            // 用户确认后执行注入
            const tag = document.getElementById('custom-css');
            tag.textContent = css;

            const hasImport = /@import\s+url\(/.test(css);
            localStorage.setItem('mq_custom_css', css);
            this.syncToFloat();
            this.updateStatus();

            if (hasImport) {
                showToast('success', t('已应用'), t('自定义 CSS 已生效（外部字体可能需稍等加载）'));
            } else {
                showToast('success', t('已应用'), t('自定义 CSS 已生效'));
            }
        });
    },

    // Beta 警告模态框（10 秒倒计时后按钮才可点击）
    _showBetaModal(onConfirm) {
        const overlay = document.getElementById('cssBetaOverlay');
        const modal = document.getElementById('cssBetaModal');
        const confirmBtn = document.getElementById('btnConfirmCss');
        const cancelBtn = document.getElementById('btnCancelCss');
        const countdownEl = document.getElementById('cssCountdown');

        let countdown = 10;
        let timer = null;
        let resolved = false;

        const cleanup = () => {
            if (timer) { clearInterval(timer); timer = null; }
            overlay.classList.remove('show');
            modal.classList.remove('show');
        };

        const doConfirm = () => {
            if (resolved) return;
            resolved = true;
            cleanup();
            onConfirm();
        };

        const doCancel = () => {
            if (resolved) return;
            resolved = true;
            cleanup();
        };

        // 倒计时
        confirmBtn.disabled = true;
        confirmBtn.style.opacity = '0.5';
        countdownEl.textContent = countdown;

        // 重置状态（支持重复打开）
        const hintEl = document.getElementById('cssCountdownHint');
        if (hintEl) hintEl.style.display = '';

        timer = setInterval(() => {
            countdown--;
            countdownEl.textContent = countdown;
            if (countdown <= 0) {
                clearInterval(timer);
                timer = null;
                if (hintEl) hintEl.style.display = 'none';
                confirmBtn.disabled = false;
                confirmBtn.style.opacity = '1';
            }
        }, 1000);

        // 事件绑定
        confirmBtn.onclick = doConfirm;
        cancelBtn.onclick = doCancel;
        overlay.onclick = doCancel;

        overlay.classList.add('show');
        modal.classList.add('show');
    },

    reset() {
        document.getElementById('custom-css').textContent = '';
        document.getElementById('customCssInput').value = '';
        localStorage.removeItem('mq_custom_css');
        this.syncToFloat();
        this.updateStatus();
        showToast('info', t('已重置'), t('自定义 CSS 已清除，恢复默认样式'));
    },

    // 同步主窗口关键 CSS 变量到悬浮窗
    syncToFloat() {
        if (!window.electronAPI || !window.electronAPI.updateFloatStyles) return;

        const style = getComputedStyle(document.documentElement);
        const get = (name, fallback) => (style.getPropertyValue(name) || fallback).trim();

        const styles = {
            btnBgColor:       get('--primary-color', '#409eff'),
            btnTextColor:     '#ffffff',
            nameColor:        get('--dark', '#1a1a1a'),
            nameHighlightColor: get('--primary-color', '#409eff'),
        };

        window.electronAPI.updateFloatStyles(styles);
    },

    // 更新状态指示
    updateStatus() {
        const el = document.getElementById('cssStatus');
        if (!el) return;
        const ta = document.getElementById('customCssInput');
        const hasContent = ta && ta.value.trim().length > 0;
        const isApplied = document.getElementById('custom-css').textContent.trim().length > 0;

        if (isApplied && hasContent) {
            // 检查 textarea 内容是否与已应用的一致
            const tagCss = document.getElementById('custom-css').textContent;
            if (ta.value.trim() === tagCss.trim()) {
                el.innerHTML = '<i class="fas fa-circle" style="color:#67c23a;font-size:8px;"></i> ' + t('已应用');
                el.style.color = '#67c23a';
            } else {
                el.innerHTML = '<i class="fas fa-exclamation-triangle" style="color:#e6a23c;font-size:10px;"></i> ' + t('有未应用的修改');
                el.style.color = '#e6a23c';
            }
        } else if (isApplied) {
            el.innerHTML = '<i class="fas fa-circle" style="color:#67c23a;font-size:8px;"></i> ' + t('已应用');
            el.style.color = '#67c23a';
        } else {
            el.innerHTML = t('未应用');
            el.style.color = '#999';
        }
    },

    renderPresets() {
        const container = document.getElementById('cssPresets');
        if (!container) return;
        container.innerHTML = '';

        CSS_PRESETS.forEach(p => {
            const btn = document.createElement('button');
            btn.className = 'control-btn';
            btn.style.cssText = 'font-size:12px;padding:6px 16px;';
            btn.textContent = p.name;
            btn.title = t('点击填入「{0}」预设\n\n{1}\n…\n\n填入后请点击"应用样式"生效', p.name, p.css.split('\n').slice(0, 6).join('\n'));
            btn.addEventListener('click', () => {
                document.getElementById('customCssInput').value = p.css;
                this.updateStatus();
                // 轻提示：提醒用户点击应用
                showToast('info', t('已填入'), t('「{0}」预设已加载，请点击"应用样式"生效', p.name));
            });
            container.appendChild(btn);
        });
    }
};
// ==========================================
