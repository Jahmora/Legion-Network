"use strict";

import { typeWriterEffect, printLine, createInputLine } from "./terminal.js";
import { startGame } from "./game.js";
import translations from "./translations.js";

let currentLanguage = "en"; // Langue par défaut
let isGameUnlocked = false; // État pour verrouiller/déverrouiller les commandes

// Détection de la langue
function detectLanguage() {
  const userLang = navigator.language || navigator.userLanguage;
  currentLanguage = userLang.toLowerCase().startsWith("fr") ? "fr" : "en";
  console.log(`Langue détectée : ${currentLanguage}`);
}

// Fonction de traduction avec gestion des placeholders dynamiques
function t(key, replacements = {}) {
  let text = translations[currentLanguage]?.messages[key] || `MISSING_TRANSLATION: ${key}`;
  for (const [placeholder, value] of Object.entries(replacements)) {
    text = text.replace(`{${placeholder}}`, value);
  }
  return text;
}

// Simulation de l'installation
function simulateInstallation(callback) {
  const steps = [
    t("installationStep1"),
    t("installationStep2"),
    t("installationStep3"),
    t("installationComplete"),
  ];

  let i = 0;
  const progressBarWidth = 20;

  function renderProgressBar(progress) {
    const completed = Math.floor(progress / (100 / progressBarWidth));
    const bar = "[" + "=".repeat(completed) + " ".repeat(progressBarWidth - completed) + "]";
    return bar;
  }

  function nextStep() {
    if (i < steps.length) {
      const progress = ((i + 1) / steps.length) * 100;
      printLine(steps[i]);
      printLine(renderProgressBar(progress));
      i++;
      setTimeout(nextStep, 1000); // Pause d'une seconde entre chaque étape
    } else {
      isGameUnlocked = true; // Déverrouiller le jeu
      console.log("Installation terminée. Les commandes du jeu sont désormais disponibles.");
      printLine(t("installationComplete"));

      // Ajouter des instructions pour l'utilisateur
      printLine(t("postInstallationInstructions"));

      if (callback) callback(); // Appeler le callback après l'installation
    }
  }

  nextStep();
}

// Initialisation de l'application
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM chargé. Initialisation de l'application.");

  setTimeout(() => {
    document.getElementById("splash-screen").style.display = "none";
    document.getElementById("app").style.display = "flex";
    console.log("Splash screen masqué. Terminal affiché.");

    detectLanguage();
    typeWriterEffect(t("consentQuestion") + "\n", () => {
      printLine(t("welcome"));

      const inputLine = createInputLine();
      if (!inputLine) {
        console.error("Impossible de trouver l'élément d'entrée utilisateur.");
        return;
      }

      inputLine.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const command = inputLine.value.trim().toLowerCase();
          console.log(`Commande reçue : ${command}`);

          if (command === translations[currentLanguage].commands.installer) {
            console.log("Commande reconnue : installer");
            simulateInstallation(() => {
              startGame(currentLanguage); // Lancer le jeu après l'installation et les instructions
            });
          } else if (command === translations[currentLanguage].commands.help) {
            // Afficher les commandes disponibles
            if (isGameUnlocked) {
              printLine(t("availableCommands")); // Toutes les commandes disponibles
            } else {
              printLine(t("limitedCommands")); // Commandes limitées avant installation
            }
          } else if (isGameUnlocked) {
            // Commandes disponibles après installation
            if (command in translations[currentLanguage].commands) {
              console.log(`Commande reconnue après installation : ${command}`);
              printLine(t("commandReceived", { command })); // Feedback sur la commande
            } else {
              printLine(t("commandNotRecognized"));
            }
          } else {
            // Commandes non disponibles avant installation
            printLine(t("commandNotRecognized"));
          }

          inputLine.value = ""; // Réinitialiser l'entrée utilisateur
        }
      });
    });
  }, 3000);
});

