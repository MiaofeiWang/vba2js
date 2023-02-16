import * as vscode from 'vscode';
import * as fs from 'fs';

const decode = (str: string):string => Buffer.from(str, 'base64').toString('binary');
const encode = (str: string):string => Buffer.from(str, 'binary').toString('base64');

const decodeBs64ToStr = (str: string):string => Buffer.from(str, 'base64').toString('ascii');
const encodeStrToBs64 = (str: string):string => Buffer.from(str, 'ascii').toString('base64');

const map = new Map<string, string>();
let targetFolder: string;
export class FileConvertUtil {
    public static encodeToBase64(uris: vscode.Uri[]) {
        for (const resource of uris) {
            fs.readFile(resource.fsPath ,'utf8', (err, data) => 
            {
                if (err){
                    throw err;
                } 					
                const bs64 = encode(data);
                console.log(bs64);
            });
            map.set(vscode.workspace.asRelativePath(resource.fsPath), resource.fsPath);
        }     
    };

    public static stringToBase64(str:string): string{
        const bs64str = encodeStrToBs64(str);
        //console.log(bs64);
        return bs64str;
    }

    public static base64ToString(bs64str:string): string{
        const resultStr = decodeBs64ToStr(bs64str);
        return resultStr;
    }

    public static decodeFromBase64(filename: string, bs64Str: string) {
        const fileFullPath = targetFolder + "/" + filename;
        const result = decode(bs64Str);
        fs.writeFile(fileFullPath, result, (err) => {
            if (err) {
                return console.error(err);
            }
        });
    };
}