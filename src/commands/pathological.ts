import { basename, dirname, join, normalize, relative } from "path";
import { readdirSync, statSync } from "fs";
import { Uri } from "vscode";
import { FileTreeNode } from "../types/file-tree-node";
import { buildTree } from "../tree-builder";

/**
 * Returns the relative path between two Uri objects.
 * @param firstUri The first Uri object.
 * @param secondUri The second Uri object.
 * @param normalizedPath Whether to normalize the path.
 * @returns The relative path between the two Uri objects, or null if the URIs are not compatible or an error occurs.
 */
export function getRelativePath(
    firstUri: Uri,
    secondUri: Uri,
    normalizedPath: boolean = false): string | null {
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

        return normalizedPath
            ? normalize(relativePath)
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
    const tree = buildTree(fileSystemTree);

    return tree;
}

/**
 * Recursively generates a tree of file system nodes for the given folder path.
 * @param folderPath The path of the folder to generate the tree for.
 * @returns The root node of the generated file system tree.
 */
function generateFileSystemTree(folderPath: string): FileTreeNode {
    const stats = statSync(folderPath);
    const nodeName = basename(folderPath);

    const node: FileTreeNode = {
        name: nodeName,
        isDirectory: stats.isDirectory(),
    };

    if (node.isDirectory) {
        const files = readdirSync(folderPath);

        node.children = files.map((file) => {
            const filePath = join(folderPath, file);
            return generateFileSystemTree(filePath);
        });
    }

    return node;
}
