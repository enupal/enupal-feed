const electron = require('electron')
const {app, BrowserWindow} = electron

const path = require('path')
const url  = require('url')

let win

const mysql = require('mysql')

const connection = mysql.createConnection({
	host     : '127.0.0.1',
	port     : 'xxx',
	user     : 'xxxx',
	password : 'xxxxxx',
	database : 'xxxxxxxx'
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


function createWindow(){
	win = new BrowserWindow ({width: 800, height:600, icon: __dirname + '/favicon.ico'})
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