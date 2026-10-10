const $ = (id) => document.getElementById(id);

document.addEventListener("keydown", (k) =>{
    if (k.key === "Backspace") {
        const text = $("input-line").textContent;
        $("input-line").textContent = text.slice(0, -1);
    } else if (k.key === "Enter") {
        const body = document.getElementById("body");
        const child = document.createElement("div");
        child.className = "line";
        child.textContent = $("input-line").textContent;
        body.insertBefore(child, $("input-line"));
        $("input-line").textContent = "admin@station67:~$ ";
    } else if (k.key === "Tab" || k.key === "Shift" || k.key === "Control" || k.key === "Alt") {
        // Do nothing for these keys
    }
     else {
        const text = $("input-line").textContent;
        $("input-line").textContent = text + k.key;
    }
})