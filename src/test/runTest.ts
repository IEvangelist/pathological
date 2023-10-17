import { resolve } from "path";
import { runTests } from "@vscode/test-electron";

function go() {
  const extensionDevelopmentPath = resolve(__dirname, "../../../");
  const extensionTestsPath = resolve(__dirname, "./suite");

  // Download VS Code, unzip it and run the integration test
  return runTests({
    extensionDevelopmentPath,
    extensionTestsPath,
    launchArgs: [
      // This disables all extensions except the one being tested
      "--disable-extensions"
    ]
  });
}

// Call the 'go' function and wait for it to finish using the .then() method
go()
  .then(() => {
    console.log("Tests finished running");
  })
  .catch(err => {
    console.error("Failed to run tests", err);
    process.exit(1);
  });
