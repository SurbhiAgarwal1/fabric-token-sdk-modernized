const API_BASE = 'http://localhost:8080';
let isProcessing = false;

async function updateBalances() {
    try {
        const response = await fetch(`${API_BASE}/wallet/balance`);
        const data = await response.json();
        
        document.getElementById('usd-balance').innerText = data['USD-Token'].toLocaleString();
        document.getElementById('eur-balance').innerText = data['EUR-Token'].toLocaleString();
    } catch (e) {
        console.error("fetch err:", e);
    }
}

async function triggerFlow(action) {
    if (isProcessing) return;
    
    isProcessing = true;
    const progress = document.getElementById('progress-bar');
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(b => b.disabled = true);
    
    addLog(`Running ${action}...`);
    progress.style.width = '50%';
    
    try {
        const response = await fetch(`${API_BASE}/token/${action}`, { method: 'POST' });
        const data = await response.json();
        
        progress.style.width = '100%';
        
        document.getElementById('zkp-time').innerText = formatMs(data.ZKPGenTime);
        document.getElementById('fabric-time').innerText = formatMs(data.FabricTime);
        document.getElementById('proof-size').innerText = `${(data.ProofSizeBytes / 1024).toFixed(1)} KB`;

        addLog(data.Details || "Done.", 'success');
        updateBalances();
    } catch (e) {
        addLog(`Error connecting to backend.`, 'error');
    } finally {
        setTimeout(() => {
            progress.style.width = '0%';
            buttons.forEach(b => b.disabled = false);
            isProcessing = false;
        }, 800);
    }
}

function formatMs(ns) {
    return `${Math.round(ns / 1000000)}ms`;
}

function addLog(msg, type = '') {
    const logs = document.getElementById('logs');
    const entry = document.createElement('p');
    entry.className = `log-entry ${type}`;
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    entry.innerText = `[${time}] ${msg}`;
    logs.prepend(entry);
}

// init
updateBalances();
setInterval(updateBalances, 5000);
