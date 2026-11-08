---
title: Development
description: How Kiln Linux is put together, how it's tested, and how to change it.
---

Kiln is Arch Linux plus four pieces: an archiso profile for the live ISO, an installer, a set of package profiles, and the `kiln` tool that applies them. Everything lives in [one repository](https://github.com/kilnlinux/Kiln-Linux).

## Repository layout

| Path | What it is |
| --- | --- |
| `archiso/kiln/` | the archiso profile, derived from upstream `releng` |
| `packages/kiln/` | the `kiln` CLI, in Rust |
| `packages/kiln-install/kiln-install` | the installer, in bash with `dialog` |
| `packages/twmx/` | the twmx `PKGBUILD` and Kiln's `config.h` |
| `profiles/` | `core`, seven desktops, `developer`, `audio` |
| `configs/` | the home skeleton that ends up in `/etc/skel` |
| `scripts/` | `build.sh`, `test.sh`, `qemu.sh` |
| `tests/qemu/` | the end-to-end install test |
| `branding/` | the marks, the boot splash and its source |

`make help` lists the targets.

## How `make iso` works

`scripts/build.sh` leaves `archiso/kiln/` untouched and builds in `build/`:

1. It checks for the build tools.
2. `cargo build --release` builds `kiln`.
3. makepkg builds every `packages/*/PKGBUILD` (today, twmx) and `repo-add` puts the results in `build/repo`, a pacman repository named `[kiln]`.
4. It copies the profile to `build/profile` and adds `kiln`, `kiln-install`, the profiles, the `[kiln]` repository and the home skeleton to its `airootfs/`.
5. It runs `mkarchiso` on the copy.

archiso runs pacstrap and its file operations inside a user namespace (`unshare --map-auto --map-root-user`). There your user acts as root, and your subordinate IDs stand in for the other users. That's why `make iso` needs no root, and why your own account can't delete the files in `build/work`.

### The live ISO

The profile in `archiso/kiln/` started as a copy of `/usr/share/archiso/configs/releng`. Kiln changed it:

- cut the package list from 128 to 46: installer tools, disk rescue, network, accessibility and console tools;
- turned off VM guest agents, ModemManager, cloud-init and sshd, and removed network (PXE) boot;
- gave root bash instead of zsh;
- branded the boot menus, `/etc/motd`, the hostname and os-release, and added the BIOS boot splash.

The accessibility pieces stay: the speech boot entry, brltty and espeakup.

### os-release

`/etc/os-release` links to `/usr/lib/os-release`, which Arch's `filesystem` package owns. A file in `airootfs` at that path would conflict with the package during the build, and an upgrade would restore Arch's file. Kiln uses a pacman hook instead, which copies `/etc/kiln/os-release` over it after every install or upgrade of `filesystem`.

## The installer

`kiln-install` is bash because each step calls an existing tool: `sfdisk`, `mkfs`, `pacstrap`, `genfstab`, `arch-chroot`, `bootctl`. You can read the script top to bottom and see every command it runs.

- The **main menu** follows Void Linux's installer and the original Kiln Linux's: each item sets one variable, in any order.
- **`DESKTOPS`**, a table at the top, lists each desktop's profile, its login screen if it has one, and the command a tty1 login runs.
- **`settings_problem`** checks every setting before Install and prints the first problem.
- **`install_all`** runs in a subshell with `set -e`, so the first failing command stops it. Its output goes to a progress box and to `/tmp/kiln-install.log`.
- **`validate`** checks the installed system. A failed check fails the install.
- **`--config FILE`** sources FILE for the variables and skips the menus.

systemd-boot ships with systemd, and its whole config is two short files. It only works on UEFI, so BIOS installs use GRUB or Limine.

The installer applies profiles with `kiln apply` inside the new system, so kiln's records are correct from the first boot and `kiln remove twmx --purge` works right away.

## kiln

- **pacman is the only package database.** kiln asks pacman with `-T` (is this satisfied), `-Qq`, `-Slq`, and changes the system with `-S --needed` and `-R`. kiln never reads `/var/lib/pacman`.
- **`pacman -T`** decides what's missing. It is pacman's own dependency check, so packages that provide a name count as installing it.
- **State** lives in `/var/lib/kiln/state.toml`. kiln writes it after pacman succeeds, with an atomic rename.
- **No `-Sy`.** Syncing without upgrading is a partial upgrade, and Arch doesn't support those.
- kiln calls pacman with an argument list and `--` before package names, never through a shell.
- Its only dependencies are `serde` and `toml`. It parses its arguments by hand.

| Module | Job |
| --- | --- |
| `main.rs` | dispatch, exit codes, SIGPIPE |
| `cli.rs` | argument parsing and help text |
| `manifest.rs` | TOML parsing, validation, profile search paths |
| `pacman.rs` | every pacman call; the root check |
| `plan.rs` | pure planning rules: what to install, what is safe to remove |
| `apply.rs` | `apply` and `remove` |
| `state.rs` | `/var/lib/kiln/state.toml` |
| `commands.rs` | read-only commands, `profile create`, `export` |
| `ui.rs`, `error.rs` | output colors, the error type |

To add a package source later, such as a hosted Kiln repository, add an optional field next to `official` in `manifest.rs`, plan it in `plan.rs` and run it in `apply.rs`. Unknown fields are errors today, so an older kiln rejects a manifest it can't honor.

## Tests

**`make test`** needs no root and no VM. It runs kiln's unit tests and its integration tests, which run the real binary against a fake `pacman` on `PATH`. It also runs clippy with warnings as errors, `bash -n` on every script (and shellcheck if you have it), and checks every package name in the profiles and the ISO list against the repositories.

**`make e2e`** needs QEMU and OVMF. `tests/qemu/run.sh` boots the newest ISO and presses keys through QEMU's monitor to add `script=http://10.0.2.2:8000/test.sh` to the boot entry. The live system downloads that script from a small HTTP server on the host and runs `kiln-install --config tests/qemu/install.cfg`. The test then boots the installed disk, logs in, and saves screenshots to `build/e2e/`.

## Changing the distribution

- **A package on the live ISO**: add it to `archiso/kiln/packages.x86_64`, then `make test` and `make iso`.
- **A file on the live ISO**: put it under `archiso/kiln/airootfs/` at its target path. Executables also need an entry in `file_permissions` in `profiledef.sh`.
- **A package in a profile**: edit `profiles/<name>.toml`.
- **A package Kiln builds itself**: add `packages/<name>/PKGBUILD`. `make iso` builds it into `[kiln]`, and any profile can list it.
- **A new desktop in the installer**: add `profiles/<name>.toml` and a line to `DESKTOPS` in `kiln-install`.
- **Branding**: `branding/README.md` lists where each piece lives.
