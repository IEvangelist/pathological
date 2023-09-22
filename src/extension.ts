import { ExtensionContext, commands, Uri, window, env } from "vscode";
import { getRelativePath } from "./commands/pathological";

let selectedUri: Uri | undefined;

const setSelectedUri = (uri: Uri | undefined) => {
    selectedUri = uri;

    commands.executeCommand(
        "setContext",
        "pathological.hasSelectedUri",
        !!selectedUri);
}


export function activate(context: ExtensionContext) {
    const selectUriForRelativeDisposable = commands.registerCommand(
        "pathological.selectUriForRelative",
        (uri: Uri) => {
            if (uri && uri.scheme === "file") {
                setSelectedUri(uri);
            }
        });

    const getRelativePathDisposable = commands.registerCommand(
        "pathological.getRelativePath",
        (uri: Uri) => {
            if (!selectedUri) {
                // Shouldn't be possible...
                return;
            }

            const relativePath = getRelativePath(selectedUri, uri);

            if (relativePath === null) {
                window.showErrorMessage(
                    "An error occurred while getting the relative path between the two files."
                );
            } else {
                env.clipboard.writeText(relativePath);

                window.showInformationMessage(
                    `The ${relativePath} path has been copied to clipboard.`
                );

                setSelectedUri(undefined);
            }
        });

    context.subscriptions.push(selectUriForRelativeDisposable);
    context.subscriptions.push(getRelativePathDisposable);

    console.log("Pathological extension activated.");
}