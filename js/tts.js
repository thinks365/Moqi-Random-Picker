// ========== 语音播报 (TTS) 功能 ==========
function buildTTSText(name) {
    const template = state.tts.template || '%name%';
    return template.replace(/%name%/g, name);
}
function countTTSEffectiveChars(template) {
    // %name% 算 1 个有效字
    const withoutVars = template.replace(/%name%/g, '_');
    return withoutVars.length;
}
function countTTSVars(template) {
    const matches = template.match(/%name%/g);
    return matches ? matches.length : 0;
}
function speakResult(name) {
    if (!state.tts.enabled || !name) return;
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const text = buildTTSText(name);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = state.tts.rate;
    utterance.pitch = state.tts.pitch;
    utterance.volume = state.tts.volume / 100;
    if (state.tts.voice) {
        const voices = window.speechSynthesis.getVoices();
        const match = voices.find(v => v.voiceURI === state.tts.voice);
        if (match) utterance.voice = match;
    }
    window.speechSynthesis.speak(utterance);
}
function speakBatchResults(results) {
    if (!state.tts.enabled || !results || results.length === 0) return;
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    // 用顿号连接所有姓名，替换 %name% 后一次性播报
    const joinedNames = results.join('、');
    const text = buildTTSText(joinedNames);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = state.tts.rate;
    utterance.pitch = state.tts.pitch;
    utterance.volume = state.tts.volume / 100;
    if (state.tts.voice) {
        const voices = window.speechSynthesis.getVoices();
        const match = voices.find(v => v.voiceURI === state.tts.voice);
        if (match) utterance.voice = match;
    }
    window.speechSynthesis.speak(utterance);
}
function toggleTTS() {
    state.tts.enabled = document.getElementById('ttsEnabled').checked;
    localStorage.setItem(storageKeys.TTS_ENABLED, state.tts.enabled);
    document.getElementById('ttsSettingsPanel').style.display = state.tts.enabled ? 'block' : 'none';
}
function updateTTSRateLabel() {
    const val = parseFloat(document.getElementById('ttsRate').value);
    state.tts.rate = val;
    document.getElementById('ttsRateValue').textContent = val.toFixed(1) + 'x';
    localStorage.setItem(storageKeys.TTS_RATE, val);
}
function updateTTSPitchLabel() {
    const val = parseFloat(document.getElementById('ttsPitch').value);
    state.tts.pitch = val;
    document.getElementById('ttsPitchValue').textContent = val.toFixed(1);
    localStorage.setItem(storageKeys.TTS_PITCH, val);
}
function updateTTSVolumeLabel() {
    const val = parseInt(document.getElementById('ttsVolume').value);
    state.tts.volume = val;
    document.getElementById('ttsVolumeValue').textContent = val + '%';
    localStorage.setItem(storageKeys.TTS_VOLUME, val);
}
function updateTTSTemplate() {
    const input = document.getElementById('ttsTemplate');
    let raw = input.value;
    const varCount = countTTSVars(raw);
    const hintEl = document.getElementById('ttsTemplateHint');
    // 变量超限提示
    if (varCount > 3) {
        hintEl.textContent = t('%name% 最多出现{0}次，多余变量将被移除', 3);
        hintEl.style.display = 'inline';
        // 移除多余的 %name%
        let removed = 0;
        raw = raw.replace(/%name%/g, () => {
            removed++;
            return removed <= 3 ? '%name%' : '';
        });
        input.value = raw;
    } else {
        hintEl.style.display = 'none';
    }
    // 有效字数超限截断
    let effectiveChars = countTTSEffectiveChars(raw);
    if (effectiveChars > 50) {
        hintEl.textContent = t('有效字数已达50字上限，已截断');
        hintEl.style.display = 'inline';
        // 逐字截断到50有效字
        let result = '';
        let i = 0;
        while (i < raw.length) {
            if (raw.substring(i, i + 6) === '%name%') {
                if (countTTSEffectiveChars(result + '%name%') > 50) break;
                result += '%name%';
                i += 6;
            } else {
                if (countTTSEffectiveChars(result + raw[i]) > 50) break;
                result += raw[i];
                i++;
            }
        }
        raw = result;
        input.value = raw;
    } else {
        hintEl.style.display = 'none';
    }
    effectiveChars = countTTSEffectiveChars(raw);
    const finalVarCount = countTTSVars(raw);
    document.getElementById('ttsCharCount').textContent = effectiveChars;
    document.getElementById('ttsVarCount').textContent = finalVarCount;
    state.tts.template = raw || '%name%';
    localStorage.setItem(storageKeys.TTS_TEMPLATE, state.tts.template);
    updatePresetActive();
}
function insertNameVar() {
    const input = document.getElementById('ttsTemplate');
    const raw = input.value;
    const varCount = countTTSVars(raw);
    if (varCount >= 3) {
        showToast('warning', t('变量超限'), t('%name% 最多出现{0}次', 3));
        return;
    }
    const effectiveChars = countTTSEffectiveChars(raw);
    if (effectiveChars >= 50) {
        showToast('warning', t('字数超限'), t('有效字数已达50字上限'));
        return;
    }
    const cursorPos = input.selectionStart || input.value.length;
    const newVal = raw.slice(0, cursorPos) + '%name%' + raw.slice(cursorPos);
    const newEffective = countTTSEffectiveChars(newVal);
    if (newEffective > 50) {
        showToast('warning', t('字数超限'), t('插入后将超过50字上限'));
        return;
    }
    input.value = newVal;
    input.focus();
    input.setSelectionRange(cursorPos + 6, cursorPos + 6);
    updateTTSTemplate();
}
function applyTTSPreset(template) {
    const input = document.getElementById('ttsTemplate');
    input.value = template;
    updateTTSTemplate();
}
function updatePresetActive() {
    const current = state.tts.template;
    document.querySelectorAll('.tts-preset-btn').forEach(btn => {
        const preset = btn.getAttribute('onclick').match(/applyTTSPreset\('(.+)'\)/);
        if (preset && preset[1] === current) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}
function testTTS() {
    if (!window.speechSynthesis) {
        showToast('error', t('不支持'), t('当前环境不支持语音播报。'));
        return;
    }
    window.speechSynthesis.cancel();
    const testName = '张三';
    const text = buildTTSText(testName);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = state.tts.rate;
    utterance.pitch = state.tts.pitch;
    utterance.volume = state.tts.volume / 100;
    if (state.tts.voice) {
        const voices = window.speechSynthesis.getVoices();
        const match = voices.find(v => v.voiceURI === state.tts.voice);
        if (match) utterance.voice = match;
    }
    window.speechSynthesis.speak(utterance);
    showToast('info', t('测试播报'), t('正在播报: {0}', text));
}
function initTTSSettings() {
    const enabled = localStorage.getItem(storageKeys.TTS_ENABLED) === 'true';
    state.tts.enabled = enabled;
    document.getElementById('ttsEnabled').checked = enabled;
    document.getElementById('ttsSettingsPanel').style.display = enabled ? 'block' : 'none';
    const rate = parseFloat(localStorage.getItem(storageKeys.TTS_RATE));
    if (!isNaN(rate)) { state.tts.rate = rate; document.getElementById('ttsRate').value = rate; updateTTSRateLabel(); }
    const pitch = parseFloat(localStorage.getItem(storageKeys.TTS_PITCH));
    if (!isNaN(pitch)) { state.tts.pitch = pitch; document.getElementById('ttsPitch').value = pitch; updateTTSPitchLabel(); }
    const volume = parseInt(localStorage.getItem(storageKeys.TTS_VOLUME));
    if (!isNaN(volume)) { state.tts.volume = volume; document.getElementById('ttsVolume').value = volume; updateTTSVolumeLabel(); }
    else { state.tts.volume = 100; } // 首次使用默认 100%
    const savedVoice = localStorage.getItem(storageKeys.TTS_VOICE);
    if (savedVoice) state.tts.voice = savedVoice;
    const savedTemplate = localStorage.getItem(storageKeys.TTS_TEMPLATE);
    if (savedTemplate) {
        state.tts.template = savedTemplate;
        document.getElementById('ttsTemplate').value = savedTemplate;
    }
    updateTTSTemplate();
}
// ========== 语音播报结束 ==========
