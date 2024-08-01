#!/usr/bin/env node
import minimist from 'minimist';
import readline from 'readline';
import { APM_AGENT } from './APMAgent.js';
async function main() {
	const options = minimist(process.argv.slice(2));
	// console.log('options', options);

	if (options.help || options._.length === 0) {
		const version = await APM_AGENT.getCLIVersion();
		console.log(`APM(Agent Package Manager) CLI v${version}

Usage:

  - show help
    apm --help
  - install agent
    apm install <agent-folder>
	apm install .
  - uninstall agent
     apm uninstall <name>:[version]
        `);
		return;
	}

	const { _ } = options;

	// install
	if (_[0] === 'install') {
		const agentSpec = _[1];
		await APM_AGENT.install(agentSpec);
	}

	// uninstall
	if (_[0] === 'uninstall') {
		const agentSpec = _[1];
		if (!agentSpec) {
			throw new Error('Invalid agent spec');
		}
		await APM_AGENT.uninstall(agentSpec);
	}

	// init
	if (_[0] === 'init') {
		return;
	}
	if (_[0] === 'init') {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		let author = options.author;
		if (!author) {
			await new Promise((resolve) => {
				rl.question(`Agent author: `, async (input) => {
					author = input;

					resolve(true);
				});
			});
		}

		let name = options.name;
		if (!name) {
			await new Promise((resolve) => {
				rl.question(`Agent name: ${author}/`, async (input) => {
					name = `${author}/${input}`;

					resolve(true);
				});
			});
		}

		let executor = options.executor;
		if (!executor) {
			await new Promise((resolve) => {
				rl.question(`Agent executor (python, nodejs): `, async (input) => {
					executor = input;

					resolve(true);
				});
			});
		}

		rl.close();

		await APM_AGENT.init({ author, name, executor });
	}

	// publish
	if (_[0] === 'publish') {
		return;
	}
	if (_[0] === 'publish') {
		await APM_AGENT.publish();
	}
}
main();
