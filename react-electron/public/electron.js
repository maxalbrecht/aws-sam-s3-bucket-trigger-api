const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const updater = require("../src/js/components/updater/updater");

let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({ 
      width: 1024,
      height: 800,
      minWidth: 500, // set a min width
      minHeight: 660, // and a min height
      // Remove the window frame from windows applications
      frame: false,
      // Hide the title bar from MacOS applications while keeping the stop lights
      titleBarStyle: 'hidden', // or 'customButtonsOnHover',
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
      }
    });
     
    mainWindow.loadURL(
        isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
    mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", () => {
  // Create the main window
  createWindow();

  // Check for update after two seconds
  setTimeout(updater.check, 2000);
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
    app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
    createWindow();
    }
});