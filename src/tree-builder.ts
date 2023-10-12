import { getConfiguration } from "./config-reader";
import { FileTreeNode } from "./types/file-tree-node";
import { PathologicalConfiguration } from "./types/pathological-configuration";

/**
 * Builds a file tree from the given root node.
 * @param node The root node of the file tree.
 * @returns A string representation of the file tree.
 */
export function buildTree(node: FileTreeNode): string {
    const config = getConfiguration();

    return buildFileTree(node, config);
}

function buildFileTree(
    node: FileTreeNode,
    config: PathologicalConfiguration,
    previousTree: string = ""): string {
    const { verticalLine } = config;

    if (node.isLeafNotEmpty) {
        return directoryNotEmpty(previousTree, config);
    }

    let result = "";

    if (node.isRoot) {
        result += directoryItem(true, previousTree, node.name, true, config);
        previousTree += previousContent(true, verticalLine);
    }

    node.children?.forEach((child, index) => {
        const isLastChild = index === node.children!.length - 1;

        if (child.isDirectory) {
            result += directoryItem(isLastChild, previousTree, child.name, true, config);
            const previousSubtree = previousTree + previousContent(isLastChild, verticalLine);
            result += buildFileTree(child, config, previousSubtree);
        }

        if (child.isFile) {
            result += directoryItem(isLastChild, previousTree, child.name, false, config);
        }
    });

    return result;
}

function directoryNotEmpty(previousContent = "", config: PathologicalConfiguration) {
    const { corner, horizontalLine, indent, openFolder } = config;

    return `${previousContent}${corner}${horizontalLine.repeat(indent - 1)}${openFolder}\n`;
}

function previousContent(isLast: boolean, verticalLine: string): string {
    return `${isLast ? ' ' : verticalLine}${" ".repeat(3)}`;
}

function directoryItem(
    isLast: boolean,
    previousContent = '',
    itemName = '',
    isDirectory = false,
    config: PathologicalConfiguration) {
    const {
        openFolder,
        horizontalLine,
        junction,
        corner,
        indent,
    } = config;

    const linePrefix = isLast ? corner : junction;
    const itemText = isDirectory
        ? `${openFolder} ${itemName}`
        : ` ${itemName}`;

    const directoryItemRepresentation =
        `${linePrefix}${horizontalLine.repeat(indent - 2)}${itemText}`;

    return `${previousContent}${directoryItemRepresentation}\n`;
}
