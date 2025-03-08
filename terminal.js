"use strict";

// Effet de machine à écrire
export function typeWriterEffect(text, callback) {
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

// Afficher une ligne dans le terminal
export function printLine(text) {
  const output = document.getElementById("output");
  output.innerHTML += `\n${text}`;
  output.scrollTop = output.scrollHeight;
}

// Gérer l'entrée utilisateur
export function createInputLine() {
  const input = document.getElementById("command-input");
  if (!input) {
    console.error("Élément #command-input introuvable !");
    return null;
  }
  input.focus();
  return input;
}

