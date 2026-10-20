import { TreeNode } from "./fs.js";
import { BASE64_SOUNDS } from "./sounds.js";

const $ = (id) => document.getElementById(id);
let step = 0;
let GAMEOVER = false;
let locked = true;
let collected = [];
let timer = null;
let ytPlayer = null;
let bgStarted = false;

const randomStartSecond = Math.floor(Math.random() * 35400); // 0 to 9h50m

window.onYouTubeIframeAPIReady = () => {
  ytPlayer = new YT.Player("yt-bg", {
    height: "1",
    width: "1",
    videoId: "Z6ylGHfLrdI",
    playerVars: {
      autoplay: 0,
      controls: 0,
      loop: 1,
      start: randomStartSecond,
    },
    events: {
      onReady: (e) => {
        e.target.setVolume(10);
      },
    },
  });
};

const ctx = new window.AudioContext();
const buffers = {};

const loadBase64Audio = async () => {
  for (const [name, base] of Object.entries(BASE64_SOUNDS)) {
    const binary = atob(base);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    buffers[name] = await ctx.decodeAudioData(bytes.buffer);
  }
};
loadBase64Audio();

const playSound = (name) => {
  const buf = buffers[name];
  if (!buf) return;

  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  src.start(0);
};

const screens = [
  `OCTOBER 31 // 02:57 AM<br><br>Every TV in the valley just went white.<br>The old tower on Blackwood Ridge is on. It shouldn't be.<br><br>You forced the door open. The transmitter's hot enough to burn you.<br>Something's walking around on the roof.<br><br><span style="color: #fff;">[ PRESS ENTER ]</span>`,

  `[01 / 03]<br><br>The station's been looping the same broadcast since 1974.<br>People are falling asleep in front of their TVs. None of them have woken up.<br><br><span style="color: #fff;">[ PRESS ENTER ]</span>`,

  `[02 / 03]<br><br>Find the three logs: the hijack schedule, the victim ledger, and the original frequency.<br>The vault won't open. There should be an override code somewhere in the desk memos.<br><br><span style="color: #fff;">[ PRESS ENTER ]</span>`,

  `[03 / 03]<br><br>Shit. The thermite purge is armed.<br>03:00 AM. That's three minutes from now.<br><br>Get the files. Type 'extract'. Don't stick around.<br><br><span style="color: #fff;">[ PRESS ENTER TO START ]</span>`,
];

const printStep = (idx) => {
  const body = $("body");
  const block = document.createElement("div");
  block.className = "output";
  block.innerHTML = screens[idx];
  body.insertBefore(block, $("input-line"));
  body.scrollTop = body.scrollHeight;
};

$("input-line").textContent = "";
printStep(0);

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
log1.content = `23:15 - Gate 2 padlock cut again. Found dead crows on the transformer box.<br><br>01:40 - High-pitch whine through the transmitter cabinet. Chief told me to leave the room locked and stop asking questions.<br><br>02:30 - Chief left down the mountain. Left his desk terminal buzzing.`;
logs.addChild(log2);
log2.content = `02:51:02 - PERIMETER FENCE: BREACH (WEST)<br><br>02:54:19 - TOWER LADDER: WEIGHT DETECTED (54.7 KG)<br><br>02:57:44 - ROOF ACCESS HATCH: VIBRATION DETECTED`;
logs.addChild(log3);
log3.content = `To whoever keeps locking the vault: I don't care about corporate security protocol. Stop resetting the digital deadbolt to the Blackwood anniversary year. If I have to type [ 1974 ] in the dark one more time, I'm quitting.`;

const broadcast1 = new TreeNode("active_queue.dat", false);
const broadcast2 = new TreeNode("carrier_config.cfg", false);
const broadcast3 = new TreeNode("audio_monitor.log", false);

broadcast.addChild(broadcast1);
broadcast1.content = `TRANSMISSION MANIFEST // OCT 31 03:00 AM<br><br>CHANNEL: VHF 04 / UHF 28 (ALL COUNTY HOMES)<br><br>CARRIER OVERRIDE: 66.6 MHz SUBCARRIER PULSE<br><br>SOURCE: /vault/ritual_payload.hex<br><br>STATUS: FORCED PLAYOUT ARMED (AUTOMATIC IGNITION ON PURGE)`;
broadcast.addChild(broadcast2);
broadcast2.content = `ANTENNA_ARRAY: 4x Directional Dipole<br><br>PULSE_FREQUENCY: 18.98 Hz (Infrasound / Ocular Resonance)<br><br>MODULATION: Inverted Binaural Human Vocal Bus`;
broadcast.addChild(broadcast3);
broadcast3.content = `02:44 - We dialed into the feed monitor. It's not static. You can hear hundreds of people whispering unison prayers in Latin, but the waveform looks like a single human heartbeat.`;

const archive1 = new TreeNode("incident_1974.txt", false);
const archive2 = new TreeNode("police_inquiry.txt", false);

archive.addChild(archive1);
archive1.content = `BLACKWOOD GAZETTE — NOV 1, 1974:<br><br>Search efforts continue for 14 youth choir members who walked into the Blackwood Ridge tree line during the Halloween midnight broadcast. Television sets across the county reportedly ran static for three hours following their disappearance.`;
archive.addChild(archive2);
archive2.content = `Case #74-889 closed by order of District Attorney. Tower transmission logs confiscated and sealed in station vault.`;

const vault1 = new TreeNode("carrier_victims.csv", false);
const vault2 = new TreeNode("ritual_payload.hex", false);

vault.addChild(vault1);
vault1.content = `NAME, AGE, ADDRESS, RESONANCE_MATCH<br><br>Holloway, Clara | 12 | 404 Elm St | 98.4%<br><br>Blackwood, Thomas | 19 | Ridge Rd | 100.0%<br><br>Vance, Dr. Emily | 38 | County Morgue | 96.1%<br><br>[72 ADDITIONAL ENTRIES LOADED]`;
vault.addChild(vault2);
vault2.content = `PAYLOAD DUMP: SAMHAIN-OCT31<br><br>4F 43 43 55 4C 54 20 48 4F 53 54 20 53 45 45 44<br><br>TRANSCRIPTION: 'THEY ARE LISTENING THROUGH THE SCREEN. AT 03:00 THE DOORWAY OPENS BOTH WAYS.'`;

root.addChild(logs);
root.addChild(broadcast);
root.addChild(archive);
root.addChild(vault);
//---------------

let current = root;

document.addEventListener("keydown", (k) => {
  if (GAMEOVER) return;

  if (!k.repeat) {
    const soundName = ["Space", "Enter", "Backspace"].includes(k.code)
      ? k.code
      : `generic${Math.floor(Math.random() * 5)}`;
    playSound(soundName);
  }

  if (!bgStarted && ytPlayer) {
    ytPlayer.playVideo();
    bgStarted = true;
  }

  if (step < screens.length) {
    if (k.key === "Enter") {
      step++;

      if (step < screens.length) {
        printStep(step);
      } else {
        $("body").innerHTML = `<div id="input-line">admin@station67:~$ </div>`;
        startTimer();
      }
    }
    return;
  }

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
      outputDiv.innerHTML = output;
      body.insertBefore(outputDiv, $("input-line"));
    }
    body.scrollTop = body.scrollHeight;
  } else if (
    k.key === "Tab" ||
    k.key === "Shift" ||
    k.key === "Control" ||
    k.key === "Alt" ||
    k.key === "Meta" ||
    k.key === "ArrowLeft" ||
    k.key === "ArrowRight" ||
    k.key === "ArrowUp" ||
    k.key === "ArrowDown" ||
    k.key === "PageUp" ||
    k.key === "PageDown" ||
    k.key === "Delete" ||
    k.key === "Insert" ||
    k.key === "PrintScreen" ||
    k.key === "F1" ||
    k.key === "F2" ||
    k.key === "F3" ||
    k.key === "F4" ||
    k.key === "F5" ||
    k.key === "F6" ||
    k.key === "F7" ||
    k.key === "F8" ||
    k.key === "F9" ||
    k.key === "F10" ||
    k.key === "F11" ||
    k.key === "F12" ||
    k.key === "Escape"
  ) {
    // Do nothing for these keys
  } else {
    const text = $("input-line").textContent;
    $("input-line").textContent = text + k.key;
  }
});

window.addEventListener("keyup", (k) => {
  const soundName = ["Space", "Backspace"].includes(k.code)
    ? `up_${k.code}`
    : `up_generic`;

  playSound(soundName);
});

const executeCommand = (input, curr) => {
  const [command, ...args] = input.trim().split(" ");

  switch (command) {
    case "help":
      return "Available commands: help, ls, cd, cat, unlock, extract, clear, echo [text]";

    case "clear": {
      $("body").innerHTML = '<div id="input-line">admin@station67:~$ </div>';
      return "";
    }

    case "ls": {
      const names = [];
      for (const child of curr.children) {
        names.push(child.name);
      }
      return names;
    }

    case "cat": {
      const result = curr.getChild(args[0]);
      if (result && !result.isDir) {
        const targets = [
          "active_queue.dat",
          "carrier_config.cfg",
          "carrier_victims.csv",
        ];

        if (targets.includes(result.name) && !collected.includes(result.name)) {
          collected.push(result.name);
          $("sg-evid").textContent = `EVID: ${collected.length}/3`;
          return (
            result.content +
            `<br><br><span style="color: #309430;">[DOWNLOADED ${collected.length}/3 EVIDENCE FILES]</span>`
          );
        }

        return result.content;
      } else {
        return "No such file in current directory.";
      }
    }
    case "cd": {
      if (args[0] === "..") {
        if (curr.parent === null) {
          return "You are at the root directory.";
        }
        current = curr.parent;
        updatePath();
        return "";
      }

      const result = curr.getChild(args[0]);

      if (result?.isDir) {
        if (result.name === "vault" && locked) {
          return "Vault is locked. Use 'unlock [pin]' to open.";
        }
        current = result;
        updatePath();
      } else {
        return `No directory named ${args[0]} is here.`;
      }

      return "";
    }

    case "unlock": {
      if (args[0] === "1974") {
        locked = false;
        return "Vault unlocked.";
      } else {
        return "Wrong pin.";
      }
    }

    case "extract": {
      if (collected.length < 3) {
        return `Extraction failed. Only ${collected.length}/3 evidence files found.`;
      }

      GAMEOVER = true;
      clearInterval(timer);
      if (ytPlayer && ytPlayer.stopVideo) ytPlayer.stopVideo();

      $("body").innerHTML = `
      <div class="output" style="color: #4af626;">
        EXTRACTION SECCESSFUL // ALL 3 LOGS SECURED<br><br>
        You have secured the logs with you and escaped down Blackwood Ridge.<br>
        At 3:00 AM, the tower purges behind you, but the evidence is safe.<br><br>
        <span style="color: white;">[YOU SURVIVED - REFRESH TO PLAY AGAIN]</span> 
    </div>`;
    }

    case "echo": {
      return args.join(" ");
    }

    case "":
      return;

    default:
      return `Command not found: ${command}`;
  }
};

const getPath = (node) => {
  if (node === root) {
    return "/";
  }

  const fullPath = "/" + node.name;

  return fullPath;
};

const updatePath = () => {
  $("sg-path").textContent = getPath(current);
};

const startTimer = () => {
  let SECONDS = 180; // 3mins

  timer = setInterval(() => {
    SECONDS--;

    let minutes = Math.floor(SECONDS / 60);
    let seconds = SECONDS % 60;

    $("sg-timer").textContent =
      `0${minutes}:${seconds.toString().padStart(2, "0")}`;

    if (SECONDS <= 0) {
      clearInterval(timer);
      GAMEOVER = true;
      if (ytPlayer && ytPlayer.setVolume) ytPlayer.setVolume(50);

      $("body").innerHTML = `
      <div class="output" style="color: #ff4444;">
        3:00 AM // THERMITE PURGE DETONATED<br><br>
        The console locks up as white smoke vents through the floor  grates.<br> 
        Heat burns through the transmitter racks. You didn't ge out in time.<br><br>
        <span style="color: white;">[ TRANSMISSION TERMINATION - REFRESH TO RETRY ]</span>
      </div>`;
    }
  }, 1000);
};
