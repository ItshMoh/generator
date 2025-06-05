/**
 * @jest-environment node
 */
const path = require('path');
const { generateAndSnapshot } = require('../../test/ integration-test-helpers.js'); 

const asyncapi_v3_path_postman = path.resolve(__dirname, '../../test/__fixtures__/asyncapi-postman-echo.yml');
const asyncapi_v3_path_hoppscotch = path.resolve(__dirname, '../../test/__fixtures__/asyncapi-hoppscotch-client.yml');

const templatePath = path.resolve(__dirname, '../');
const outputDir = path.resolve(__dirname, './temp/snapshotTestResult');

describe('testing if generated client match snapshot', () => {
  jest.setTimeout(100000);

  it('generate simple client for postman echo', async () => {
    const testOutputFile = 'client-postman.js';
    await generateAndSnapshot({
      templatePath,
      outputDir,
      outputFile: testOutputFile,
      asyncapiSpecPath: asyncapi_v3_path_postman,
      templateParams: {
        server: 'echoServer',
        clientFileName: testOutputFile,
        appendClientSuffix: true
      }
    });
  });

  it('generate simple client for hoppscotch echo', async () => {
    const testOutputFile = 'client-hoppscotch.js';
    await generateAndSnapshot({
      templatePath,
      outputDir,
      outputFile: testOutputFile,
      asyncapiSpecPath: asyncapi_v3_path_hoppscotch,
      templateParams: {
        server: 'echoServer',
        clientFileName: testOutputFile,
      }
    });
  });

  it('generate simple client for hoppscotch echo with custom client name', async () => {
    const testOutputFile = 'custom-client-hoppscotch.js';
    await generateAndSnapshot({
      templatePath,
      outputDir,
      outputFile: testOutputFile,
      asyncapiSpecPath: asyncapi_v3_path_hoppscotch,
      templateParams: {
        server: 'echoServer',
        clientFileName: testOutputFile,
        customClientName: 'HoppscotchClient',
      }
    });
  });

  it('generate simple client for hoppscotch echo without clientFileName param', async () => {
    const defaultOutputFile = 'client.js'; 
    await generateAndSnapshot({
      templatePath,
      outputDir,
      outputFile: defaultOutputFile,
      asyncapiSpecPath: asyncapi_v3_path_hoppscotch,
      templateParams: {
        server: 'echoServer',
      },
      checkFileExistenceOnly: true 
    });
  });

  it('should throw an error when server param is missing during simple client generation for hoppscotch echo', async () => {
    await generateAndSnapshot({
      templatePath,
      outputDir,
      outputFile: 'client-hoppscotch.js',
      asyncapiSpecPath: asyncapi_v3_path_hoppscotch,
      templateParams: {
        clientFileName: 'client-hoppscotch.js'
      },
      expectedErrorMsg: 'This template requires the following missing params: server'
    });
  });
});