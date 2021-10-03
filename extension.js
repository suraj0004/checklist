// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	const getCurrentTime  = () =>{
		
		const currentTime = new Date();
		let hours = (currentTime.getHours()).toString();
		let minutes = (currentTime.getMinutes()).toString();
		let AMorPM = 'AM';

		if(currentTime.getHours() >= 12){
			AMorPM = 'PM';
			hours = (currentTime.getHours() - 12).toString();
		}

		if(hours === '0'){
			hours = '12';
		}

		// Adding leading zero
		if (currentTime.getMinutes() < 10) {
			minutes = `0${currentTime.getMinutes()}`;
		}

		if (Number(hours) < 10) {
			hours = `0${hours}`;
		}

		return `${hours}:${minutes} ${AMorPM}` 
	}

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "checklist" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('checklist.helloChecklist', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hi User, I am Checklist');
	});
	
	let showCurrentTime = vscode.commands.registerCommand('checklist.showCurrentTime', function () {
		vscode.window.showInformationMessage(`Current time is: ${getCurrentTime()} `);
	});
	
	let iAmBad = vscode.commands.registerCommand('checklist.iAmBad',function () {
		vscode.window.showErrorMessage('You are not bad! You are a good programmer.');
	})

	context.subscriptions.push(disposable);
	context.subscriptions.push(showCurrentTime);
	context.subscriptions.push(iAmBad);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
