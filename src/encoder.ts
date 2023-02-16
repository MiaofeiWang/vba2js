import * as vscode from 'vscode';
import * as fs from 'fs';

const decode = (str: string):string => Buffer.from(str, 'base64').toString('binary');
const encode = (str: string):string => Buffer.from(str, 'binary').toString('base64');

export class Encoder {
    encodeToBase64(uris: vscode.Uri[], srcFiles: Map<string, string>, originFullName: Map<string, string>) {
        uris.map((resource: { fsPath: fs.PathOrFileDescriptor; }) => {
            const data = fs.readFileSync(resource.fsPath, 'utf8');
            const bs64 = encode(data);
            const fullPath = resource.fsPath.toString();
            srcFiles.set(fullPath, bs64);
            const subPath = fullPath.split("\\");
            const originFilename = subPath[subPath.length-1];
            const newNameArr = originFilename.split(".");
            if(newNameArr.length > 1) {
                newNameArr.pop();
            }
            originFullName.set(newNameArr.toString(), resource.fsPath.toString());
        });
    }

    decodeFromBase64(targetFolder:string, filename: string, bs64Str: string) {
        const fileFullPath = targetFolder + "/" + filename;
        const result = decode(bs64Str);
        fs.writeFile(fileFullPath, result, (err) => {
            if (err) {
                return console.error(err);
            }
        });
    }
}