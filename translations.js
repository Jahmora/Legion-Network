// Gestion des traductions
const translations = {
  en: {
    commands: {
      help: "help",
      status: "status",
      mine: "mine",
    },
    welcome: "Welcome to Legion Network! Type 'help' to get started.",
    consentQuestion: "Do you agree to participate? (yes/no)",
    consentAccepted: "Consent accepted. Thank you!",
    consentRejected: "Consent rejected. Please confirm again.",
    commandNotRecognized: "Command not recognized. Type 'help' for a list of commands.",
    statusMessage: "Current network status:",
    nodesConnected: "Nodes connected:",
    blocksCreated: "Blocks created:",
    totalLegion: "Total $Legion supply:",
    availableCommands: "Available commands: help, status, mine",
  },
  fr: {
    commands: {
      help: "aide",
      status: "statut",
      mine: "miner",
    },
    welcome: "Bienvenue dans le réseau Legion ! Tapez 'aide' pour commencer.",
    consentQuestion: "Acceptez-vous de participer ? (oui/non)",
    consentAccepted: "Consentement accepté. Merci !",
    consentRejected: "Consentement refusé. Veuillez confirmer à nouveau.",
    commandNotRecognized: "Commande non reconnue. Tapez 'aide' pour une liste des commandes.",
    statusMessage: "Statut actuel du réseau :",
    nodesConnected: "Noeuds connectés :",
    blocksCreated: "Blocs créés :",
    totalLegion: "Total $Legion disponible :",
    availableCommands: "Commandes disponibles : aide, statut, miner",
  },
};

// Fonction pour traduire le contenu en fonction de la langue sélectionnée
function t(key) {
  const lang = currentLanguage || "en"; // Langue par défaut : Anglais
  return translations[lang][key] || `MISSING_TRANSLATION: ${key}`;
}

// Fonction pour changer la langue en temps réel
function changeLanguage(langCode) {
  if (translations[langCode]) {
    currentLanguage = langCode;
    return currentLanguage === "fr"
      ? "Langue changée en Français."
      : "Language changed to English.";
  }
  return null; // Langue non prise en charge
}
