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
    isLast: boolean = true): string {
    const {
        closedFolder,
        openFolder,
        verticalLine,
        horizontalLine,
        junction,
        corner,
        indent,
    } = config;

    const indentString = `${depth > 1 ? verticalLine : ' '}   `.repeat(depth * indent);

    if (!node.children || node.children.length === 0) {
        return `${indentString}${isLast ? corner : junction}${closedFolder} ${node.name}\n`;
    }

    node.children.sort(sortNodes);

    let tree = `${indentString}${isLast ? corner : junction}${openFolder} ${node.name}\n`;

    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];

        const isLastChild = i === node.children.length - 1;
        const subtree = buildFileTree(child, config, depth + 1, isLastChild);

        tree += `${subtree}`;
    }

    return tree;
}