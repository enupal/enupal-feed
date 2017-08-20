const electron = require('electron')
const {app, BrowserWindow} = electron

const path = require('path')
const url  = require('url')

//updater 85243753a7031694ec6856ac439cdfccf19b1fc7
const { dialog } = require('electron')
const { autoUpdater } = require('electron-updater')

let updater
autoUpdater.autoDownload = true

autoUpdater.on('error', (event, error) => {
  dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
})

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Found Updates',
    message: 'Found updates, do you want update now?',
    buttons: ['Sure', 'No']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      autoUpdater.downloadUpdate()
    }
    else {
      updater.enabled = true
      updater = null
    }
  })
})

autoUpdater.on('update-not-available', () => {
  dialog.showMessageBox({
    title: 'No Updates',
    message: 'Current version is up-to-date.'
  })
  updater.enabled = true
  updater = null
})

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    title: 'Install Updates',
    message: 'Updates downloaded, application will be quit for update...'
  }, () => {
    setImmediate(() => autoUpdater.quitAndInstall())
  })
})

// export this to MenuItem click callback
function checkForUpdates (menuItem, focusedWindow, event) {
  updater = menuItem
  updater.enabled = false
  autoUpdater.checkForUpdates()
}
module.exports.checkForUpdates = checkForUpdates
////////////////////////
// end autoupdater

const isDev = require('electron-is-dev');  // this is required to check if the app is running in development mode.
const {appUpdater} = require('./autoupdater')

let win

const mysql = require('mysql')

const connection = mysql.createConnection({
	host     : '127.0.0.1',
	port     : '8889',
	user     : 'root',
	password : 'root',
	database : 'happylager_local_03'
})

connection.connect(function(err){
	// si hay
	if (err)
	{
		console.log(err.code)
		console.log(err.fatal)
	}
})

exports.connection = connection

exports.closeConnection = () =>{
	connection.end(function(){
		// cerrar la conexion
	})
}

// UPDATE CODE
// Funtion to check the current OS. As of now there is no proper method to add auto-updates to linux platform.
function isWindowsOrmacOS() {
	return process.platform === 'darwin' || process.platform === 'win32';
}

function createWindow(){
	win = new BrowserWindow ({width: 800, height:600, icon: __dirname + '/favicon.ico'})
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file',
		slashes: true
	}))

	const page = win.webContents;

	page.once('did-frame-finish-load', () => {
		const checkOS = isWindowsOrmacOS();
		if (checkOS && !isDev) {
			// Initate auto-updates on macOs and windows
			appUpdater();
	}});

	win.webContents.openDevTools()
}

exports.openWindow = () => {
	let newWin = new BrowserWindow ({width: 400, height:200})
	newWin.loadURL(url.format({
		pathname: path.join(__dirname, 'enupal.html'),
		protocol: 'file',
		slashes: true
	}))
}

app.on('ready', createWindow)

