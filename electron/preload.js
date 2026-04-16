const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  silentPrint: (options) => ipcRenderer.invoke("silent-print", options),
  getPrinters: () => ipcRenderer.invoke("get-printers"),
});
