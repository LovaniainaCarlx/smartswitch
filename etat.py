import psutil
import time

# Fonction pour récupérer état de chaque composante
def get_system_status():
    status = {}

    # CPU
    cpu_percent = psutil.cpu_percent(interval=1)
    status['cpu'] = cpu_percent

    # RAM
    ram = psutil.virtual_memory()
    status['ram_total'] = ram.total // 1024**2   # en MB
    status['ram_used'] = ram.used // 1024**2
    status['ram_free'] = ram.available // 1024**2
    status['ram_percent'] = ram.percent

    # Disque
    disk = psutil.disk_usage('/')
    status['disk_total'] = disk.total // 1024**3  # en GB
    status['disk_used'] = disk.used // 1024**3
    status['disk_free'] = disk.free // 1024**3
    status['disk_percent'] = disk.percent

    # Uptime
    uptime_seconds = time.time() - psutil.boot_time()
    status['uptime_hours'] = int(uptime_seconds // 3600)
    status['uptime_minutes'] = int((uptime_seconds % 3600) // 60)

    # État global par composante
    # Critères : Vert < 70%, Jaune < 90%, Rouge >= 90%
    def component_state(percent):
        if percent < 70:
            return 'green'
        elif percent < 90:
            return 'yellow'
        else:
            return 'red'

    status['cpu_state'] = component_state(cpu_percent)
    status['ram_state'] = component_state(ram.percent)
    status['disk_state'] = component_state(disk.percent)

    return status

# Boucle de test
if __name__ == "__main__":
    while True:
        sys_status = get_system_status()
        print("=== SYSTEM STATUS ===")
        print(f"CPU Usage: {sys_status['cpu']}% [{sys_status['cpu_state']}]")
        print(f"RAM Used: {sys_status['ram_used']}/{sys_status['ram_total']} MB [{sys_status['ram_state']}]")
        print(f"Disk Used: {sys_status['disk_used']}/{sys_status['disk_total']} GB [{sys_status['disk_state']}]")
        print(f"Uptime: {sys_status['uptime_hours']}h {sys_status['uptime_minutes']}min")
        print("=====================\n")
        time.sleep(5)  # mise à jour toutes les 5 secondes