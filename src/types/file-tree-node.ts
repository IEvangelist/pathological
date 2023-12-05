import { FileKind } from "./file-kind";

/**
 * Represents a node in a file tree.
 */
export interface IFileTreeNode {
  /**
   * The name of the node.
   */
  name: string;

  /**
   * The full path of the node.
   */
  fullPath?: string;

  /**
   * Whether the node is a directory.
   */
  isDirectory: boolean;

  /**
   * Whether the node is a file.
   */
  isFile: boolean;

  /**
   * The depth of the node in the file tree.
   */
  depth: number;

  /**
   * The children of the node.
   */
  children?: IFileTreeNode[] | undefined;

  /**
   * The size of the node in bytes.
   */
  size: number;

  /**
   * The extension of the file represented by this node.
   */
  extension?: string;

  /**
   * The kind of file represented by this node.
   */
  fileKind: FileKind;
}

/**
 * Represents a node in a file tree.
 */
export class FileTreeNode implements IFileTreeNode {
  private _name: string;
  private _fullPath: string;
  private _isDirectory: boolean;
  private _isFile: boolean;
  private _depth: number;
  private _children?: FileTreeNode[] | undefined;
  private _size: number;
  private _extension?: string;
  private _fileKind: FileKind;

  /**
   * The name of the file or directory represented by this node.
   */
  get name(): string {
    return this._name;
  }

  /**
   * The full path of the file or directory represented by this node.
   */
  get fullPath(): string {
    return this._fullPath;
  }

  /**
   * Returns a boolean indicating whether this node represents a directory.
   */
  get isDirectory(): boolean {
    return this._isDirectory;
  }

  /**
   * Returns a boolean indicating whether this node represents a file.
   */
  get isFile(): boolean {
    return this._isFile;
  }

  /**
   * The depth of the current node in the file tree.
   */
  get depth(): number {
    return this._depth;
  }

  /**
   * Returns a boolean indicating whether this node is a leaf node (i.e. has no children).
   * @returns {boolean} True if this node is a leaf node, false otherwise.
   */
  get isLeaf(): boolean {
    return (this._children?.length ?? 0) === 0;
  }

  /**
   * Gets the children of the current `FileTreeNode`.
   * @returns An array of `FileTreeNode` objects representing the children of the current node, or `undefined` if the node has no children.
   */
  get children(): FileTreeNode[] | undefined {
    return this._children;
  }

  /**
   * Returns a boolean indicating whether this node is the root of the file tree.
   */
  get isRoot(): boolean {
    return this._depth === 0;
  }

  /**
   * The size of the file or directory represented by this node in bytes.
   */
  get size(): number {
    if (this.isDirectory) {
      return this._children?.reduce((total, child) => total + child.size, 0) ?? 0;
    }

    return this._size;
  }

  /**
   * The extension of the file represented by this node.
   */
  get extension(): string | undefined {
    return this._extension;
  }

  /**
   * The kind of file represented by this node.
   */
  get fileKind(): FileKind {
    return this._fileKind;
  }

  /**
   * Creates a new instance of the FileTreeNode class.
   * @param node The node to create the instance from.
   */
  constructor(node: IFileTreeNode) {
    this._name = node.name;
    this._fullPath = node.fullPath ?? "";
    this._isDirectory = node.isDirectory;
    this._isFile = node.isFile;
    this._depth = node.depth;
    this._size = node.size;
    this._extension = node.extension;
    this._fileKind = node.fileKind;
    this._children = node.children
      ?.map(child => new FileTreeNode(child))
      ?.sort((nodeA, nodeB) => {
        if (nodeA.isDirectory === nodeB.isDirectory) {
          return nodeA.name.localeCompare(nodeB.name);
        }
        return nodeA.isDirectory ? -1 : 1;
      });
  }
}
