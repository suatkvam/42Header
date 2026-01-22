import * as vscode from 'vscode';
import * as os from 'os';

interface FileType {
    start: string;
    end: string;
    fill: string;
}

export class Header42 {
    private readonly LENGTH = 80;
    private readonly MARGIN = 5;

    private readonly ASCII_ART = [
        '        :::      ::::::::',
        '      :+:      :+:    :+:',
        '    +:+ +:+         +:+  ',
        '  +#+  +:+       +#+     ',
        '+#+#+#+#+#+   +#+        ',
        '     #+#    #+#          ',
        '    ###   ########.fr    '
    ];

    private readonly FILE_TYPES: { [key: string]: FileType } = {
        'c': { start: '/*', end: '*/', fill: '*' },
        'cpp': { start: '/*', end: '*/', fill: '*' },
        'h': { start: '/*', end: '*/', fill: '*' },
        'hpp': { start: '/*', end: '*/', fill: '*' },
        'cc': { start: '/*', end: '*/', fill: '*' },
        'hh': { start: '/*', end: '*/', fill: '*' },
        'php': { start: '/*', end: '*/', fill: '*' },
        'js': { start: '//', end: '//', fill: '*' },
        'html': { start: '<!--', end: '-->', fill: '*' },
        'xml': { start: '<!--', end: '-->', fill: '*' },
        'tex': { start: '%', end: '%', fill: '*' },
        'ml': { start: '(*', end: '*)', fill: '*' },
        'mli': { start: '(*', end: '*)', fill: '*' },
        'vim': { start: '"', end: '"', fill: '*' },
        'el': { start: ';', end: ';', fill: '*' }
    };

    private getFileType(fileName: string): FileType {
        const extension = fileName.split('.').pop()?.toLowerCase() || '';
        return this.FILE_TYPES[extension] || { start: '#', end: '#', fill: '*' };
    }

    private getUsername(): string {
        const config = vscode.workspace.getConfiguration('42header');
        const username = config.get<string>('username', '');
        if (username) {
            return username;
        }
        return os.userInfo().username || 'username';
    }

    private getEmail(): string {
        const config = vscode.workspace.getConfiguration('42header');
        const email = config.get<string>('email', '');
        if (email) {
            return email;
        }
        const username = this.getUsername();
        return `${username}@student.42istanbul.com.tr`;
    }

    private getDate(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    }

    private textLine(left: string, right: string, fileType: FileType, customLeftPadding?: number): string {
        const actualLeftPadding = customLeftPadding !== undefined ? customLeftPadding : (this.MARGIN - fileType.start.length);
        const maxLeftLength = this.LENGTH - actualLeftPadding - fileType.start.length - this.MARGIN - right.length;
        let trimmedLeft = left;

        if (left.length > maxLeftLength) {
            // If truncating an email (ends with '>'), keep the closing bracket
            if (left.endsWith('>')) {
                trimmedLeft = left.substring(0, maxLeftLength - 1) + '>';
            } else {
                trimmedLeft = left.substring(0, maxLeftLength);
            }
        }

        const spaces = this.LENGTH - fileType.start.length - actualLeftPadding - trimmedLeft.length - right.length - this.MARGIN;

        const leftPadding = ' '.repeat(actualLeftPadding);
        const rightPadding = ' '.repeat(this.MARGIN - fileType.end.length);

        return fileType.start + leftPadding + trimmedLeft + ' '.repeat(spaces) + right + rightPadding + fileType.end;
    }

    private generateLine(lineNum: number, fileName: string, fileType: FileType, createdDate?: string): string {
        const username = this.getUsername();
        const email = this.getEmail();
        const currentDate = this.getDate();

        switch (lineNum) {
            case 1:
            case 11:
                // Top and bottom border
                const fillLength = this.LENGTH - fileType.start.length - fileType.end.length - 2;
                return fileType.start + ' ' + fileType.fill.repeat(fillLength) + ' ' + fileType.end;

            case 2:
            case 10:
                // Blank lines
                return this.textLine('', '', fileType);

            case 3:
            case 5:
            case 7:
                // ASCII art lines
                return this.textLine('', this.ASCII_ART[lineNum - 3], fileType);

            case 4:
                // Filename
                return this.textLine(fileName, this.ASCII_ART[lineNum - 3], fileType);

            case 6:
                // Author - compact format: By:username <email>
                return this.textLine(`By:${username} <${email}>`, this.ASCII_ART[lineNum - 3], fileType, 1);

            case 8:
                // Created - aligned with By line
                const created = createdDate || currentDate;
                return this.textLine(`Created: ${created} by ${username}`, this.ASCII_ART[lineNum - 3], fileType, 1);

            case 9:
                // Updated - aligned with By line
                return this.textLine(`Updated: ${currentDate} by ${username}`, this.ASCII_ART[lineNum - 3], fileType, 1);

            default:
                return '';
        }
    }

    public shouldProcessFile(document: vscode.TextDocument): boolean {
        const fileName = document.fileName.split(/[/\\]/).pop() || '';
        const extension = fileName.split('.').pop()?.toLowerCase() || '';
        return extension in this.FILE_TYPES;
    }

    private hasHeader(document: vscode.TextDocument): boolean {
        if (document.lineCount < 9) {
            return false;
        }

        const line9 = document.lineAt(8).text;
        return line9.includes('Updated: ');
    }

    public async updateHeaderIfExists(editor: vscode.TextEditor): Promise<void> {
        const document = editor.document;

        if (!this.shouldProcessFile(document)) {
            return;
        }

        if (!this.hasHeader(document)) {
            return;
        }

        const fileName = document.fileName.split(/[/\\]/).pop() || 'unknown';
        const fileType = this.getFileType(fileName);

        // Extract creation date from line 8
        let createdDate: string | undefined;
        if (document.lineCount >= 8) {
            const line8 = document.lineAt(7).text;
            const match = line8.match(/Created: ([\d\/: ]+) by/);
            if (match) {
                createdDate = match[1];
            }
        }

        const edit = new vscode.WorkspaceEdit();

        // Update line 4 (filename) - might have changed
        const line4 = this.generateLine(4, fileName, fileType, createdDate);
        edit.replace(document.uri, new vscode.Range(3, 0, 3, document.lineAt(3).text.length), line4);

        // Update line 9 (updated date)
        const line9 = this.generateLine(9, fileName, fileType, createdDate);
        edit.replace(document.uri, new vscode.Range(8, 0, 8, document.lineAt(8).text.length), line9);

        await vscode.workspace.applyEdit(edit);
    }

    public async insertOrUpdateHeader(editor: vscode.TextEditor): Promise<void> {
        const document = editor.document;
        const fileName = document.fileName.split(/[/\\]/).pop() || 'unknown';

        if (!this.shouldProcessFile(document)) {
            vscode.window.showWarningMessage('File type not supported for 42 header');
            return;
        }

        const fileType = this.getFileType(fileName);

        // Check if header exists
        if (this.hasHeader(document)) {
            await this.updateHeaderIfExists(editor);
            vscode.window.showInformationMessage('Header updated');
            return;
        }

        // Insert new header
        const headerLines: string[] = [];
        for (let i = 1; i <= 11; i++) {
            headerLines.push(this.generateLine(i, fileName, fileType));
        }
        headerLines.push(''); // Empty line after header

        const edit = new vscode.WorkspaceEdit();
        edit.insert(document.uri, new vscode.Position(0, 0), headerLines.join('\n') + '\n');

        await vscode.workspace.applyEdit(edit);
        vscode.window.showInformationMessage('Header inserted');
    }

    public async updateAllHeadersInWorkspace(): Promise<void> {
        const files = await vscode.workspace.findFiles('**/*.{c,h,cpp,hpp,cc,hh}', '**/node_modules/**');

        if (files.length === 0) {
            vscode.window.showInformationMessage('No C/C++ files found in workspace');
            return;
        }

        let insertedCount = 0;
        let updatedCount = 0;

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Processing 42 headers',
            cancellable: false
        }, async (progress) => {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                progress.report({
                    increment: (100 / files.length),
                    message: `${i + 1}/${files.length} files`
                });

                const document = await vscode.workspace.openTextDocument(file);
                const editor = await vscode.window.showTextDocument(document, { preview: false, preserveFocus: true });

                if (this.hasHeader(document)) {
                    // Update existing header
                    await this.updateHeaderIfExists(editor);
                    updatedCount++;
                } else {
                    // Insert new header
                    await this.insertOrUpdateHeader(editor);
                    insertedCount++;
                }

                await document.save();
            }
        });

        vscode.window.showInformationMessage(`Processed ${files.length} files: ${insertedCount} inserted, ${updatedCount} updated`);
    }
}
