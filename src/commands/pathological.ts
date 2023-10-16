import { basename, dirname, join, normalize, relative } from "path";
import { Uri } from "vscode";
import { buildTree } from "../tree-builder";
import { generateFileSystemTree } from "../file-node-resolver";
import { getConfiguration } from "../config-reader";

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

    return config.normalizePath ? normalize(relativePath) : relativePath;
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
  const tree = buildTree(fileSystemTree);

  return tree;
}
