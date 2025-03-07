"use strict";

// État global de l'application
let blockchainStatus = {
  nodes: 3,
  blocks: 0,
  totalLegion: 10000,
};

let currentLanguage = "fr"; // Langue par défaut (Français)

// Sauvegarde et récupération des données via localStorage
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
    <p>Noeuds connectés : ${blockchainStatus.nodes}</p>
    <p>Blocs créés : ${blockchainStatus.blocks}</p>
    <p>Total de Legion ($Legion) : ${blockchainStatus.totalLegion}</p>
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
    } else if (callback) {
      callback();
    }
  }

  typeChar();
}

// Gestion des commandes du terminal
function processCommand(command) {
  const output = document.getElementById("output");
  command = command.trim().toLowerCase();

  if (command === "help") {
    output.innerHTML += "\nCommandes disponibles :\n";
    output.innerHTML += "  - help : Voir la liste des commandes\n";
    output.innerHTML += "  - status : Affiche l'état actuel du réseau\n";
    output.innerHTML += "  - mine : Simule le minage d'un bloc\n";
  } else if (command === "status") {
    output.innerHTML += `\nNoeuds connectés : ${blockchainStatus.nodes}\n`;
    output.innerHTML += `Blocs créés : ${blockchainStatus.blocks}\n`;
    output.innerHTML += `Total de $Legion : ${blockchainStatus.totalLegion}\n`;
  } else if (command === "mine") {
    blockchainStatus.blocks += 1;
    blockchainStatus.totalLegion += 500;
    saveBlockchainData();
    output.innerHTML += "\nBloc miné avec succès ! +500 $Legion ajoutés.\n";
    updateStatusPanel();
  } else {
    output.innerHTML += `\nCommande inconnue : "${command}"\n`;
  }

  output.scrollTop = output.scrollHeight;
}

// Initialisation de l'application
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("command-input");
  const splashScreen = document.getElementById("splash-screen");
  const appContainer = document.getElementById("app");

  // Écran de démarrage
  setTimeout(() => {
    splashScreen.style.display = "none";
    appContainer.style.display = "block";

    loadBlockchainData();
    updateStatusPanel();

    typeWriterEffect("Bienvenue sur le réseau Legion ! Tapez 'help' pour commencer.\n");
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

  // Forcer le focus sur mobile lorsque le terminal est cliqué
  document.getElementById("terminal").addEventListener("click", () => {
    input.focus();
  });

  // Gérer les comportements tactiles sur mobile
  input.addEventListener("touchstart", (e) => {
    e.preventDefault();
    input.focus();
  });
});
