import { getConfiguration } from "./config";
import { FileTreeNode } from "./models/file-tree-node";
import { PathologicalConfiguration } from "./models/pathological-configuration";

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
    depth: number = 0): string {
    const {
        closedFolder,
        openFolder,
        verticalLine,
        horizontalLine,
        junction,
        corner,
        indent,
    } = config;

    const indentString = ' '.repeat(depth * indent);

    if (!node.children || node.children.length === 0) {
        return `${indentString}${closedFolder} ${node.name}\n`;
    }

    node.children.sort(sortNodes);

    let tree = `${indentString}${openFolder} ${node.name}\n`;

    for (let i = 0; i < node.children.length; i++) {
        const isLast = i === node.children.length - 1;
        const child = node.children[i];

        const subtree = buildFileTree(child, config, depth + 1);

        const prefix = isLast ? corner : junction;
        tree += `${indentString}${prefix}${horizontalLine.repeat(indent - 1)}${subtree}`;
    }

    return tree;
}