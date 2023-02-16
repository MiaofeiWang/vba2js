import * as vscode from 'vscode';
import { console_info, console_error, api, console_suc } from './config';
import { get } from './request';
import {FileConvertUtil} from './convertUtil';

export const insertResultAtCur = vscode.commands.registerTextEditorCommand('extension.insertResultAtCur', async (editor, edit, projectId, taskId) => {
    // var editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor
    }

    const getResultUrl = api.vba2js.getResult.replace("{project_id}", projectId).replace("{task_id}", taskId);
    await get(getResultUrl, {}).then(async (res) => {
        if (res.status == 200 && res.data != null) {
            console_suc("Congratulations! Success!!!!");
            const result = res.data.result;
            // step 2 insert translated JS code snippet at target cur
            let targetCodeSnippet = "";
            for (const member in result) {
                targetCodeSnippet = result[member];
                console_info(`member ${member}, converted base64 code: `);
                console_info(targetCodeSnippet);
                break;
            }

            //const targetCodeSnippet = result["util/f3.vb"];//just for test
            //const targetCodeSnippet = "codeSnippet";// just for test TODO
            const targetCodeSnippetStr = FileConvertUtil.base64ToString(targetCodeSnippet);
            console_info(`converted code:`);
            console_info(targetCodeSnippetStr);
            editor.edit((edit) => edit.replace(editor.selection, targetCodeSnippetStr));
        }
    });
});