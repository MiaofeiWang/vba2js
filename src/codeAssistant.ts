import * as vscode from 'vscode';
import { codeAssistantApi } from './config';
import { post, get } from './request';

export class CodeAssistantViewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'vba2js.codeAssistant';

	private _view?: vscode.WebviewView;

	constructor(private readonly _extensionUri: vscode.Uri) {
		
	}

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		// set options for the webview
		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,
			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = this.getHtml();
	}

	public async request(prompt:string) {
		if (!this._view) {
			await vscode.commands.executeCommand('vba2js.codeAssistant.focus');
		} else {
			this._view?.show?.(true);
		}

		const selection = vscode.window.activeTextEditor?.selection;
		const selectedText = vscode.window.activeTextEditor?.document.getText(selection);
		if (!selectedText) {
			return;
		}
		const requestPrompt = prompt.replace("{selected_code}", selectedText);

		const payload = {
			"prompt": requestPrompt,
			"max_tokens": 1000,
			"temperature": 0.5
		};

		const url = codeAssistantApi.baseurl + "/openai/deployments/" + codeAssistantApi.deploymentname + "/completions?api-version=2022-12-01";
		const config = {
			headers : {
				"api-key": "",
				"Content-Type": "application/json"
			}
		};
		let response = '';

		await post(url, payload, config).then((res) => {
			if (res.status == 200 && res.data != null) {
				response = res.data.choices[0].text;
				console.log("ChatGPT response: " + response);
			} else {
				response = 'It seems something is wrong, please try again.';
			}
		});

		if (this._view) {
			this._view.webview.html = this.getHtml(response);
			this._view.show?.(true);
		}
	}
	private getHtml(response = '') {
		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<style>
				.code {
					white-space : pre;
				</style>
			</head>
			<body>
			<textarea readonly type="text"  name="txtarea" style="font-family: Arial;font-size: 12pt;width:100%;height:150vw;background-color:transparent;color:white">
			${response}
			</textarea>
			</body>
			</html>`;
	}

}
