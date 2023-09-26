import { getConfiguration } from "./config";
import { FileTreeNode } from "./models/file-tree-node";
import { PathologicalConfiguration } from "./models/pathological-configuration";

export function build(fileTreeNode: FileTreeNode): string {
    const config = getConfiguration();

    // Build the tree.
    const tree = buildTree(fileTreeNode, config);

    return "";
}

function buildTree(fileTreeNode: FileTreeNode, config: PathologicalConfiguration) {
    throw new Error("Not implemented.");
}
