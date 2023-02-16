import * as vscode from 'vscode';
import * as fs from 'fs';
import { post } from './request';
import * as util from './config';
import { console_info } from './config';

const encode = (str: string): string => Buffer.from(str, 'binary').toString('base64');

export const selectSrcTgtFile = vscode.commands.registerCommand('extension.configSrcTgt', async (...commandArgs) => {

    let targetDir = "";
    const options: vscode.OpenDialogOptions = {
        canSelectMany: false,
        canSelectFiles: false,
        canSelectFolders: true,
        openLabel: 'Selectfolderforconvertedfiles',
    };
    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0]) {
        options.defaultUri = vscode.workspace.workspaceFolders[0].uri;
    }
    vscode.window.showOpenDialog(options).then(fileUri => {
        if (fileUri && fileUri[0]) {
            targetDir = fileUri[0].fsPath;
        }
        console_info(`Selected target folder: ${targetDir}`);

        const srcFiles: Map<string, string> = new Map();
        if (commandArgs[1][0] instanceof vscode.Uri) {
            commandArgs[1].map((resource: { fsPath: fs.PathOrFileDescriptor; }) => {
                const data = fs.readFileSync(resource.fsPath, 'utf8');
                const bs64 = encode(data);
                srcFiles.set(resource.fsPath.toString(), bs64);
            });
        }

        console_info("start to convert the file");
        for (const key of srcFiles.keys()) {
            console_info(`"${key}"`);
            console_info(`"${srcFiles.get(key)}"`);
        }

        const name = "Project name";
        const description: string = "ConvertFileOf" + [...srcFiles.values()].join(",");
        const createProjectURLPath = util.api.vba2js.createProject;
        const projectParam: util.ProjectParams = util.setProjectParams(name, description, "vb", "js", srcFiles);
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
    });
});