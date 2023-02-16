import * as vscode from 'vscode';
import { post } from './request';
import * as util from './config';
import { console_info } from './config';
import { Encoder } from './encoder';

const encoder = new Encoder();
const srcFiles: Map<string, string> = new Map();
export const fileNameToFullSourceFilePathMap: Map<string, string> = new Map();
let targetDir = "";

export const selectSrcTgtFile = vscode.commands.registerCommand('extension.configSrcTgt', async (...commandArgs) => {
    const options: vscode.OpenDialogOptions = {
        canSelectMany: false,
        canSelectFiles: false,
        canSelectFolders: true,
        openLabel: 'Select folder for converted files',
    };
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0]) {
        options.defaultUri = vscode.workspace.workspaceFolders[0].uri;
    }
    vscode.window.showOpenDialog(options).then(fileUri => {
        if (fileUri && fileUri[0]) {
            targetDir = fileUri[0].fsPath;

            console_info(`Selected target folder: ${targetDir}`);

            if (commandArgs[1][0] instanceof vscode.Uri)
                encoder.encodeToBase64(commandArgs[1], srcFiles, fileNameToFullSourceFilePathMap);



            console_info("start to convert the file");
            for (const key of srcFiles.keys()) {
                console_info(`"${key}"`);
                console_info(`"${srcFiles.get(key)}"`);
            }

            const name = "Project name";
            const description = "convert file description";
            const createProjectURLPath = util.api.vba2js.createProject;
            const projectParam: util.ProjectParams = util.setProjectParams(name, description, "vb", "js", srcFiles);
            console.log(projectParam.project);
            post(createProjectURLPath, projectParam).then((res) => {
                if (res.status == 200 && res.data != null) {
                    const projectId = res.data.project_id;
                    console_info("created project succeed: " + projectId);
                    if (projectId != null) {
                        // trigger the project to generate a task
                        vscode.commands.executeCommand("extension.startTask", projectId, targetDir);
                    }
                }


            });
        }
    });
});