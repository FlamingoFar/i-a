/** @format */

const { app, BrowserWindow } = require("electron");
require("update-electron-app");

const ipc = require("electron").ipcMain;
const os = require("os");
const { dialog } = require("electron");

try {
	require("electron-reloader")(module);
} catch (_) {}

let win;

function createWindow() {
	win = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	win.loadFile("./src/index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

/*-------------------------- Logic -----------------------------*/
// Get event sent by renderer.jsw
ipc.on("path:get", function (event) {
	/* 	dialog
		.showOpenDialog(win, {
			properties: ["openFile", "openDirectory"],
		})
		.then((result) => {
			console.log(result.filePaths, result.canceled);
			win.webContents.send(
				"path:selected",
				result.filePaths[0],
				result.canceled
			);
		})
		.catch((err) => {
			console.log(err);
		}); */
	if (os.platform() === "linux" || os.platform() === "win32") {
		dialog
			.showOpenDialog({
				properties: ["openFile", "openDirectory"],
			})
			.then((result) => {
				if (result) win.webContents.send("path:selected", result.filePaths);
			})
			.catch((err) => {
				console.log(err);
			});
	} else {
		dialog
			.showOpenDialog({
				properties: ["openFile", "openDirectory"],
			})
			.then((result) => {
				console.log(result.filePaths);
				if (result) win.webContents.send("path:selected", result.filePaths);
			})
			.catch((err) => {
				console.log(err);
			});
	}
});
