const electron = require('electron')
const {app, BrowserWindow} = electron

const path = require('path')
const url  = require('url')
const log = require('electron-log');

//updater 85243753a7031694ec6856ac439cdfccf19b1fc7
const { dialog } = require('electron')
const { autoUpdater } = require('electron-updater')

//Logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

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


//NEW CODE

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Buscando actualizaciones...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Actualización disponible');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Ya tienes la última versión.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error al actualizar.');
})
autoUpdater.on('download-progress', (progressObj) => {
  let speed = ((progressObj.bytesPerSecond / 1000) / 1000).toFixed(1);
  let transferred = ((progressObj.transferred / 1000) / 1000).toFixed(1);
  let total = ((progressObj.total / 1000) / 1000).toFixed(1);
  let percent = progressObj.percent.toFixed(1);

  let log_message = "Download speed: " + speed + " Mb/s";
  log_message = log_message + ' - Downloaded: ' + percent + '%';
  log_message = log_message + ' (' + transferred + "/" + total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Actualización descargada, se instalará en 5 segundos.');
});

// end new code


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

	//win.webContents.openDevTools()
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


app.on('ready', function()  {
  //autoUpdater.checkForUpdates();
});

