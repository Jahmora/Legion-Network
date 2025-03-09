"use strict";

import { typeWriterEffect, printLine, createInputLine } from "./terminal.js";
import { startGame } from "./game.js";
import translations from "./translations.js";

let currentLanguage = "en"; // Langue par défaut
let isGameUnlocked = false; // Déverrouillage du jeu après installation

// Détection automatique de la langue
function detectLanguage() {
  const userLang = navigator.language || navigator.userLanguage;
  currentLanguage = userLang.toLowerCase().startsWith("fr") ? "fr" : "en";
  console.log(`Langue détectée : ${currentLanguage}`);
}

// Fonction de traduction avec gestion des placeholders
function t(key, replacements = {}) {
  let text = translations[currentLanguage]?.messages[key] || `MISSING_TRANSLATION: ${key}`;
  for (const [placeholder, value] of Object.entries(replacements)) {
    text = text.replace(`{${placeholder}}`, value);
  }
  console.log(`Traduction demandée pour "${key}": ${text}`);
  return text;
}

// Simulation de l'installation avec affichage des étapes progressives
function simulateInstallation(callback) {
  const steps = [
    t("installationStep1"),
    t("installationStep2"),
    t("installationStep3"),
    t("installationComplete")
  ];
  
  let i = 0;
  const progressBarWidth = 20;
  
  function renderProgressBar(progress) {
    const completed = Math.floor(progress / (100 / progressBarWidth));
    return "[" + "=".repeat(completed) + " ".repeat(progressBarWidth - completed) + "]";
  }
  
  function nextStep() {
    if (i < steps.length) {
      const progress = ((i + 1) / steps.length) * 100;
      printLine(steps[i]);
      printLine(renderProgressBar(progress));
      console.log(`Étape ${i + 1} terminée, progress: ${progress}%`);
      i++;
      setTimeout(nextStep, 1000); // Pause d'une seconde
    } else {
      isGameUnlocked = true;
      console.log("Installation terminée. Jeu déverrouillé.");
      printLine(t("installationComplete"));
      printLine(t("postInstallationInstructions"));
      if (callback) callback();
    }
  }
  
  nextStep();
}

// Traitement des commandes pendant la phase pré-installation
function processCommand(command) {
  const cmds = translations[currentLanguage]?.commands || {};
  console.log(`Commande reçue (pré-installation) : "${command}"`);
  printLine(`$ ${command}`);
  
  if (command === cmds.help) {
    // Avant installation, on affiche uniquement les commandes limitées
    printLine(t("limitedCommands"));
  } else if (command === cmds.installer) {
    console.log("Commande reconnue : installer");
    simulateInstallation(() => {
      // Une fois l'installation terminée, le jeu démarre dans game.js.
      startGame(currentLanguage);
    });
  } else {
    printLine(t("commandNotRecognized"));
  }
}

// Attacher l'écouteur pour la phase pré-installation
function attachInstallerListener() {
  const inputLine = createInputLine();
  if (!inputLine) {
    console.error("Élément d'entrée introuvable.");
    return;
  }
  // Pour cette phase, on réinitialise l'écouteur à chaque "Enter" sans utiliser { once: true }
  inputLine.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const command = inputLine.value.trim().toLowerCase();
      console.log(`Commande saisie : "${command}"`);
      processCommand(command);
      inputLine.value = "";
    }
  });
}

// Lancement de l'application
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM entièrement chargé. Initialisation de l'application.");
  setTimeout(() => {
    const splash = document.getElementById("splash-screen");
    const app = document.getElementById("app");
    if (splash) splash.style.display = "none";
    if (app) app.style.display = "flex";
    console.log("Splash screen masqué. Interface terminal affichée.");
    
    detectLanguage();
    
    typeWriterEffect(t("consentQuestion") + "\n", () => {
      printLine(t("welcome"));
      attachInstallerListener();
    });
  }, 3000);
});

