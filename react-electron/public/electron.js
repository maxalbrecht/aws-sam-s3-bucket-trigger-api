const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({ 
      width: 1024,
      height: 728,
      minWidth: 600, // set a min width!
      minHeight: 300, // and a min height!
      // Remove the window frame from windows applications
      frame: false,
      // Hide the titlebar from MacOS applications while keeping the stop lights
      titleBarStyle: 'hidden', // or 'customButtonsOnHover',
    });
     

    mainWindow.loadURL(
        isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
    mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);
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