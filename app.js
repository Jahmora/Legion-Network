"use strict";

import { typeWriterEffect, printLine, createInputLine } from "./terminal.js";

let currentLanguage = "en"; // Langue par défaut

// Détection automatique de la langue
function detectLanguage() {
  const userLang = navigator.language || navigator.userLanguage;
  currentLanguage = userLang.toLowerCase().startsWith("fr") ? "fr" : "en";
  console.log(`Langue détectée : ${currentLanguage}`);
}

// Fonction de traduction
function t(key) {
  return translations[currentLanguage]?.[key] || `MISSING_TRANSLATION: ${key}`;
}

// Mise à jour du panneau de statut
function updateStatusPanel() {
  const statusInfo = document.getElementById("status-info");
  if (!statusInfo) {
    console.error("Élément #status-info introuvable !");
    return;
  }

  // Mettre à jour le contenu de #status-info
  statusInfo.innerHTML = `
    <p>Nodes Connected: 3</p>
    <p>Blocks Created: 0</p>
    <p>Total Legion: 10000</p>
  `;
}

// Séquence d'initialisation (imitation de boot)
function bootSequence(callback) {
  typeWriterEffect("Initialisation du système...\n", () => {
    setTimeout(() => {
      typeWriterEffect("Chargement des services Legion Network...\n", callback);
    }, 1000);
  });
}

// Fonction pour démarrer le terminal
function startTerminal() {
  updateStatusPanel(); // Charger le statut initial
  setInterval(updateStatusPanel, 5000); // Mettre à jour le statut toutes les 5 secondes

  typeWriterEffect(t("welcome"), () => {
    const inputLine = createInputLine();
    inputLine.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        processCommand(inputLine.value.trim());
        inputLine.value = "";
      }
    });
  });
}

// Traitement des commandes utilisateur
function processCommand(command) {
  const commands = translations[currentLanguage]?.commands || {};
  printLine(`$ ${command}`); // Afficher la commande saisie

  if (command === commands.help) {
    printLine(t("availableCommands"));
  } else if (command === commands.clear) {
    document.getElementById("output").innerHTML = "";
  } else if (command === commands.exit) {
    printLine(currentLanguage === "fr" ? "Au revoir !" : "Goodbye!");
  } else {
    printLine(t("commandNotRecognized"));
  }
}

// Lancement de l'application
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.getElementById("splash-screen").style.display = "none";
    document.getElementById("app").style.display = "flex";

    detectLanguage(); // Détecter automatiquement la langue
    typeWriterEffect(t("consentQuestion") + "\n", () => {
      bootSequence(() => {
        startTerminal();
      });
    });
  }, 3000);
});
