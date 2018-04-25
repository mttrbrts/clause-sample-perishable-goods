import { writeFile } from 'fs';
import { argv } from 'yargs';

// This is good for local dev environments, when it's better to
// store a projects environment variables in a .gitignore'd file
require('dotenv').config();

// Would be passed to script like this:
// `ts-node set-env.ts --environment=dev`
// we get it from yargs's argv object
const environment = argv.environment;
const isProd = environment === 'prod';

// Workaround because dotenv doesn't support Object in .env files,
// but starter kit assigns an object to the Environment Variable
let urls = process.env.REST_SERVER_URLS;
if (urls && typeof urls === 'string') {
    urls = JSON.parse(urls);
}

const targetPath = `./src/environments/environment.${environment}.ts`;
const envConfigFile = `
export const environment = {
  production: ${isProd},
  apiUrl: '${urls['cicero-perishable-network']}',
};
`;
writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.log(err);
  }

  console.log(`Output generated at ${targetPath}`);
});
