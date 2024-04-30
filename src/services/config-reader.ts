import { workspace } from "vscode";
import { PathologicalConfiguration } from "../types/pathological-configuration";

/**
 * Retrieves the configuration for the Pathological extension.
 * @returns The configuration object containing the closed and open folder icons.
 */
export function getConfiguration(): PathologicalConfiguration {
  const config = workspace.getConfiguration();

  const closedFolder = config.get("pathological.closedFolder", "📁");
  const openFolder = config.get("pathological.openFolder", "📂");
  const verticalLine = config.get("pathological.verticalLine", "│");
  const horizontalLine = config.get("pathological.horizontalLine", "─");
  const junction = config.get("pathological.junction", "├");
  const corner = config.get("pathological.corner", "└");
  const indent = config.get("pathological.indent", 4);
  const stats = config.get("pathological.stats", false);
  const filterExpression = config.get("pathological.filterExpression", undefined);
  const normalizedPathSeparator = config.get("pathological.normalizedPathSeparator", undefined);

  return {
    closedFolder,
    openFolder,
    verticalLine,
    horizontalLine,
    junction,
    corner,
    indent,
    stats,
    filterExpression,
    normalizedPathSeparator
  };
}
