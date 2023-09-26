import { workspace } from "vscode";
import { PathologicalConfiguration } from "./types/pathological-configuration";

let cachedConfig: PathologicalConfiguration | undefined;

/**
 * Retrieves the configuration for the Pathological extension.
 * @returns The configuration object containing the closed and open folder icons.
 */
export function getConfiguration(): PathologicalConfiguration {
    if (cachedConfig !== undefined) {
        return cachedConfig;
    }
    
    const config = workspace.getConfiguration("pathological");

    const closedFolder = config.get("closedFolder", "📁");
    const openFolder = config.get("openFolder", "📂");
    const verticalLine = config.get("verticalLine", "│");
    const horizontalLine = config.get("horizontalLine", "─");
    const junction = config.get("junction", "├");
    const corner = config.get("corner", "└");
    const indent = config.get("indent", 4);

    cachedConfig = {
        closedFolder,
        openFolder,
        verticalLine,
        horizontalLine,
        junction,
        corner,
        indent,
    };

    return cachedConfig;
}