const electron = require('electron')
const {app, BrowserWindow} = electron

const path = require('path')
const url  = require('url')

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

	/*page.once('did-frame-finish-load', () => {
		const checkOS = isWindowsOrmacOS();
		if (checkOS && !isDev) {
			// Initate auto-updates on macOs and windows
			appUpdater();
	}});
	*/
	const checkOS = isWindowsOrmacOS();
		if (checkOS && !isDev) {
			let newWin = new BrowserWindow ({width: 400, height:200})
			newWin.loadURL(url.format({
				pathname: path.join(__dirname, 'enupal.html'),
				protocol: 'file',
				slashes: true
			}))
			// Initate auto-updates on macOs and windows
			appUpdater();
	}

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

