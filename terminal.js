"use strict";

export function typeWriterEffect(text, callback) {
  const output = document.getElementById("output");
  if (!output) {
    console.error("Erreur : Élément #output introuvable !");
    return;
  }
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
  if (!output) {
    console.error("Erreur : Élément #output introuvable !");
    return;
  }
  output.innerHTML += `\n${text}`;
  output.scrollTop = output.scrollHeight;
}

export function createInputLine() {
  const input = document.getElementById("command-input");
  if (!input) {
    console.error("Erreur : Élément #command-input introuvable !");
    return null;
  }
  input.focus();
  return input;
}
