---
title: Status and roadmap
description: What works in Kiln Linux today, what nobody has tried yet, and what's missing.
---

Kiln Linux is young. This page separates what someone has run from what only exists in code. The test dates refer to the repository at that time.

## Tested and working

On 2026-11-03, on an x86_64 Arch Linux host:

- `make iso` built `out/kilnlinux-YYYY.MM.DD-x86_64.iso` (1.1 GiB) without root.
- The ISO booted in QEMU on UEFI, through the systemd-boot menu, and on BIOS, through the syslinux menu. Both reached the live system's welcome screen with root logged in.
- `make e2e` ran a full unattended install in QEMU: UEFI, erase the disk, ext4, twmx. All ten of the installer's checks passed: kernel, initramfs, systemd-boot, the fallback EFI loader, the root UUID in the boot entry and in fstab, `/boot` in fstab, the user account, os-release, and `kiln doctor`.
- The installed system booted through systemd-boot. The user could log in, fastfetch showed the Kiln logo and `OS: Kiln Linux`, `kiln list` showed the core and twmx profiles, and `systemctl --failed` listed nothing. `startx` started twmx, and Super+Return opened xterm in Kiln's colors.
- `kiln apply` and `kiln remove --purge` ran against real pacman in a test root. The purge removed what kiln had installed and kept a package installed by hand. That test predates kiln's switch from `pacman -Rs` to `pacman -R`, which keeps dependencies installed.
- A user installed Kiln on a VM through the interactive menus, with ext4 and twmx. The install finished, the system booted, and the login worked. Two things showed up and are fixed in the installer: kernel messages drew over the progress box, and the desktop didn't start on login, so the installer now adds the tty1 autostart lines.
- A reinstall from the updated ISO confirmed the autostart: logging in on tty1 starts twmx.
- Manual partitioning works: the user partitioned a VM disk in cfdisk (GPT, a 1 GiB EFI System partition, the rest Linux filesystem) and picked the EFI and root partitions in the installer.
- An earlier manual install on a VM reached the installer's checks, which caught a real bug: a boot entry for a fallback initramfs that current Arch no longer builds. The installer reported failure instead of success, and the entry no longer exists.

## Written but not yet tried

- btrfs, and setting a root password.
- The six desktops other than twmx: i3, Sway, Hyprland, XFCE, KDE Plasma and GNOME. Their package lists pass `make test`, which checks that every package exists in the repositories, but nobody has installed them in a VM.
- The installer's failure path under real faults, such as losing the network during `pacstrap`.
- Keeping Kiln's os-release through a `pacman -Syu` that upgrades the `filesystem` package.
- Real hardware.

## Known limits

- No published ISO. You build it.
- The installer only sets up UEFI systems. The ISO itself boots on BIOS, and you can use it there as a rescue system.
- The installer has no disk encryption option.
- twmx comes from a small local repository, `[kiln]`, copied from the ISO. It updates when you install from a newer ISO, not through `pacman -Syu`.
- The installer copies the `kiln` binary into `/usr/local/bin`; no pacman package tracks it.
- The installer doesn't set an X11 keyboard layout. On a non-US keyboard, run `sudo localectl set-x11-keymap <layout>` after installing.
- Kiln hasn't measured boot time yet.

## Next

1. Test the interactive menus, the tty1 autostart and each desktop in QEMU.
2. A BIOS install path with GRUB.
3. Host the `[kiln]` repository online, signed, so twmx updates with `pacman -Syu`.
4. Package `kiln` for pacman.
5. A first published ISO.
