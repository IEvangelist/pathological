import { basename, dirname, relative } from "path";
import { buildTree } from "../services/tree-builder";
import { generateFileSystemTree } from "../services/file-node-resolver";
import { getConfiguration } from "../services/config-reader";
import { Uri } from "vscode";
import { toHumanReadableSize } from "../services/size-humanizer";

// TODO:
// Add showFileSystemStats.

// /**
//  * Show a webview of all the file stats for the given URI.
//  * @param uri - The URI to generate the file or aggregated directory stats for.
//  */
// export function showPathological(uri: Uri): void {
//   const config = getConfiguration();

//   const fileSystemTree = generateFileSystemTree(uri.fsPath);
//   const tree = buildTree(fileSystemTree, config);

//   const panel = config.createPanel("Pathological", "pathological", tree);
//   panel.webview.onDidReceiveMessage(
//     (message) => {
//       switch (message.command) {
//         case "openFile":
//           const fileUri = Uri.file(message.path);
//           config.openFile(fileUri);
//           break;
//       }
//     },
//     undefined,
//     config.extensionContext.subscriptions
//   );
// }

/**
 * Returns the relative path between two Uri objects.
 * @param firstUri The first Uri object.
 * @param secondUri The second Uri object.
 * @returns The relative path between the two Uri objects, or null if the URIs are not compatible or an error occurs.
 */
export function getRelativePath(firstUri: Uri, secondUri: Uri): string | null {
  try {
    if (firstUri.fsPath === secondUri.fsPath) {
      return basename(firstUri.fsPath);
    }

    if (firstUri.scheme !== secondUri.scheme) {
      return null;
    }

    if (firstUri.scheme !== "file") {
      return null;
    }

    const relativePath = relative(dirname(firstUri.fsPath), secondUri.fsPath);

    const config = getConfiguration();

    // If the normalizedPathSeparator option is set, use it to replace the path separator.
    return config.normalizedPathSeparator
      ? relativePath.replace(/[\\/]/g, config.normalizedPathSeparator)
      : relativePath;
  } catch (error) {
    return null;
  }
}

/**
 * Returns a formatted file system tree as a string for the given URI.
 * @param uri - The URI to generate the file system tree for.
 * @returns The formatted file system tree as a string.
 */
export function getAsFileSystemTree(uri: Uri): string {
  const fileSystemTree = generateFileSystemTree(uri.fsPath);
  const config = getConfiguration();
  const tree = buildTree(fileSystemTree, config);

  return tree;
}

/**
 * Returns a file system as a flat list string for the given URI.
 * @param uri - The URI to generate the file system tree for.
 * @returns The file system as a flat list string.
 */
export function getAsFlatList(uri: Uri): string {
  const fileSystemTree = generateFileSystemTree(uri.fsPath);

  const flatList = [];
  const stack = [fileSystemTree];
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) {
      continue;
    }

    flatList.push(node);
    if (node.children) {
      stack.push(...node.children);
    }
  }

  const sorted = flatList?.sort((nodeA, nodeB) => {
    if (nodeA.isDirectory === nodeB.isDirectory) {
      return nodeA.fullPath.localeCompare(nodeB.fullPath);
    }
    return nodeA.isDirectory ? -1 : 1;
  });

  return sorted.map(n => n.fullPath).join("\n");
}

export function getAsFileSystemStats(uri: Uri): string {
  const fileSystemTree = generateFileSystemTree(uri.fsPath);

  const stats = {
    directories: 0,
    files: 0,
    size: 0,
    sizeWithUnits: "",
    lineCount: 0
  };

  const stack = [fileSystemTree];
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) {
      continue;
    }

    if (node.isDirectory) {
      stats.directories++;
    } else {
      stats.files++;
      stats.size += node.size;
      if (node.lineCount !== undefined) {
        stats.lineCount += node.lineCount;
      }
    }

    if (node.children) {
      stack.push(...node.children);
    }
  }

  stats.sizeWithUnits = toHumanReadableSize(stats.size);

  const json = JSON.stringify(stats, null, 2);
  return json;
}
