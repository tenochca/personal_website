document.addEventListener("DOMContentLoaded", () => {
  const terminal = document.getElementById("terminal-lines");

  if (!terminal) {
    return;
  }

  const lines = [
    "> booting system...",
    "> checking connection...",
    "> authentication: guest",
    "> status: CONNECTED"
  ];

  let lineIndex = 0;
  let isInteractive = false;
  let commandBuffer = "";
  let promptLine = null;

  const cursor = document.createElement("span");
  cursor.className = "cursor";
  cursor.textContent = "┃";
  terminal.appendChild(cursor);

  function moveCursorToBottom() {
    cursor.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  function printLine(text) {
    const outputLine = document.createElement("span");
    outputLine.textContent = text;
    terminal.insertBefore(outputLine, cursor);
    terminal.insertBefore(document.createElement("br"), cursor);
    moveCursorToBottom();
  }

  function createPrompt() {
    commandBuffer = "";
    promptLine = document.createElement("span");
    promptLine.className = "terminal-prompt";
    promptLine.textContent = "> ";
    terminal.insertBefore(promptLine, cursor);
    moveCursorToBottom();
  }

  function clearTerminal() {
    while (terminal.firstChild && terminal.firstChild !== cursor) {
      terminal.removeChild(terminal.firstChild);
    }
  }

  function navigateTo(page) {
    window.location.href = page;
  }

  function openGithub() {
    window.open("https://github.com/tenochca", "_blank", "noopener,noreferrer");
  }

  function runCommand(rawCommand) {
    const trimmed = rawCommand.trim();
    const lower = trimmed.toLowerCase();
    const [baseCommand = "", ...args] = lower.split(/\s+/);
    const joinedArg = args.join(" ");

    const aliasMap = {
      "?": "help",
      cls: "clear",
      dir: "ls",
      gh: "github"
    };

    const command = aliasMap[baseCommand] || baseCommand;

    if (!command) {
      terminal.insertBefore(document.createElement("br"), cursor);
      createPrompt();
      return;
    }

    if (command === "help") {
      printLine("Available:");
      printLine("  help | ?                show commands");
      printLine("  clear | cls             clear terminal");
      printLine("  ls | dir                list pages");
      printLine("  open <target>           open page/repo");
      printLine("  cd <target>             navigate to page");
      printLine("  about | projects | logs | home");
      printLine("  github | gh");
      createPrompt();
      return;
    }

    if (command === "clear") {
      clearTerminal();
      createPrompt();
      return;
    }

    if (command === "ls") {
      printLine("about.html  logs.html  projects.html  index.html");
      createPrompt();
      return;
    }

    if (command === "cd") {
      if (!joinedArg) {
        printLine("usage: cd <about|projects|logs|home>");
        createPrompt();
        return;
      }

      if (joinedArg === "about") {
        navigateTo("about.html");
        return;
      }

      if (joinedArg === "projects") {
        navigateTo("projects.html");
        return;
      }

      if (joinedArg === "logs") {
        navigateTo("logs.html");
        return;
      }

      if (joinedArg === "home" || joinedArg === "~" || joinedArg === "/") {
        navigateTo("index.html");
        return;
      }

      printLine(`cd: no such target: ${joinedArg}`);
      createPrompt();
      return;
    }

    if (command === "open") {
      if (!joinedArg) {
        printLine("usage: open <about|projects|logs|home|github>");
        createPrompt();
        return;
      }

      if (joinedArg === "github" || joinedArg === "repo") {
        openGithub();
        terminal.insertBefore(document.createElement("br"), cursor);
        createPrompt();
        return;
      }

      if (joinedArg === "about") {
        navigateTo("about.html");
        return;
      }

      if (joinedArg === "projects") {
        navigateTo("projects.html");
        return;
      }

      if (joinedArg === "logs") {
        navigateTo("logs.html");
        return;
      }

      if (joinedArg === "home" || joinedArg === "index") {
        navigateTo("index.html");
        return;
      }

      printLine(`open: unknown target: ${joinedArg}`);
      createPrompt();
      return;
    }

    if (command === "about") {
      navigateTo("about.html");
      return;
    }

    if (command === "projects") {
      navigateTo("projects.html");
      return;
    }

    if (command === "logs") {
      navigateTo("logs.html");
      return;
    }

    if (command === "home") {
      navigateTo("index.html");
      return;
    }

    if (command === "github") {
      openGithub();
      terminal.insertBefore(document.createElement("br"), cursor);
      createPrompt();
      return;
    }

    printLine(`command not found: ${rawCommand}`);
    createPrompt();
  }

  function typeTerminalLine() {
    if (lineIndex >= lines.length) {
      terminal.insertBefore(document.createElement("br"), cursor);
      isInteractive = true;
      createPrompt();
      return;
    }

    const currentLine = document.createElement("span");
    terminal.insertBefore(currentLine, cursor);
    let charIndex = 0;

    function step() {
      if (charIndex < lines[lineIndex].length) {
        currentLine.textContent += lines[lineIndex].charAt(charIndex);
        charIndex++;
        moveCursorToBottom();
        setTimeout(step, 50);
      } else {
        if (lineIndex < lines.length - 1) {
          terminal.insertBefore(document.createElement("br"), cursor);
        }

        lineIndex++;
        setTimeout(typeTerminalLine, 300);
      }
    }

    step();
  }

  typeTerminalLine();

  document.addEventListener("keydown", (event) => {
    if (!isInteractive || !promptLine) {
      return;
    }

    const target = event.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      (target instanceof HTMLElement && target.isContentEditable)
    ) {
      return;
    }

    if (event.key === "Backspace") {
      event.preventDefault();
      if (commandBuffer.length > 0) {
        commandBuffer = commandBuffer.slice(0, -1);
        promptLine.textContent = `> ${commandBuffer}`;
        moveCursorToBottom();
      }
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      terminal.insertBefore(document.createElement("br"), cursor);
      runCommand(commandBuffer);
      return;
    }

    if (
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      event.preventDefault();
      commandBuffer += event.key;
      promptLine.textContent = `> ${commandBuffer}`;
      moveCursorToBottom();
    }
  });
});