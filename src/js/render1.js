/** @format */

const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");

const electron = require("electron");
const ipc = require("electron").ipcRenderer;

const createBtn = document.querySelector(".create-ct");

let chosenPath;
let dir;

// Get chosen path
createBtn.addEventListener("click", (event) => {
	ipc.send("path:get");
});

// Chosen path returned from ipcMain
ipc.on("path:selected", (event, path) => {
	chosenPath = path;

	makeDir();
	clearInput();
});

/* testBtn.addEventListener("click", makeDir()); */

// Get Data From Input
const land = document.querySelector(".land");
const kunde_nr = document.querySelector(".kunde_nr");
const navn = document.querySelector(".navn");
const email = document.querySelector(".email");
const telefon = document.querySelector(".telefon");
const adresse = document.querySelector(".adresse");
const post_nr = document.querySelector(".post_nr");
const by = document.querySelector(".by");

// Get todays date
let today = new Date();
let date =
	today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();

// Create File From Templates
function createDocs() {
	createElev();
	createWelcome();
}

// Create 'elevblanket'
function createElev(e) {
	// The error object contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
	function replaceErrors(key, value) {
		if (value instanceof Error) {
			return Object.getOwnPropertyNames(value).reduce(function (error, key) {
				error[key] = value[key];
				return error;
			}, {});
		}
		return value;
	}

	function errorHandler(error) {
		console.log(JSON.stringify({ error: error }, replaceErrors));

		if (error.properties && error.properties.errors instanceof Array) {
			const errorMessages = error.properties.errors
				.map(function (error) {
					return error.properties.explanation;
				})
				.join("\n");
			console.log("errorMessages", errorMessages);
			// errorMessages is a humanly readable message looking like this :
			// 'The tag beginning with "foobar" is unopened'
		}
		throw error;
	}

	//Load the docx file as a binary
	var content = fs.readFileSync(
		path.resolve(__dirname, "./template-files/elevblanket.docx"),
		"binary"
	);

	var zip = new PizZip(content);
	var doc;
	try {
		doc = new Docxtemplater(zip);
	} catch (error) {
		// Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
		errorHandler(error);
	}

	//set the templateVariables
	doc.setData({
		land: land.value,
		kunde_nr: kunde_nr.value,
		navn: navn.value,
		email: email.value,
		phone: telefon.value,
		adresse: adresse.value,
		post_nr: post_nr.value,
		by: by.value,
		dato: date,
	});

	try {
		// render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
		doc.render();
	} catch (error) {
		// Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
		errorHandler(error);
	}

	var buf = doc.getZip().generate({ type: "nodebuffer" });

	// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
	fs.writeFileSync(
		path.resolve(
			`${chosenPath[0]}/${navn.value}`,
			`Elevblanket ${navn.value}.docx`
		),
		buf
	);
}
// Create 'Indholdsbrev'
function createWelcome(e) {
	// The error object contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
	function replaceErrors(key, value) {
		if (value instanceof Error) {
			return Object.getOwnPropertyNames(value).reduce(function (error, key) {
				error[key] = value[key];
				return error;
			}, {});
		}
		return value;
	}

	function errorHandler(error) {
		console.log(JSON.stringify({ error: error }, replaceErrors));

		if (error.properties && error.properties.errors instanceof Array) {
			const errorMessages = error.properties.errors
				.map(function (error) {
					return error.properties.explanation;
				})
				.join("\n");
			console.log("errorMessages", errorMessages);
			// errorMessages is a humanly readable message looking like this :
			// 'The tag beginning with "foobar" is unopened'
		}
		throw error;
	}

	//Load the docx file as a binary
	var content = fs.readFileSync(
		path.resolve(__dirname, "./template-files/DA_Indholds_brev.docx"),
		"binary"
	);

	var zip = new PizZip(content);
	var doc;
	try {
		doc = new Docxtemplater(zip);
	} catch (error) {
		// Catch compilation errors (errors caused by the compilation of the template : misplaced tags)
		errorHandler(error);
	}

	//set the templateVariables
	doc.setData({
		land: land.value,
		kunde_nr: kunde_nr.value,
		navn: navn.value,
		email: email.value,
		phone: telefon.value,
		adresse: adresse.value,
		post_nr: post_nr.value,
		by: by.value,
		dato: date,
	});

	try {
		// render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
		doc.render();
	} catch (error) {
		// Catch rendering errors (errors relating to the rendering of the template : angularParser throws an error)
		errorHandler(error);
	}

	var buf = doc.getZip().generate({ type: "nodebuffer" });

	// buf is a nodejs buffer, you can either write it to a file or do anything else with it.
	fs.writeFileSync(
		path.resolve(
			`${chosenPath[0]}/${navn.value}`,
			`${navn.value} Velkomstbrev.docx`
		),
		buf
	);
}
// Make Directory with the name of the student
function makeDir() {
	if (!fs.existsSync(`${chosenPath[0]}/${navn.value}`)) {
		fs.mkdirSync(`${chosenPath[0]}/${navn.value}`),
			(err) => {
				if (err) {
					return console.log(err);
				}
			};
	} else {
		alert("Eleven eksisterer allerede.");
	}

	createDocs();
}

function clearInput() {
	document.getElementById("form").reset();
}
