/**
 * Represents a node in a file tree.
 */
export interface FileTreeNode {
    name: string;
    isDirectory: boolean;
    children?: FileTreeNode[];
}