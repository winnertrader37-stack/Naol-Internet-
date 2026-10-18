
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  const status = $("#status");
  const coreStatus = $("#coreStatus");
  const coreText = $("#coreText");
  const connectMessage = $("#connectMessage");
  const serverMessage = $("#serverMessage");
  const logs = $("#logs");

  // Stop clearly if the wrong HTML page is being used.
  if (!status || !coreStatus || !coreText || !logs) {
    console.error(
      "Nexus Net Pro: HTML elements are missing. Check index.html."
    );
    return;
  }

  let selectedServer = "Singapore";

  function log(message, level = "INFO") {
    const row = document.createElement("p");
    const time = document.createElement("time");
    const text = document.createElement("span");

    time.textContent = level;
    text.textContent = message;
    row.append(time, text);
    logs.prepend(row);

    while (logs.children.length > 15) {
      logs.lastElementChild.remove();
    }
  }

  function selectServer(name) {
    selectedServer = name;

    $$(".server").forEach((button) => {
      const isSelected = button.dataset.server === name;
      button.classList.toggle("selected", isSelected);

      const check = button.querySelector(".check");
      if (check) check.textContent = isSelected ? "✓" : "○";
    });

    if (serverMessage) {
      serverMessage.textContent =
        name + " selected. Live server performance is not verified.";
    }

    log(name + " selected as the candidate server.", "SELECT");
  }

  // Server selection buttons
  $$(".server").forEach((button) => {
    button.addEventListener("click", function () {
      selectServer(button.dataset.server);
    });
  });

  // Smart Connect: never pretend that a VPN has connected.
  const connectBtn = $("#connectBtn");

  if (connectBtn) {
    connectBtn.addEventListener("click", function () {
      status.textContent = "NOT CONNECTED";
      coreStatus.textContent = "READY";
      coreText.textContent = "VPN NOT CONNECTED";

      if (connectMessage) {
        connectMessage.textContent =
          "VPN gateway and Android VPN app integration are required.";
      }

      log(
        "Connect clicked. No VPN tunnel has been started.",
        "NOTICE"
      );
    });
  }

  // Candidate selection
  const autoBtn = $("#autoBtn");

  if (autoBtn) {
    autoBtn.addEventListener("click", function () {
      const toggle = $("#autoToggle");

      if (toggle && !toggle.checked) {
        if (serverMessage) {
          serverMessage.textContent =
            "Enable Auto server selection first.";
        }
        log("Auto selection is disabled.", "NOTICE");
        return;
      }

      if (serverMessage) {
        serverMessage.textContent =
          "No live health-check API. Fastest server cannot yet be verified.";
      }

      log(
        "Automatic selection needs real server measurements.",
        "NOTICE"
      );
    });
  }

  // DNS preference
  const dns = $("#dns");

  if (dns) {
    dns.addEventListener("change", function () {
      log(
        "DNS preference selected: " + dns.value +
        ". Device DNS has not been changed.",
        "SETTINGS"
      );
    });
  }

  // Auto-selection preference
  const autoToggle = $("#autoToggle");

  if (autoToggle) {
    autoToggle.addEventListener("change", function () {
      log(
        "Auto-selection preference: " +
        (autoToggle.checked ? "ON" : "OFF"),
        "SETTINGS"
      );
    });
  }

  // Reconnect preference
  const reconnectToggle = $("#reconnectToggle");

  if (reconnectToggle) {
    reconnectToggle.addEventListener("change", function () {
      log(
        "Reconnect preference: " +
        (reconnectToggle.checked ? "ON" : "OFF") +
        ". VPN reconnect is not yet integrated.",
        "SETTINGS"
      );
    });
  }

  // Clear activity log
  const clearBtn = $("#clearBtn");

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      logs.replaceChildren();
      log("Activity log cleared.");
    });
  }

  // Confirm that JavaScript has loaded.
  status.textContent = "DASHBOARD ACTIVE";
  log("JavaScript loaded successfully.", "READY");
  log("Server: " + selectedServer, "INFO");
});
