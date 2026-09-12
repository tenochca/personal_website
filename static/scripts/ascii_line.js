function fillAsciiLine(elementId, char = "=") {
    const el = document.getElementById(elementId);
    if (!el) return;

    // Measure how wide a single character is
    const charWidth = getCharWidth(el, char);
    const containerWidth = el.clientWidth;
    const count = Math.ceil(containerWidth / charWidth);

    el.textContent = char.repeat(count);
}

function getCharWidth(el, char) {
    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.style.whiteSpace = "pre";
    span.style.font = getComputedStyle(el).font;
    span.textContent = char;
    document.body.appendChild(span);
    const width = span.getBoundingClientRect().width;
    document.body.removeChild(span);
    return width;
}

// Run on load and whenever the window resizes
window.addEventListener("load", () => fillAsciiLine("ascii-line"));
window.addEventListener("resize", () => fillAsciiLine("ascii-line"));
