// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
class NodeDependenciesProvider {
	constructor(workspaceRoot) {
	  this.workspaceRoot = workspaceRoot;
	  this._onDidChangeTreeData= new vscode.EventEmitter();
	  // onDidChangeTreeData = this._onDidChangeTreeData.event;
	}
  
	getTreeItem(element) {
	  return element;
	}
  
	getChildren(element) {
	  if (!this.workspaceRoot) {
		vscode.window.showInformationMessage("No dependency in empty workspace");
		return Promise.resolve([]);
	  }
  
	  if (element) {
		return Promise.resolve(
		  this.getDepsInPackageJson(
			path.join(
			  this.workspaceRoot,
			  "node_modules",
			  element.label,
			  "package.json"
			)
		  )
		);
	  } else {
		const packageJsonPath = path.join(this.workspaceRoot, "package.json");
		if (this.pathExists(packageJsonPath)) {
		  return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
		} else {
		  vscode.window.showInformationMessage("Workspace has no package.json");
		  return Promise.resolve([]);
		}
	  }
	}
  
	/**
	 * Given the path to package.json, read all its dependencies and devDependencies.
	 */
	getDepsInPackageJson(packageJsonPath) {
	  if (this.pathExists(packageJsonPath)) {
		const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  
		const toDep = (moduleName, version) => {
		  if (
			this.pathExists(
			  path.join(this.workspaceRoot, "node_modules", moduleName)
			)
		  ) {
			return new Dependency(
			  moduleName,
			  version,
			  vscode.TreeItemCollapsibleState.Collapsed
			);
		  } else {
			return new Dependency(
			  moduleName,
			  version,
			  vscode.TreeItemCollapsibleState.None
			);
		  }
		};
  
		const deps = packageJson.dependencies
		  ? Object.keys(packageJson.dependencies).map((dep) =>
			  toDep(dep, packageJson.dependencies[dep])
			)
		  : [];
		const devDeps = packageJson.devDependencies
		  ? Object.keys(packageJson.devDependencies).map((dep) =>
			  toDep(dep, packageJson.devDependencies[dep])
			)
		  : [];
		return deps.concat(devDeps);
	  } else {
		return [];
	  }
	}
  
	pathExists(p) {
	  try {
		fs.accessSync(p);
	  } catch (err) {
		return false;
	  }
	  return true;
	}
  
	refresh() {
	  this._onDidChangeTreeData.fire();
	}
  }
  
  class Dependency extends vscode.TreeItem {
	constructor(label, version, collapsibleState) {
	  super(label, collapsibleState);
	  this.version = version;
	  this.label = label;
	  this.collapsibleState = collapsibleState;
	  this.tooltip = `${this.label}-${this.version}`;
	  this.description = this.version;
	}
  
	//   iconPath = {
	//     light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
	//     dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	//   };
  }
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

	const nodeDependenciesProvider = new NodeDependenciesProvider(vscode.workspace.rootPath);
  vscode.window.registerTreeDataProvider('nodeDependencies', nodeDependenciesProvider);
  vscode.commands.registerCommand('nodeDependencies.refreshEntry', () =>
    nodeDependenciesProvider.refresh()
  );
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
