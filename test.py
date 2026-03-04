import psutil
import time
import requests  # pip install requests

# ------------------------
# CONFIGURATION
# ------------------------
SERVER_URL = "http://192.168.1.63:3000/api/data"  # Remplace par l'IP ou le domaine du serveur Node.js
DEVICE_ID = "PC1"  # identifiant unique pour chaque PC
SEND_INTERVAL = 5   # secondes entre chaque envoi

# ------------------------
# Boucle principale
# ------------------------
while True:
    # CPU
    cpu_percent = psutil.cpu_percent(interval=1)

    # RAM
    ram = psutil.virtual_memory()
    ram_used = ram.used // 1024**2
    ram_total = ram.total // 1024**2
    ram_percent = ram.percent

    # Disque
    disk = psutil.disk_usage('/')
    disk_used = disk.used // 1024**3
    disk_total = disk.total // 1024**3
    disk_percent = disk.percent

    # Uptime
    uptime_seconds = time.time() - psutil.boot_time()
    uptime_hours = int(uptime_seconds // 3600)
    uptime_minutes = int((uptime_seconds % 3600) // 60)

    # Définir état global par composante
    def component_state(percent):
        if percent < 70:
            return 'green'
        elif percent < 90:
            return 'yellow'
        else:
            return 'red'

    cpu_state = component_state(cpu_percent)
    ram_state = component_state(ram_percent)
    disk_state = component_state(disk_percent)

    # Préparer le dictionnaire des données à envoyer
    data = {
        "device_id": DEVICE_ID,
        "cpu": cpu_percent,
        "cpu_state": cpu_state,
        "ram_used": ram_used,
        "ram_total": ram_total,
        "ram_state": ram_state,
        "disk_used": disk_used,
        "disk_total": disk_total,
        "disk_state": disk_state,
        "uptime_hours": uptime_hours,
        "uptime_minutes": uptime_minutes
    }

    # Envoi POST au serveur Node.js
    try:
        response = requests.post(SERVER_URL, json=data)
        if response.status_code == 200:
            print(f"✅ Data sent successfully: {data}")
        else:
            print(f"⚠ Failed to send data: {response.status_code}")
    except Exception as e:
        print(f"❌ Error sending data: {e}")

    time.sleep(SEND_INTERVAL)