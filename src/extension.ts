import { ExtensionContext, commands, Uri, window, env } from "vscode";
import { getRelativePath } from "./commands/pathological";

export function activate(context: ExtensionContext) {
    const disposable = commands.registerCommand(
        "pathological.getRelativePath",
        (_: Uri, uris?: [Uri, Uri]) => {
            if (uris?.length !== 2) {
                window.showErrorMessage(
                    "Please select two files to get the relative path between them."
                );

                return;
            }

            const relativePath = getRelativePath(uris[0], uris[1]);

            if (relativePath === null) {
                window.showErrorMessage(
                    "An error occurred while getting the relative path between the two files."
                );
            } else {
                env.clipboard.writeText(relativePath);
                window.showInformationMessage(
                    `The ${relativePath} path has been copied to clipboard.`
                );
            }
        });

    context.subscriptions.push(disposable);

    console.log("Pathological extension activated.");
}