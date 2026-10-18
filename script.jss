
"use strict";

const $ = (selector) => document.querySelector(selector);

const state = {
  selectedServer: "Singapore",
  autoSelection: true,
  reconnect: true,
  dns: "1.1.1.1"
};

function log(message, level = "INFO") {
  const row = document.createElement("p");
  const time = document.createElement("time");
  const text = document.createElement("span");

  time.textContent = level;
  text.textContent = message;
  row.append(time, text);

  $("#logs").prepend(row);

  while ($("#logs").children.length > 15) {
    $("#logs").lastElementChild.remove();
  }
}

function selectServer(name) {
  state.selectedServer = name;

  document.querySelectorAll(".server").forEach((button) => {
    const selected = button.dataset.server === name;

    button.classList.toggle("selected", selected);
    button.querySelector(".check").textContent = selected ? "✓" : "○";
  });

  log(`${name} selected as a server candidate.`, "SELECT");
  $("#serverMessage").textContent =
    `${name} selected. Live VPN server checks are not configured.`;
}

document.querySelectorAll(".server").forEach((button) => {
  button.addEventListener("click", () => {
    selectServer(button.dataset.server);
  });
});

$("#autoBtn").addEventListener("click", () => {
  if (!$("#autoToggle").checked) {
    $("#serverMessage").textContent =
      "Enable auto server selection in Smart Controls first.";
    return;
  }

  /*
    No real server health API exists in this frontend yet.
    Do not claim that this demo choice is the fastest server.
  */
  $("#serverMessage").textContent =
    "No live server measurements available. Configure VPN gateways and API first.";

  log("Server selection requires a live health-check API.", "NOTICE");
});

$("#connectBtn").addEventListener("click", () => {
  $("#status").textContent = "NOT CONNECTED";
  $("#coreStatus").textContent = "READY";
  $("#coreText").textContent = "VPN NOT CONNECTED";
  $("#connectMessage").textContent =
    "No Android VPN integration or gateway is configured.";

  log(
    "Connection requested. A website cannot start an Android VPN tunnel by itself.",
    "NOTICE"
  );
});

$("#autoToggle").addEventListener("change", (event) => {
  state.autoSelection = event.target.checked;
  log(`Auto selection preference: ${state.autoSelection}.`);
});

$("#reconnectToggle").addEventListener("change", (event) => {
  state.reconnect = event.target.checked;
  log(`Reconnect preference: ${state.reconnect}.`);
});

$("#dns").addEventListener("change", (event) => {
  state.dns = event.target.value;
  log(
    `DNS preference set to ${state.dns}. Android DNS has not been changed.`
  );
});

$("#clearBtn").addEventListener("click", () => {
  $("#logs").replaceChildren();
  log("Activity log cleared.");
});

log("Dashboard initialized.");
log("Live VPN gateway is not configured.");
log("No live speed data is being reported.");
