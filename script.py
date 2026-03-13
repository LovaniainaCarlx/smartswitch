import psutil
import time
import requests
import socket  # pour obtenir le nom du PC

# ------------------------
# CONFIGURATION
# ------------------------
SERVER_URL = "http://192.168.1.63:3000/api/data"
SEND_INTERVAL = 5

# Récupérer automatiquement le nom du PC
DEVICE_ID = socket.gethostname()


def component_state(percent):
    if percent < 70:
        return "green"
    elif percent < 90:
        return "yellow"
    else:
        return "red"


def collect_and_send():
    # CPU
    cpu_percent = psutil.cpu_percent(interval=1)

    # RAM
    ram = psutil.virtual_memory()
    ram_used = ram.used // 1024**2
    ram_total = ram.total // 1024**2
    ram_percent = ram.percent

    # Disque
    disk = psutil.disk_usage("/")
    disk_used = disk.used // 1024**3
    disk_total = disk.total // 1024**3
    disk_percent = disk.percent

    # Uptime
    uptime_seconds = time.time() - psutil.boot_time()
    uptime_hours = int(uptime_seconds // 3600)
    uptime_minutes = int((uptime_seconds % 3600) // 60)

    cpu_state = component_state(cpu_percent)
    ram_state = component_state(ram_percent)
    disk_state = component_state(disk_percent)

    data = {
        "device_id": DEVICE_ID,  # Nom automatique du PC
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

    try:
        response = requests.post(SERVER_URL, json=data, timeout=5)

        if response.status_code == 200:
            print(f"Data sent from {DEVICE_ID}")
        else:
            print(f"Server error ({DEVICE_ID}):", response.status_code)

    except Exception as e:
        print(f"Connection error ({DEVICE_ID}):", e)


def main():
    while True:
        collect_and_send()
        time.sleep(SEND_INTERVAL)


if __name__ == "__main__":
    main()