const path = require('path');
const { readFile, stat } = require('fs').promises;
const Generator = require('@asyncapi/generator');

/**
 * Generates a client file using a template and snapshots its content.
 
 *
 * @param {object} options
 * @param {string} options.templatePath - Absolute path to the template directory.
 * @param {string} options.outputDir - Absolute path to the base output directory (e.g., .../temp/snapshotTestResult).
 * @param {string} options.outputFile - The name of the file to be generated and snapshot (e.g., 'client-postman.js').
 * @param {string} options.asyncapiSpecPath - Absolute path to the AsyncAPI spec file.
 * @param {object} options.templateParams - Parameters for the generator.
 * @param {string} [options.expectedErrorMsg] - If set, the test expects generation to fail with this message.
 * @param {boolean} [options.checkFileExistenceOnly=false] - If true, only checks if the output file exists, doesn't snapshot its content.
 */
async function generateAndSnapshot({
  templatePath,
  outputDir,
  outputFile, 
  asyncapiSpecPath,
  templateParams,
  expectedErrorMsg,
  checkFileExistenceOnly = false,
}) {
  const generator = new Generator(templatePath, outputDir, {
    forceWrite: true,
    templateParams,
  });

  if (expectedErrorMsg) {
    await expect(generator.generateFromFile(asyncapiSpecPath))
      .rejects.toThrow(expectedErrorMsg);
    return; 
  }

  const targetOutputFile = outputFile || templateParams.clientFileName || 'client.js';
  const fullOutputPath = path.join(outputDir, targetOutputFile);

  await generator.generateFromFile(asyncapiSpecPath);

  if (checkFileExistenceOnly) {
    const fileStats = await stat(fullOutputPath);
    expect(fileStats.isFile()).toBeTruthy();
  } else {
    const client = await readFile(fullOutputPath, 'utf8');
    expect(client).toMatchSnapshot();
  }
}

module.exports = {
  generateAndSnapshot,
};