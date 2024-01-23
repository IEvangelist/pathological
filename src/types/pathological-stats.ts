import { Uri } from "vscode";
import { FileTreeNode } from "./file-tree-node";

export interface PathologicalStats {
  /**
   * The URI of the file or directory.
   */
  sourceUri: Uri;

  /**
   * The number of directories in the file system.
   */
  directories: number;

  /**
   * The number of files in the file system.
   */
  files: number;

  /**
   * The total size of the file system in bytes.
   */
  size: number;

  /**
   * The total size of the file system in bytes, with units.
   */
  sizeWithUnits: string;

  /**
   * The total number of lines in the file system.
   */
  lineCount: number;

  /**
   * The number of unique file types in the file system.
   */
  uniqueFileTypeCount: number;

  /**
   * The file tree node for the file system, with all children, including directories and files (recursively).
   */
  fileTreeNode: FileTreeNode;

  /**
   * The \<pre\>\<\/pre> ASCII content representing the file system.
   */
  preAsciiContent: string;
}
