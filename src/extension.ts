import { ExtensionContext, commands, Uri, window, env } from "vscode";
import { getAsFileSystemTree, getAsFlatList, getRelativePath } from "./commands/pathological";

/**
 * The URI of the currently selected item, if any.
 */
let selectedUri: Uri | undefined;

/**
 * Sets the selected URI and updates the context accordingly.
 * @param uri The URI to set as selected.
 */
const setSelectedUri = async (uri: Uri | undefined) => {
  selectedUri = uri;

  await commands.executeCommand("setContext", "pathological.hasSelectedUri", !!selectedUri);
};

/**
 * Activates the Pathological extension.
 * @param context The extension context.
 */
export function activate(context: ExtensionContext) {
  const selectUriForRelativeDisposable = commands.registerCommand(
    "pathological.selectUriForRelative",
    async (uri: Uri) => {
      if (uri && uri.scheme === "file") {
        await setSelectedUri(uri);
      }
    }
  );

  const getRelativePathDisposable = commands.registerCommand("pathological.getRelativePath", async (uri: Uri) => {
    if (!selectedUri) {
      // Shouldn't be possible...
      return;
    }

    const relativePath = getRelativePath(selectedUri, uri);

    if (relativePath === null) {
      await window.showErrorMessage("An error occurred while getting the relative path between the two files.");
    } else {
      await env.clipboard.writeText(relativePath);

      await window.showInformationMessage(`The ${relativePath} path has been copied to clipboard.`);

      await setSelectedUri(undefined);
    }
  });

  const getFileSystemTreeDisposable = commands.registerCommand("pathological.getAsFileSystemTree", async (uri: Uri) => {
    if (uri && uri.scheme === "file") {
      const fileSystemTree = getAsFileSystemTree(uri);

      await env.clipboard.writeText(fileSystemTree);

      await window.showInformationMessage(fileSystemTree);
    }
  });

  const getFileSystemFlatListDisposable = commands.registerCommand("pathological.getAsFlatList", async (uri: Uri) => {
    if (uri && uri.scheme === "file") {
      const fileSystemFlatList = getAsFlatList(uri);

      await env.clipboard.writeText(fileSystemFlatList);

      await window.showInformationMessage(fileSystemFlatList);
    }
  });

  context.subscriptions.push(selectUriForRelativeDisposable);
  context.subscriptions.push(getRelativePathDisposable);
  context.subscriptions.push(getFileSystemTreeDisposable);
  context.subscriptions.push(getFileSystemFlatListDisposable);

  console.log("Pathological extension activated.");
}
