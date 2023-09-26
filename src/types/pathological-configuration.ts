/**
 * Represents the configuration options for the Pathological extension.
 */
export interface PathologicalConfiguration {
    closedFolder: string;   // 📁
    openFolder: string;     // 📂
    verticalLine: string;   // │
    horizontalLine: string; // ─
    junction: string;       // ├
    corner: string;         // └
    indent: number;         // 4
}