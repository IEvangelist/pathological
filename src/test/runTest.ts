import * as path from "path";

import { runTests } from "@vscode/test-electron";

async function go() {
	try {
		const extensionDevelopmentPath = path.resolve(__dirname, "../../../");
		const extensionTestsPath = path.resolve(__dirname, "./suite");

		// Download VS Code, unzip it and run the integration test
		await runTests({ 
			extensionDevelopmentPath,
			extensionTestsPath,
			launchArgs: [
				// This disables all extensions except the one being tested
				'--disable-extensions',
			],
		});
	} catch (err) {
		console.error("Failed to run tests");
		process.exit(1);
	}
}

go();