const electron = require("electron");
const app = electron.app;
const { autoUpdater } = require('electron-updater');
// Enable logging
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info'
//Disable auto downloading
autoUpdater.autoDownload = false;

const { dialog, ipcMain } = require('electron-updater');
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
let mainWindow;

function CheckForUpdates() {
  try {
    // Check for updates
    console.log('Checking for updates...');

    // Start update check
    console.log('Start update check...');
    autoUpdater.checkForUpdates();

    // Listen for download (update) found
    console.log('Listen for download (update) found...');
    autoUpdater.on('update-available', () => {
      // Track progress percent
      console.log('Tracking progress percent...');
      let downloadProgress = 0;

      // Prompt user to update
      console.log('Prompting user to update...');
      dialog.showMessageBox({
        type: 'info',
        title: 'Update Available',
        message: 'A new version is available. Do you want to update now?',
        button: ['Update', 'No']
      }, (buttonIndex) => {
        // If not 'Update button, return
        console.log('Return if user did not click the Update button...');
        if(buttonIndex !== 0) return
        
        // Else start download and show download progress in new window
        console.log('Else start download...');
        autoUpdater.downloadUdpate();

        //Create progress window
        console.log('Creating progress window...');
        let progressWin = new BrowserWindow({
          width: 350,
          height: 35,
          useContentSize: true,
          autoHideMenuBar: true,
          maximizable: false,
          fullscreen: false,
          fullscreenable: false,
          resizable: false
        });

        // Load progress HTML
        console.log('Loading progress HTML...');
        progressWin.LoadURL('file://${__dirname}/renderer/progress.html');

        //Handle win close
        console.log('Handle window closing');
        progressWin.on('closed', () => {progressWin = null});

        ipcMain.on('download-progress-request', (e) => {
          e.returnValue = downloadProgress;
        });

        // Track download progress on autoUpdater
        console.log('Track download progress');
        autoUpdater.on('download-progress', (d) => {
          downloadProgress = d.percent;
        });
        
        // Listen for completed update download
        console.log('Listen for completed update download');
        autoUpdater.on('update-downloaded', () => {
          // Close progress Win
          console.log('Close progress window');
          if(progressWin) progressWin.close();

          //Prompt user to quit and install update
          console.log('Prompting user to quit and install update...')
          dialog.showMessageBox({
            type: 'info',
            title: 'Update Ready',
            message: 'A new version is ready. Quit and install now?',
            buttons: ['Yes', 'Later']
          }, (buttonIndex) => {
            //Update if 'Yes'
            console.log('Update application if user chose yes...');
            if(buttonIndex === 0) autoUpdater.quitAndInstall()
          })
        })
      })
    })
  }
  catch (e) {
    console.log(`Error while looking for available updates: ${e}`);
    alert(`Error while looking for available updates. Please reach out to support with the following error: ${e}`);
  }
}

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
  try {
    // Check for update after two seconds
    setTimeout(CheckForUpdates(), 2000);
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