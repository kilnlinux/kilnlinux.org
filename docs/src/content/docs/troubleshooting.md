---
title: Troubleshooting
description: Known problems building, installing and running Kiln Linux, and their fixes.
---

For problems with Arch packages, pacman or systemd, the [Arch wiki](https://wiki.archlinux.org/) has the answers. This page covers what Kiln adds.

## Building the ISO

**`no /etc/subuid entry`.** Rootless builds need subordinate IDs for your user. `useradd` adds them by default; for an older account, add a line such as `you:100000:65536` to `/etc/subuid` and `/etc/subgid`.

**makepkg reports missing dependencies.** The twmx build needs `base-devel`, `git`, `libx11` and `libxrandr`. Install them with pacman; `make iso` doesn't install build dependencies for you.

**You can't delete `build/work`.** Your subordinate IDs own its files. `make clean` deletes it inside a user namespace, and the next `make iso` does the same before it starts.

## Booting the ISO

**The installer says systemd-boot needs UEFI.** The computer started in BIOS mode. Choose GRUB or Limine under Boot loader, or reboot and pick the stick's UEFI entry in your firmware's boot menu.

**The stick doesn't boot at all.** Turn off Secure Boot in your firmware settings; Kiln isn't signed for it.

## Installing

**Install says "Not ready".** It names the first missing piece: a user account, a disk, a network connection, or the pacman keyring still initializing right after boot. Fix that item and choose Install again.

**A disk is missing from the list.** The installer hides the medium you booted from, and refuses disks under 8 GiB or with mounted filesystems. Unmount with `umount -R /mnt`, then pick the disk again.

**Installation FAILED.** The installer stops at the first failing command and shows the end of `/tmp/kiln-install.log`. Read the full log with `less /tmp/kiln-install.log`, and copy it off the machine before you reboot, because the live system runs from RAM. Filesystems may stay mounted under `/mnt`; run `umount -R /mnt` before you try again.

## After installing

**`twmx: cannot open display`.** You ran twmx on a console, where no X server is running. Run `startx` instead; it starts X and then twmx through `~/.xinitrc`. To start it on every tty1 login, see [Starting the desktop](../desktops/#starting-the-desktop).

**The desktop doesn't start on login.** The autostart lines in `~/.bash_profile` only run on tty1. Check that the lines exist and that you logged in on tty1, not on Ctrl+Alt+F2 or a later console.

**The X11 keyboard layout is US.** The installer only sets the console layout. Run `sudo localectl set-x11-keymap <layout>`, for example `de`, then restart X.

**Sway fails to start in QEMU.** Try software rendering: `WLR_RENDERER=pixman sway`.

**The system won't boot, and root is locked.** Boot the Kiln ISO, mount the root partition at `/mnt` and the EFI partition at `/mnt/boot`, then run `arch-chroot /mnt` to repair it. The boot menu's editor is off (`editor no` in `/boot/loader/loader.conf`), so you can't add kernel options at boot unless you turned it on beforehand.

**`kiln apply` says a package isn't in any repository.** Your package databases may be out of date: run `sudo pacman -Syu`. Check the name with `kiln search <name>`.

**`kiln remove --purge` fails.** Another installed package still depends on one of the profile's packages. pacman refused the whole removal, so nothing changed, and the profile stays active. pacman's message names the package.

**twmx doesn't update with `pacman -Syu`.** twmx comes from `[kiln]`, a local repository copied from the ISO. It updates when you install from a newer ISO.
