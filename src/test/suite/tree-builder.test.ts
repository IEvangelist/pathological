import { equal } from "assert";
import { suite, test } from "mocha";
import { buildTree } from "../../tree-builder";
import { IFileTreeNode, FileTreeNode } from "../../types/file-tree-node";

suite("buildTree", () => {
  test("should return an empty string for an empty node", () => {
    const node: IFileTreeNode = {
      name: "root",
      isDirectory: true,
      isFile: false,
      depth: 0,
      children: []
    };

    const tree = buildTree(new FileTreeNode(node));

    equal(tree, "└───📁 root\n");
  });

  test("should return a tree with one file", () => {
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

    const tree = buildTree(new FileTreeNode(node));

    const lines = [
      "└───📂 root",
      "    └─── file1.txt"
    ];

    const expected = lines.join("\n") + "\n";
    equal(tree, expected);
  });

  test("should return a tree with one directory", () => {
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

    const tree = buildTree(new FileTreeNode(node));

    const lines = [
      "└───📂 root",
      "    └───📁 dir1"
    ]

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

    const tree = buildTree(new FileTreeNode(node));

    const lines = [
      "└───📂 root",
      "    ├───📂 dir1",
      "    │   └─── file2.txt",
      "    ├───📂 dir2",
      "    │   ├───📁 dir3",
      "    │   └─── file3.txt",
      "    └─── file1.txt"
    ]

    const expected = lines.join("\n") + "\n";
    equal(tree, expected);
  });

  test("should return a tree with one file", () => {
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

    const tree = buildTree(new FileTreeNode(node));

    const lines = [
      "└───📂 root",
      "    └─── file1.txt"
    ];

    const expected = lines.join("\n") + "\n";
    equal(tree, expected);
  });
});
