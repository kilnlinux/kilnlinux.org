---
title: Contributing
description: How to help build Kiln Linux.
---

Kiln is early, and a test install on your machine helps more than anything else right now. Kiln's own code is MIT licensed. `archiso/kiln/` derives from archiso's `releng` profile and keeps its GPL-3.0-or-later license.

## Good places to start

- **Install it and report back.** Boot the ISO in QEMU or on real hardware, install, and open an issue with your hardware, firmware (UEFI or BIOS), desktop and what happened. [Status](../status/) lists what nobody has tried yet: real hardware installs, logging in to XFCE, KDE Plasma and GNOME, a root password, `linux-hardened`.
- **Profiles.** Propose a package for a profile, with the reason it belongs there. Kiln prefers a profile users opt into over a new default.
- **Docs.** If something on these pages turned out wrong for you, fix it.

## Rules for changes

1. `make test` passes.
2. If you change the ISO or the installer, build with `make iso` and run `make e2e`, or install by hand with `make run`. Say in the pull request what you tested and on which firmware.
3. A new package or service needs a reason in the pull request.
4. kiln must never edit pacman's database, run `pacman -Sy`, or remove a package kiln didn't install.

Code style: `cargo fmt` for Rust. Bash uses `set -Eeuo pipefail` or an explicit error check, quoted expansions, and argument arrays instead of command strings.

[The repository](https://github.com/kilnlinux/Kiln-Linux) has the code, the [issues](https://github.com/kilnlinux/Kiln-Linux/issues) and the [pull requests](https://github.com/kilnlinux/Kiln-Linux/pulls).
