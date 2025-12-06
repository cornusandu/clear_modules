#!/usr/bin/env node

const { program } = require("commander");
const ora = require("ora");
const fs = require("fs");
const pathlib = require("path");
const { Readline } = require("readline/promises");
const readline = require("readline");
const { promises } = require("dns");

function waitForEnter() {
    return new Promise(resolve => {
        process.stdin.resume();
        process.stdin.once("data", () => resolve());
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

program
	.name("clearmodules")
	.description("Easily get rid of node_modules folders to clear up storage.")
	.version("1.0.0")
    .option(
        "--skip-sys",
        "also skip /mnt, /usr, and /opt (in addition to the default skip-list)"
    );

program
	.command("clear <path>")
	.description("Delete all descendant node_modules folders in a certain directory.")
	.action(async(path) => {
		let paths = [];

		const spinner0 = ora('Retrieving node_modules file paths (1 file scanned)  0.0s').start();
        spinner0.spinner = 'line';

        let i = 0;
        let _searchPromises = []

        const now = Date.now();
				
		try {
            const tmp1 = async(path) => {
                const children = []
                let items;
                try {
                    items = fs.readdirSync(path, { withFileTypes: true });
                } catch (err) {
                    if (err.code === "EACCES") {
                        // Skip directories you cannot read
                        return [];
                    }
                    throw err; // rethrow unexpected errors
                }

		        for (const item of items) {
		        	const fullPath = pathlib.join(path, item.name);

		        	if (item.isDirectory()) {
		        		if (item.name == "node_modules") {
                            paths.push(pathlib.resolve(fullPath));
                        } else {
                            if (["proc", "boot", "etc", "var", "tmp", "bin", "dev", "sys"].includes(item.name)) {
                                continue;
                            }
                            await sleep(1);  // Avoid crashes
                            children.push(tmp1(fullPath));
                        }
		        	} else if (item.isFile()) {
                    
		        	} else {
                    
		        	}
                    await sleep(1);  // Avoid crashes
                    i += 1;

                    if (i % 100 == 0) {
                        const dt = Math.round((Date.now() - now) / 100)/10
                        spinner0.text = `Retrieving node_modules file paths (scanned ${i} items)  ${dt}s (${Math.round(dt/i*100*1000)/100}s / 1k items)`;
                    }

                };

                await Promise.all(children);
		    };
            _searchPromises.push(tmp1(path));
            await Promise.all(_searchPromises);
        } catch (error) {
            spinner0.fail();
            console.error(error);
            process.exit(1);
        }

		spinner0.succeed();

        console.log("Found paths:");
        for (const _p of paths) {
            console.log(_p);
        }

        console.log("Press ENTER to delete node_modules folders");
        await waitForEnter();

        async function delete_dir(target) {
            const spinner = ora(`Deleting ${target}`);
            spinner.spinner = 'line';

            try {
                await fs.promises.rm(target, {
                    recursive: true,
                    force: false
                });
            } catch (err) {
                console.log(err);

                spinner.fail();
                return;
            }

            spinner.succeed();
        }

        const deletePromises = [];

        for (const target of paths) {
            deletePromises.push(delete_dir(target));
        }

        await Promise.all(deletePromises);

        process.exit(0);
	});

program
	.command("scan <path>")
	.description("Scan for deletable paths.")
	.action(async(path) => {
        const opts = program.opts();
        const skipSys = opts.skipSys === true;

		let paths = [];

		const spinner0 = ora('Retrieving node_modules file paths (1 file scanned)  0.0s').start();
        spinner0.spinner = 'line';

        let i = 0;
        let _searchPromises = []

        const now = Date.now();
				
		try {
            const tmp1 = async(path) => {
                const children = []
                let items;
                try {
                    items = fs.readdirSync(path, { withFileTypes: true });
                } catch (err) {
                    if (err.code === "EACCES") {
                        // Skip directories you cannot read
                        return [];
                    }
                    throw err; // rethrow unexpected errors
                }

		        for (const item of items) {
		        	const fullPath = pathlib.join(path, item.name);

		        	if (item.isDirectory()) {
		        		if (item.name == "node_modules") {
                            paths.push(pathlib.resolve(fullPath));
                        } else {
                            if (["proc", "boot", "etc", "var", "tmp", "bin", "dev", "sys"].includes(item.name)) {
                                continue;
                            }
                            if (["usr", "opt", "mnt"].includes(item.name) && skipSys) {
                                continue;
                            }
                            await sleep(1);  // Avoid crashes
                            children.push(tmp1(fullPath));
                        }
		        	} else if (item.isFile()) {
                    
		        	} else {
                    
		        	}
                    await sleep(1);  // Avoid crashes
                    i += 1;

                    if (i % 100 == 0) {
                        const dt = Math.round((Date.now() - now) / 100)/10
                        spinner0.text = `Retrieving node_modules file paths (scanned ${i} items)  ${dt}s (${Math.round(dt/i*100*1000)/100}s / 1k items)`;
                    }

                };

                await Promise.all(children);
		    };
            _searchPromises.push(tmp1(path));
            await Promise.all(_searchPromises);
        } catch (error) {
            spinner0.fail();
            console.error(error);
            process.exit(1);
        }

		spinner0.succeed();

        console.log("Found paths:");
        for (const _p of paths) {
            console.log(_p);
        }

        process.exit(0);
	});

program.parse();