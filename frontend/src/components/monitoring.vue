<template>
    <div class="monitoring-container">
      <h1>Monitoring en temps réel</h1>
  
      <div class="pcs-wrapper">
        <div v-for="(pc, index) in pcs" :key="index" class="monitoring-pc">
          <h2>{{ pc.nom }}</h2>
  
          <div class="monitoring-item">
            <label>CPU :</label>
            <span :class="getState(pc.cpu)">{{ pc.cpu }}%</span>
            <small>{{ getStateText(pc.cpu) }}</small>
          </div>
  
          <div class="monitoring-item">
            <label>RAM :</label>
            <span :class="getState(pc.ram)">{{ pc.ram }}%</span>
            <small>{{ getStateText(pc.ram) }}</small>
          </div>
  
          <div class="monitoring-item">
            <label>Disque dur :</label>
            <span :class="getState(pc.disk)">{{ pc.disk }}%</span>
            <small>{{ getStateText(pc.disk) }}</small>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Monitoring",
    data() {
      return {
        pcs: [
          { nom: "PC-1", cpu: 0, ram: 0, disk: 0 },
          { nom: "PC-2", cpu: 0, ram: 0, disk: 0 },
          { nom: "PC-3", cpu: 0, ram: 0, disk: 0 },
        ],
        intervalId: null
      };
    },
    mounted() {
      this.intervalId = setInterval(this.updateValues, 1000);
    },
    beforeUnmount() {
      clearInterval(this.intervalId);
    },
    methods: {
      updateValues() {
        this.pcs.forEach(pc => {
          pc.cpu = Math.floor(Math.random() * 101);
          pc.ram = Math.floor(Math.random() * 101);
          pc.disk = Math.floor(Math.random() * 101);
        });
      },
      getState(value) {
        if (value < 50) return 'normal';
        if (value < 80) return 'warning';
        return 'critical';
      },
      getStateText(value) {
        if (value < 50) return 'Normal';
        if (value < 80) return 'Attention';
        return 'Critique';
      }
    }
  };
  </script>
  
  <style scoped>
  .monitoring-container {
    max-width: 1000px;
    margin: 50px auto;
    font-family: Arial, sans-serif;
    text-align: center;
    padding: 0 15px;
  }
  
  .monitoring-container h1 {
    margin-bottom: 30px;
    color: #333;
  }
  
  /* Wrapper horizontal */
  .pcs-wrapper {
    display: flex;
    flex-wrap: wrap; /* permet de passer à la ligne si nécessaire */
    gap: 20px;
    justify-content: space-between;
  }
  
  /* Chaque PC prend 1/3 sur grand écran */
  .monitoring-pc {
    flex: 1 1 calc(33.333% - 20px); /* 3 par ligne - gap */
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    min-width: 250px; /* évite que la carte soit trop petite */
  }
  
  .monitoring-pc h2 {
    margin-bottom: 15px;
    color: #555;
    text-decoration: underline;
  }
  
  .monitoring-item {
    margin: 8px 0;
    font-size: 16px;
    text-align: left;
    color: #333;
  }
  
  .monitoring-item label {
    font-weight: bold;
    margin-right: 8px;
  }
  
  .monitoring-item span {
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 6px;
    color: white;
  }
  
  .monitoring-item small {
    font-size: 12px;
    color: #555;
    margin-left: 5px;
  }
  
  /* États */
  .normal {
    background-color: #2ecc71;  /* vert */
  }
  
  .warning {
    background-color: #f1c40f;  /* jaune */
  }
  
  .critical {
    background-color: #e74c3c;  /* rouge */
  }
  
  /* Media queries pour responsive */
  @media (max-width: 900px) {
    .monitoring-pc {
      flex: 1 1 calc(50% - 20px); /* 2 par ligne */
    }
  }
  
  @media (max-width: 600px) {
    .monitoring-pc {
      flex: 1 1 100%; /* 1 par ligne */
    }
  }
  </style>