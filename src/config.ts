import * as vscode from 'vscode';

export const api = {
    baseUrl: "https://deeptranslator.azurewebsites.net",
    vba2js: {
        createProject: "/api/project",
        taskProgress: "/api/project/{project_id}/task/{task_id}",
        trigger: "/api/project/{project_id}/trigger",
        getResult: "/api/project/{project_id}/task/{task_id}/result"
    }
};

export const codeAssistantApi = {
    baseurl: "https://augloop-cs-test-scus-shared-open-ai-0.openai.azure.com",
    deploymentname: "text-davinci-003"
};

export const codeAssistantPrompts = {
    explain: "Explain what the following Microsoft Word API JavaScript code does: {selected_code}",
    findMisuse: "The following Microsoft Word API JavaScript code may have some misuse of functions/APIs, fix them and explain what was wrong (Do not change anything else): {selected_code}"
};

/**
 * ____   ____ __________     _____                       __          ____. _________
\   \ /   / \______   \   /  _  \                      \ \        |    |/   _____/
 \   Y   /   |    |  _/  /  /_\  \    ______   ______   \ \       |    |\_____  \ 
  \     /    |    |   \ /    |    \  /_____/  /_____/   / /   /\__|    |/        \
   \___/     |______  / \____|__  /                    /_/    \________/_______  /
                    \/          \/                                             \/ 
 */
export const boot_tag = "____   ____ __________     _____                       __          ____. _________\n\\   \\ /   / \\______   \\   /  _  \\                      \\ \\        |    |/   _____/\n \\   Y   /   |    |  _/  /  /_\\  \\    ______   ______   \\ \\       |    |\\_____  \\ \n  \\     /    |    |   \\ /    |    \\  /_____/  /_____/   / /   /\\__|    |/        \\\n   \\___/     |______  / \\____|__  /                    /_/    \\________/_______  /\n                    \\/          \\/                                             \\/ ";

export interface ProjectParams {
    name: string;
    description: string;
    source_lang: string;
    target_lang: string;
    project: { [x: string]: string; }
}

enum triggerType {
    translate,
    refactor
}

export interface TriggerSettings {
    add_comment: boolean,
    add_usage_example: boolean
}

export interface TriggerTaskParams {
    project_id: string,
    trigger: string,
    setting: TriggerSettings
}

export const setProjectParams = (_name: string, _description: string, _source_lang: string, _target_lang: string, _project: Map<string, string>): ProjectParams => {

    const obj: { [x: string]: string; } = {};
    [..._project.entries()].map((arr, index) => {
        obj[arr[0]] = arr[1];
    });
    const projecParam: ProjectParams = {
        name: _name,
        description: _description,
        source_lang: _source_lang,
        target_lang: _target_lang,
        project: obj
    };
    return projecParam;
};

export const defaultTriggerSettings = (): TriggerSettings => {
    const triggerSettings: TriggerSettings = {
        add_comment: true,
        add_usage_example: true
    };
    return triggerSettings;
};

export const setTriggerTaskParams = (_project_id: string, _setting: TriggerSettings): TriggerTaskParams => {
    const triggerTaskParams: TriggerTaskParams = {
        project_id: _project_id,
        trigger: "translate",
        setting: _setting
    };
    return triggerTaskParams;
};


export const vba2js_console: vscode.OutputChannel = vscode.window.createOutputChannel("VBA2JS CONSOLE", "vba2js_log");
export const console_info = (log: string) => vba2js_console.appendLine(`[info]:${log}`);
export const console_suc = (log: string) => vba2js_console.appendLine(`[success]:${log}`);
export const console_error = (log: string) => vba2js_console.appendLine(`[error]:${log}`);
export const console_append = (tail_log: string) => vba2js_console.append(`${tail_log}`); 