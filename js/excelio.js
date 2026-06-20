// --- 导出历史记录功能 ---
document.getElementById('exportHistoryBtn').addEventListener('click', () => {
    if (state.history.length === 0) {
        showToast('warning', t('无法导出'), t('当前没有历史记录'));
        return;
    }
    document.getElementById('exportOverlay').classList.add('show');
    document.getElementById('exportModal').classList.add('show');
});

document.getElementById('btnExportCancel').addEventListener('click', () => {
    document.getElementById('exportOverlay').classList.remove('show');
    document.getElementById('exportModal').classList.remove('show');
});

document.getElementById('btnExportConfirm').addEventListener('click', () => {
    const expPerson = document.getElementById('expPerson').checked;
    const expGroup = document.getElementById('expGroup').checked;
    const expBatch = document.getElementById('expBatch').checked;

    if (!expPerson && !expGroup && !expBatch) {
        showToast('warning', t('提示'), t('请至少选择一种导出类型'));
        return;
    }

    const exportData = [];
    state.history.forEach(item => {
        const isBatch = item.name.startsWith('[批量]');
        // 判断是否为小组（包含括号）
        const isGroup = !isBatch && item.name.includes('(') && item.name.includes(')');
        const isPerson = !isBatch && !isGroup;

        if ((isBatch && expBatch) || (isGroup && expGroup) || (isPerson && expPerson)) {
            let type = isBatch ? '批量点名' : (isGroup ? '小组点名' : '个人点名');
            exportData.push({
                '抽取时间': item.time,
                '点名模式': type,
                '抽取结果': item.name.replace('[批量] ', '') // 清理一下前缀让表格更好看
            });
        }
    });

    if (exportData.length === 0) {
        showToast('info', t('无数据'), t('所选类型下没有历史记录'));
        return;
    }

    // 调用 SheetJS 生成并下载 Excel
    const ws = XLSX.utils.json_to_sheet(exportData);
    // 自动调整列宽
    ws['!cols'] = [{ wch: 22 }, { wch: 12 }, { wch: 40 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "点名记录");
    XLSX.writeFile(wb, `点名历史记录_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
    
    document.getElementById('exportOverlay').classList.remove('show');
    document.getElementById('exportModal').classList.remove('show');
    showToast('success', t('导出成功'), t('Excel 文件已开始下载'));
});

// --- 导入名单功能 --
// --- Excel 名单导入功能 ---
let tempXlsxData = []; // 临时存放解析好的 JSON

document.getElementById('xlsxFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            // 获取第一个工作表
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // 将表格转换为 JSON 数组（第一行为 Key）
            tempXlsxData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
            
            if (tempXlsxData.length === 0) {
                showToast('error', t('文件为空'), t('Excel文件中没有读取到有效数据行'));
                return;
            }

            // 获取表头（列名）
            const headers = Object.keys(tempXlsxData[0]);
            
            const nameColSelect = document.getElementById('xlsxNameCol');
            const groupColSelect = document.getElementById('xlsxGroupCol');
            
            // 填充下拉框
            nameColSelect.innerHTML = headers.map(h => `<option value="${h}">${h}</option>`).join('');
            groupColSelect.innerHTML = `<option value="">${t('-- 全员不分组 --')}</option>` + headers.map(h => `<option value="${h}">${h}</option>`).join('');
            
            // 智能预选：根据中文关键词自动猜测列名
            const guessName = headers.find(h => h.includes('名') || h.toLowerCase().includes('name'));
            const guessGroup = headers.find(h => h.includes('组') || h.toLowerCase().includes('group'));
            if (guessName) nameColSelect.value = guessName;
            if (guessGroup) groupColSelect.value = guessGroup;

            // 默认名单名使用文件名
            document.getElementById('xlsxListName').value = file.name.replace(/\.[^/.]+$/, "");

            // 弹出配置窗口
            document.getElementById('xlsxOverlay').classList.add('show');
            document.getElementById('xlsxModal').classList.add('show');
        } catch (error) {
            showToast('error', t('解析失败'), t('无法读取 Excel 文件，请确保文件没有被加密损坏'));
            console.error(error);
        }
    };
    reader.readAsArrayBuffer(file);
    // 重置 input 防止同名文件无法再次触发 change
    e.target.value = ''; 
});

document.getElementById('btnXlsxCancel').addEventListener('click', () => {
    document.getElementById('xlsxOverlay').classList.remove('show');
    document.getElementById('xlsxModal').classList.remove('show');
    tempXlsxData = [];
});

document.getElementById('btnXlsxConfirm').addEventListener('click', () => {
    const listName = document.getElementById('xlsxListName').value.trim() || t('未命名Excel名单');
    const nameCol = document.getElementById('xlsxNameCol').value;
    const groupCol = document.getElementById('xlsxGroupCol').value;

    if (!nameCol) {
        showToast('warning', t('参数缺失'), t('必须指定【姓名】所在的列！'));
        return;
    }

    const parsedGroups = new Map();
    const namesList = [];

    // 开始格式化数据
    tempXlsxData.forEach(row => {
        const name = String(row[nameCol] || '').trim();
        if (!name) return; // 跳过空行

        const group = groupCol ? (String(row[groupCol] || '').trim() || '未分组') : '未分组';

        if (!parsedGroups.has(group)) {
            parsedGroups.set(group, []);
        }
        // 防止同组内有完全重名的人
        if (!parsedGroups.get(group).includes(name)) {
            parsedGroups.get(group).push(name);
        }
        namesList.push(name);
    });

    const uniqueNames = [...new Set(namesList)];

    if (uniqueNames.length === 0) {
        showToast('error', t('导入失败'), t('未提取到任何有效的姓名'));
        return;
    }

    // 生成新的名单对象并直接入库
    const newList = {
        id: Date.now().toString(),
        name: listName,
        names: uniqueNames,
        originalNames: uniqueNames,
        groups: Array.from(parsedGroups.entries()),
        groupNames: Array.from(parsedGroups.keys()),
        photoPath: null,
        timestamp: new Date().toLocaleString()
    };

    state.allLists.push(newList);
    saveListsToStorage();

    renderSavedLists();
    applySwitchListBtnVisibility();
    switchList(newList.id); // 直接切换到这个新名单
    
    showToast('success', t('导入并保存成功'), t('名单 "{0}" ({1}人) 已载入库中！', listName, uniqueNames.length));

    document.getElementById('xlsxOverlay').classList.remove('show');
    document.getElementById('xlsxModal').classList.remove('show');
    tempXlsxData = [];
});