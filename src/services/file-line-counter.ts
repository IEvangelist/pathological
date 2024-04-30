import { exec } from "child_process";
import { createInterface } from "readline";
import { createReadStream, readFileSync } from "fs";
import { getConfiguration } from "./config-reader";

/**
 * Given a file path, read the file and count the number of lines
 * in the most efficient and performant way possible.
 */
export function tryCountLines(filePath: string): number {
  const config = getConfiguration();
  if (config && config.stats === false) {
    return 0;
  }

  let lineCount = 0;
  try {
    const { stdout } = exec(`cat "${filePath}" | wc -l`);

    if (stdout != null) {
      stdout.on("data", (data: string) => {
        lineCount = parseInt(data);
      });
    }
  } catch (error) {
    console.error(error);
  }

  return lineCount || tryCountLinesReadStream(filePath);
}

function tryCountLinesReadStream(filePath: string): number {
  let lineCount = 0;
  try {
    const rl = createInterface({
      input: createReadStream(filePath),
      output: process.stdout,
      terminal: false,
      crlfDelay: Infinity
    });

    // Increment the line count on each line read
    rl.on("line", () => ++lineCount);

    // Print the total line count when the 'close' event is triggered
    rl.on("close", () => console.log(lineCount));

    // ensure that all lines are read before continuing
    rl.on("pause", () => rl.close());
  } catch (error) {
    console.error(error);
  }

  return lineCount || tryCountLinesRawRead(filePath);
}

function tryCountLinesRawRead(filePath: string): number {
  let lineCount = 0;

  try {
    const data = readFileSync(filePath, "utf8");
    lineCount = data.split("\n").length;
  } catch (error) {
    console.error(error);
  }

  return lineCount;
}
