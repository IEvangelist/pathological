import { basename, dirname, relative } from "path";
import { buildTree } from "../tree-builder";
import { generateFileSystemTree } from "../file-node-resolver";
import { getConfiguration } from "../config-reader";
import { Uri } from "vscode";

// TODO:
// Add showFileSystemStats.

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
      ? relativePath.replace(/[\\\/]/g, config.normalizedPathSeparator)
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
