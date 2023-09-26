import { basename, dirname, join, normalize, relative } from "path";
import { readdirSync, statSync } from "fs";
import { Uri } from "vscode";
import { FileTreeNode } from "../models/file-tree-node";
import { getConfiguration } from "../config";

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

        const normalizedPath = normalize(relativePath);

        return normalizedPath;

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
    const formattedTree = formatFileSystemTree(fileSystemTree);

    return formattedTree;
}

/**
 * Returns the emoji to use for a given file tree node.
 * If the node is a directory, it returns the open or closed folder emoji
 * based on whether the directory has children or not.
 * If the node is a file, it returns an empty string.
 *
 * @param node The file tree node to get the emoji for.
 * @returns The emoji to use for the given file tree node.
 */
function getFolderEmoji(node: FileTreeNode): string {
    if (node.isDirectory) {
        const config = getConfiguration();

        return node.children && node.children.length > 0
            ? config?.openFolder ?? "📂"
            : config?.closedFolder ?? "📁";
    }

    return "";
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

/**
 * Formats a file system tree as a string.
 * @param node The root node of the file system tree.
 * @param depth The current depth of the node in the tree.
 * @param isLastChild Whether the node is the last child of its parent.
 * @returns A string representation of the file system tree.
 */
function formatFileSystemTree(
    node: FileTreeNode, depth: number = 0, isLastChild: boolean = true): string {
    const indent = ' '.repeat(depth * 4);
    let result = indent;

    if (node.isDirectory) {
        result += isLastChild ? '└───' : '├───';

        const folderEmoji = getFolderEmoji(node);
        result += `${folderEmoji} ${node.name}\n`;

        if (node.children) {
            const childCount = node.children.length;

            for (let i = 0; i < childCount; i++) {
                const child = node.children[i];
                const isLast = i === childCount - 1;

                result += formatFileSystemTree(child, depth + 1, isLast);
            }
        }
    } else {
        result += isLastChild ? '└───' : '├───';
        result += ` ${node.name}\n`;
    }

    return result;
}