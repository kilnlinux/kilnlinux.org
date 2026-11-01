---
title: Installation
description: Build and boot a Kiln Linux UEFI test image, and the kiln-installer text installer.
---

Kiln boots in QEMU from an x86_64 UEFI disk image. There is no published disk image
or live ISO yet, and BIOS boot is not supported.

Follow [Development](../development/) to build the system from source and boot the
image in QEMU. The image is for testing; log in as root with the password `kiln`.

## kiln-installer

The base edition has a text-mode installer, `kiln-installer`. It asks for the keyboard,
hostname, locale, timezone and accounts, then partitions the disk automatically or
with cfdisk, copies the running system onto it and installs GRUB.
`kiln-installer --config FILE` runs it unattended.

There is no live ISO to run it from yet. Installation media and checksums will be
documented here when releases are available.
