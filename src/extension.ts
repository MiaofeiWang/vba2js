/* eslint-disable @typescript-eslint/no-var-requires */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { console_info, vba2js_console, boot_tag } from './config';
import { get } from './request';
import { api } from './config';
import { selectSrcTgtFile } from './selectSrcTgt';
import { progressWnd } from './convert';
import { save2TargetDir } from './saveResult';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	vba2js_console.clear();
	vba2js_console.show();
	console_info(`Congratulations, your extension "vba -> js" is now active! \n ${boot_tag}`);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		let data: string;
		get(api.baseUrl, {}).then((res: { status: number; data: null; }) => {
			if (res.status == 200 && res.data != null) {
				data = res.data;
			}
		}).then(() => {
			vscode.window.showInformationMessage(data);
		});
		// vscode.window.showInformationMessage('Hello World!');

	});

	context.subscriptions.push(disposable);

	context.subscriptions.push(selectSrcTgtFile);

	context.subscriptions.push(progressWnd);

	context.subscriptions.push(save2TargetDir);

	const compareWithSourceFile = vscode.commands.registerCommand('extension.compareWithSourceFile', (clickedFileUri: vscode.Uri) => {
		// The code you place here will be executed every time your command is executed

		// Compare with the corresponding source file.
		const targetFile = clickedFileUri.fsPath;
		const targetFileUri = vscode.Uri.file(targetFile);
		vscode.window.showTextDocument(targetFileUri, { viewColumn: vscode.ViewColumn.Two });

		const sourceFile = "C:\\vsaddin\\HelloWorld\\vscode-extension-samples\\helloworld-sample\\src\\config.ts";
		const sourceFileUri = vscode.Uri.file(sourceFile);
		vscode.window.showTextDocument(sourceFileUri, { viewColumn: vscode.ViewColumn.One });
	});

	context.subscriptions.push(compareWithSourceFile);

}
