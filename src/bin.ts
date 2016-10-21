#!/usr/bin/env node

import * as program from 'commander';
import {ScenarioSynchronizer, readConfig} from './index';
// tslint:disable-next-line:no-var-requires
const pkg = require('../package.json');

program
  .version(pkg.version)
  .option('--verify', 'Verify that the local features files match the test cases from TestRail')
  .option('--silent', 'Disable output')
  .parse(process.argv);

const sync = new ScenarioSynchronizer();

const config = readConfig();
config.verify = (<any> program).verify || config.verify || false;
config.silent = (<any> program).silent || config.silent || false;

sync.synchronize(config, (err: any): void => {
  process.exit(err ? 1 : 0);
});