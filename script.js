import { TreeNode } from "./fs.js";

const $ = (id) => document.getElementById(id);

// Creating the Filesystem
const root = new TreeNode("/", true);
const logs = new TreeNode("logs", true);
const broadcast = new TreeNode("broadcast", true);
const archive = new TreeNode("archive", true);
const vault = new TreeNode("vault", true);
const log1 = new TreeNode("shift_oct31.log", false);
const log2 = new TreeNode("motion_sensor.txt", false);
const log3 = new TreeNode("staff_memo.txt", false);

logs.addChild(log1);
log1.content = `23:15 - Gate 2 padlock cut again. Found dead crows on the transformer box.\n\n01:40 - High-pitch whine through the transmitter cabinet. Chief told me to leave the room locked and stop asking questions.\n\n02:30 - Chief left down the mountain. Left his desk terminal buzzing.`;
logs.addChild(log2);
log2.content = `02:51:02 - PERIMETER FENCE: BREACH (WEST)\n\n02:54:19 - TOWER LADDER: WEIGHT DETECTED (54.7 KG)\n\n02:57:44 - ROOF ACCESS HATCH: VIBRATION DETECTED`;
logs.addChild(log3);
log3.content = `To whoever keeps locking the vault: I don't care about corporate security protocol. Stop resetting the digital deadbolt to the Blackwood anniversary year. If I have to type [ 1974 ] in the dark one more time, I'm quitting.`;

const broadcast1 = new TreeNode("active_queue.dat", false);
const broadcast2 = new TreeNode("carrier_config.cfg", false);
const broadcast3 = new TreeNode("audio_monitor.log", false);

broadcast.addChild(broadcast1);
broadcast1.content = `TRANSMISSION MANIFEST // OCT 31 03:00 AM\n\nCHANNEL: VHF 04 / UHF 28 (ALL COUNTY HOMES)\n\nCARRIER OVERRIDE: 66.6 MHz SUBCARRIER PULSE\n\nSOURCE: /vault/ritual_payload.hex\n\nSTATUS: FORCED PLAYOUT ARMED (AUTOMATIC IGNITION ON PURGE)`;
broadcast.addChild(broadcast2);
broadcast2.content = `ANTENNA_ARRAY: 4x Directional Dipole\n\nPULSE_FREQUENCY: 18.98 Hz (Infrasound / Ocular Resonance)\n\nMODULATION: Inverted Binaural Human Vocal Bus`;
broadcast.addChild(broadcast3);
broadcast3.content = `02:44 - We dialed into the feed monitor. It's not static. You can hear hundreds of people whispering unison prayers in Latin, but the waveform looks like a single human heartbeat.`;

const archive1 = new TreeNode("incident_1974.txt", false);
const archive2 = new TreeNode("police_inquiry.txt", false);

archive.addChild(archive1);
archive1.content = `BLACKWOOD GAZETTE — NOV 1, 1974:\n\nSearch efforts continue for 14 youth choir members who walked into the Blackwood Ridge tree line during the Halloween midnight broadcast. Television sets across the county reportedly ran static for three hours following their disappearance.`;
archive.addChild(archive2);
archive2.content = `Case #74-889 closed by order of District Attorney. Tower transmission logs confiscated and sealed in station vault.`;

const vault1 = new TreeNode("carrier_victims.csv", false);
const vault2 = new TreeNode("ritual_payload.hex", false);

vault.addChild(vault1);
vault1.content = `NAME, AGE, ADDRESS, RESONANCE_MATCH\n\nHolloway, Clara | 12 | 404 Elm St | 98.4%\n\nBlackwood, Thomas | 19 | Ridge Rd | 100.0%\n\nVance, Dr. Emily | 38 | County Morgue | 96.1%\n\n[72 ADDITIONAL ENTRIES LOADED]`;
vault.addChild(vault2);
vault2.content = `PAYLOAD DUMP: SAMHAIN-OCT31\n\n4F 43 43 55 4C 54 20 48 4F 53 54 20 53 45 45 44\n\nTRANSCRIPTION: 'THEY ARE LISTENING THROUGH THE SCREEN. AT 03:00 THE DOORWAY OPENS BOTH WAYS.'`;

root.addChild(logs);
root.addChild(broadcast);
root.addChild(archive);
root.addChild(vault);
//---------------

let current = root;

document.addEventListener("keydown", (k) => {
  if (k.key === "Backspace") {
    const text = $("input-line").textContent;
    if (text.length > 19) {
      $("input-line").textContent = text.slice(0, -1);
    }
  } else if (k.key === "Enter") {
    const body = document.getElementById("body");
    const child = document.createElement("div");
    child.className = "line";
    child.textContent = $("input-line").textContent;
    const command = $("input-line").textContent.slice(19);
    const output = executeCommand(command, current);
    $("input-line").textContent = "admin@station67:~$ ";
    if (command !== "clear") {
      body.insertBefore(child, $("input-line"));
    }
    if (output) {
      const outputDiv = document.createElement("div");
      outputDiv.className = "output";
      outputDiv.textContent = output;
      body.insertBefore(outputDiv, $("input-line"));
    }
  } else if (
    k.key === "Tab" ||
    k.key === "Shift" ||
    k.key === "Control" ||
    k.key === "Alt"
  ) {
    // Do nothing for these keys
  } else {
    const text = $("input-line").textContent;
    $("input-line").textContent = text + k.key;
  }
});

const executeCommand = (command, current) => {
  switch (command) {
    case "help":
      return "Available commands: help, clear, echo [text]";
    case "clear":
      $("body").innerHTML = '<div id="input-line">admin@station67:~$ </div>';
      return "";
    case "ls":
      const names = [];
      for (const child of current.children) {
        names.push(child.name);
      }
      return names;
    case "":
      return;
    default:
      if (command.startsWith("echo ")) {
        return command.slice(5);
      } else {
        return `Command not found: ${command}`;
      }
  }
};
