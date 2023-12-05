import { equal } from "assert";
import { suite, test } from "mocha";
import { buildTree } from "../../tree-builder";
import { IFileTreeNode, FileTreeNode } from "../../types/file-tree-node";
import { PathologicalConfiguration } from "../../types/pathological-configuration";
import { FileKind } from "../../types/file-kind";

suite("buildTree", () => {
  const config: PathologicalConfiguration = {
    indent: 4,
    closedFolder: "📁",
    openFolder: "📂",
    verticalLine: "│",
    horizontalLine: "─",
    junction: "├",
    corner: "└",
    normalizedPathSeparator: "/"
  };

  const laughableConfig: PathologicalConfiguration = {
    indent: 2,
    closedFolder: "💩",
    openFolder: "🤓",
    verticalLine: "⁞",
    horizontalLine: "→",
    junction: "+",
    corner: "⁘",
    normalizedPathSeparator: "/"
  };

  test("should return closed folder for single / empty directory", () => {
    const node: IFileTreeNode = {
      name: "root",
      isDirectory: true,
      isFile: false,
      depth: 0,
      size: 0,
      extension: undefined,
      fileKind: FileKind.NotApplicable,
      children: []
    };

    const tree = buildTree(new FileTreeNode(node), config);

    equal(tree, "└───📁 root\n");
  });

  test("should return a tree with a single file", () => {
    const node: IFileTreeNode = {
      name: "root",
      isDirectory: true,
      isFile: false,
      depth: 0,
      size: 10,
      extension: undefined,
      fileKind: FileKind.NotApplicable,
      children: [
        {
          name: "file1.txt",
          isDirectory: false,
          isFile: true,
          depth: 1,
          size: 10,
          extension: ".txt",
          fileKind: FileKind.Text
        }
      ]
    };

    const tree = buildTree(new FileTreeNode(node), config);

    const lines = ["└───📂 root", "     └─── file1.txt"];

    const expected = lines.join("\n") + "\n";
    equal(tree, expected);
  });

  test("should return a tree with a single closed folder directory", () => {
    const node: IFileTreeNode = {
      name: "root",
      isDirectory: true,
      isFile: false,
      depth: 0,
      size: 0,
      extension: undefined,
      fileKind: FileKind.NotApplicable,
      children: [
        {
          name: "dir1",
          isDirectory: true,
          isFile: false,
          depth: 1,
          size: 0,
          extension: undefined,
          fileKind: FileKind.NotApplicable,
          children: []
        }
      ]
    };

    const tree = buildTree(new FileTreeNode(node), config);

    const lines = ["└───📂 root", "     └───📁 dir1"];

    const expected = lines.join("\n") + "\n";
    equal(tree, expected);
  });

  test("should return a tree with multiple files and directories", () => {
    const node: IFileTreeNode = {
      name: "root",
      isDirectory: true,
      isFile: false,
      depth: 0,
      size: 100,
      extension: undefined,
      fileKind: FileKind.NotApplicable,
      children: [
        {
          name: "file1.txt",
          isDirectory: false,
          isFile: true,
          depth: 1,
          size: 30,
          extension: ".txt",
          fileKind: FileKind.Text
        },
        {
          name: "dir1",
          isDirectory: true,
          isFile: false,
          depth: 1,
          size: 20,
          extension: undefined,
          fileKind: FileKind.NotApplicable,
          children: [
            {
              name: "file2.txt",
              isDirectory: false,
              isFile: true,
              depth: 2,
              size: 20,
              extension: ".txt",
              fileKind: FileKind.Text
            }
          ]
        },
        {
          name: "dir2",
          isDirectory: true,
          isFile: false,
          depth: 1,
          size: 50,
          extension: undefined,
          fileKind: FileKind.NotApplicable,
          children: [
            {
              name: "file3.txt",
              isDirectory: false,
              isFile: true,
              depth: 2,
              size: 50,
              extension: ".txt",
              fileKind: FileKind.Text
            },
            {
              name: "dir3",
              isDirectory: true,
              isFile: false,
              depth: 2,
              size: 0,
              extension: undefined,
              fileKind: FileKind.NotApplicable,
              children: []
            }
          ]
        }
      ]
    };

    const tree = buildTree(new FileTreeNode(node), config);

    const lines = [
      "└───📂 root",
      "     ├───📂 dir1",
      "     │    └─── file2.txt",
      "     ├───📂 dir2",
      "     │    ├───📁 dir3",
      "     │    └─── file3.txt",
      "     └─── file1.txt"
    ];

    const expected = lines.join("\n") + "\n";
    equal(tree, expected);
  });

  test("should return a tree that is correctly styled", () => {
    const node: IFileTreeNode = {
      name: "root",
      isDirectory: true,
      isFile: false,
      depth: 0,
      size: 100,
      extension: undefined,
      fileKind: FileKind.NotApplicable,
      children: [
        {
          name: "file1.txt",
          isDirectory: false,
          isFile: true,
          depth: 1,
          size: 30,
          extension: ".txt",
          fileKind: FileKind.Text
        },
        {
          name: "dir1",
          isDirectory: true,
          isFile: false,
          depth: 1,
          size: 20,
          extension: undefined,
          fileKind: FileKind.NotApplicable,
          children: [
            {
              name: "file2.txt",
              isDirectory: false,
              isFile: true,
              depth: 2,
              size: 20,
              extension: ".txt",
              fileKind: FileKind.Text
            }
          ]
        },
        {
          name: "dir2",
          isDirectory: true,
          isFile: false,
          depth: 1,
          size: 50,
          extension: undefined,
          fileKind: FileKind.NotApplicable,
          children: [
            {
              name: "file3.txt",
              isDirectory: false,
              isFile: true,
              depth: 2,
              size: 50,
              extension: ".txt",
              fileKind: FileKind.Text
            },
            {
              name: "dir3",
              isDirectory: true,
              isFile: false,
              depth: 2,
              size: 0,
              extension: undefined,
              fileKind: FileKind.NotApplicable,
              children: []
            }
          ]
        }
      ]
    };

    const tree = buildTree(new FileTreeNode(node), laughableConfig);

    const lines = [
      "⁘→🤓 root",
      "   +→🤓 dir1",
      "   ⁞  ⁘→ file2.txt",
      "   +→🤓 dir2",
      "   ⁞  +→💩 dir3",
      "   ⁞  ⁘→ file3.txt",
      "   ⁘→ file1.txt"
    ];

    const expected = lines.join("\n") + "\n";
    equal(tree, expected);
  });
});
