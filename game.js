"use strict";

import { printLine, createInputLine } from "./terminal.js";
import translations from "./translations.js";

// Initialisation du jeu
export function startGame(language) {
  console.log("Démarrage du jeu après la commande 'installer'. Langue :", language);

  const commands = translations[language]?.commands;
  const messages = translations[language]?.messages;

  // Variables du jeu
  const terrain = Array(10).fill(null).map(() => Array(20).fill("."));
  const resources = { energy: 50, blocks: 10 };
  const constructions = { nodes: 0, roads: 0 };

  // Afficher le terrain
  function renderTerrain() {
    console.log("Affichage du terrain.");
    terrain.forEach((line) => printLine(line.join("")));
  }

  // Gestion des commandes utilisateur
  function handleCommand(action) {
    console.log(`Commande reçue : ${action}`);
    if (action === commands.dig) {
      resources.blocks += 5;
      printLine(messages.diggingMessage);
    } else if (action === commands.buildNode) {
      if (resources.energy >= 10 && resources.blocks >= 5) {
        constructions.nodes++;
        resources.energy -= 10;
        resources.blocks -= 5;
        terrain[5][5] = "N";
        printLine(messages.buildNodeSuccess);
      } else {
        printLine(messages.insufficientResourcesNode);
      }
    } else if (action === commands.buildRoad) {
      if (resources.blocks >= 3) {
        constructions.roads++;
        resources.blocks -= 3;
        terrain[6][5] = "-";
        printLine(messages.buildRoadSuccess);
      } else {
        printLine(messages.insufficientResourcesRoad);
      }
    } else if (action === commands.state) {
      printLine(messages.stateDisplay.replace("{energy}", resources.energy).replace("{blocks}", resources.blocks));
      printLine(messages.constructionsDisplay.replace("{nodes}", constructions.nodes).replace("{roads}", constructions.roads));
    } else if (action === commands.quit) {
      printLine(messages.quitMessage);
      console.log("Fin du jeu.");
      return;
    } else {
      printLine(messages.commandNotRecognized);
    }

    renderTerrain(); // Mettre à jour le terrain après chaque commande
  }

  // Initialisation du terminal pour le jeu
  renderTerrain();

  const inputLine = createInputLine();
  if (!inputLine) {
    console.error("Impossible de trouver l'élément d'entrée utilisateur pour le jeu.");
    return;
  }

  inputLine.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const action = inputLine.value.trim().toLowerCase(); // Normaliser en minuscule
      handleCommand(action);
      inputLine.value = ""; // Réinitialiser l'entrée utilisateur
    }
  });
}
