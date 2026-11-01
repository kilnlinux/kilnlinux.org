---
title: Package management
description: Using kiln, the Kiln Linux package manager.
---

`kiln` is Kiln's package manager, written in Rust. It builds recipes into `.kpkg` packages and installs, upgrades, removes and queries them.

## Build kiln

Run these commands from the source repository on a host with Rust, Cargo and a C compiler.
The PATH change applies to the current shell. For the static bootstrap executable,
follow [Development](../development/#build-kiln-for-the-bootstrap).

```sh
cargo build --release --manifest-path kiln/Cargo.toml
export PATH="$PWD/kiln/target/release:$PATH"
```

## Commands

```sh
# writes packages/zlib-1.3.1-1.x86_64.kpkg
kiln build recipes/zlib
kiln install packages/zlib-*.kpkg
kiln list
kiln info zlib
kiln files zlib
kiln owner /usr/lib/libz.so.1
kiln remove zlib
```

| Command | What it does |
| --- | --- |
| `build <recipe> [--out DIR]` | Build a recipe directory into a `.kpkg`. Output goes to `packages/` by default. |
| `fetch <recipe\|ORDER>...` | Download and verify sources without building. |
| `build-all [ORDER] [--out DIR] [--force] [--keep-going]` | Build and install recipes in order; defaults to `recipes/ORDER`. Skips installed versions. `--keep-going` continues past failures and lists them at the end. |
| `install <name\|file.kpkg>... [--force]` | Install or upgrade local packages, or repository packages by name with their dependencies. |
| `sync` | Download each configured repository's package index. |
| `search <term>` | Search repository package names and summaries. |
| `upgrade [--force]` | Upgrade installed packages to repository versions. |
| `index [DIR]` | Write `index.toml` for a directory of packages; defaults to `packages/`. |
| `remove <name>... [--force]` | Remove installed packages. Refuses if another package depends on it, unless `--force`. |
| `list` | List installed packages. |
| `info <name>` | Show an installed package's metadata. |
| `files <name>` | List the files an installed package owns. |
| `owner <path>` | Show which package owns a path. |

Every command takes `--root DIR` to work on a system other than `/`. The bootstrap uses this to install packages into the new root.

## How installs work

- kiln records installed packages under `/var/lib/kiln/installed/<name>/`.
- Install refuses to overwrite files another package owns, or files no package owns unless you pass `--force`.
- kiln writes each file beside its target and renames it into place, so a running program never sees half a file.
- A package's payload must match its manifest and checksums before kiln installs it.
- File operations stay inside `--root`, including through symlinks. This needs Linux 5.6 or newer and a mounted `/proc`.
- Modified or deleted files under `/etc` are kept on upgrade and removal. Unmodified configuration files get the package's new version.
- Upgrades delete files the new version dropped.

## Repositories

Kiln's official repository is published as the `repo-x86_64` release on GitHub,
and `/etc/kiln/repos` lists it by default. It holds the base system packages.
A repository is a directory containing `.kpkg` files and an `index.toml` generated
with `kiln index packages`. List its local path or HTTP(S) URL in `/etc/kiln/repos`,
one per line. Repository commands need a configured repository with packages in it.

```sh
kiln sync
kiln search editor
kiln install vim
kiln upgrade
```

`kiln sync` refreshes repository indexes; `kiln upgrade` upgrades installed packages.
Dependency resolution applies when you install packages by name from a repository.
Installing local `.kpkg` files does not fetch their dependencies.

## Not done yet

Package signatures.
