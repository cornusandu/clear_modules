#!/usr/bin/env node

const { program } = require("commander");
const ora = require("ora");
const fs = require("fs");
const pathlib = require("path");
const { Readline } = require("readline/promises");
const readline = require("readline");

function waitForEnter() {
    return new Promise(resolve => {
        process.stdin.resume();
        process.stdin.once("data", () => resolve());
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitUntilStableTrue(checkFn, stableMs = 3000, intervalMs = 100) {
    return new Promise(resolve => {
        let becameTrueAt = null;

        const interval = setInterval(() => {
            if (checkFn()) {
                // If just turned true, start timing
                if (becameTrueAt === null) {
                    becameTrueAt = Date.now();
                }

                // Check if it has stayed true long enough
                if (Date.now() - becameTrueAt >= stableMs) {
                    clearInterval(interval);
                    resolve();
                }

            } else {
                // Reset timer if it becomes false again
                becameTrueAt = null;
            }
        }, intervalMs);
    });
}

program
	.name("clearmodules")
	.description("Easily get rid of node_modules folders to clear up storage.")
	.version("1.0.0");

program
	.command("clear <path>")
	.description("Delete all descendant node_modules folders in a certain directory.")
	.action(async(path) => {
		let paths = [];

		const spinner0 = ora('Retrieving node_modules file paths (1 file scanned)  0.0s').start();
        spinner0.spinner = 'line';

        let i = 0;
        let active = 0;

        const now = Date.now();
				
		try {
            const tmp1 = async(path) => {
                active++;
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
                            if (["proc", "boot", "etc", "var", "tmp", "bin", "dev", "sys", "usr"].includes(item.name)) {
                                continue;
                            }
                            await sleep(2);  // Avoid crashes
                            tmp1(fullPath);
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
                active--;
		    };
            await tmp1(path);
        } catch (error) {
            spinner0.fail();
            console.error(error);
            process.exit(1);
        }

        await waitUntilStableTrue(() => active === 0, 500);

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
		let paths = [];

		const spinner0 = ora('Retrieving node_modules file paths (1 file scanned)  0.0s').start();
        spinner0.spinner = 'line';

        let i = 0;
        let done = false;

        const now = Date.now();
				
		try {
            const tmp1 = async(path) => {
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
                            paths.push(fullPath);
                        } else {
                            if (["proc", "boot", "etc", "var", "tmp", "bin", "dev", "sys", "usr"].includes(item.name)) {
                                continue;
                            }
                            await sleep(2);  // Avoid crashes
                            tmp1(fullPath);
                        }
		        	} else if (item.isFile()) {
                    
		        	} else {
                    
		        	}
                    await sleep(1);  // Avoid crashes
                    i += 1;
                    done = false;

                    if (i % 100 == 0) {
                        const dt = Math.round((Date.now() - now) / 100)/10
                        spinner0.text = `Retrieving node_modules file paths (scanned ${i} items)  ${dt}s (${Math.round(dt/i*100*1000)/100}s / 1k items)`;
                    }
                };
                done = true;
		    };
            await tmp1(path);
        } catch (error) {
            spinner0.fail();
            console.error(error);
            process.exit(1);
        }

        await waitUntilStableTrue(() => done, 3000);

		spinner0.succeed();

        console.log("Found paths:");
        for (const _p of paths) {
            console.log(_p);
        }

        process.exit(0);
	});

program.parse();