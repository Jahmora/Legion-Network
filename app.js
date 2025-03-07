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
  // Vérifier que les commandes sont chargées
  if (!translations[currentLanguage] || !translations[currentLanguage].commands) {
    printLine("Error: Commands not properly loaded for the selected language.");
    return;
  }

  const commands = translations[currentLanguage].commands; // Commandes traduites
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
setTimeout(() => {
  document.getElementById("splash-screen").style.display = "none";
  document.getElementById("app").style.display = "flex";

  detectLanguage(); // Détecter la langue
  typeWriterEffect(t("consentQuestion") + "\n", () => {
    bootSequence(() => {
      startTerminal();
    });
  });
}, 3000);

