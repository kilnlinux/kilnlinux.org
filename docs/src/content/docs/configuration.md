---
title: Configuration
description: Services, networking, accounts, keyboard layouts, the boot loader and the files Kiln adds to an installed system.
---

You configure Kiln like any Arch system, and the [Arch wiki](https://wiki.archlinux.org/) applies. This page covers the parts Kiln sets up itself.

## Services

Kiln uses systemd; `systemctl` manages services. The installer turns on:

| Service | Why |
| --- | --- |
| `NetworkManager` | network, from the `core` profile |
| `systemd-timesyncd` | clock sync. Arch leaves it off by default |
| `systemd-boot-update` | updates the boot loader after systemd upgrades |
| `lightdm`, `sddm` or `gdm` | only if you chose XFCE, KDE Plasma or GNOME |

Nothing from Kiln runs in the background. `kiln` runs only when you call it.

## Network

Connect with `nmtui`, a text menu, or `nmcli`. The live ISO uses systemd-networkd and iwd instead, which is why the installer's Network item opens `iwctl`.

## Accounts

Your user is in the `wheel` group, and `/etc/sudoers.d/10-wheel` lets `wheel` use sudo. If you locked root in the installer (the default), use `sudo` for admin work, and `sudo passwd root` if you want a root password later.

With a locked root, systemd's emergency shell can't log you in. To repair a system that won't boot, boot the Kiln ISO, mount the root partition at `/mnt` and the EFI partition at `/mnt/boot`, and run `arch-chroot /mnt`. Or set a root password while the system still works.

## Keyboard layouts

The installer sets the console layout in `/etc/vconsole.conf`. X11 desktops (twmx, i3, XFCE) read a separate setting, which the installer leaves at US. Set it with:

```sh
sudo localectl set-x11-keymap de
```

Sway, Hyprland, Plasma and GNOME set the layout in their own config or settings app.

## New users and the home skeleton

The installer copies Kiln's defaults into `/etc/skel`, and `useradd -m` copies `/etc/skel` into each new home directory:

| File | For |
| --- | --- |
| `~/.xinitrc` | `startx`: loads `.Xresources`, sets the background, starts dunst, runs twmx (or i3) |
| `~/.Xresources` | xterm colors and font |
| `~/.bash_profile` | Arch's default, plus the lines that start a window manager on tty1 |
| `~/.config/dunst/dunstrc` | notifications for twmx and i3 |
| `~/.config/sway`, `foot`, `fuzzel`, `mako` | the Sway desktop |

To give an existing user the defaults without overwriting their files: `cp -rn /etc/skel/. ~/`.

## Boot loader

Installed systems boot with systemd-boot from the EFI system partition, mounted at `/boot`. Its files:

- `/boot/loader/loader.conf`: the default entry, a 3-second menu, and the entry editor turned off.
- `/boot/loader/entries/kiln.conf`: the kernel, the initramfs and `root=UUID=…`.

Arch's kernel package no longer builds a fallback initramfs, so Kiln writes one entry. To add kernel options, edit the `options` line in `kiln.conf`. To edit options at boot time, set `editor yes` in `loader.conf` first.

## fastfetch

`fastfetch` shows the Kiln logo through `/etc/xdg/fastfetch/config.jsonc`, which points at `/usr/share/kiln/logo`. Put your own config in `~/.config/fastfetch/config.jsonc` to override it.

## os-release

`/etc/os-release` names the system Kiln Linux (`ID=kiln`, `ID_LIKE=arch`), so tools that read it, fastfetch among them, show Kiln. Arch's `filesystem` package owns that file and would restore Arch's version on upgrade. A pacman hook, `/etc/pacman.d/hooks/kiln-os-release.hook`, copies `/etc/kiln/os-release` back over it after every install or upgrade of `filesystem`.

## The `[kiln]` repository

The installer adds this to `/etc/pacman.conf`:

```ini
[kiln]
SigLevel = Optional TrustAll
Server = file:///usr/share/kiln/repo
```

It holds packages Kiln builds itself; today that's twmx. The repository is a local, root-owned directory copied from the ISO, and its packages aren't signed. twmx updates only when you reinstall from a newer ISO or copy a newer repository into place. If you don't use twmx, you can delete the block.
