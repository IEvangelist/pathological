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

/**
 * Builds a string representation of a file tree structure starting from a given node.
 * @param node The root node of the file tree.
 * @param config The configuration object for the file tree.
 * @param previousTree The string representation of the previous tree level.
 * @returns A string representation of the file tree structure.
 */
function buildFileTree(
    node: FileTreeNode,
    config: PathologicalConfiguration,
    previousTree: string = ""): string {
    const { verticalLine } = config;

    if (node.isLeafNotEmpty) {
        return toLeadingCornerLine(previousTree, config);
    }

    let result = "";

    if (node.isRoot) {
        result += toSingleLine(true, previousTree, node.name, true, config);
        previousTree += toLeadingLine(true, verticalLine);
    }

    node.children?.forEach((child, index) => {
        const isLastChild = index === node.children!.length - 1;

        if (child.isDirectory) {
            result += toSingleLine(isLastChild, previousTree, child.name, true, config);
            const previousSubtree = `${previousTree}${toLeadingLine(isLastChild, verticalLine)}`;
            result += buildFileTree(child, config, previousSubtree);
        }

        if (child.isFile) {
            result += toSingleLine(isLastChild, previousTree, child.name, false, config);
        }
    });

    return result;
}

/**
 * Returns a string representing the leading line of a folder tree node, including the corner, horizontal line, and open folder icon.
 * @param previousContent - The content that comes before the leading line.
 * @param config - The configuration object containing the corner, horizontal line, indent, and open folder icon.
 * @returns A string representing the leading line of a folder tree node.
 */
function toLeadingCornerLine(previousContent = "", config: PathologicalConfiguration) {
    const { corner, horizontalLine, indent, openFolder } = config;

    return `${previousContent}${corner}${horizontalLine.repeat(indent - 1)}${openFolder}\n`;
}

/**
 * Returns a string representing the leading line of a tree node.
 * @param isLast - A boolean indicating whether the node is the last child of its parent.
 * @param verticalLine - A string representing the vertical line character used in the tree.
 * @returns A string representing the leading line of a tree node.
 */
function toLeadingLine(isLast: boolean, verticalLine: string): string {
    return `${isLast ? ' ' : verticalLine}${" ".repeat(3)}`;
}

/**
 * Returns a single line representation of a directory item, including its name and prefix characters.
 * @param isLast - Indicates whether the item is the last one in the directory.
 * @param previousContent - The content that was previously generated for the directory.
 * @param itemName - The name of the directory item.
 * @param isDirectory - Indicates whether the item is a directory.
 * @param config - The configuration object for the tree builder.
 * @returns A string representing the directory item in a single line.
 */
function toSingleLine(
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
