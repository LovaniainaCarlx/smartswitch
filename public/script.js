const history = {};
const MAX_POINTS = 20;
let activeChart = null;

// ── COMPTEUR ──
function updateStats(devices) {
    const online  = devices.filter(d => isOnline(d)).length;
    const offline = devices.length - online;
    document.getElementById("count-online").textContent  = online;
    document.getElementById("count-offline").textContent = offline;
    document.getElementById("count-total").textContent   = devices.length;
}

// ── THEME TOGGLE ──
function toggleTheme() {
    const body = document.body;
    const btn  = document.getElementById("theme-toggle");
    body.classList.toggle("light");
    btn.textContent = body.classList.contains("light") ? "🌙 Dark" : "☀️ Clair";
}

// ── COULEURS ──
function getColor(type, value, total) {
    let percent = value;
    if (total) percent = (value / total) * 100;
    if (percent < 50) return "#00e5a0";
    if (percent < 80) return "#ffb830";
    return "#ff4d6d";
}

// ── HISTORIQUE ──
function saveHistory(device) {
    if (!history[device.device_id]) {
        history[device.device_id] = { labels: [], cpu: [], ram: [] };
    }
    const h = history[device.device_id];
    const now = new Date().toLocaleTimeString();
    const ramPercent = Math.round((device.ram_used / device.ram_total) * 100);

    h.labels.push(now);
    h.cpu.push(device.cpu);
    h.ram.push(ramPercent);

    if (h.labels.length > MAX_POINTS) {
        h.labels.shift();
        h.cpu.shift();
        h.ram.shift();
    }
}

// ── MODAL ──
function openModal(device) {
    const cpuColor    = getColor("cpu",  device.cpu);
    const ramColor    = getColor("ram",  device.ram_used,  device.ram_total);
    const diskColor   = getColor("disk", device.disk_used, device.disk_total);
    const ramPercent  = Math.round((device.ram_used  / device.ram_total)  * 100);
    const diskPercent = Math.round((device.disk_used / device.disk_total) * 100);

    document.getElementById("modal-content").innerHTML = `
        <button id="modal-close" onclick="closeModal()">✕</button>
        <div class="modal-header">
            <div class="modal-icon">🖥️</div>
            <h2>${device.device_id}</h2>
            <p class="modal-subtitle">Rapport système détaillé</p>
        </div>
        <div class="modal-stats">
            <div class="modal-row">
                <span class="modal-label">⚙️ CPU</span>
                <span class="modal-value" style="color:${cpuColor}">${device.cpu}%</span>
            </div>
            <div class="modal-row">
                <span class="modal-label">🧠 RAM</span>
                <span class="modal-value" style="color:${ramColor}">${device.ram_used} / ${device.ram_total} MB (${ramPercent}%)</span>
            </div>
            <div class="modal-row">
                <span class="modal-label">💾 DISK</span>
                <span class="modal-value" style="color:${diskColor}">${device.disk_used} / ${device.disk_total} GB (${diskPercent}%)</span>
            </div>
            <div class="modal-row">
                <span class="modal-label">⏱️ Uptime</span>
                <span class="modal-value">${device.uptime_hours}h ${device.uptime_minutes}min</span>
            </div>
            <div class="modal-row">
                <span class="modal-label">🌐 Données</span>
                <span class="modal-value" style="color: var(--accent)">
                    ↑ ${device.data_sent || "--"} GB &nbsp; ↓ ${device.data_received || "--"} GB
                </span>
            </div>
            <div class="modal-row">
                <span class="modal-label">🕐 Mis à jour</span>
                <span class="modal-value">${new Date(device.timestamp).toLocaleString()}</span>
            </div>
        </div>
        <div class="chart-section">
            <p class="chart-title">📈 Historique CPU & RAM</p>
            <canvas id="modal-chart" height="140"></canvas>
        </div>
    `;

    document.getElementById("modal-overlay").style.display = "flex";

    if (activeChart) {
        activeChart.destroy();
        activeChart = null;
    }

    const h   = history[device.device_id] || { labels: [], cpu: [], ram: [] };
    const ctx = document.getElementById("modal-chart").getContext("2d");

    activeChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: h.labels,
            datasets: [
                {
                    label: "CPU %",
                    data: h.cpu,
                    borderColor: "#58a6ff",
                    backgroundColor: "rgba(88,166,255,0.1)",
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: "#58a6ff",
                    tension: 0.4,
                    fill: true
                },
                {
                    label: "RAM %",
                    data: h.ram,
                    borderColor: "#00e5a0",
                    backgroundColor: "rgba(0,229,160,0.08)",
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: "#00e5a0",
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            animation: { duration: 400 },
            scales: {
                x: {
                    ticks: { color: "#8b949e", font: { size: 10 }, maxTicksLimit: 6 },
                    grid:  { color: "rgba(255,255,255,0.05)" }
                },
                y: {
                    min: 0, max: 100,
                    ticks: { color: "#8b949e", font: { size: 10 }, callback: val => val + "%" },
                    grid:  { color: "rgba(255,255,255,0.05)" }
                }
            },
            plugins: {
                legend: {
                    labels: { color: "#e6edf3", font: { size: 11 }, boxWidth: 12 }
                },
                tooltip: {
                    backgroundColor: "#161b22",
                    borderColor: "#30363d",
                    borderWidth: 1,
                    titleColor: "#e6edf3",
                    bodyColor: "#8b949e",
                    callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}%` }
                }
            }
        }
    });
}

function closeModal() {
    if (activeChart) {
        activeChart.destroy();
        activeChart = null;
    }
    document.getElementById("modal-overlay").style.display = "none";
}

// ── OFFLINE ──
const OFFLINE_THRESHOLD = 15000;

function isOnline(device) {
    return (Date.now() - device.timestamp) < OFFLINE_THRESHOLD;
}

// ── AFFICHAGE CARDS ──
function displayDevices(devices) {
    updateStats(devices);
    const container = document.getElementById("devices-container");
    container.innerHTML = "";

    if (devices.length === 0) {
        container.innerHTML = `
            <div class="device-card empty-card">
                <div class="empty-icon">📡</div>
                <h2>Aucun appareil connecté</h2>
                <p>En attente de connexion...</p>
            </div>`;
        return;
    }

    devices.forEach(device => {
        saveHistory(device);

        const online      = isOnline(device);
        const cpuColor    = online ? getColor("cpu",  device.cpu) : "#8b949e";
        const ramColor    = online ? getColor("ram",  device.ram_used,  device.ram_total) : "#8b949e";
        const diskColor   = online ? getColor("disk", device.disk_used, device.disk_total) : "#8b949e";
        const ramPercent  = online ? Math.round((device.ram_used  / device.ram_total)  * 100) : 0;
        const diskPercent = online ? Math.round((device.disk_used / device.disk_total) * 100) : 0;
        const cpuPercent  = online ? device.cpu : 0;

        const card = document.createElement("div");
        card.className = `device-card ${online ? "" : "card-offline"}`;
        card.innerHTML = `
            <div class="card-header">
                <span class="card-icon">🖥️</span>
                <h2>${device.device_id || "Device"}</h2>
                <span class="${online ? "card-online" : "card-offline-badge"}">
                    ${online ? "● ONLINE" : "● OFFLINE"}
                </span>
            </div>

            <!-- CPU -->
            <div class="stat-block">
                <div class="stat-top">
                    <span class="status-label">
                        <img src="/icons/Procesor.png" class="icon-sm" /> CPU
                    
                    </span>
                    <span class="status-value" style="color:${cpuColor}">
                        ${online ? device.cpu + "%" : "--"}
                    </span>
                </div>
                <div class="bar-bg">
                    <div class="bar" style="width:${cpuPercent}%; background:${cpuColor}"></div>
                </div>
            </div>

            <!-- RAM -->
            <div class="stat-block">
                <div class="stat-top">
                    <span class="status-label">
                        <img src="/icons/ram.png" class="icon-sm" /> RAM
                    
                    </span>
                    <span class="status-value" style="color:${ramColor}">
                        ${online ? device.ram_used + " / " + device.ram_total + " MB" : "--"}
                    </span>
                </div>
                <div class="bar-bg">
                    <div class="bar" style="width:${ramPercent}%; background:${ramColor}"></div>
                </div>
            </div>

            <!-- DISK -->
            <div class="stat-block">
                <div class="stat-top">
                    <span class="status-label">💾 DISK</span>
                    <span class="status-value" style="color:${diskColor}">
                        ${online ? device.disk_used + " / " + device.disk_total + " GB" : "--"}
                    </span>
                </div>
                <div class="bar-bg">
                    <div class="bar" style="width:${diskPercent}%; background:${diskColor}"></div>
                </div>
            </div>

            <!-- Données réseau -->
            <div class="stat-block">
                <div class="stat-top">
                    <span class="status-label">🌐 Data</span>
                    <span class="status-value" style="color: var(--accent)">
                        ↑ ${online ? (device.data_sent || "--") + " GB" : "--"}
                        &nbsp;↓ ${online ? (device.data_received || "--") + " GB" : "--"}
                    </span>
                </div>
            </div>

            <!-- Uptime -->
            <div class="stat-block">
                <div class="stat-top">
                    <span class="status-label">⏱️ Uptime</span>
                    <span class="status-value" style="color: var(--text-muted)">
                        ${device.uptime_hours || "--"}h ${device.uptime_minutes || "--"}min
                    </span>
                </div>
            </div>

            <div class="card-hint">DETAILS</div>
        `;
        card.addEventListener("click", () => openModal(device));
        container.appendChild(card);
    });
}

// ── FETCH ──
async function fetchDevices() {
    try {
        const res  = await fetch("/api/data");
        const data = await res.json();
        displayDevices(data.devices || []);
    } catch (err) {
        console.error("Erreur fetch:", err);
        displayDevices([]);
    }
}

setInterval(fetchDevices, 5000);
fetchDevices();