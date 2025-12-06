# clear_modules
## What is it?
clear_modules is a light-weight node.js application that allows you to easily search for and delete `node_modules` folders to easily free up space.

## Performance
clear_modules takes less than a second for each item scanned (on average). This may differ based on your computer.

**Note:** When scanning root, skip over `/mnt`, `/usr` and `/opt` for higher performance with the `--skip-sys` flag! \
|&nbsp;&nbsp;&nbsp;&nbsp;  **Note:** Due to a slight bug, using `--skip-sys` will also skip over **all** directories named `mnt`, `usr` or `opt` and their descendants.

## Installation
To install, simply run:
* **Linux:** `npm i bossboss2021.clear_modules -g` in a safe directory. Make sure to not delete the node_modules folder for clear_modules (usually `/usr/local/lib/node_modules`).
* **Windows:** `npm i bossboss2021.clear_modules -g` in a terminal with Administrator permissions. Make sure to not delete the node_modules folder for clear_modules.

## Usage
To scan for `node_modules` folders, run: `clearmodules scan <base_directory>` (ex. `clearmodules scan ~`). \
To scan and delete all `node_modules` folders, run: `clearmodules clear <base_directory>` (ex. `clearmodules clear ~`). This **will** wait for confirmation. \
For a help message, do `clearmodules help`.

**Note:** When scanning, `clearmodules` automatically skips over directories named `proc`, `boot`, `etc`, `var`, `tmp`, `bin`, `dev` and `sys`.