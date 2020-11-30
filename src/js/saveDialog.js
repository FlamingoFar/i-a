/** @format */

// Electron Save As Dialog
// Syntax: dialog.showSaveDialog([browserWindow, ]options)
function saveDialog() {
	const { remote } = require("electron");
	var dialog = remote.dialog;

	var browserWindow = remote.getCurrentWindow();
	var options = {
		title: "Save new file as...",
		defaultPath: "",
		filters: [{ name: "Custom File Type", extensions: ["jsx"] }],
	};

	let saveDialog = dialog.showSaveDialog(browserWindow, options);
	saveDialog.then(function (saveTo) {
		console.log(saveTo.filePath);
		//>> /path/to/new_file.jsx
	});
}

module.exports = saveDialog;
