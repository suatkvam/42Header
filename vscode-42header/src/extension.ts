import * as vscode from 'vscode';
import { Header42 } from './header42';

export function activate(context: vscode.ExtensionContext) {
    console.log('42 Header extension is now active');

    const header42 = new Header42();

    // Command: Insert/Update Header (F1 or Command Palette)
    const insertHeaderCommand = vscode.commands.registerCommand('42header.insertHeader', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        header42.insertOrUpdateHeader(editor);
    });

    // Command: Update All Headers in Workspace
    const updateAllCommand = vscode.commands.registerCommand('42header.updateAllHeaders', async () => {
        await header42.updateAllHeadersInWorkspace();
    });

    // Auto-update on save
    const saveListener = vscode.workspace.onWillSaveTextDocument(event => {
        const config = vscode.workspace.getConfiguration('42header');
        const autoUpdate = config.get<boolean>('autoUpdate', true);

        if (!autoUpdate) {
            return;
        }

        const editor = vscode.window.visibleTextEditors.find(
            e => e.document === event.document
        );

        if (editor && header42.shouldProcessFile(editor.document)) {
            // Update only if header exists
            const promise = header42.updateHeaderIfExists(editor);
            event.waitUntil(promise);
        }
    });

    context.subscriptions.push(insertHeaderCommand);
    context.subscriptions.push(updateAllCommand);
    context.subscriptions.push(saveListener);
}

export function deactivate() {}
