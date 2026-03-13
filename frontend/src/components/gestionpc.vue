<template>
    <div class="gestion-pc">
  
      <h2>Formulaire</h2>
  
      <div class="form">
        <label>Nom PC :</label>
        <input v-model="nomPc" type="text" placeholder="Entrez le nom du PC">
  
        <label>Adresse IP :</label>
        <input v-model="ipPc" type="text" placeholder="Entrez l'adresse IP">
      </div>
  
      <div class="buttons">
        <button @click="ajouterPc">Ajouter</button>
        <button @click="supprimerPc" :disabled="pcs.length === 0">Supprimer</button>
        <button @click="$emit('retour')">Voir</button>
      </div>
  
      <h3>Liste des PC</h3>
  
      <table v-if="pcs.length > 0" border="1">
        <thead>
          <tr>
            <th>#</th>
            <th>Nom PC</th>
            <th>Adresse IP</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(pc,index) in pcs" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ pc.nom }}</td>
            <td>{{ pc.ip }}</td>
          </tr>
        </tbody>
      </table>
  
      <p v-else>Aucun PC ajouté.</p>
  
    </div>
  </template>
  
  <script>
  export default {
    name: "GestionPc",
  
    data() {
      return {
        nomPc: '',
        ipPc: '',
        pcs: []
      }
    },
  
    methods: {
      ajouterPc() {
        if (this.nomPc && this.ipPc) {
          this.pcs.push({
            nom: this.nomPc,
            ip: this.ipPc
          });
  
          // Réinitialise les champs
          this.nomPc = '';
          this.ipPc = '';
        } else {
          alert("Veuillez remplir tous les champs !");
        }
      },
  
      supprimerPc() {
        if (this.pcs.length > 0) {
          this.pcs.pop();
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .gestion-pc {
    text-align: center;
    font-family: Arial, sans-serif;
    margin: 40px auto;
    max-width: 700px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 0 15px rgba(0,0,0,0.1);
  }
  
  .gestion-pc h2 {
    margin-bottom: 20px;
    color: #333;
  }
  
  .form {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .form label {
    font-weight: bold;
    margin-right: 5px;
    line-height: 32px;
  }
  
  .form input {
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    width: 200px;
  }
  
  .buttons {
    margin: 20px 0;
  }
  
  button {
    margin: 5px;
    padding: 10px 25px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 8px;
    color: white;
    background-color: #3498db;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #2980b9;
  }
  
  button:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
  
  table {
    margin: auto;
    border-collapse: collapse;
    width: 100%;
    max-width: 600px;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0,0,0,0.05);
  }
  
  th, td {
    padding: 12px 15px;
    text-align: center;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background-color: #3498db;
    color: white;
  }
  
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  
  p {
    color: #777;
    margin-top: 20px;
    font-style: italic;
  }
  </style>