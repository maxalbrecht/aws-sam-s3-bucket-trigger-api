const CheckForUpdates = require('./checkForUpdates');
const { dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

const { initSplashScreen, OfficeTemplate } = require('electron-splashscreen');
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
let mainWindow;

let allowDevTools = false;
if(isDev) {
  allowDevTools = true;
}

async function createWindow() {
  mainWindow = new BrowserWindow({ 
    width: 1024,
    height: 900,
    minWidth: 720, // set a min width
    minHeight: 900, // and a min height
    // Remove the window frame from windows applications
    frame: false,
    show:false,
    backgroundColor: '#282c34',
    // Hide the title bar from MacOS applications while keeping the stop lights
    titleBarStyle: 'hidden', // or 'customButtonsOnHover',
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      devTools: allowDevTools
    }
  });

  if(!allowDevTools) {
    mainWindow.webContents.on("devtools-opened", () => { mainWindow.webContents.closeDevTools(); });
  }

  const hideSplashscreen = initSplashScreen({
    mainWindow,
    icon: `file://${path.join(__dirname, "../public/icon.ico")}`,
    url: OfficeTemplate,
    color: '#1f2329',
    width: 460,
    height: 600,
    brand: 'AlbrechtSoft',
    productName: 'VeriSync',
    logo: `file://${path.join(__dirname, "../build/index.html")}`,
    text: 'VeriSync is initializing...',
    website: 'www.veritext.com'
  });

  await mainWindow.loadURL(
      isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  hideSplashscreen();

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", () => {
  // Create the main window
  createWindow();
  try {
    // Check for update after two seconds
    //setTimeout(CheckForUpdates, 2000);
    CheckForUpdates();
  }
  catch (e) {
    console.log(`Error at setTimeout(CheckForUpdates(). Error: ${e})`);
  }
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