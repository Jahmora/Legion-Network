"use strict";

// État global de l'application
let blockchainStatus = {
  nodes: 3,
  blocks: 0,
  totalLegion: 10000,
};

let currentLanguage = "fr"; // Par défaut, Français

// Sauvegarde et récupération des données avec localStorage
function saveBlockchainData() {
  localStorage.setItem("blockchainStatus", JSON.stringify(blockchainStatus));
}

function loadBlockchainData() {
  const savedData = localStorage.getItem("blockchainStatus");
  if (savedData) {
    blockchainStatus = JSON.parse(savedData);
  }
}

// Mise à jour du panneau de statut
function updateStatusPanel() {
  const statusInfo = document.getElementById("status-info");
  statusInfo.innerHTML = `
    <p>${t("nodesConnected")} ${blockchainStatus.nodes}</p>
    <p>${t("blocksCreated")} ${blockchainStatus.blocks}</p>
    <p>${t("totalLegion")} ${blockchainStatus.totalLegion}</p>
  `;
}

// Effet de machine à écrire pour le terminal
function typeWriterEffect(text, callback) {
  const output = document.getElementById("output");
  let i = 0;

  function typeChar() {
    if (i < text.length) {
      output.innerHTML += text.charAt(i);
      i++;
      output.scrollTop = output.scrollHeight;
      setTimeout(typeChar, 20);
    } else {
      if (callback) callback();
    }
  }

  typeChar();
}

// Gestion des commandes dans le terminal
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
    if (message) {
      output.innerHTML += `\n${message}\n`;
      updateStatusPanel();
    } else {
      output.innerHTML += `\n${t("languageNotRecognized")}\n`;
    }
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

  // Chargement initial avec écran d'accueil
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

  // Compatibilité mobile (empêche comportements tactiles non souhaités)
  document.getElementById("terminal").addEventListener("touchstart", (e) => {
    e.preventDefault();
  });
});
