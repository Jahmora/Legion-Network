const translations = {
  en: {
    commands: {
      help: "help",
      clear: "clear",
      exit: "exit",
      installer: "installer",
      dig: "dig",
      buildNode: "build node",
      buildRoad: "build road",
      state: "state",
      quit: "quit"
    },
    messages: {
      consentQuestion: "By using this service for mining $Legion, you consent to use Legion Network's services.",
      welcome: "Welcome to Legion Network! Type 'help' to get started.",
      limitedCommands: "Available commands: help, installer.",
      availableCommands: "Available commands: help, clear, exit, installer, dig, build node, build road, state, quit.",
      installationStep1: "Downloading files...",
      installationStep2: "Extracting resources...",
      installationStep3: "Installing dependencies...",
      installationComplete: "Installation complete!",
      postInstallationInstructions: "You can now interact with the system. Use 'dig' to mine blocks, 'build node' to set up a blockchain node, or 'help' to see all commands.",
      commandReceived: "You executed: {command}",
      commandNotRecognized: "Command not recognized. Type 'help' for the list of commands."
    }
  },
  fr: {
    commands: {
      help: "aide",
      clear: "clear",
      exit: "exit",
      installer: "installer",
      dig: "creuser",
      buildNode: "batir noeud",
      buildRoad: "construire route",
      state: "etat",
      quit: "quitter"
    },
    messages: {
      consentQuestion: "En utilisant ce service pour le minage de $Legion, vous consentez à utiliser les services de Legion Network.",
      welcome: "Bienvenue dans le réseau Legion ! Tapez 'aide' pour commencer.",
      limitedCommands: "Commandes disponibles : aide, installer.",
      availableCommands: "Commandes disponibles : aide, clear, exit, installer, creuser, batir noeud, construire route, etat, quitter.",
      installationStep1: "Téléchargement des fichiers...",
      installationStep2: "Extraction des ressources...",
      installationStep3: "Installation des dépendances...",
      installationComplete: "Installation terminée !",
      postInstallationInstructions: "Vous pouvez maintenant interagir avec le système. Utilisez 'creuser' pour miner des blocs, 'batir noeud' pour établir un noeud blockchain, ou 'aide' pour voir toutes les commandes.",
      commandReceived: "Vous avez exécuté : {command}",
      commandNotRecognized: "Commande non reconnue. Tapez 'aide' pour voir la liste des commandes."
    }
  }
};

export default translations;

