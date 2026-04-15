const API_BASE = 'http://localhost:8080';

async function updateBalances() {
    try {
        const response = await fetch(`${API_BASE}/wallet/balance`);
        const data = await response.json();
        document.getElementById('usd-balance').innerText = `$ ${data['USD-Token'].toLocaleString()}`;
        document.getElementById('eur-balance').innerText = `€ ${data['EUR-Token'].toLocaleString()}`;
    } catch (e) {
        console.error("Backend not running?", e);
    }
}

async function triggerFlow(action) {
    const logContainer = document.getElementById('logs');
    const zkpEl = document.getElementById('zkp-time');
    const fabricEl = document.getElementById('fabric-time');
    const progress = document.getElementById('progress-bar');

    addLog(`INITIATING: ${action.toUpperCase()} flow...`);
    progress.style.width = '30%';
    
    try {
        const response = await fetch(`${API_BASE}/token/${action}`, { method: 'POST' });
        const data = await response.json();
        
        // Update Stats
        zkpEl.innerText = formatDuration(data.ZKPGenTime);
        fabricEl.innerText = formatDuration(data.FabricTime);
        progress.style.width = '100%';

        addLog(`SUCCESS: ${action} logic validated on ledger.`, 'success');
        addLog(`ZKP Proof Size: ${(data.ProofSizeBytes / 1024).toFixed(2)} KB`);
        
        setTimeout(() => { progress.style.width = '0%'; }, 2000);
        updateBalances();
    } catch (e) {
        addLog(`ERROR: Connection to FSC Node failed. Check if Go server is running.`, 'error');
    }
}

function formatDuration(ns) {
    // Backend returns nanoseconds in JSON if not handled, 
    // but my Engine returns Duration which strings usually or we parse
    // Let's assume it's roughly 100ms-500ms based on our simulation
    return `${Math.round(ns / 1000000)}ms`;
}

function addLog(msg, type = '') {
    const logs = document.getElementById('logs');
    const entry = document.createElement('p');
    entry.className = `log-entry ${type}`;
    entry.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
    logs.prepend(entry);
}

// Initial hydration
updateBalances();
setInterval(updateBalances, 5000);
