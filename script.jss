
"use strict";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const state = {
  selectedServer: "singapore",
  autoSelect: true,
  reconnect: true,
  dns: "cloudflare",
  vpnConnected: false
};

const serverNames = {
  singapore: "Singapore",
  germany: "Germany",
  finland: "Finland"
};

let toastTimer;

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 3200);
}

function addActivity(level, message) {
  const log = $("#activityLog");
  const row = document.createElement("p");
  const time = document.createElement("time");
  const text = document.createElement("span");

  time.textContent = level;
  text.textContent = message;

  row.append(time, text);
  log.prepend(row);

  // Keep the activity log small.
  while (log.children.length > 20) {
    log.lastElementChild.remove();
  }
}

function renderServerSelection() {
  $$(".server-card").forEach((card) => {
    const isSelected =
      card.dataset.server === state.selectedServer;

    card.classList.toggle("selected", isSelected);

    const indicator = card.querySelector(".server-indicator");
    indicator.textContent = isSelected ? "✓" : "○";
  });

  $("#serverFeedback").textContent =
    `${serverNames[state.selectedServer]} selected as a candidate. ` +
    "Live server performance has not been verified.";

  addActivity(
    "SELECT",
    `${serverNames[state.selectedServer]} selected as a candidate route.`
  );
}

function selectServer(serverId) {
  if (!Object.hasOwn(serverNames, serverId)) {
    showToast("Unknown server candidate.");
    return;
  }

  if (state.vpnConnected) {
    showToast("Disconnect the VPN before changing the candidate.");
    return;
  }

  state.selectedServer = serverId;
  renderServerSelection();
}

function findBestCandidate() {
  if (state.vpnConnected) {
    showToast("Disconnect before changing the candidate.");
    return;
  }

  /*
    This is a deterministic demo choice, not a real measurement.
    Replace this section with results from a configured API that
    checks actual VPN gateways and real device-side performance.
  */
  const candidates = Object.keys(serverNames);

  const chosen = candidates.find(
    (id) => id === state.selectedServer
  ) || candidates[0];

  state.selectedServer = chosen;
  renderServerSelection();

  $("#serverFeedback").textContent =
    `Demo selection: ${serverNames[chosen]}. ` +
    "No live health checks or speed measurements were performed.";

  addActivity(
    "DEMO",
    "Candidate selection preview completed without live server testing."
  );

  showToast("Demo only: configure live server checks for real selection.");
}

function handleConnect() {
  /*
    A website cannot create an Android-wide VPN tunnel by itself.
    Do not display a fake connected state. A real implementation
    must invoke a separately installed Android VPN app or its
    supported connection flow, with user permission.
  */
  if (state.vpnConnected) {
    state.vpnConnected = false;
  }

  $("#connectionLabel").textContent = "READY";
  $("#corePercent").textContent = "READY";
  $("#coreCaption").textContent = "AWAITING CONNECTION";
  $("#connectButtonText").textContent = "SMART CONNECT";
  $("#buttonNote").textContent =
    "Demo mode · No VPN tunnel connected";

  addActivity(
    "INFO",
    "Connect requested. No VPN gateway is configured; no tunnel was started."
  );

  showToast(
    "VPN not connected. An Android VPN app and a working gateway are required."
  );
}

function updateAutoSelection() {
  state.autoSelect = $("#autoServerToggle").checked;

  addActivity(
    "SETTINGS",
    `Auto candidate selection ${state.autoSelect ? "enabled" : "disabled"}.`
  );

  showToast(
    `Auto selection preference ${state.autoSelect ? "enabled" : "disabled"}.`
  );
}

function updateReconnectPreference() {
  state.reconnect = $("#reconnectToggle").checked;

  addActivity(
    "SETTINGS",
    `Reconnect preference ${state.reconnect ? "enabled" : "disabled"}.`
  );

  showToast(
    "Preference saved for this page session. VPN reconnect is not active."
  );
}

function updateDnsPreference() {
  state.dns = $("#dnsSelect").value;

  const labels = {
    cloudflare: "Cloudflare DNS",
    google: "Google DNS",
    system: "System default DNS"
  };

  addActivity(
    "SETTINGS",
    `${labels[state.dns]} selected as a preference.`
  );

  showToast(
    `${labels[state.dns]} selected. Android DNS has not been changed.`
  );
}

function clearActivity() {
  $("#activityLog").replaceChildren();

  addActivity("INFO", "Activity log cleared.");
}

function initialize() {
  $$(".server-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectServer(card.dataset.server);
    });
  });

  $("#connectButton").addEventListener("click", handleConnect);
  $("#autoSelectButton").addEventListener("click", findBestCandidate);

  $("#autoServerToggle").addEventListener(
    "change",
    updateAutoSelection
  );

  $("#reconnectToggle").addEventListener(
    "change",
    updateReconnectPreference
  );

  $("#dnsSelect").addEventListener(
    "change",
    updateDnsPreference
  );

  $("#clearLogButton").addEventListener("click", clearActivity);

  $("#systemStatus").textContent = "SYSTEM READY";

  addActivity("READY", "Network dashboard initialized.");
  addActivity("INFO", "Live server API is not configured.");
  addActivity("INFO", "Android VPN integration is not configured.");
}

document.addEventListener("DOMContentLoaded", initialize);
