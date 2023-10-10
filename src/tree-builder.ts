import { getConfiguration } from "./config";
import { FileTreeNode } from "./types/file-tree-node";
import { PathologicalConfiguration } from "./types/pathological-configuration";

export function buildTree(node: FileTreeNode): string {
    const config = getConfiguration();

    const sortedNode = { ...node };
    sortedNode.children = [...(node.children || [])].sort(sortNodes);

    return buildFileTree(sortedNode, config);
}

function sortNodes(nodeA: FileTreeNode, nodeB: FileTreeNode): number {
    if (nodeA.isDirectory === nodeB.isDirectory) {
        return nodeA.name.localeCompare(nodeB.name);
    }
    return nodeA.isDirectory ? -1 : 1;
}

function buildFileTree(
    node: FileTreeNode,
    config: PathologicalConfiguration,
    depth: number = 0,
    isLast: boolean = true,
    isSibling: boolean = false): string {
    const {
        closedFolder,
        openFolder,
        verticalLine,
        horizontalLine,
        junction,
        corner,
        indent,
    } = config;

    let indentString = '';
    if (isSibling) {
        const count = depth * indent;
        for (let i = 0; i < count; ++ i) {
            const lead = i % indent;
            indentString += i > 0 && lead === 0 && isSibling 
                ? verticalLine 
                : ' ';
        }
    } else {
        indentString = ' '.repeat(depth * indent);
    }

    let tree = indentString;

    if (!node.children || node.children.length === 0) {
        const folderEmoji = node.isDirectory ? closedFolder : '';

        tree = `${indentString}${isLast ? corner : junction}`;
        tree += `${horizontalLine.repeat(indent - 1)}${folderEmoji} ${node.name}\n`;

        return tree;
    }

    node.children.sort(sortNodes);

    if (node.isDirectory) {
        tree = `${indentString}${isLast ? corner : junction}`;
        tree += `${horizontalLine.repeat(indent - 2)}${openFolder} ${node.name}\n`;

        for (let i = 0; i < node.children.length; i++) {
            const child = node.children[i];

            const isLastChild = i === node.children.length - 1;
            const isSubtreeSibling = isSibling || !isLastChild;
            const subtree = buildFileTree(child, config, depth + 1, isLastChild, isSubtreeSibling);

            tree += `${subtree}`;
        }
    } else {
        tree += `${indentString}${isLast ? corner : junction}`;
        tree += `${horizontalLine.repeat(indent - 1)} ${node.name}\n`;
    }

    return tree;
}