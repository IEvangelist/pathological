import { equal } from "assert";
import { suite, test } from "mocha";
import { buildTree } from "../../tree-builder";
import { IFileTreeNode, FileTreeNode } from "../../types/file-tree-node";
import { PathologicalConfiguration } from "../../types/pathological-configuration";

suite("buildTree", () => {
  const config: PathologicalConfiguration = {
    indent: 4,
    closedFolder: "📁",
    openFolder: "📂",
    verticalLine: "│",
    horizontalLine: "─",
    junction: "├",
    corner: "└",
    normalizePath: false
  };

  const laughableConfig: PathologicalConfiguration = {
    indent: 2,
    closedFolder: "💩",
    openFolder: "🤓",
    verticalLine: "⁞",
    horizontalLine: "→",
    junction: "+",
    corner: "⁘",
    normalizePath: false
  };

  test("should return closed folder for single / empty directory", () => {
    const node: IFileTreeNode = {
      name: "root",
      isDirectory: true,
      isFile: false,
      depth: 0,
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
      children: [
        {
          name: "file1.txt",
          isDirectory: false,
          isFile: true,
          depth: 1
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
      children: [
        {
          name: "dir1",
          isDirectory: true,
          isFile: false,
          depth: 1,
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
      children: [
        {
          name: "file1.txt",
          isDirectory: false,
          isFile: true,
          depth: 1
        },
        {
          name: "dir1",
          isDirectory: true,
          isFile: false,
          depth: 1,
          children: [
            {
              name: "file2.txt",
              isDirectory: false,
              isFile: true,
              depth: 2
            }
          ]
        },
        {
          name: "dir2",
          isDirectory: true,
          isFile: false,
          depth: 1,
          children: [
            {
              name: "file3.txt",
              isDirectory: false,
              isFile: true,
              depth: 2
            },
            {
              name: "dir3",
              isDirectory: true,
              isFile: false,
              depth: 2,
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
      children: [
        {
          name: "file1.txt",
          isDirectory: false,
          isFile: true,
          depth: 1
        },
        {
          name: "dir1",
          isDirectory: true,
          isFile: false,
          depth: 1,
          children: [
            {
              name: "file2.txt",
              isDirectory: false,
              isFile: true,
              depth: 2
            }
          ]
        },
        {
          name: "dir2",
          isDirectory: true,
          isFile: false,
          depth: 1,
          children: [
            {
              name: "file3.txt",
              isDirectory: false,
              isFile: true,
              depth: 2
            },
            {
              name: "dir3",
              isDirectory: true,
              isFile: false,
              depth: 2,
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
