// State Management
let currentRole = 'owner';
let currentUser = 'Alice';

const STATE = {
    accounts: ['Alice', 'Bob', 'Charlie', 'Issuer'],
    denylist: [],
    utxos: [
        { id: 'tx001-0', owner: 'Alice', type: 'USD', value: 5000, status: 'unspent' },
        { id: 'tx002-0', owner: 'Alice', type: 'EUR', value: 200, status: 'unspent' },
        { id: 'tx003-0', owner: 'Bob', type: 'USD', value: 1000, status: 'unspent' }
    ],
    history: [
        { id: 'tx001', type: 'Issue', amount: 5000, from: 'Issuer', to: 'Alice', status: 'Confirmed', time: Date.now() - 86400000 },
        { id: 'tx002', type: 'Issue', amount: 200, from: 'Issuer', to: 'Alice', status: 'Confirmed', time: Date.now() - 80000000 },
        { id: 'tx003', type: 'Issue', amount: 1000, from: 'Issuer', to: 'Bob', status: 'Confirmed', time: Date.now() - 70000000 }
    ],
    htlcs: []
};

// Utility: Hashing simulation
function sha256(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash).toString(16);
}

// Initialization
function init() {
    const accSelect = document.getElementById('account-select');
    accSelect.innerHTML = STATE.accounts.filter(a => a !== 'Issuer').map(a => `<option value="${a}">${a}</option>`).join('');
    
    switchRole();
    setInterval(tickHTLCs, 1000);
    log('System initialized. Fabric Network connected.', 'info');
}

function switchRole() {
    currentRole = document.getElementById('role-select').value;
    document.getElementById('account-selector-container').style.display = currentRole === 'owner' ? 'block' : 'none';
    
    if(currentRole === 'issuer') currentUser = 'Issuer';
    else if(currentRole === 'auditor') currentUser = 'Auditor';
    else currentUser = document.getElementById('account-select').value;
    
    document.querySelectorAll('.role-view').forEach(el => el.classList.remove('active'));
    document.getElementById(`view-${currentRole}`).classList.add('active');
    
    log(`Switched role context to: ${currentRole.toUpperCase()}`);
    renderAll();
}

function switchAccount() {
    currentUser = document.getElementById('account-select').value;
    log(`Switched active wallet to: ${currentUser}`);
    renderAll();
}

function renderAll() {
    renderBalances();
    renderUTXOs();
    renderHistory();
    renderHTLCs();
    renderDenylist();
}

// Render Logic
function renderBalances() {
    if (currentRole !== 'owner') return;
    const balances = {};
    STATE.utxos.filter(u => u.owner === currentUser && u.status === 'unspent').forEach(u => {
        balances[u.type] = (balances[u.type] || 0) + u.value;
    });

    const grid = document.getElementById('balance-grid');
    grid.innerHTML = Object.keys(balances).length === 0 ? '<div class="balance-card"><span class="label">Total</span><span class="value">0</span></div>' : '';
    for (const [type, val] of Object.entries(balances)) {
        grid.innerHTML += `<div class="balance-card"><span class="label">${type}</span><span class="value">${val.toLocaleString()}</span></div>`;
    }
}

function renderUTXOs() {
    if (currentRole !== 'owner') return;
    const tbody = document.getElementById('utxo-body');
    const myUtxos = STATE.utxos.filter(u => u.owner === currentUser);
    
    if(myUtxos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">No UTXOs found for this account.</td></tr>';
        return;
    }

    tbody.innerHTML = myUtxos.map(u => `
        <tr>
            <td><code>${u.id}</code></td>
            <td>${u.type}</td>
            <td>${u.value}</td>
            <td><span class="badge ${u.status}">${u.status}</span></td>
        </tr>
    `).join('');
}

function renderHistory() {
    const tbody = document.getElementById('history-body');
    const typeFilter = document.getElementById('filter-type').value;
    const statusFilter = document.getElementById('filter-status').value;

    let viewable = STATE.history;
    
    if (currentRole === 'owner') {
        viewable = viewable.filter(h => h.from === currentUser || h.to === currentUser);
    } else if (currentRole === 'issuer') {
        viewable = viewable.filter(h => h.from === 'Issuer' || h.type === 'Issue');
    }
    // Auditor sees everything

    if (typeFilter !== 'all') viewable = viewable.filter(h => h.type === typeFilter);
    if (statusFilter !== 'all') viewable = viewable.filter(h => h.status === statusFilter);

    if(viewable.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted)">No transactions match criteria.</td></tr>';
        return;
    }

    tbody.innerHTML = viewable.sort((a,b)=>b.time-a.time).map(h => `
        <tr>
            <td><code>${h.id}</code></td>
            <td>${h.type}</td>
            <td>${h.amount}</td>
            <td>${h.from} &rarr; ${h.to}</td>
            <td><span class="badge ${h.status.toLowerCase()}">${h.status}</span></td>
            <td>${new Date(h.time).toLocaleTimeString()}</td>
        </tr>
    `).join('');
}

function renderDenylist() {
    if (currentRole !== 'auditor') return;
    const tbody = document.getElementById('denylist-body');
    if(STATE.denylist.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">Denylist is empty.</td></tr>';
        return;
    }
    tbody.innerHTML = STATE.denylist.map((d, i) => `
        <tr>
            <td>${d.identity}</td>
            <td>${d.reason}</td>
            <td>${new Date(d.time).toLocaleString()}</td>
            <td><button class="btn btn-sm btn-danger" onclick="removeDenylist(${i})">Remove</button></td>
        </tr>
    `).join('');
}

function renderHTLCs() {
    if (currentRole !== 'owner') return;
    const tbody = document.getElementById('htlc-body');
    const myHtlcs = STATE.htlcs.filter(h => h.from === currentUser || h.to === currentUser);
    
    if(myHtlcs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted)">No HTLC locks found.</td></tr>';
        return;
    }

    tbody.innerHTML = myHtlcs.map(h => {
        let actionStr = '';
        let now = Date.now();
        if (h.status === 'Locked') {
            if (h.to === currentUser && h.expires > now) {
                actionStr = `<button class="btn btn-sm btn-primary" onclick="claimHTLC('${h.id}')">Claim</button>`;
            } else if (h.from === currentUser && h.expires < now) {
                actionStr = `<button class="btn btn-sm btn-danger" onclick="reclaimHTLC('${h.id}')">Reclaim</button>`;
            }
        }
        
        let timeStr = '-';
        if(h.status === 'Locked') {
            if(h.expires > now) timeStr = Math.max(0, Math.floor((h.expires - now)/1000)) + 's';
            else timeStr = 'Expired';
        }

        return `<tr>
            <td><code>${h.id.substring(0,8)}...</code></td>
            <td>${h.amount} ${h.type}</td>
            <td>${h.to}</td>
            <td>${timeStr}</td>
            <td><span class="badge ${h.status.toLowerCase()}">${h.status}</span></td>
            <td>${actionStr}</td>
        </tr>`;
    }).join('');
}

function tickHTLCs() {
    if (currentRole === 'owner') renderHTLCs();
}

// Handlers
async function handleIssue() {
    const amt = parseInt(document.getElementById('issue-amount').value);
    const type = document.getElementById('issue-type').value;
    const rec = document.getElementById('issue-recipient').value;
    
    if(!amt || !rec) return;

    await executeFlow('Issue', async () => {
        const txId = 'tx' + Math.floor(Math.random()*1000000);
        STATE.utxos.push({ id: txId+'-0', owner: rec, type: type, value: amt, status: 'unspent' });
        STATE.history.push({ id: txId, type: 'Issue', amount: amt, from: 'Issuer', to: rec, status: 'Confirmed', time: Date.now() });
        log(`Minted ${amt} ${type} to ${rec}. ZKATdlog proof generated.`);
    });
}

async function handleTransfer() {
    const amt = parseInt(document.getElementById('transfer-amount').value);
    const type = document.getElementById('transfer-type').value;
    const rec = document.getElementById('transfer-recipient').value;
    
    if(!amt || !rec) return;

    await executeFlow('Transfer', async () => {
        // Auditor Check
        if(STATE.denylist.find(d => d.identity === currentUser || d.identity === rec)) {
            const txId = 'tx' + Math.floor(Math.random()*1000000);
            STATE.history.push({ id: txId, type: 'Transfer', amount: amt, from: currentUser, to: rec, status: 'Rejected', time: Date.now() });
            throw new Error(`Auditor rejected: Identity on denylist.`);
        }

        // Coin selection
        let unspent = STATE.utxos.filter(u => u.owner === currentUser && u.type === type && u.status === 'unspent');
        let total = 0;
        let inputs = [];
        for(let u of unspent) {
            total += u.value;
            inputs.push(u);
            if(total >= amt) break;
        }

        if(total < amt) throw new Error("Insufficient funds for transfer.");

        log(`Selected ${inputs.length} UTXOs for transfer. Total input: ${total}.`);
        inputs.forEach(u => u.status = 'spent');

        const txId = 'tx' + Math.floor(Math.random()*1000000);
        STATE.utxos.push({ id: txId+'-0', owner: rec, type: type, value: amt, status: 'unspent' });
        log(`Output created for recipient: ${amt}.`);
        
        if(total > amt) {
            STATE.utxos.push({ id: txId+'-change', owner: currentUser, type: type, value: total - amt, status: 'unspent' });
            log(`Change output created for owner: ${total - amt}.`);
        }
        
        STATE.history.push({ id: txId, type: 'Transfer', amount: amt, from: currentUser, to: rec, status: 'Confirmed', time: Date.now() });
        log(`Transfer confirmed. Endorsed by Auditor.`, 'success');
    });
}

async function handleCreateHTLC() {
    const amt = parseInt(document.getElementById('htlc-amount').value);
    const type = document.getElementById('htlc-type').value;
    const rec = document.getElementById('htlc-recipient').value;
    const pre = document.getElementById('htlc-preimage').value;
    const dur = parseInt(document.getElementById('htlc-duration').value);

    if(!amt || !rec || !pre || !dur) return;

    await executeFlow('HTLC Lock', async () => {
        let unspent = STATE.utxos.filter(u => u.owner === currentUser && u.type === type && u.status === 'unspent');
        let total = 0;
        let inputs = [];
        for(let u of unspent) { total += u.value; inputs.push(u); if(total >= amt) break; }
        if(total < amt) throw new Error("Insufficient funds for Lock.");

        inputs.forEach(u => u.status = 'spent');
        const lockId = 'htlc' + Math.floor(Math.random()*1000000);
        const hash = sha256(pre);
        
        if(total > amt) {
            STATE.utxos.push({ id: lockId+'-change', owner: currentUser, type: type, value: total - amt, status: 'unspent' });
        }

        STATE.htlcs.push({
            id: lockId, from: currentUser, to: rec, amount: amt, type: type,
            hash: hash, expires: Date.now() + (dur * 1000), status: 'Locked',
            secret: pre // just for checking in the mock
        });

        STATE.history.push({ id: lockId, type: 'HTLC', amount: amt, from: currentUser, to: rec, status: 'Confirmed', time: Date.now() });
        log(`HTLC Lock Created. Preimage Hash: ${hash}`);
    });
}

async function claimHTLC(id) {
    const htlc = STATE.htlcs.find(h => h.id === id);
    const pre = prompt("Enter preimage secret to claim funds:");
    if(!pre) return;

    await executeFlow('HTLC Claim', async () => {
        if(pre !== htlc.secret) throw new Error("Invalid preimage hash. Auditor rejected.");
        if(htlc.expires < Date.now()) throw new Error("HTLC expired. Cannot claim.");

        htlc.status = 'Claimed';
        STATE.utxos.push({ id: htlc.id+'-claim', owner: htlc.to, type: htlc.type, value: htlc.amount, status: 'unspent' });
        STATE.history.push({ id: 'clm'+htlc.id, type: 'HTLC', amount: htlc.amount, from: 'HTLC', to: htlc.to, status: 'Confirmed', time: Date.now() });
        log(`Claim successful. Unlocked ${htlc.amount} ${htlc.type} to ${htlc.to}.`, 'success');
    });
}

async function reclaimHTLC(id) {
    const htlc = STATE.htlcs.find(h => h.id === id);
    await executeFlow('HTLC Reclaim', async () => {
        if(htlc.expires > Date.now()) throw new Error("HTLC not yet expired. Auditor rejected.");
        htlc.status = 'Expired';
        STATE.utxos.push({ id: htlc.id+'-reclaim', owner: htlc.from, type: htlc.type, value: htlc.amount, status: 'unspent' });
        STATE.history.push({ id: 'rec'+htlc.id, type: 'HTLC', amount: htlc.amount, from: 'HTLC', to: htlc.from, status: 'Confirmed', time: Date.now() });
        log(`Reclaimed expired HTLC lock. Restored funds to ${htlc.from}.`, 'success');
    });
}

function handleAddDenylist() {
    const id = document.getElementById('denylist-identity').value;
    const reason = document.getElementById('denylist-reason').value;
    if(id) {
        STATE.denylist.push({ identity: id, reason: reason || 'Manual block', time: Date.now() });
        log(`Auditor added ${id} to Denylist. Reason: ${reason}`, 'warning');
        renderDenylist();
    }
}

function removeDenylist(index) {
    const removed = STATE.denylist.splice(index, 1);
    log(`Auditor removed ${removed[0].identity} from Denylist.`);
    renderDenylist();
}

// Flow Simulator
async function executeFlow(name, logicFn) {
    log(`--- Initiating ${name} Flow ---`, 'info');
    log('Building transaction...');
    updateMetrics();

    try {
        await new Promise(r => setTimeout(r, 400));
        log('Generating Zero Knowledge Proofs...');
        await new Promise(r => setTimeout(r, 600));
        
        await logicFn();
        
        log('Requesting Auditor Co-signature...');
        await new Promise(r => setTimeout(r, 300));
        log('Transaction successfully committed to Fabric.', 'success');
    } catch(e) {
        log(`Error: ${e.message}`, 'error');
    }
    
    updateMetrics(true);
    renderAll();
}

function updateMetrics(simulate = false) {
    if(simulate) {
        document.getElementById('metric-zkp').innerText = `${100 + Math.floor(Math.random()*150)} ms`;
        document.getElementById('metric-commit').innerText = `${200 + Math.floor(Math.random()*200)} ms`;
        document.getElementById('metric-size').innerText = `${(1.2 + Math.random()).toFixed(2)} KB`;
    } else {
        document.getElementById('metric-zkp').innerText = `...`;
        document.getElementById('metric-commit').innerText = `...`;
        document.getElementById('metric-size').innerText = `...`;
    }
}

function log(msg, type = '') {
    const logs = document.getElementById('logs');
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    const p = document.createElement('div');
    p.className = `log-entry ${type}`;
    p.innerText = `[${time}] ${msg}`;
    logs.prepend(p);
}

// Boot
window.onload = init;
