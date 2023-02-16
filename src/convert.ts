import * as vscode from 'vscode';
import { post, get } from './request';
import * as util from './config';
import { console_info, console_error, console_append } from './config';

export const progressWnd = vscode.commands.registerCommand('extension.startTask', (projectId, targetDir) => {
    console_info("received project id: " + projectId);
    console_info(`received target directory: ` + targetDir);
    const triggerSetting: util.TriggerSettings = util.defaultTriggerSettings();
    const triggerTaskParams: util.TriggerTaskParams = util.setTriggerTaskParams(projectId, triggerSetting);
    const url = util.api.vba2js.trigger.replace("{project_id}", projectId);

    post(url, triggerTaskParams).then((res) => {
        if (res.status == 200 && res.data != null) {
            const taskId = res.data.task_id;
            console_info(`create task: ${taskId}`);
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "vba2js progress",
                cancellable: true
            }, async (progress, token) => {
                token.onCancellationRequested(() => {
                    console_info("User canceled the long running operation");
                });

                let lastProgress = 0;
                let curProgress = 0;
                let times = 0;
                const maxTimes = 10;

                progress.report({ increment: lastProgress });

                const getStatusUrl = util.api.vba2js.taskProgress.replace("{project_id}", projectId).replace("{task_id}", taskId);
                const startTime = Date.now().valueOf();
                while (lastProgress < 100) {
                    // eslint-disable-next-line no-var
                    var increment = 0;
                    Promise.resolve(get(getStatusUrl, {}).then((res) => {
                        if (res.status == 200 && res.data != null) {
                            curProgress = res.data.progress;
                            increment = curProgress - lastProgress;
                            // increment = 20 + times * 20;
                            lastProgress = curProgress;
                            console_info(`running current progress ${curProgress}`);
                            progress.report({ increment: increment, message: "still converting, wait ..... " });
                        }
                    }));
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    times++;
                }
                await new Promise(resolve => setTimeout(resolve, 5000));
                const endTime = Date.now().valueOf();
                const laps = endTime - startTime;
                const summary = `project: ${projectId} task:  ${taskId}  finished in ${laps} milliseconds loop times: ${times}`;
                console_info(`task finished sucessfully!!! Here's the summary`);
                console_info(summary);
                // task finished, save the converted files.
                vscode.commands.executeCommand("extension.saveResult", projectId, taskId, targetDir);
                // debug
                vscode.commands.executeCommand("extension.saveResult", projectId, taskId, targetDir);

                const p = new Promise<void>(resolve => {
                    setTimeout(() => {
                        resolve();
                    }, 5000);
                });

                return p;
            });
        }
    });
});

