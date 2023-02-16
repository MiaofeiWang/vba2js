import * as vscode from 'vscode';
import {FileConvertUtil } from './convertUtil';
import { post } from './request';
import * as util from './config';
import { console_info } from './config';

export const translateCodeSnippet = vscode.commands.registerTextEditorCommand('extension.translateCodeSnippet', (editor, edit) => {
		// var editor = vscode.window.activeTextEditor;
		if (!editor) {
			return; // No open text editor
		}

		// step 1 get selection code snippet and trans to base64str
		const selection = vscode.window.visibleTextEditors[0].selection;
		const sourceCodeSnippet = vscode.window.visibleTextEditors[0].document.getText(selection);
		const sourceCodeSnippetBase64Str = FileConvertUtil.stringToBase64(sourceCodeSnippet);

		// send request
		// todo
		const name = "Project name";
        const description = "Convert Code Snippet";
        const createProjectURLPath = util.api.vba2js.createProject;

		const srcFiles: Map<string, string> = new Map();
        srcFiles.set("codeSnippet"/*fileNameKey*/, sourceCodeSnippetBase64Str);
		console_info(`source snippet code: ${sourceCodeSnippet}`);
		console_info(`base64 snippet code: ${sourceCodeSnippetBase64Str}`);

        const projectParam: util.ProjectParams = util.setProjectParams(name, description, "vb", "js", srcFiles);
        post(createProjectURLPath, projectParam).then((res) => {
            if (res.status == 200 && res.data != null) {
                const projectId = res.data.project_id;
                console_info("created project succeed: " + projectId);
                if (projectId != null) {
                    // trigger the project to generate a task
                    vscode.commands.executeCommand("extension.startTask", projectId, "Snippet"/*targetDir*/);
                }
            }
        });

		// // parse response
		// // to do: parse the response and get the base64
		// const targetCodeSnippetBase64Str = sourceCodeSnippetBase64Str; // just for test
		// const targetCodeSnippet = FileConvertUtil.base64ToString(targetCodeSnippetBase64Str);

		// // step 2 insert translated JS code snippet at target cur
		// //var targetCodeSnippet = sourceCodeSnippet;
		// edit.replace(editor.selection, targetCodeSnippet);
});
