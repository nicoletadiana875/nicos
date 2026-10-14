// Lettura di una riga dal terminale, con opzione "nascosta" (si vedono solo asterischi).
// Modulo separato per poterlo collaudare con un terminale simulato.

/**
 * @param {NodeJS.ReadableStream & {setRawMode?: Function, isTTY?: boolean}} input
 * @param {NodeJS.WritableStream} output
 */
export function readTerminalLine(input, output, { question, hidden = false }) {
  return new Promise((resolve) => {
    output.write(`${question}: `);
    let buffer = "";

    const cleanup = () => {
      input.removeListener("data", onData);
      if (typeof input.setRawMode === "function") input.setRawMode(false);
      if (typeof input.pause === "function") input.pause();
    };

    const onData = (chunk) => {
      for (const ch of String(chunk)) {
        if (ch === "\r" || ch === "\n") {
          cleanup();
          output.write("\n");
          return resolve(buffer);
        }
        if (ch === "\u0003") {
          // Ctrl+C
          cleanup();
          output.write("\n");
          return process.exit(130);
        }
        if (ch === "\u007f" || ch === "\b") {
          if (buffer.length) {
            buffer = buffer.slice(0, -1);
            output.write("\b \b");
          }
          continue;
        }
        if (ch >= " ") {
          buffer += ch;
          output.write(hidden ? "*" : ch);
        }
      }
    };

    if (typeof input.setRawMode === "function") input.setRawMode(true);
    if (typeof input.setEncoding === "function") input.setEncoding("utf8");
    if (typeof input.resume === "function") input.resume();
    input.on("data", onData);
  });
}
