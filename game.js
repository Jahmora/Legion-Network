"use strict";

import { printLine } from "./terminal.js";
import translations from "./translations.js";

// Fonctions de sauvegarde et de chargement de l'état du jeu
function saveGameState(state) {
  localStorage.setItem("gameState", JSON.stringify(state));
  console.log("État du jeu sauvegardé.");
}

function loadGameState() {
  const state = localStorage.getItem("gameState");
  return state ? JSON.parse(state) : null;
}

// Fonction pour créer un panneau de commandes (boutons) dans #gameContainer
function createGameInput() {
  const gameContainer = document.getElementById("gameContainer");
  if (!gameContainer) {
    console.error("Élément #gameContainer introuvable !");
    return null;
  }
  let controlsDiv = document.getElementById("gameControls");
  if (!controlsDiv) {
    controlsDiv = document.createElement("div");
    controlsDiv.id = "gameControls";
    controlsDiv.style.position = "absolute";
    controlsDiv.style.bottom = "20px";
    controlsDiv.style.left = "50%";
    controlsDiv.style.transform = "translateX(-50%)";
    controlsDiv.style.textAlign = "center";
    controlsDiv.style.zIndex = "10";
    gameContainer.appendChild(controlsDiv);
  }
  
  // Utiliser la valeur actuelle de la langue stockée globalement
  const cmds = translations[window.currentLanguage]?.commands || {};
  
  controlsDiv.innerHTML = `
    <button id="btnHelp" class="actionButton">${cmds.help}</button>
    <button id="btnDig" class="actionButton">${cmds.dig}</button>
    <button id="btnBuildNode" class="actionButton">${cmds.buildNode}</button>
    <button id="btnBuildRoad" class="actionButton">${cmds.buildRoad}</button>
    <button id="btnState" class="actionButton">${cmds.state}</button>
    <button id="btnQuit" class="actionButton">${cmds.quit}</button>
  `;
  
  return controlsDiv;
}

export function startGame(language, config) {
  console.log("Démarrage du jeu. Langue :", language);
  console.log("Configuration du nœud :", config);
  
  const cmds = translations[language]?.commands;
  const messages = translations[language]?.messages;
  
  // Charger l'état sauvegardé ou initialiser l'état du jeu
  let savedState = loadGameState();
  let terrain, resources, constructions;
  if (savedState) {
    console.log("Reprise de l'état sauvegardé.");
    ({ terrain, resources, constructions } = savedState);
    printLine(messages.resumeGame);
  } else {
    terrain = Array.from({ length: 10 }, () => Array(20).fill("."));
    resources = { energy: 50, blocks: 10 };
    constructions = { nodes: 0, roads: 0 };
  }
  
  // Masquer l'interface terminal (du mode configuration)
  const appElement = document.getElementById("app");
  if (appElement) appElement.style.display = "none";
  
  // Afficher ou créer le conteneur de jeu graphique
  let gameContainer = document.getElementById("gameContainer");
  if (!gameContainer) {
    gameContainer = document.createElement("div");
    gameContainer.id = "gameContainer";
    gameContainer.style.width = "100vw";
    gameContainer.style.height = "100vh";
    gameContainer.style.backgroundColor = "#111";
    gameContainer.style.position = "relative";
    document.body.appendChild(gameContainer);
    console.log("Conteneur de jeu créé.");
  } else {
    gameContainer.style.display = "block";
    console.log("Conteneur de jeu affiché.");
  }
  // Nettoyer le conteneur de jeu
  gameContainer.innerHTML = "";
  
  // Créer un canvas pour le rendu graphique du jeu
  const canvas = document.createElement("canvas");
  canvas.id = "gameCanvas";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gameContainer.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  
  // Fonction de rendu graphique du mode jeu
  function drawNetwork() {
    // Créer un fond avec dégradé
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#111");
    gradient.addColorStop(1, "#333");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner le nœud utilisateur au centre
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 50;
    let nodeGradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius);
    nodeGradient.addColorStop(0, "#00ff00");
    nodeGradient.addColorStop(1, "#003300");
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = nodeGradient;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.stroke();
    
    // Afficher l'état du joueur en overlay (en haut à gauche)
    ctx.font = "20px Courier New";
    ctx.fillStyle = "#00ff00";
    ctx.textAlign = "left";
    const stateText = messages.stateDisplay
      .replace("{energy}", resources.energy)
      .replace("{blocks}", resources.blocks);
    ctx.fillText(stateText, 20, 30);
  }
  
  drawNetwork();
  
  // Fonction pour mettre à jour et sauvegarder l'état du jeu
  function updateGameState() {
    drawNetwork();
    const newState = { terrain, resources, constructions };
    saveGameState(newState);
  }
  
  // Gestion des commandes du jeu
  function handleGameCommand(action) {
    console.log(`Commande jeu reçue : "${action}"`);
    switch (action) {
      case cmds.help:
        alert(messages.availableCommands);
        break;
      case cmds.dig:
        resources.blocks += 5;
        resources.energy = Math.max(resources.energy - 2, 0);
        alert(messages.diggingMessage);
        break;
      case cmds.buildNode:
        if (resources.energy >= 10 && resources.blocks >= 5) {
          constructions.nodes++;
          resources.energy -= 10;
          resources.blocks -= 5;
          terrain[5][5] = "N";
          alert(messages.buildNodeSuccess);
        } else {
          alert(messages.insufficientResourcesNode);
        }
        break;
      case cmds.buildRoad:
        if (resources.blocks >= 3) {
          constructions.roads++;
          resources.blocks -= 3;
          terrain[6][5] = "-";
          alert(messages.buildRoadSuccess);
        } else {
          alert(messages.insufficientResourcesRoad);
        }
        break;
      case cmds.state:
        const stateText = messages.stateDisplay
          .replace("{energy}", resources.energy)
          .replace("{blocks}", resources.blocks);
        const consText = messages.constructionsDisplay
          .replace("{nodes}", constructions.nodes)
          .replace("{roads}", constructions.roads);
        alert(stateText + "\n" + consText);
        break;
      case cmds.quit:
        alert(messages.quitMessage);
        console.log("Fermeture du jeu.");
        localStorage.removeItem("gameState");
        alert(messages.shutdownMessage);
        setTimeout(() => window.close(), 2000);
        return;
      default:
        alert(messages.commandNotRecognized);
        break;
    }
    updateGameState();
  }
  
  // Créer le panneau d'entrée du jeu avec les boutons
  const controlsDiv = createGameInput();
  if (!controlsDiv) {
    console.error("Impossible de créer le panneau de commande pour le jeu.");
    return;
  }
  // Attacher les écouteurs d'événements sur les boutons
  document.getElementById("btnHelp").addEventListener("click", () => handleGameCommand(cmds.help));
  document.getElementById("btnDig").addEventListener("click", () => handleGameCommand(cmds.dig));
  document.getElementById("btnBuildNode").addEventListener("click", () => handleGameCommand(cmds.buildNode));
  document.getElementById("btnBuildRoad").addEventListener("click", () => handleGameCommand(cmds.buildRoad));
  document.getElementById("btnState").addEventListener("click", () => handleGameCommand(cmds.state));
  document.getElementById("btnQuit").addEventListener("click", () => handleGameCommand(cmds.quit));
  
  // Régénération périodique de l'énergie toutes les 10 secondes
  setInterval(() => {
    resources.energy = Math.min(resources.energy + 1, 100);
    updateGameState();
  }, 10000);
}
