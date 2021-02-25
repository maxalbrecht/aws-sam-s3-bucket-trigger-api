const { dialog, BrowserWindow, ipcMain } = require('electron-updater');

function createProgressBar() {
  const ProgressBar = require('electron-progressbar');
  let progressBar = new ProgressBar({
      text:'VeriSuite is updating...',
      detail: 'Updating...'
    });

  progressBar
    .on('completed', function() {
      console.info('Completed...');
      progressBar.detail = 'Update has been downloaded. VeriSuite will relaunch automatically after installation.';
    })
    .on('aborted', function() {
      console.info('Update was aborted...');
      throw Error('Error during update');
    });
  
  return progressBar;
}

async function CheckForUpdates() {
  try {
    console.log("Checking for Updates...")
    const { autoUpdater } = require('electron-updater');
    //let progressBar;

    autoUpdater.logger = require('electron-log');
    autoUpdater.logger.transports.file.level = 'info';
    autoUpdater.autoDownload = false;

    autoUpdater.checkForUpdates();
    autoUpdater.on('update-available', () => { 
      //progressBar = createProgressBar();
      autoUpdater.downloadUpdate();
    });
    autoUpdater.on('update-downloaded', async () => {
      //progressBar.setCompleted();
      autoUpdater.quitAndInstall();
    });
  }
  catch (e) {
    console.log(`Error while looking for available updates: ${e}`);
    //alert(`Error while looking for available updates. Please reach out to support with the following error: ${e}`);
  }
}

module.exports = CheckForUpdates;