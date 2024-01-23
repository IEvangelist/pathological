import { basename, extname, join } from "path";
import { readdirSync, statSync } from "fs";
import { IFileTreeNode, FileTreeNode } from "../types/file-tree-node";
import { FileKind } from "../types/file-kind";
import { tryCountLines } from "./file-line-counter";

/**
 * Recursively generates a tree of file system nodes for the given folder path.
 * @param folderPath The path of the folder to generate the tree for.
 * @returns The root node of the generated file system tree.
 */
export function generateFileSystemTree(folderPath: string, depth: number = 0): FileTreeNode {
  const stats = statSync(folderPath);
  const nodeName = basename(folderPath);
  const extension = extname(nodeName);
  const fullPath = join(folderPath, folderPath.endsWith(nodeName) ? "" : nodeName);
  const lineCount = tryCountLines(fullPath);

  const node: IFileTreeNode = {
    name: nodeName,
    fullPath: fullPath,
    isDirectory: stats.isDirectory(),
    isFile: stats.isFile(),
    depth: depth,
    size: stats.size,
    lineCount: lineCount,
    extension: extension,
    fileKind: mapKindFrom(extension)
  };

  if (node.isDirectory) {
    const files = readdirSync(folderPath);

    node.children = files.map(file => {
      const filePath = join(folderPath, file);
      return generateFileSystemTree(filePath, depth + 1);
    });
  }

  return new FileTreeNode(node);
}

function mapKindFrom(extension?: string | undefined): FileKind {
  switch (extension) {
    case ".ts":
      return FileKind.TypeScript;
    case ".js":
      return FileKind.JavaScript;
    case ".json":
      return FileKind.Json;
    case ".md":
      return FileKind.Markdown;
    case ".txt":
      return FileKind.Text;
    case ".png":
      return FileKind.Png;
    case ".jpg":
    case ".jpeg":
      return FileKind.Jpeg;
    case ".gif":
      return FileKind.Gif;
    case ".svg":
      return FileKind.Svg;
    case ".css":
      return FileKind.Css;
    case ".html":
      return FileKind.Html;
    case ".xml":
      return FileKind.Xml;
    case ".yaml":
    case ".yml":
      return FileKind.Yaml;
    case ".sh":
      return FileKind.Shell;
    case ".bat":
      return FileKind.Batch;
    case ".ps1":
      return FileKind.PowerShell;
    case ".cs":
      return FileKind.CSharp;
    case ".cshtml":
      return FileKind.Cshtml;
    case ".dll":
      return FileKind.Dll;
    case ".exe":
      return FileKind.Exe;
    case ".java":
    case ".class":
    case ".jar":
      return FileKind.Java;
    case ".kt":
      return FileKind.Kotlin;
    case ".py":
      return FileKind.Python;
    case ".rb":
      return FileKind.Ruby;
    case ".php":
      return FileKind.Php;
    case ".go":
      return FileKind.Go;
    case ".rs":
      return FileKind.Rust;
    case ".fs":
    case ".fsx":
      return FileKind.FSharp;
    case ".hs":
      return FileKind.Haskell;
    case ".erl":
      return FileKind.Erlang;
    case ".lisp":
      return FileKind.Lisp;
    case ".lua":
      return FileKind.Lua;
    case ".rkt":
      return FileKind.Racket;
    case ".clj":
      return FileKind.Clojure;
    case ".cpp":
    case ".h":
      return FileKind.Cpp;
    case ".scala":
      return FileKind.Scala;
    case ".scm":
      return FileKind.Scheme;
    case ".scss":
      return FileKind.Scss;
    case ".sass":
      return FileKind.Sass;
    case null:
    case undefined:
      return FileKind.NotApplicable;
  }

  return FileKind.Unknown;
}
