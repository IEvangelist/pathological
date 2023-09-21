import { basename, dirname, normalize, relative } from "path";
import { Uri as CodeUri } from "vscode";

/**
 * Returns the relative path between two CodeUri objects.
 * @param firstUri The first CodeUri object.
 * @param secondUri The second CodeUri object.
 * @returns The relative path between the two CodeUri objects, or null if the URIs are not compatible or an error occurs.
 */
export function getRelativePath(firstUri: CodeUri, secondUri: CodeUri): string | null {
    try {
        if (firstUri.fsPath === secondUri.fsPath) {
            return basename(firstUri.fsPath);
        }
    
        if (firstUri.scheme !== secondUri.scheme) {
            return null;
        }
    
        if (firstUri.scheme !== "file") {
            return null;
        }

        const relativePath = relative(dirname(firstUri.fsPath), secondUri.fsPath);

        const normalizedPath = normalize(relativePath);

        return normalizedPath;

    } catch (error) {
        return null;
    }
}