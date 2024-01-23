import { Uri } from "vscode";
import { basename, dirname, relative } from "path";
import { buildTree } from "../services/tree-builder";
import { DirectoryPanel } from "../panels/directory-panel";
import { generateFileSystemTree } from "../services/file-node-resolver";
import { getConfiguration } from "../services/config-reader";
import { PathologicalStats } from "../types/pathological-stats";
import { toHumanReadableSize } from "../services/size-humanizer";
import { FileTreeNode } from "../types/file-tree-node";

// /**
//  * Show a webview of all the file stats for the given URI.
//  * @param uri - The URI to generate the file or aggregated directory stats for.
//  */
export function showPathological(extensionUri: Uri, uri: Uri): void {
  const stats = getAsFileSystemStats(uri);

  DirectoryPanel.createOrShow(extensionUri, uri, stats);
}

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
  return representAsFileSystemTree(fileSystemTree);
}

function representAsFileSystemTree(fileSystemTree: FileTreeNode) {
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

export function getAsFileSystemStats(uri: Uri): PathologicalStats {
  const fileSystemTree = generateFileSystemTree(uri.fsPath);
  const treeContent = representAsFileSystemTree(fileSystemTree);

  const stats: PathologicalStats = {
    directories: 0,
    files: 0,
    size: 0,
    sizeWithUnits: "",
    lineCount: 0,
    uniqueFileTypeCount: 0,
    sourceUri: uri,
    fileTreeNode: fileSystemTree,
    preAsciiContent: treeContent
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

  const allChildren = fileSystemTree.allChildren;
  const uniqueFileTypes = new Set(allChildren.map(n => n.extension));
  stats.uniqueFileTypeCount = uniqueFileTypes.size;
  stats.lineCount = allChildren.reduce((total, child) => total + (child.lineCount ?? 0), 0);
  stats.directories = allChildren.filter(n => n.isDirectory).length;
  stats.sizeWithUnits = toHumanReadableSize(stats.size);

  return stats;
}
