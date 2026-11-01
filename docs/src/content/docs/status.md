---
title: Status and roadmap
description: What works in Kiln Linux today and the remaining work toward releases and a desktop.
---

Kiln boots on x86_64 in QEMU from a UEFI disk image through GRUB, reaches a login
prompt, gets an address over DHCP and shuts down cleanly. It uses runit and eudev.

## Build and packages

The bootstrap builds a cross toolchain and temporary system following Linux From
Scratch 12.2. `kiln build-all` then builds and installs the base system from recipes
inside Kiln. See [Development](../development/) for the sequence.

The package manager can build, fetch, install, upgrade, remove and query packages.
It checks payloads against their manifests and keeps changes you made under `/etc`.
The base system's 77 packages are published in the official repository, so
`kiln install` can fetch them by name with their dependencies.

Kiln's recipe driver also reads Void Linux templates, and the first batch of
imported recipes (htop, tmux, curl and others) is being built. Some don't build yet.

## Installer

The base edition has a text-mode installer, `kiln-installer`, in the style of
Void's. See [Installation](../installation/#kiln-installer).

## Remaining work

- A live ISO to run the installer from, and published images
- BIOS boot
- A desktop: an XFCE edition is planned
- Package signatures

Building packages inside Kiln works; a complete self-hosted rebuild, including
building the Rust package manager inside Kiln, remains a separate goal.
