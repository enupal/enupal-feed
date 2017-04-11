const electron = require('electron')
const {app, BrowserWindow} = electron

const path = require('path')
const url  = require('url')

let win

function createWindow(){
	win = new BrowserWindow ({width: 800, height:600})
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file',
		slashes: true
	}))

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