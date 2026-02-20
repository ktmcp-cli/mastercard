/**
 * Mastercard CLI - Main Command Interface
 */

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';
import ora from 'ora';
import * as api from './lib/api.js';
import { setConfig, getConfig, getAllConfig, clearConfig } from './lib/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

const program = new Command();

// Configure main program
program
  .name('mastercard')
  .description(chalk.cyan('Mastercard Locations API CLI - ATM and merchant location services'))
  .version(packageJson.version, '-v, --version', 'output the current version')
  .addHelpText('after', `
${chalk.bold('Examples:')}
  $ mastercard config set apiKey <your-api-key>
  $ mastercard atms search --lat 37.7749 --lng -122.4194 --radius 5
  $ mastercard merchants search --lat 40.7128 --lng -74.0060 --category restaurant

${chalk.bold('API Documentation:')}
  ${chalk.blue('https://developer.mastercard.com/product/locations/')}

${chalk.bold('Get API Key:')}
  ${chalk.blue('https://developer.mastercard.com/')}
`);

// Config commands
const config = program.command('config').description('Manage configuration');

config
  .command('set')
  .description('Set a configuration value')
  .argument('<key>', 'Configuration key')
  .argument('<value>', 'Configuration value')
  .action((key, value) => {
    setConfig(key, value);
    console.log(chalk.green(`✓ Set ${key} = ${value}`));
  });

config
  .command('get')
  .description('Get a configuration value')
  .argument('<key>', 'Configuration key')
  .action((key) => {
    const value = getConfig(key);
    console.log(value || chalk.gray('(not set)'));
  });

config
  .command('list')
  .description('List all configuration')
  .action(() => {
    const cfg = getAllConfig();
    console.log(JSON.stringify(cfg, null, 2));
  });

config
  .command('clear')
  .description('Clear all configuration')
  .action(() => {
    clearConfig();
    console.log(chalk.green('✓ Configuration cleared'));
  });

// ATMs commands
const atms = program.command('atms').description('Search for ATM locations');

atms
  .command('search')
  .description('Search for ATMs near a location')
  .option('--lat <latitude>', 'Latitude')
  .option('--lng <longitude>', 'Longitude')
  .option('--radius <km>', 'Search radius in kilometers', '5')
  .option('--limit <number>', 'Maximum number of results', '25')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    if (!options.lat || !options.lng) {
      console.error(chalk.red('Error: --lat and --lng are required'));
      process.exit(1);
    }
    const spinner = ora('Searching for ATMs...').start();
    try {
      const data = await api.get('/atms', {
        latitude: parseFloat(options.lat),
        longitude: parseFloat(options.lng),
        radius: parseFloat(options.radius),
        limit: parseInt(options.limit),
      });
      spinner.succeed('ATMs found');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to search ATMs');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

atms
  .command('nearby')
  .description('Find nearest ATMs')
  .option('--lat <latitude>', 'Latitude')
  .option('--lng <longitude>', 'Longitude')
  .option('--count <number>', 'Number of nearest ATMs to find', '5')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    if (!options.lat || !options.lng) {
      console.error(chalk.red('Error: --lat and --lng are required'));
      process.exit(1);
    }
    const spinner = ora('Finding nearest ATMs...').start();
    try {
      const data = await api.get('/atms/nearest', {
        latitude: parseFloat(options.lat),
        longitude: parseFloat(options.lng),
        count: parseInt(options.count),
      });
      spinner.succeed('Nearest ATMs found');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to find ATMs');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Merchants commands
const merchants = program.command('merchants').description('Search for merchant locations');

merchants
  .command('search')
  .description('Search for merchants near a location')
  .option('--lat <latitude>', 'Latitude')
  .option('--lng <longitude>', 'Longitude')
  .option('--radius <km>', 'Search radius in kilometers', '5')
  .option('--category <type>', 'Merchant category (restaurant, retail, gas, etc.)')
  .option('--limit <number>', 'Maximum number of results', '25')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    if (!options.lat || !options.lng) {
      console.error(chalk.red('Error: --lat and --lng are required'));
      process.exit(1);
    }
    const spinner = ora('Searching for merchants...').start();
    try {
      const params = {
        latitude: parseFloat(options.lat),
        longitude: parseFloat(options.lng),
        radius: parseFloat(options.radius),
        limit: parseInt(options.limit),
      };
      if (options.category) {
        params.category = options.category;
      }
      const data = await api.get('/merchants', params);
      spinner.succeed('Merchants found');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to search merchants');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

merchants
  .command('nearby')
  .description('Find nearest merchants')
  .option('--lat <latitude>', 'Latitude')
  .option('--lng <longitude>', 'Longitude')
  .option('--category <type>', 'Merchant category filter')
  .option('--count <number>', 'Number of nearest merchants to find', '5')
  .option('--json', 'Output as JSON')
  .action(async (options) => {
    if (!options.lat || !options.lng) {
      console.error(chalk.red('Error: --lat and --lng are required'));
      process.exit(1);
    }
    const spinner = ora('Finding nearest merchants...').start();
    try {
      const params = {
        latitude: parseFloat(options.lat),
        longitude: parseFloat(options.lng),
        count: parseInt(options.count),
      };
      if (options.category) {
        params.category = options.category;
      }
      const data = await api.get('/merchants/nearest', params);
      spinner.succeed('Nearest merchants found');
      console.log(options.json ? JSON.stringify(data, null, 2) : data);
    } catch (error) {
      spinner.fail('Failed to find merchants');
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

// Global error handler
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('Unhandled error:'), error);
  process.exit(1);
});

// Parse command line arguments
program.parse(process.argv);
