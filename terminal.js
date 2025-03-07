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

export function createInputLine() {
  const input = document.getElementById("command-input");
  input.focus();
  return input;
}
