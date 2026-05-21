// electron\main.js
const {
  app,
  BrowserWindow,
  ipcMain,
  globalShortcut,
  screen,
} = require("electron");
const path = require("path");
const os = require("os");
const fs = require("fs");

// ── Force scale factor to 1 — prevents white edge clipping in kiosk mode ──────
app.commandLine.appendSwitch("high-dpi-support", "1");
app.commandLine.appendSwitch("force-device-scale-factor", "1");

const isDev = false;

let mainWindow;
let adminExit = false;

// ── OPTIMISATION: Cache resolved printer name after first lookup ──────────────
let cachedPrinterName = null;

function findPosPrinter(printers) {
  // 1. Exact / partial name match for common POS58 driver names
  const pos = printers.find(
    (p) =>
      p.name.toLowerCase().includes("pos58") ||
      p.name.toLowerCase().includes("pos 58") ||
      p.name.toLowerCase().includes("xp-58") ||
      p.name.toLowerCase().includes("xprinter") ||
      p.name.toLowerCase().includes("thermal") ||
      p.name.toLowerCase().includes("receipt"),
  );
  if (pos) return pos.name;

  // 2. Fall back to system default
  const def = printers.find((p) => p.isDefault);
  if (def) return def.name;

  // 3. Last resort — empty string lets Chromium pick system default
  return "";
}

async function resolvePrinterName(webContents) {
  if (cachedPrinterName !== null) return cachedPrinterName;

  let printers = [];
  try {
    printers = await webContents.getPrintersAsync();
  } catch (_) {}

  if (!printers.length && mainWindow && !mainWindow.isDestroyed()) {
    try {
      printers = await mainWindow.webContents.getPrintersAsync();
    } catch (_) {}
  }

  console.log("=== AVAILABLE PRINTERS ===");
  printers.forEach((p) =>
    console.log(
      ` - "${p.name}" | default: ${p.isDefault} | status: ${p.status}`,
    ),
  );

  cachedPrinterName = findPosPrinter(printers);
  console.log(
    "[silent-print] Printer name cached:",
    cachedPrinterName || "(system default — no POS58 found)",
  );
  return cachedPrinterName;
}

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.bounds;

  console.log("=== DISPLAY INFO ===");
  console.log("bounds:", primaryDisplay.bounds);
  console.log("workAreaSize:", primaryDisplay.workAreaSize);
  console.log("scaleFactor:", primaryDisplay.scaleFactor);

  mainWindow = new BrowserWindow({
    ...(isDev
      ? { width: 1080, height: 1920, fullscreen: false, kiosk: false }
      : {
          width,
          height,
          x: 0,
          y: 0,
          fullscreen: true,
          kiosk: true,
          resizable: false,
          movable: false,
        }),

    show: false,
    frame: false,
    titleBarStyle: "hidden",
    autoHideMenuBar: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    backgroundColor: "#ffffff",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,
    },
  });

  if (!isDev) {
    mainWindow.setKiosk(true);
    mainWindow.setFullScreen(true);
    mainWindow.setAlwaysOnTop(true, "screen-saver");
    mainWindow.setBounds({ x: 0, y: 0, width, height });
  }

  mainWindow.once("ready-to-show", () => {
    if (!isDev) {
      mainWindow.setKiosk(true);
      mainWindow.setFullScreen(true);
      mainWindow.setAlwaysOnTop(true, "screen-saver");
      mainWindow.setBounds({ x: 0, y: 0, width, height });
    }
    mainWindow.show();
    if (!isDev) mainWindow.focus();

    // ── OPTIMISATION: Pre-warm printer list at startup (non-blocking) ────────
    mainWindow.webContents
      .getPrintersAsync()
      .then((printers) => {
        console.log("=== AVAILABLE PRINTERS (startup) ===");
        printers.forEach((p) =>
          console.log(
            ` - "${p.name}" | default: ${p.isDefault} | status: ${p.status}`,
          ),
        );
        cachedPrinterName = findPosPrinter(printers);
        console.log(
          "[startup] Printer cached:",
          cachedPrinterName || "(system default — no POS58 found)",
        );
      })
      .catch(() => {
        cachedPrinterName = "";
      });
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../dist/index.html")}`,
  );

  if (isDev) mainWindow.webContents.openDevTools();

  mainWindow.on("blur", () => {
    if (!isDev) {
      mainWindow.setKiosk(true);
      mainWindow.setFullScreen(true);
      mainWindow.setAlwaysOnTop(true, "screen-saver");
      mainWindow.focus();
    }
  });

  mainWindow.webContents.on("render-process-gone", (event, details) => {
    console.error("Renderer crashed:", details.reason, "— relaunching...");
    app.relaunch();
    app.exit(0);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    if (!isDev && !adminExit) {
      app.relaunch();
      app.exit(0);
    }
  });

  mainWindow.webContents.on("context-menu", (e) => e.preventDefault());
}

// ── Wait for all images to decode, then one paint flush ──────────────────────
const waitForImagesAndPaint = async (webContents) => {
  const imgStatus = await webContents.executeJavaScript(`
    new Promise((resolve) => {
      const imgs = Array.from(document.querySelectorAll('img'));
      if (imgs.length === 0) return resolve('no-images');

      let pending = imgs.length;
      const done = () => { if (--pending === 0) resolve('images-loaded'); };

      imgs.forEach((img) => {
        if (img.complete && img.naturalWidth > 0) {
          done();
        } else {
          img.onload  = done;
          img.onerror = done;
        }
      });

      setTimeout(() => resolve('timeout'), 3000);
    })
  `);

  console.log("[silent-print] Image decode status:", imgStatus);

  await webContents.executeJavaScript(`
    new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 120)))
  `);

  return imgStatus;
};

// ── Silent print via hidden BrowserWindow ─────────────────────────────────────
ipcMain.handle("silent-print", async (event, options = {}) => {
  return new Promise((resolve, reject) => {
    const tmpFile = path.join(os.tmpdir(), `ticket_${Date.now()}.html`);

    try {
      fs.writeFileSync(tmpFile, options.html, "utf8");
      console.log("[silent-print] Temp file written:", tmpFile);
    } catch (writeErr) {
      return reject(
        new Error(`Failed to write temp ticket file: ${writeErr.message}`),
      );
    }

    const cleanup = () => {
      try {
        fs.unlinkSync(tmpFile);
      } catch (_) {}
    };

    const printWindow = new BrowserWindow({
      show: false,
      width: 220,
      height: 500,
      skipTaskbar: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: false,
        offscreen: false,
      },
    });

    printWindow.loadURL(`file://${tmpFile}`);

    printWindow.webContents.on("did-finish-load", async () => {
      try {
        const imgStatus = await waitForImagesAndPaint(printWindow.webContents);
        console.log("[silent-print] Ready to print. Image status:", imgStatus);

        const printerName = await resolvePrinterName(printWindow.webContents);
        console.log(
          "=== PRINTING TO:",
          printerName || "(system default)",
          "===",
        );

        const printOptions = {
          silent: true,
          printBackground: true,
          deviceName: printerName,
          copies: options.copies || 1,
          margins: { marginType: "none" },
        };

        console.log("=== PRINT OPTIONS ===", JSON.stringify(printOptions));

        printWindow.webContents.print(printOptions, (success, errorType) => {
          printWindow.close();
          cleanup();
          if (success) {
            console.log("=== PRINT SUCCESS ===");
            resolve({ success: true });
          } else {
            console.error("=== PRINT FAILED:", errorType, "===");
            reject(new Error(errorType || "Print failed"));
          }
        });
      } catch (err) {
        printWindow.close();
        cleanup();
        reject(err);
      }
    });

    printWindow.webContents.on("did-fail-load", (e, code, desc) => {
      printWindow.close();
      cleanup();
      reject(new Error(`Ticket page failed to load: ${desc} (code ${code})`));
    });
  });
});

// ── Get printers list ─────────────────────────────────────────────────────────
ipcMain.handle("get-printers", async () => {
  try {
    return await mainWindow.webContents.getPrintersAsync();
  } catch (_) {
    return [];
  }
});

// ── Child process crash — auto-restart ───────────────────────────────────────
app.on("child-process-gone", (event, details) => {
  console.error(
    "Child process gone:",
    details.type,
    details.reason,
    "— relaunching...",
  );
  if (!isDev) {
    app.relaunch();
    app.exit(0);
  }
});

// ── App ready ─────────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  createWindow();

  globalShortcut.register("CommandOrControl+Alt+Q", () => {
    console.log("=== ADMIN EXIT TRIGGERED ===");
    adminExit = true;
    globalShortcut.unregisterAll();
    app.quit();
  });

  globalShortcut.register("CommandOrControl+Alt+D", () => {
    if (mainWindow && !mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.webContents.openDevTools();
      console.log("DevTools opened via Ctrl+Alt+D");
    } else if (mainWindow && mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.webContents.closeDevTools();
      console.log("DevTools closed via Ctrl+Alt+D");
    }
  });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", (e) => {
  if (!adminExit) e.preventDefault();
});
