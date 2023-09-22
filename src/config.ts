import { workspace } from "vscode";
import { PathologicalConfiguration } from "./models/pathological-configuration";

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

    cachedConfig = {
        closedFolder,
        openFolder,
    };

    return cachedConfig;
}