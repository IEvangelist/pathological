import { basename, join } from "path";
import { readdirSync, statSync } from "fs";
import { FileTreeNode } from "./types/file-tree-node";

/**
* Recursively generates a tree of file system nodes for the given folder path.
* @param folderPath The path of the folder to generate the tree for.
* @returns The root node of the generated file system tree.
*/
export function generateFileSystemTree(folderPath: string): FileTreeNode {
   const stats = statSync(folderPath);
   const nodeName = basename(folderPath);

   const node: FileTreeNode = {
       name: nodeName,
       isDirectory: stats.isDirectory(),
   };

   if (node.isDirectory) {
       const files = readdirSync(folderPath);

       node.children = files.map((file) => {
           const filePath = join(folderPath, file);
           return generateFileSystemTree(filePath);
       });
   }

   return node;
}