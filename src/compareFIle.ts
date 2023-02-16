import * as vscode from 'vscode';
import {fileNameToFullSourceFilePathMap} from './selectSrcTgt';

export const compareWithSourceFile = vscode.commands.registerCommand('extension.compareWithSourceFile', (clickedFileUri:vscode.Uri) => {
    // Compare with the corresponding source file.
    
    // step 1 get the targetFile user selected
    const fullPathOfTheTargetFile = clickedFileUri.fsPath;
    const targetFileUri = vscode.Uri.file(fullPathOfTheTargetFile);

    // step 2 get the source file's full path
    const splitStartPos = fullPathOfTheTargetFile.lastIndexOf("\\");
    const splitEndPos = fullPathOfTheTargetFile.lastIndexOf(".");
    const fileNameSelectedWithoutSuffix = fullPathOfTheTargetFile.substring(splitStartPos+1,splitEndPos);

    // just for test: initial the map // todo: remvove it
    // just for test 
    //fileNameToFullSourceFilePathMap.set("JSTestFile","C:\\Users\\haijiajin.FAREAST\\Downloads\\vsc-extention-template\\src\\test\\ApplyUniformBordersToAllTables.vb");

    let fullPathOfTheSourceFile;
    if(fileNameToFullSourceFilePathMap.get(fileNameSelectedWithoutSuffix)!== undefined){
        fullPathOfTheSourceFile = fileNameToFullSourceFilePathMap.get(fileNameSelectedWithoutSuffix);
    }else{
        const message = "It is not a converted file";
        vscode.window.showInformationMessage(message);
        return;
    }

    // step 3 open the source file in left of the split window
    //var fullPathOfTheSourceFile = "C:\\Users\\haijiajin.FAREAST\\Downloads\\vsc-extention-template\\src\\test\\ApplyUniformBordersToAllTables.vb";
    const sourceFileUri = vscode.Uri.file(fullPathOfTheSourceFile!);// the "!" tells TypeScript that even though something looks like it could be null, it can trust you that it's not:
    vscode.window.showTextDocument(sourceFileUri, { viewColumn: vscode.ViewColumn.One });

    // step 4 open the selected js file in the right of the split window.
    vscode.window.showTextDocument(targetFileUri, { viewColumn: vscode.ViewColumn.Two });

    // // Show the difference between the two files
    //vscode.commands.executeCommand("vscode.diff", targetFileUri, sourceFileUri);
});