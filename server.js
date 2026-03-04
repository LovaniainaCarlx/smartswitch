/*const express = require("express");
const app = express();
app.use(express.json());

let allData = []; // Stockage temporaire en mémoire

// Fonction pour afficher joliment l'état d'un PC dans le terminal
function printSystemStatus(data) {
  console.log("====================================");
  console.log(`Device: ${data.device_id}`);
  console.log(`CPU Usage: ${data.cpu}% [${data.cpu_state}]`);
  console.log(`RAM Usage: ${data.ram_used || '?'} / ${data.ram_total || '?'} MB [${data.ram_state}]`);
  console.log(`Disk Usage: ${data.disk_used || '?'} / ${data.disk_total || '?'} GB [${data.disk_state}]`);
  
  if (data.uptime_hours !== undefined && data.uptime_minutes !== undefined) {
    console.log(`Uptime: ${data.uptime_hours}h ${data.uptime_minutes}min`);
  } else if (data.uptime_seconds !== undefined) {
    const hours = Math.floor(data.uptime_seconds / 3600);
    const minutes = Math.floor((data.uptime_seconds % 3600) / 60);
    console.log(`Uptime: ${hours}h ${minutes}min`);
  }

  console.log("====================================\n");
}

// Route pour recevoir les données POST des PC
app.post("/api/data", (req, res) => {
  const data = req.body;

  // Affiche dans le terminal
  printSystemStatus(data);

  // Sauvegarde dans mémoire
  allData.push(data);

  res.json({ status: "ok" });
});

// Route GET pour récupérer les dernières données
app.get("/api/data", (req, res) => {
  res.json(allData.slice(-50));
});

// Démarrage du serveur sur toutes les interfaces
app.listen(3000, '0.0.0.0', () => console.log("Server running on port 3000")); */

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("public")); // pour servir le fichier HTML et JS

let allData = []; // Stockage temporaire en mémoire

// Fonction pour afficher joliment l'état d'un PC dans le terminal
function printSystemStatus(data) {
  console.log("====================================");
  console.log(`Device: ${data.device_id}`);
  console.log(`CPU Usage: ${data.cpu}% [${data.cpu_state}]`);
  console.log(`RAM Usage: ${data.ram_used || '?'} / ${data.ram_total || '?'} MB [${data.ram_state}]`);
  console.log(`Disk Usage: ${data.disk_used || '?'} / ${data.disk_total || '?'} GB [${data.disk_state}]`);
  if (data.uptime_hours !== undefined && data.uptime_minutes !== undefined) {
    console.log(`Uptime: ${data.uptime_hours}h ${data.uptime_minutes}min`);
  }
  console.log("====================================\n");
}

// Route POST pour recevoir les données des PC
app.post("/api/data", (req, res) => {
  const data = req.body;
  printSystemStatus(data); // affichage terminal
  allData.push(data);
  res.json({ status: "ok" });
});

// Route GET pour récupérer les 50 dernières données
app.get("/api/data", (req, res) => {
  res.json(allData.slice(-50));
});

// Servir le HTML pour l'interface
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Démarrage du serveur
app.listen(3000, '0.0.0.0', () => console.log("Server running on port 3000"));