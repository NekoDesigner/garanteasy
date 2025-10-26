# Garanteasy CLI

## ⚙️ Installation

Install the CLI manually

```shell
cd scripts/cli
chmod +x cli.mjs
npm link
```

or run the NPM command for automatic installation :

```shell
npm run install:cli
````

If the installation is successful, open your terminal and check if the command `garanteasy` is available:

```shell
❯ garanteasy --help
Usage: Garanteasier [options] [command]

CLI for generating components and hooks for Garanteasier

Options:
  -V, --version                 output the version number
  -h, --help                    display help for command

Commands:
  generate|g <type> <name>      Generate a new Garanteasy Element
  generate-component|gc <name>  Generate a new Component
  generate-icon|gic <name>      Generate a new Icon Component
  generate-hook|gh <name>       Generate a new Hook
  generate-migration|gm <name>  Generate a new Migration
```

## 🚀 Usage

These commands generate the complete folder structure for the created element. They ensure consistency in the project architecture.

### 💅 Generate a UI component

This example generates a `CardComponent`:

```shell
garanteasy generate-component Card
garanteasy gc Card
```

### 🍀 Generate an icon component

This example generates a `FlowerIcon`:

```shell
garanteasy generate-icon Flower
garanteasy gic Flower
```

### 🪝 Generate a hook

This example generates a `useAuth`:

```shell
garanteasy generate-hook Auth
garanteasy gh Auth
```

### 🚢 Generate a migration

This example generates an `AddPostTableMigration-1751057246774` (the number is from `Date.now()`):

```shell
garanteasy generate-migration AddPostTable
garanteasy gm AddPostTable
```

## Contributors

|<img src="https://avatars.githubusercontent.com/u/18350326?v=4" width="24" height="24" style="border-radius:50%">|Nekodev|
|---|---|

## Full documentation

You can see the full documentation from [NekoDesigner/garanteasy Wiki](https://github.com/NekoDesigner/garanteasy/wiki/Garenteasy-CLI).
