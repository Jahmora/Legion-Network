"use strict";

// ---------------------------
// 1. Détection automatique de la langue
// ---------------------------
function detectLanguage() {
  const userLang = navigator.language || navigator.userLanguage;
  if (userLang.startsWith("fr")) {
    currentLanguage = "fr";
  } else {
    currentLanguage = "en";
  }
}
let currentLanguage = "en"; // Par défaut en anglais
detectLanguage();

// ---------------------------
// 2. Fonctions de traduction
// ---------------------------
function t(key) {
  return translations[currentLanguage][key] || `MISSING_TRANSLATION: ${key}`;
}
function changeLanguage(langCode) {
  if (translations[langCode]) {
    currentLanguage = langCode;
    return t("languageChanged");
  }
  return t("languageNotRecognized");
}

// ---------------------------
// 3. Gestion de la persistance (localStorage)
// ---------------------------
let blockchainStatus = localStorage.getItem("blockchainStatus")
  ? JSON.parse(localStorage.getItem("blockchainStatus"))
  : { nodes: 3, blocks: 0, totalLegion: 10000 };

let userContribution = localStorage.getItem("userContribution")
  ? JSON.parse(localStorage.getItem("userContribution"))
  : { blocksMined: 0, legionMined: 0 };

let commandHistory = localStorage.getItem("cmdHistory")
  ? JSON.parse(localStorage.getItem("cmdHistory"))
  : [];
let historyIndex = commandHistory.length;

function saveBlockchainData() {
  localStorage.setItem("blockchainStatus", JSON.stringify(blockchainStatus));
  localStorage.setItem("userContribution", JSON.stringify(userContribution));
}

function saveHistory() {
  localStorage.setItem("cmdHistory", JSON.stringify(commandHistory));
}

// ---------------------------
// 4. Mise à jour du panneau de statut
// ---------------------------
function updateStatusPanel() {
  const statusInfo = document.getElementById("status-info");
  statusInfo.innerHTML = `
    <p>${t("nodesConnected")} ${blockchainStatus.nodes}</p>
    <p>${t("blocksCreated")} ${blockchainStatus.blocks}</p>
    <p>${t("totalLegion")} ${blockchainStatus.totalLegion}</p>
  `;
}
setInterval(updateStatusPanel, 5000);
updateStatusPanel();

// ---------------------------
// 5. Effet typewriter pour le terminal
// ---------------------------
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

function printLine(text) {
  const output = document.getElementById("output");
  output.innerHTML += "\n" + text;
  output.scrollTop = output.scrollHeight;
}

function printErrorLine(text) {
  const output = document.getElementById("output");
  output.innerHTML += "\n" + text;
  output.scrollTop = output.scrollHeight;
}

// ---------------------------
// 6. Gestion des commandes du terminal
// ---------------------------
function processCommand(command) {
  printLine("$ " + command);
  const commands = translations[currentLanguage].commands;
  const output = document.getElementById("output");
  const cmd = command.trim().toLowerCase();

  if (cmd === commands.help) {
    output.innerHTML += `\n${t("availableCommands")}`;
  } else if (cmd === commands.status) {
    output.innerHTML += `\n${t("statusMessage")}`;
    output.innerHTML += `\n${t("nodesConnected")} ${blockchainStatus.nodes}`;
    output.innerHTML += `\n${t("blocksCreated")} ${blockchainStatus.blocks}`;
    output.innerHTML += `\n${t("totalLegion")} ${blockchainStatus.totalLegion}`;
  } else if (cmd === commands.mine) {
    blockchainStatus.blocks += 1;
    blockchainStatus.totalLegion += 500;
    saveBlockchainData();
    output.innerHTML += `\n${t("blockMinedSuccess")}`;
    updateStatusPanel();
  } else if (cmd.startsWith("lang")) {
    const parts = cmd.split(" ");
    if (parts.length === 2) {
      const langCode = parts[1];
      const msg = changeLanguage(langCode);
      output.innerHTML += `\n${msg}`;
      updateStatusPanel();
    } else {
      output.innerHTML += `\n${currentLanguage === "fr" ? "Usage: lang fr|en" : "Usage: lang fr|en"}`;
    }
  } else {
    output.innerHTML += `\n${t("commandNotRecognized")}`;
  }
  output.scrollTop = output.scrollHeight;
}

// ---------------------------
// 7. Gestion de la saisie utilisateur (Terminal)
// ---------------------------
function createInputLine() {
  const input = document.getElementById("command-input");
  input.focus();
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const command = input.value;
      document.getElementById("output").innerHTML += `\n$ ${command}`;
      processCommand(command);
      commandHistory.push(command);
      saveHistory();
      input.value = "";
    } else if (e.key === "ArrowUp") {
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex] || "";
      }
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input.value = "";
      }
      e.preventDefault();
    } else if (e.key === "Tab") {
      e.preventDefault();
      const currentValue = input.value.trim().toLowerCase();
      const availableCommands = Object.values(translations[currentLanguage].commands);
      const suggestions = availableCommands.filter(cmd => cmd.startsWith(currentValue));
      if (suggestions.length === 1) {
        input.value = suggestions[0];
      } else if (suggestions.length > 1) {
        printLine("Suggestions: " + suggestions.join(", "));
      }
    }
  });

  // Pour mobile : s'assurer que l'input reçoit le focus lorsque le terminal est cliqué ou touché
  const terminalDiv = document.getElementById("terminal");
  terminalDiv.addEventListener("click", () => { input.focus(); });
  input.addEventListener("touchstart", (e) => { e.preventDefault(); input.focus(); });
}

// ---------------------------
// 8. Module de Consentement
// ---------------------------
let consentGiven = false;
function createConsentInputLine() {
  const input = document.getElementById("command-input");
  input.focus();
  input.addEventListener("keydown", function onConsent(e) {
    if (e.key === "Enter") {
      const response = input.value.trim().toLowerCase();
      printLine("$ " + response);
      processConsent(response);
      input.disabled = true;
      input.removeEventListener("keydown", onConsent);
    }
  });
}

function processConsent(response) {
  if (
    (currentLanguage === "fr" && response === "oui") ||
    (currentLanguage === "en" && response === "yes")
  ) {
    consentGiven = true;
    printLine(t("consentAccepted"));
    startApplication();
  } else {
    printErrorLine(t("consentRejected"));
    createConsentInputLine();
  }
}

// ---------------------------
// 9. Module de Minage (Worker via Blob)
// ---------------------------
let minerWorker = null;
function startMiningWorker() {
  const workerCode = `
    let iterations = 100000;
    self.onmessage = function(e) {
      if(e.data.type === 'setLoad') {
        iterations = e.data.iterations;
      }
    };
    function mine() {
      let counter = 0;
      let solutionFound = false;
      while (!solutionFound && counter < iterations) {
        counter++;
        if (counter % (iterations / 10) === 0) {
          solutionFound = true;
        }
      }
      postMessage({ type: "mined", blocks: 1, legion: 500 });
    }
    setInterval(mine, 5000);
  `;
  const blob = new Blob([workerCode], { type: "application/javascript" });
  const workerURL = URL.createObjectURL(blob);
  minerWorker = new Worker(workerURL);
  minerWorker.onmessage = function (event) {
    if (event.data.type === "mined") {
      const currentMaxTokens = updateMaxTokens();
      if (blockchainStatus.totalLegion >= currentMaxTokens) {
        stopMiningWorker();
        printLine(currentLanguage === "fr"
          ? "Capacité maximale atteinte. Minage arrêté."
          : "Maximum capacity reached. Mining stopped.");
      } else {
        let minted = event.data.legion;
        if (blockchainStatus.totalLegion + minted > currentMaxTokens) {
          minted = currentMaxTokens - blockchainStatus.totalLegion;
        }
        blockchainStatus.blocks += event.data.blocks;
        blockchainStatus.totalLegion += minted;
        userContribution.blocksMined += event.data.blocks;
        userContribution.legionMined += minted;
        saveBlockchainData();
      }
    }
  };
  minerWorker.postMessage({
    type: "setLoad",
    iterations: parseInt(document.getElementById("miningLoad").value),
  });
}

function stopMiningWorker() {
  if (minerWorker) {
    minerWorker.terminate();
    minerWorker = null;
  }
}

document.getElementById("miningToggle").addEventListener("change", function () {
  if (this.checked && consentGiven) {
    startMiningWorker();
    printLine(currentLanguage === "fr" ? "Minage activé." : "Mining activated.");
  } else {
    stopMiningWorker();
    printLine(currentLanguage === "fr" ? "Minage désactivé." : "Mining deactivated.");
  }
});

// ---------------------------
// 10. Module de Mode Veille (Idle)
// ---------------------------
let idleTimer;
const idleScreen = document.getElementById("idle-screen");
function showIdleScreen() {
  idleScreen.style.display = "flex";
}
function hideIdleScreen() {
  idleScreen.style.display = "none";
}
function resetIdleTimer() {
  clearTimeout(idleTimer);
  hideIdleScreen();
  idleTimer = setTimeout(showIdleScreen, 30000); // 30 secondes d'inactivité
}

document.addEventListener("mousemove", resetIdleTimer);
document.addEventListener("keydown", resetIdleTimer);
document.addEventListener("touchstart", resetIdleTimer);
resetIdleTimer();

// ---------------------------
// 11. Lancement: Splash Screen & Demande de Consentement
// ---------------------------
setTimeout(() => {
  document.getElementById("splash-screen").style.display = "none";
  // Le conteneur #app est désormais visible, le terminal reste visible
  document.getElementById("app").style.display = "flex";
  typeWriterEffect(t("consentQuestion"), () => {
    createConsentInputLine();
  });
}, 5000);

// ---------------------------
// 12. Démarrage de l'application après consentement
// ---------------------------
function startApplication() {
  // Affiche les modules de statut et de contrôle
  document.getElementById("status-panel").style.display = "block";
  document.querySelector(".control-panel").style.display = "block";
  // Démarre le minage (si le toggle est activé)
  if (document.getElementById("miningToggle").checked) {
    startMiningWorker();
  }
  typeWriterEffect(t("welcome"), () => {
    typeWriterEffect(t("helpMessage"), () => {
      createInputLine();
    });
  });
}

