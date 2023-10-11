/**
 * Represents a node in a file tree.
 */
export interface FileTreeNode {
    /**
     * The name of the node.
     */
    name: string;

    /**
     * Whether the node is a directory.
     */
    isDirectory: boolean;

    /** 
     * The children of the node.
    */
    children?: FileTreeNode[];
}