#include <WiFi.h>  // Bibliothèque pour ESP32

// Remplace par le nom et mot de passe de ton WiFi
const char* ssid = "TON_SSID";       
const char* password = "TON_MDP";    

void setup() {
  Serial.begin(115200);    // Démarrage du moniteur série
  delay(1000);

  Serial.println();
  Serial.println("Connexion au WiFi...");

  WiFi.begin(ssid, password);  // Connexion au WiFi

  // Attendre la connexion
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connecté !");
  Serial.print("Adresse IP : ");
  Serial.println(WiFi.localIP());  // Affiche l'adresse IP de l'ESP32
}

void loop() {
  // Ici tu peux mettre le code de ton Smart Switch
  // Exemple simple : afficher l'état du WiFi toutes les 5 secondes
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("WiFi toujours connecté ✅");
  } else {
    Serial.println("WiFi perdu ❌, tentative de reconnexion...");
    WiFi.begin(ssid, password);
  }
  delay(5000);
}
