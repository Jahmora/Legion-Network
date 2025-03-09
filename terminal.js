// terminal.js
"use strict";

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

export function printLine(text) {
  const output = document.getElementById("output");
  output.innerHTML += `\n${text}`;
  output.scrollTop = output.scrollHeight;
}

// Cette version réinitialise le contenu de #input-line afin d'éliminer les anciens listeners.
export function createInputLine() {
  const inputLineContainer = document.getElementById("input-line");
  inputLineContainer.innerHTML = `<span class="prompt">$</span>
    <input type="text" id="command-input" autocomplete="off">`;
  const input = document.getElementById("command-input");
  if (!input) {
    console.error("Erreur : Élément #command-input introuvable !");
    return null;
  }
  input.focus();
  return input;
}

