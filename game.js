"use strict";

import { printLine, createInputLine } from "./terminal.js";
import translations from "./translations.js";

// Fonction principale qui démarre le jeu
export function startGame(language) {
  console.log("Démarrage du jeu. Langue :", language);
  
  const cmds = translations[language]?.commands;
  const messages = translations[language]?.messages;
  
  // Initialisation du terrain (10x20), des ressources et des constructions
  const terrain = Array.from({ length: 10 }, () => Array(20).fill("."));
  const resources = { energy: 50, blocks: 10 };
  const constructions = { nodes: 0, roads: 0 };
  
  // Affiche le terrain dans le terminal
  function renderTerrain() {
    // Pour éviter que l'affichage du terrain s'accumule, on peut nettoyer temporairement ou (alternativement) l'afficher après un séparateur.
    printLine("----- Terrain mis à jour -----");
    terrain.forEach((line) => printLine(line.join("")));
  }
  
  // Met à jour et affiche un résumé de l'état du jeu dans une section dédiée, par exemple.
  function displayState() {
    let stateText = messages.stateDisplay
      .replace("{energy}", resources.energy)
      .replace("{blocks}", resources.blocks);
    let consText = messages.constructionsDisplay
      .replace("{nodes}", constructions.nodes)
      .replace("{roads}", constructions.roads);
    printLine(stateText);
    printLine(consText);
  }
  
  // Fonction pour gérer l'action "creuser" (dig)
  function doDig() {
    resources.blocks += 5;
    printLine(messages.diggingMessage);
  }
  
  // Fonction pour gérer l'action "batir noeud" (build node)
  function doBuildNode() {
    if (resources.energy >= 10 && resources.blocks >= 5) {
      constructions.nodes++;
      resources.energy -= 10;
      resources.blocks -= 5;
      terrain[5][5] = "N"; // Place le noeud sur le terrain
      printLine(messages.buildNodeSuccess);
    } else {
      printLine(messages.insufficientResourcesNode);
    }
  }
  
  // Fonction pour gérer l'action "construire route" (build road)
  function doBuildRoad() {
    if (resources.blocks >= 3) {
      constructions.roads++;
      resources.blocks -= 3;
      terrain[6][5] = "-"; // Place la route sur le terrain
      printLine(messages.buildRoadSuccess);
    } else {
      printLine(messages.insufficientResourcesRoad);
    }
  }
  
  // Fonction pour traiter la commande de l'utilisateur dans le jeu
  function handleGameCommand(action) {
    console.log(`Commande jeu reçue : "${action}"`);
    switch (action) {
      case cmds.help:
        printLine(messages.availableCommands);
        break;
      case cmds.dig:
        doDig();
        break;
      case cmds.buildNode:
        doBuildNode();
        break;
      case cmds.buildRoad:
        doBuildRoad();
        break;
      case cmds.state:
        displayState();
        break;
      case cmds.quit:
        printLine(messages.quitMessage);
        console.log("Fin du jeu.");
        return;
      default:
        printLine(messages.commandNotRecognized);
        break;
    }
    renderTerrain();
  }
  
  // Ajout d'un listener sur l'input pour le mode jeu
  const input = createInputLine();
  if (!input) {
    console.error("Impossible de trouver l'élément d'entrée pour le jeu.");
    return;
  }
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const action = input.value.trim().toLowerCase();
      handleGameCommand(action);
      input.value = "";
    }
  });

  // Option n°1 : Mettre à jour périodiquement l’état du jeu (ex : régénération d'énergie)
  setInterval(() => {
    // Augmenter légèrement l'énergie chaque 10 secondes
    resources.energy = Math.min(resources.energy + 1, 100);
    // Afficher l'état actualisé au hasard (optionnel)
    // displayState();
  }, 10000);
}

