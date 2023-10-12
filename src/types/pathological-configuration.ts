/**
 * Represents the configuration options for the Pathological library.
 */
export interface PathologicalConfiguration {
    
    /**
     * The character to represent a closed folder.
     * @default "📁"
     */
    closedFolder: string;
    
    /**
     * The character to represent an open folder.
     * @default "📂"
     */
    openFolder: string;
    
    /**
     * The character to represent a vertical line.
     * @default "│"
     */
    verticalLine: string;
    
    /**
     * The character to represent a horizontal line.
     * @default "─"
     */
    horizontalLine: string;
    
    /**
     * The character to represent a junction between lines.
     * @default "├"
     */
    junction: string;
    
    /**
     * The corner character for the bottom of the tree.
     * @default "└"
     */
    corner: string;
    
    /**
     * The number of spaces to indent each level of the tree.
     * @default 4
     */
    indent: number;

    /**
     * Whether to normalize the path.
     * @default false
     */
    normalizePath: boolean;
}