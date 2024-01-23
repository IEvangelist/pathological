import * as vscode from "vscode";
import * as path from "path";
import { PathologicalStats } from "../types/pathological-stats";
import { getConfiguration } from "../services/config-reader";

const statType = {
    Folder: "📂",
    File: "📄"
};

export class DirectoryPanel {
    public static currentPanel: DirectoryPanel | undefined;

    public static readonly viewType = "directoryPanel";

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];
    private _stats: PathologicalStats;

    public static createOrShow(extensionUri: vscode.Uri, fileOrDirectoryUri: vscode.Uri, stats: PathologicalStats) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

        // If we already have a panel, show it.
        if (DirectoryPanel.currentPanel) {
            DirectoryPanel.currentPanel._panel.reveal(column);
            return;
        }

        // Get the name of the file or directory only.
        const fileName = path.basename(fileOrDirectoryUri.fsPath || "");

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(
            DirectoryPanel.viewType,
            `📂 Directory '${fileName}' Stats`,
            column || vscode.ViewColumn.One,
            DirectoryPanel.getWebviewOptions(extensionUri)
        );

        DirectoryPanel.currentPanel = new DirectoryPanel(panel, extensionUri, stats);
    }

    public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, stats: PathologicalStats) {
        DirectoryPanel.currentPanel = new DirectoryPanel(panel, extensionUri, stats);
    }

    public static getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
        return {
            // Enable javascript in the webview
            enableScripts: true,

            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, "media")]
        };
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, stats: PathologicalStats) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        this._stats = stats;

        // Set the webview's initial html content
        this._update(this._stats);

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Update the content based on view changes
        this._panel.onDidChangeViewState(
            () => {
                if (this._panel.visible) {
                    this._update(this._stats);
                }
            },
            null,
            this._disposables
        );

        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(
            message => {
                console.log(message);
            },
            null,
            this._disposables
        );
    }

    public async updateStats(stats: PathologicalStats) {
        // Send a message to the webview webview.
        // You can send any JSON serializable data.
        await this._panel.webview.postMessage(stats);
    }

    public dispose() {
        DirectoryPanel.currentPanel = undefined;

        // Clean up our resources
        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private _update(stats: PathologicalStats) {
        const webview = this._panel.webview;

        // Vary the webview's content based on where it is located in the editor.
        switch (this._panel.viewColumn) {
            case vscode.ViewColumn.Two:
                this._updateForStatType(webview, "File", stats);
                return;

            case vscode.ViewColumn.One:
            default:
                this._updateForStatType(webview, "Folder", stats);
                return;
        }
    }

    private _updateForStatType(webview: vscode.Webview, stat: keyof typeof statType, stats: PathologicalStats) {
        this._panel.title = stat;
        this._panel.webview.html = this._getHtmlForWebview(webview, statType[stat], stats);
    }

    private _getHtmlForWebview(webview: vscode.Webview, statTypeIcon: string, stats: PathologicalStats) {
        // Local path to main script run in the webview
        const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, "media", "main.js");

        // And the uri we use to load this script in the webview
        const scriptUri = webview.asWebviewUri(scriptPathOnDisk);

        // Local path to css styles
        const styleResetPath = vscode.Uri.joinPath(this._extensionUri, "media", "reset.css");
        const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css");

        // Uri to load styles into webview
        const stylesResetUri = webview.asWebviewUri(styleResetPath);
        const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);

        // Use a nonce to only allow specific scripts to be run
        const nonce = getNonce();

        const config = getConfiguration();
        const normalizedPath = config.normalizedPathSeparator
            ? stats.sourceUri.fsPath.replace(/[\\/]/g, config.normalizedPathSeparator)
            : stats.sourceUri.fsPath;

        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${stylesResetUri}" rel="stylesheet">
				<link href="${stylesMainUri}" rel="stylesheet">

				<title>${statTypeIcon} — ${normalizedPath}</title>
			</head>
			<body>
				<h1>Stats for: ${statTypeIcon} — ${normalizedPath}</h1>
				<div class="stats">
				<div class="pb-1">
					<p><span class="term">Files</span> <span class="value">${stats.files}</span></p>
					<p><span class="term">Directories</span> <span class="value">${stats.directories}</span></p>
					<p><span class="term">Total Size</span> <span class="value">${stats.sizeWithUnits}</span></p>
					<p><span class="term">Total Number Lines</span> <span class="value">${stats.lineCount ? stats.lineCount : "Did not count..."}</span></p>
					<p><span class="term">Unique File Types</span> <span class="value">${stats.uniqueFileTypeCount}</span></p>
				</div>
				<h2>File Tree</h2>
				<pre>${stats.preAsciiContent}</pre>
				</div>

				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}

function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
