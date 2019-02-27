# [Advent of Code](https://adventofcode.com) 2017 in FSharp Fable

This also serves as an example app of run FSharp with Fable utilizing only Nodejs since there aren't any to be found as of today (Feb 2019). 

## Requirements

- [dotnet SDK](https://www.microsoft.com/net/download/core) 2.1 or higher
- [node.js](https://nodejs.org) with [npm](https://www.npmjs.com/)
- An F# editor like Visual Studio, VSCode with [Ionide](http://ionide.io/) or [JetBrains Rider](https://www.jetbrains.com/rider/).
- [Mono](https://www.mono-project.com/) (Only if on Linux/OSX)
- [Paket](https://fsprojects.github.io/Paket/installation.html) to manage F# dependencies. (A local copy is included already). 

## Building and running the app

- `npm i` to install JS dependencies
- `npm run paket-i` to install F# dependencies (`.paket/paket.exe install` on Windows)
- `npm start` to compile and watch with fable-splitter.
- `npm run build` - same but outputs javascript to `/out`.

## Adding Modules

While fable-splitter is watching with one of above watch commands:

### new src
- To add `DayXX.fs`, change `App.fs` to run it.
- If editor say unable to find modules like Util (eg. vscode), need to re-save `App.fsporj`.

### new Library

- Add `nuget ModuleName` to paket.dependencies and run paket install command above.
- Add `ModuleName` to src/paket.references (referenced in `App.fsporj`).

## Source Paths

`App.fsporj` sets `Include` source paths, so add them here if new paths are created.
Current paths are:
```
Utils/*.fs
Day*.fs
App.fs - change the day to run here. 
```