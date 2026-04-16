const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("path");

// ── Fix Windows DPI scaling gaps (must be before app.whenReady) ───────────────
app.commandLine.appendSwitch("high-dpi-support", "1");
app.commandLine.appendSwitch("force-device-scale-factor", "1");

// Set to false for production kiosk mode (true only for local development)
const isDev = false;

let mainWindow;
let adminExit = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    // ── Portrait dev mode (only when isDev = true) ──
    ...(isDev
      ? {
          width: 1080,
          height: 1920,
          fullscreen: false,
          kiosk: false,
        }
      : {
          fullscreen: true,
          kiosk: true, // Force kiosk mode (hides taskbar)
        }),

    show: false, // ✅ Hide until fully painted — prevents white flash/gaps
    frame: false, // No window frame
    autoHideMenuBar: true,
    alwaysOnTop: true,
    skipTaskbar: true, // Prevents taskbar entry
    backgroundColor: "#0f0f0f", // Prevents white flash/gaps before React mounts
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true, // Allow DevTools via shortcut
    },
  });

  // ✅ Only show window once React has fully painted — no white edges
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    if (!isDev) {
      mainWindow.setKiosk(true);
      mainWindow.setFullScreen(true);
      mainWindow.setAlwaysOnTop(true, "screen-saver");
    }
  });

  // Load the app
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../dist/index.html")}`,
  );

  // In development, open DevTools automatically
  if (isDev) mainWindow.webContents.openDevTools();

  // Keep window focused in kiosk mode
  mainWindow.on("blur", () => {
    if (!isDev) mainWindow.focus();
  });

  // Auto-restart on crash
  mainWindow.webContents.on("render-process-gone", (event, details) => {
    console.error("Renderer crashed:", details.reason, "— relaunching...");
    app.relaunch();
    app.exit(0);
  });

  // Auto-restart if window is closed (unless admin exit)
  mainWindow.on("closed", () => {
    mainWindow = null;
    if (!isDev && !adminExit) {
      app.relaunch();
      app.exit(0);
    }
  });

  // Block right-click context menu
  mainWindow.webContents.on("context-menu", (e) => e.preventDefault());
}

// ── Silent print via hidden BrowserWindow ─────────────────────────────────────
ipcMain.handle("silent-print", async (event, options = {}) => {
  return new Promise((resolve, reject) => {
    const printWindow = new BrowserWindow({
      show: false,
      skipTaskbar: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    const encodedHtml = encodeURIComponent(options.html);
    printWindow.loadURL(`data:text/html;charset=utf-8,${encodedHtml}`);

    printWindow.webContents.on("did-finish-load", () => {
      setTimeout(() => {
        mainWindow.webContents
          .getPrintersAsync()
          .then((printers) => {
            console.log("=== AVAILABLE PRINTERS ===");
            printers.forEach((p) =>
              console.log(` - ${p.name} | default: ${p.isDefault}`),
            );

            const defaultPrinter = printers.find((p) => p.isDefault);
            const printerName =
              options.printerName ||
              (defaultPrinter ? defaultPrinter.name : "");

            console.log("=== PRINTING TO:", printerName, "===");

            printWindow.webContents.print(
              {
                silent: true,
                printBackground: true,
                deviceName: printerName,
                copies: options.copies || 1,
                margins: {
                  marginType: "custom",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                },
                pageSize: options.pageSize || "A4",
              },
              (success, errorType) => {
                printWindow.close();
                if (success) {
                  console.log("=== PRINT SUCCESS ===");
                  resolve({ success: true });
                } else {
                  console.error("=== PRINT FAILED:", errorType, "===");
                  reject(new Error(errorType || "Print failed"));
                }
              },
            );
          })
          .catch((err) => {
            printWindow.close();
            reject(err);
          });
      }, 800);
    });

    printWindow.webContents.on("did-fail-load", (e, code, desc) => {
      printWindow.close();
      reject(new Error(`Page load failed: ${desc}`));
    });
  });
});

// ── Get printers list ─────────────────────────────────────────────────────────
ipcMain.handle("get-printers", async () => {
  return await mainWindow.webContents.getPrintersAsync();
});

// ── App unresponsive — auto-restart ───────────────────────────────────────────
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

  // ── Secret admin exit: Ctrl + Alt + Q ──
  globalShortcut.register("CommandOrControl+Alt+Q", () => {
    console.log("=== ADMIN EXIT TRIGGERED ===");
    adminExit = true;
    globalShortcut.unregisterAll();
    app.quit();
  });

  // ── Secret shortcut to open/close DevTools: Ctrl + Alt + D ──
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

// Unregister shortcuts on quit
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

// Prevent accidental quit (but admin exit will override)
app.on("window-all-closed", (e) => {
  if (!adminExit) e.preventDefault();
});
