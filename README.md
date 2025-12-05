# clear_modules
## What is it?
clear_modules is a light-weight node.js application that allows you to easily search for and delete `node_modules` folders to easily free up space.
## Performance
clear_modules takes less than a second for each item scanned (on average).
## Installation
To install, simply run: `npm i bossboss2021.clear_modules`
## Usage
To scan for `node_modules` folders, run: `clearmodules scan <base_directory>` (ex. `clearmodules scan ~`).
To scan and delete all `node_modules` folders, run: `clearmodules clear <base_directory>` (ex. `clearmodules clear ~`). This **will** wait for confirmation.
For a help message, do `clearmodules help`.