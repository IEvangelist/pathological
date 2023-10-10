import { workspace } from "vscode";
import { PathologicalConfiguration } from "./types/pathological-configuration";

/**
 * Retrieves the configuration for the Pathological extension.
 * @returns The configuration object containing the closed and open folder icons.
 */
export function getConfiguration(): PathologicalConfiguration {
    const config = workspace.getConfiguration("pathological");

    const closedFolder = config.get("closedFolder", "📁");
    const openFolder = config.get("openFolder", "📂");
    const verticalLine = config.get("verticalLine", "│");
    const horizontalLine = config.get("horizontalLine", "─");
    const junction = config.get("junction", "├");
    const corner = config.get("corner", "└");
    const indent = config.get("indent", 4);

    return {
        closedFolder,
        openFolder,
        verticalLine,
        horizontalLine,
        junction,
        corner,
        indent,
    };
}