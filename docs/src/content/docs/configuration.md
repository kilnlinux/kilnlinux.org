---
title: Configuration
description: Init, networking and package repository configuration in Kiln Linux.
---

Kiln uses runit as its init system and service supervisor, with eudev for device management.

## Services and networking

Service definitions live under `/etc/sv/`. Enabled services live under `/var/service/`.
The base system includes a `dhcpcd` service to obtain an address over DHCP on boot.
The test image enables a serial login service on `ttyS0`.

## Package repositories

List repository URLs in `/etc/kiln/repos`, one per line, then run `kiln sync`.
The official repository, `https://github.com/kilnlinux/Kiln/releases/download/repo-x86_64`,
is listed by default. See [Package management](../package-management/)
for the commands and repository format.

## Test image

The generated QEMU image uses the root password `kiln`. Change it with `passwd`
if you keep using the image. See [Development](../development/) to build and boot it.
