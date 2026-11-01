---
title: Troubleshooting
description: Common problems with the Kiln build and kiln. Mostly not written yet.
---

:::note[Not written yet]
This page will grow as people hit problems. For now it covers the errors the existing tools report.
:::

## Build host

`./bootstrap/00-host-check.sh` prints `missing: <tool>` for each required tool it can't find, and fails if `/bin/sh` isn't bash or `g++` can't compile a trivial program. The `kiln-builder` container has everything it needs; run the scripts inside it.

## kiln install

- `<pkg>: /<path> is owned by <other>`: another package owns that file. kiln won't overwrite it.
- `<pkg>: /<path> already exists and no package owns it (use --force)`: the file exists but isn't tracked. Pass `--force` if you mean to replace it.

## kiln remove

- `<name> is needed by <pkgs> (use --force)`: other installed packages depend on it.

## kiln build

- `checksum mismatch for <tarball>`: the downloaded source doesn't match the recipe's `sha256`.
