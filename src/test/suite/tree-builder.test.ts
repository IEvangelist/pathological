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

    equal(tree, "└──📁 root\n");
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

    equal(tree, "└──📂 root\n   └── file1.txt\n");
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

    equal(tree, "└──📂 root\n   └──📁 dir1\n");
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

    equal(
      tree,
      "└──📂 root\n   ├──📂 dir1\n   │   └── file2.txt\n   ├──📂 dir2\n   │   ├──📁 dir3\n   │   └── file3.txt\n   └── file1.txt\n"
    );
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

    equal(tree, "└──📂 root\n   └── file1.txt\n");
  });
});
