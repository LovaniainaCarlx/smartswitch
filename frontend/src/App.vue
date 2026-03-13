<template>

  <!-- Page d'accueil -->
  <div v-if="page === 'home'" class="home-container">
    <h1>Monitoring</h1>
    <button @click="page = 'gestion'">Gestion PC</button>
    <button @click="page = 'monitoring'">Voir Monitoring</button>
  </div>

  <!-- Page Gestion PC -->
  <gestionpc v-if="page === 'gestion'" 
             @retour="page = 'home'" />

  <!-- Page Monitoring -->
  <monitoring v-if="page === 'monitoring'" 
              @retour="page = 'home'" 
              @voirMonitoring="page = 'monitoring'"/>

</template>

<script>
// Import des composants
import gestionpc from './components/gestionpc.vue'
import monitoring from './components/monitoring.vue'

export default {
  name: 'App',

  components: {
    'gestionpc': gestionpc,
    'monitoring': monitoring
  },

  data() {
    return {
      page: 'home'   // 'home', 'gestion', ou 'monitoring'
    }
  }
}
</script>

<style scoped>
.home-container {
  text-align: center;
  margin-top: 100px;
  font-family: Arial, sans-serif;
}

.home-container h1 {
  font-size: 40px;
  margin-bottom: 40px;
}

.home-container button {
  padding: 15px 30px;
  margin: 10px;
  font-size: 18px;
  cursor: pointer;
  border: none;
  background-color: #3498db;
  color: white;
  border-radius: 8px;
}

.home-container button:hover {
  background-color: #2980b9;
}
</style>