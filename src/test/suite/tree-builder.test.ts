import * as assert from "assert";

import { buildTree } from "../../tree-builder";
import { FileTreeNode } from "../../types/file-tree-node";

suite("buildTree", () => {
    test("should return an empty string for an empty node", () => {
        const node: FileTreeNode = {
            name: "root",
            isDirectory: true,
            children: [],
        };
        assert.strictEqual(buildTree(node), "");
    });

    test("should return a tree with one file", () => {
        const node: FileTreeNode = {
            name: "root",
            isDirectory: true,
            children: [
                {
                    name: "file1.txt",
                    isDirectory: false,
                },
            ],
        };
        assert.strictEqual(buildTree(node), "└── root\n    └── file1.txt\n");
    });

    test("should return a tree with one directory", () => {
        const node: FileTreeNode = {
            name: "root",
            isDirectory: true,
            children: [
                {
                    name: "dir1",
                    isDirectory: true,
                    children: [],
                },
            ],
        };
        assert.strictEqual(buildTree(node), "└── root\n    └── dir1\n");
    });

    test("should return a tree with multiple files and directories", () => {
        const node: FileTreeNode = {
            name: "root",
            isDirectory: true,
            children: [
                {
                    name: "file1.txt",
                    isDirectory: false,
                },
                {
                    name: "dir1",
                    isDirectory: true,
                    children: [
                        {
                            name: "file2.txt",
                            isDirectory: false,
                        },
                    ],
                },
                {
                    name: "dir2",
                    isDirectory: true,
                    children: [
                        {
                            name: "file3.txt",
                            isDirectory: false,
                        },
                        {
                            name: "dir3",
                            isDirectory: true,
                            children: [],
                        },
                    ],
                },
            ],
        };
        assert.strictEqual(
            buildTree(node),
            "└── root\n    ├── dir1\n    │   └── file2.txt\n    ├── dir2\n    │   ├── dir3\n    │   └── file3.txt\n    └── file1.txt\n"
        );
    });

    test("should return a tree with one file", () => {
        const node: FileTreeNode = {
            name: "root",
            isDirectory: true,
            children: [
                {
                    name: "file1.txt",
                    isDirectory: false,
                },
            ],
        };
        assert.strictEqual(buildTree(node), "└── root\n    └── file1.txt\n");
    });
});
