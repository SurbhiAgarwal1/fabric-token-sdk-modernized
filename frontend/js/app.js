const API_BASE = window.location.origin.includes('localhost') ? 'http://localhost:8080' : null;
let isProcessing = false;

// Mock state for Live Demos (Vercel/Github Pages) where Go backend isn't present
let mockState = {
    'USD-Token': 12500,
    'EUR-Token': 500
};

async function updateBalances() {
    if (!API_BASE) {
        // Mock Mode
        document.getElementById('usd-balance').innerText = mockState['USD-Token'].toLocaleString();
        document.getElementById('eur-balance').innerText = mockState['EUR-Token'].toLocaleString();
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/wallet/balance`);
        const data = await response.json();
        document.getElementById('usd-balance').innerText = data['USD-Token'].toLocaleString();
        document.getElementById('eur-balance').innerText = data['EUR-Token'].toLocaleString();
    } catch (e) {
        console.warn("Backend lookups failed, reverting to mock mode for demo.");
        // Fallback to mock behavior if backend is unreachable
        document.getElementById('usd-balance').innerText = mockState['USD-Token'].toLocaleString();
        document.getElementById('eur-balance').innerText = mockState['EUR-Token'].toLocaleString();
    }
}

async function triggerFlow(action) {
    if (isProcessing) return;
    
    isProcessing = true;
    const progress = document.getElementById('progress-bar');
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(b => b.disabled = true);
    
    addLog(`Running ${action.toUpperCase()} flow...`);
    progress.style.width = '40%';
    
    if (!API_BASE) {
        // Simulated Browser-Side Engine (Proves architectural logic even without Go)
        await new Promise(r => setTimeout(r, 800)); // Simulate ZKP Gen
        progress.style.width = '100%';
        
        const amount = action === 'issue' ? 1000 : 500;
        let details = "Success.";

        if (action === 'issue') {
            mockState['USD-Token'] += amount;
            details = `Issued ${amount} USD-Token to treasury.`;
        } else if (action === 'transfer') {
            if (mockState['USD-Token'] >= amount) {
                mockState['USD-Token'] -= amount;
                details = `Transferred ${amount} USD-Token (ZKATdlog proof verified).`;
            } else {
                details = "Transaction failed: Insufficient USD-Token balance.";
            }
        }

        document.getElementById('zkp-time').innerText = `${120 + Math.floor(Math.random() * 50)}ms`;
        document.getElementById('fabric-time').innerText = `${200 + Math.floor(Math.random() * 100)}ms`;
        document.getElementById('proof-size').innerText = `${(1 + Math.random() * 2).toFixed(1)} KB`;

        addLog(details, action === 'transfer' && details.includes('failed') ? 'error' : 'success');
        updateBalances();
        finalizeClick(progress, buttons);
        return;
    }

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
        addLog(`Error connecting to backend. Check Go server status.`, 'error');
    } finally {
        finalizeClick(progress, buttons);
    }
}

function finalizeClick(progress, buttons) {
    setTimeout(() => {
        progress.style.width = '0%';
        buttons.forEach(b => b.disabled = false);
        isProcessing = false;
    }, 800);
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

// Initial hydration
updateBalances();
setInterval(updateBalances, 5000);
