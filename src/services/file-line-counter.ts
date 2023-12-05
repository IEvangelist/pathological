import { createInterface } from "readline";
import { createReadStream } from "fs";

/**
 * Given a file path, read the file and count the number of lines
 * in the most efficient and performant way possible.
 */
export function tryCountLines(filePath: string): number {
  let linesCount = 0;

  try {
    const rl = createInterface({
      input: createReadStream(filePath),
      output: process.stdout,
      terminal: false,
      crlfDelay: Infinity
    });

    // Increment the line count on each line read
    rl.on("line", () => ++linesCount);

    // Print the total line count when the 'close' event is triggered
    rl.on("close", () => console.log(linesCount));

    // ensure that all lines are read before continuing
    rl.on("pause", () => rl.close());
  } catch (error) {
    console.error(error);
  }

  return linesCount;
}
