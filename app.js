"use strict";

import { typeWriterEffect, printLine, createInputLine } from "./terminal.js";
import { startGame } from "./game.js";
import translations from "./translations.js";

let currentLanguage = "en"; // Langue par défaut
let isGameUnlocked = false;   // Devient true après l'installation
let config = {};              // Stocke la configuration du nœud

// Détecte automatiquement la langue (français ou anglais)
function detectLanguage() {
  const userLang = navigator.language || navigator.userLanguage;
  currentLanguage = userLang.toLowerCase().startsWith("fr") ? "fr" : "en";
  window.currentLanguage = currentLanguage; // Stocker globalement
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

// Phase de configuration du nœud (nom et niveau d’investissement)
function configureNode(callback) {
  const input = createInputLine();
  if (!input) {
    console.error("Élément d'entrée introuvable pour la configuration.");
    return;
  }
  
  // Demande du nom du nœud
  printLine("Configuration : Entrez le nom de votre nœud :");
  input.addEventListener("keydown", function handleName(e) {
    if (e.key === "Enter") {
      const nodeName = input.value.trim();
      config.name = nodeName;
      printLine(`Nom du nœud défini : ${nodeName}`);
      input.value = "";
      input.removeEventListener("keydown", handleName);
      
      // Demande du niveau d'investissement initial
      printLine("Configuration : Entrez le niveau d'investissement initial (ex : 1, 2, 3) :");
      input.addEventListener("keydown", function handleInvestment(ev) {
        if (ev.key === "Enter") {
          const investment = ev.target.value.trim();
          config.investment = investment;
          printLine(`Niveau d'investissement défini : ${investment}`);
          ev.target.value = "";
          ev.target.removeEventListener("keydown", handleInvestment);
          printLine(`Configuration terminée. Votre nœud "${config.name}" avec investissement ${config.investment} est prêt.`);
          printLine("Tapez 'installer' pour lancer l'amorçage de votre nœud.");
          if (callback) callback();
        }
      });
    }
  });
}

// Simulation de l'installation avec affichage progressif (barre ASCII)
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
      console.log(`Étape ${i + 1}/${steps.length} terminée, progress: ${progress}%`);
      i++;
      setTimeout(nextStep, 1000);
    } else {
      isGameUnlocked = true;
      console.log("Installation terminée. Le jeu est désormais déverrouillé.");
      printLine(t("installationComplete"));
      printLine(t("postInstallationInstructions"));
      if (callback) callback();
    }
  }
  nextStep();
}

// Traitement des commandes en phase pré-installation (seule commande "aide" et "installer" sont autorisées)
function processPreInstallCommand(command) {
  const cmds = translations[currentLanguage]?.commands || {};
  printLine(`$ ${command}`);
  
  if (command === cmds.help) {
    printLine(t("limitedCommands"));
  } else if (command === cmds.installer) {
    console.log("Commande reconnue : installer");
    simulateInstallation(() => {
      // Une fois l'installation terminée, le jeu démarre et l'input pour le jeu sera recréé dans game.js
      startGame(currentLanguage, config);
    });
  } else {
    printLine(t("commandNotRecognized"));
  }
}

// Attacher un listener pour la phase pré-installation qui reste actif jusqu'à ce que la commande soit validée
function attachPreInstallListener() {
  const input = createInputLine();
  if (!input) {
    console.error("Élément d'entrée introuvable pour la phase pré-installation.");
    return;
  }
  console.log("Listener pré-installation attaché sur l'input.");
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const command = input.value.trim().toLowerCase();
      console.log(`Commande saisie (pré-installation) : "${command}"`);
      processPreInstallCommand(command);
      input.value = "";
    }
  });
}

// Lancement de l'application
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM entièrement chargé. Initialisation de l'application.");
  setTimeout(() => {
    const splash = document.getElementById("splash-screen");
    const app = document.getElementById("app");
    if (splash) {
      splash.style.display = "none";
      console.log("Splash screen masqué.");
    }
    if (app) {
      app.style.display = "flex";
      console.log("Interface terminal affichée.");
    }
    
    // Démarrer la phase de lancement
    detectLanguage();
    typeWriterEffect(t("consentQuestion") + "\n", () => {
      printLine(t("welcome"));
      // Lancer la configuration du nœud
      configureNode(() => {
        // Une fois la configuration terminée, attacher l'écouteur pour la phase pré-installation
        attachPreInstallListener();
      });
    });
  }, 3000);
});
