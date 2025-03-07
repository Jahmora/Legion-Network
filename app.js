"use strict";

// État global de l'application
let blockchainStatus = {
  nodes: 3,
  blocks: 0,
  totalLegion: 10000,
};

let currentLanguage = "en"; // Valeur par défaut : Anglais

// Détecte automatiquement la langue du navigateur de l'utilisateur
function detectLanguage() {
  const userLang = navigator.language || navigator.userLanguage; // Ex : "fr", "en-US"
  if (userLang.startsWith("fr")) {
    currentLanguage = "fr";
  } else {
    currentLanguage = "en";
  }
}

// Traductions disponibles
const translations = {
  en: {
    commands: {
      help: "help",
      status: "status",
      mine: "mine",
    },
    welcome: "Welcome to Legion Network! Type 'help' to get started.",
    commandNotRecognized: "Command not recognized. Type 'help' for a list of commands.",
    statusMessage: "Current network status:",
    nodesConnected: "Nodes connected:",
    blocksCreated: "Blocks created:",
    totalLegion: "Total $Legion supply:",
    availableCommands: "Available commands: help, status, mine",
    blockMinedSuccess: "Block mined successfully! +500 $Legion added.",
    languageChanged: "Language changed to English.",
    languageNotRecognized: "Language not recognized. Use 'lang en' or 'lang fr'.",
  },
  fr: {
    commands: {
      help: "aide",
      status: "statut",
      mine: "miner",
    },
    welcome: "Bienvenue dans le réseau Legion ! Tapez 'aide' pour commencer.",
    commandNotRecognized: "Commande non reconnue. Tapez 'aide' pour voir la liste des commandes.",
    statusMessage: "Statut actuel du réseau :",
    nodesConnected: "Noeuds connectés :",
    blocksCreated: "Blocs créés :",
    totalLegion: "Total $Legion disponible :",
    availableCommands: "Commandes disponibles : aide, statut, miner",
    blockMinedSuccess: "Bloc miné avec succès ! +500 $Legion ajoutés.",
    languageChanged: "Langue changée en Français.",
    languageNotRecognized: "Langue non reconnue. Utilisez 'lang fr' ou 'lang en'.",
  },
};

// Fonction pour récupérer les traductions
function t(key) {
  return translations[currentLanguage][key] || `MISSING_TRANSLATION: ${key}`;
}

// Change dynamiquement la langue (si commandée par l'utilisateur)
function changeLanguage(langCode) {
  if (translations[langCode]) {
    currentLanguage = langCode;
    return t("languageChanged");
  }
  return t("languageNotRecognized");
}

// Sauvegarde et récupération de l'état via localStorage
function saveBlockchainData() {
  localStorage.setItem("blockchainStatus", JSON.stringify(blockchainStatus));
}

function loadBlockchainData() {
  const savedData = localStorage.getItem("blockchainStatus");
  if (savedData) {
    blockchainStatus = JSON.parse(savedData);
  }
}

// Met à jour le panneau de statut
function updateStatusPanel() {
  const statusInfo = document.getElementById("status-info");
  statusInfo.innerHTML = `
    <p>${t("nodesConnected")} ${blockchainStatus.nodes}</p>
    <p>${t("blocksCreated")} ${blockchainStatus.blocks}</p>
    <p>${t("totalLegion")} ${blockchainStatus.totalLegion}</p>
  `;
}

// Effet de machine à écrire
function typeWriterEffect(text, callback) {
  const output = document.getElementById("output");
  let i = 0;

  function typeChar() {
    if (i < text.length) {
      output.innerHTML += text.charAt(i);
      i++;
      output.scrollTop = output.scrollHeight;
      setTimeout(typeChar, 20);
    } else if (callback) {
      callback();
    }
  }

  typeChar();
}

// Gère les commandes du terminal
function processCommand(command) {
  const output = document.getElementById("output");
  command = command.trim().toLowerCase();

  const commands = translations[currentLanguage].commands;

  if (command === commands.help) {
    output.innerHTML += `\n${t("availableCommands")}\n`;
  } else if (command === commands.status) {
    output.innerHTML += `\n${t("statusMessage")}\n`;
    output.innerHTML += `${t("nodesConnected")} ${blockchainStatus.nodes}\n`;
    output.innerHTML += `${t("blocksCreated")} ${blockchainStatus.blocks}\n`;
    output.innerHTML += `${t("totalLegion")} ${blockchainStatus.totalLegion}\n`;
  } else if (command === commands.mine) {
    blockchainStatus.blocks += 1;
    blockchainStatus.totalLegion += 500;
    saveBlockchainData();
    output.innerHTML += `\n${t("blockMinedSuccess")}\n`;
    updateStatusPanel();
  } else if (command.startsWith("lang")) {
    const langCode = command.split(" ")[1];
    const message = changeLanguage(langCode);
    output.innerHTML += `\n${message}\n`;
    updateStatusPanel();
  } else {
    output.innerHTML += `\n${t("commandNotRecognized")}\n`;
  }

  output.scrollTop = output.scrollHeight;
}

// Initialisation de l'application
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("command-input");
  const splashScreen = document.getElementById("splash-screen");
  const appContainer = document.getElementById("app");

  // Détecte automatiquement la langue
  detectLanguage();

  // Écran de démarrage
  setTimeout(() => {
    splashScreen.style.display = "none";
    appContainer.style.display = "block";

    loadBlockchainData();
    updateStatusPanel();

    typeWriterEffect(t("welcome"));
  }, 3000);

  // Gestion des entrées utilisateur
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const command = input.value;
      document.getElementById("output").innerHTML += `$ ${command}\n`;
      processCommand(command);
      input.value = "";
    }
  });

  // Comportement mobile : Forcer le focus
  document.getElementById("terminal").addEventListener("click", () => {
    input.focus();
  });

  input.addEventListener("touchstart", (e) => {
    e.preventDefault();
    input.focus();
  });
});
