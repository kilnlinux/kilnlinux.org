---
title: Kiln Linux documentation
description: Start here. What Kiln Linux is, what works today, and where the docs are going.
---

Kiln Linux is an independent Linux distribution, built from source with no parent distro.

- **libc:** glibc
- **init:** runit
- **Packages:** `kiln`, Kiln's own package manager, written in Rust

:::caution[Early project]
Kiln boots in QEMU from a UEFI disk image, gets an address over DHCP and shuts down cleanly. It has a text installer, and its base packages are in a published repository. There is no published image, live ISO or desktop yet. These docs cover the build host, the bootstrap scripts, the `kiln` package manager and the recipe format. Pages marked **Not written yet** are placeholders for later.
:::

## Where to go

- [Status and roadmap](./status/): what works and what's next.
- [Package management](./package-management/): using `kiln`.
- [Recipes](./recipes/): how packages are defined.
- [Development](./development/): running the bootstrap in the build container.
- [Contributing](./contributing/): how to help.
