const express = require("express");
const path = require("path");
const open = require("open").default; // <-- import du module open

const app = express();

app.use(express.json());
app.use(express.static("public"));

let devices = {};

// Fonction affichage terminal
function printSystemStatus(data) {
  console.log("====================================");
  console.log(`Device: ${data.device_id}`);
  console.log(`CPU: ${data.cpu}% [${data.cpu_state}]`);
  console.log(`RAM: ${data.ram_used}/${data.ram_total} MB [${data.ram_state}]`);
  console.log(`DISK: ${data.disk_used}/${data.disk_total} GB [${data.disk_state}]`);
  if (data.uptime_hours !== undefined) {
    console.log(`Uptime: ${data.uptime_hours}h ${data.uptime_minutes}min`);
  }
  console.log(`Time: ${new Date().toLocaleString()}`);
  console.log("====================================\n");
}

// API recevoir données
app.post("/api/data", (req, res) => {
  const data = req.body;
  if (!data.device_id) return res.status(400).json({ error: "device_id missing" });

  data.timestamp = Date.now();
  devices[data.device_id] = data;

  printSystemStatus(data);
  res.json({ status: "ok" });
});

// API récupérer toutes les machines
/*app.get("/api/data", (req, res) => {
  res.json(Object.values(devices));
});*/
// API récupérer toutes les machines
app.get("/api/data", (req, res) => {
  const deviceList = Object.values(devices);

  if (deviceList.length === 0) {
    return res.json({
      status: "waiting",
      message: "Aucune donnée reçue pour le moment",
      devices: []
    });
  }

  res.json({
    status: "ok",
    devices: deviceList
  });
});

// Interface we
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Port
const PORT = 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  
  // Ouvre automatiquement le navigateur
  open(`http://localhost:${PORT}`);
});