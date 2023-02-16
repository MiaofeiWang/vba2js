import * as vscode from 'vscode';
import { console_info, console_suc, api } from './config';
import { get } from './request';
import * as fs from 'fs';

const decode = (str: string):string => Buffer.from(str, 'base64').toString('binary');

export const save2TargetDir = vscode.commands.registerCommand('extension.saveResult', (projectId, taskId, targetDir) => {
    console_info(`save result: project ${projectId} stask ${taskId} to targetDir ${targetDir}`);
    const getResultUrl = api.vba2js.getResult.replace("{project_id}", projectId).replace("{task_id}", taskId);
    get(getResultUrl, {}).then((res) => {
        if (res.status == 200 && res.data != null) {
            console_suc("congratulations!!!task success!!!!!");
            const result = res.data.result;
            const tgtFilesMap = new Map<string,string>();
            for (const member in result) {
                tgtFilesMap.set(member, result[member]);
                const subPath = member.split("\\");
                console_info(`${member} --- ${targetDir}/${subPath[subPath.length-1]}`);
                const decodeFromBase64 = decode(result[member]);
                fs.writeFileSync(`${targetDir}/${subPath[subPath.length-1]}`,  decodeFromBase64);
            }
        }
    });

});