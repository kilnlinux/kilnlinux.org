// Facts about Kiln Linux, copied from the distro repository (commit b17e40f). Update these when
// it changes; every page reads from here. Recipe metadata is in recipes.json (scripts/recipes.mjs).
import recipeList from './recipes.json';

export const repo = 'https://github.com/kilnlinux/Kiln';
export const recipes = recipeList;

/** bootstrap/config.sh (LFS 12.2) and recipes/. */
export const toolchain = [
  { name: 'binutils', version: '2.43.1' },
  { name: 'GCC', version: '14.2.0' },
  { name: 'glibc', version: '2.40' },
  { name: 'Linux', version: '6.10.5' },
  { name: 'GMP', version: '6.3.0' },
  { name: 'MPFR', version: '4.2.1' },
  { name: 'MPC', version: '1.3.1' },
];

/** recipes/runit, recipes/grub. */
export const runitVersion = '2.1.2';
export const grubVersion = '2.12';

/** kiln/Cargo.toml. */
export const kilnVersion = '0.1.0';

/** kiln/src/main.rs: subcommands and their help text. */
export const commands = [
  { name: 'build', args: '<recipe> [--out DIR]', help: 'Build a recipe directory into a .kpkg package.' },
  { name: 'fetch', args: '<recipe|ORDER>…', help: 'Download and verify sources, without building.' },
  { name: 'build-all', args: '[ORDER] [--force] [--keep-going]', help: 'Build and install every recipe in an ORDER file (default recipes/ORDER), in order, skipping ones already installed.' },
  { name: 'install', args: '<name|file.kpkg>… [--force]', help: 'Install or upgrade packages by name, with their dependencies, or from .kpkg files.' },
  { name: 'remove', args: '<name>… [--force]', help: 'Remove installed packages.' },
  { name: 'sync', args: '', help: 'Download the package index from each repository.' },
  { name: 'upgrade', args: '[--force]', help: 'Upgrade installed packages to the repositories’ versions.' },
  { name: 'search', args: '<term>', help: 'Search the repositories by name and summary.' },
  { name: 'index', args: '[dir]', help: 'Write index.toml for a directory of packages, making it a repository.' },
  { name: 'list', args: '', help: 'List installed packages.' },
  { name: 'info', args: '<name>', help: 'Show an installed package’s metadata.' },
  { name: 'files', args: '<name>', help: 'List the files an installed package owns.' },
  { name: 'owner', args: '<path>', help: 'Show which package owns a path.' },
];

/** Not done yet, per README.md and kiln/src. */
export const kilnMissing = ['package signatures'];
export const systemMissing = ['a live ISO to run the installer from', 'BIOS boot', 'a desktop'];
