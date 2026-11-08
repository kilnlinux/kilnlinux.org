---
title: Status and roadmap
description: What works in Kiln Linux today, what nobody has tried yet, and what's missing.
---

Kiln Linux is young. This page separates what someone has run from what only exists in code. The test dates refer to the repository at that time. The repository's [docs/testing.md](https://github.com/kilnlinux/Kiln-Linux/blob/main/docs/testing.md) has the full record.

## Tested and working

### Real hardware

- On 2026-11-08 the live ISO booted from a USB stick on a real PC. Nobody has installed Kiln on real hardware yet.

### Installs in QEMU

`make e2e` installs the ISO unattended in QEMU, boots the result and logs in. Every run below passed the installer's own checks (kernel, initramfs, boot loader, root UUID in the boot entry and fstab, `/boot` in fstab, the user, os-release, `kiln doctor`) and booted the installed system.

- **Firmware and boot loaders:** UEFI with systemd-boot, GRUB and Limine; BIOS with GRUB and Limine.
- **Encryption:** LUKS2 root on UEFI with systemd-boot, and on BIOS with GRUB and with Limine. The passphrase typed at boot unlocks root.
- **Filesystems:** ext4, and btrfs.
- **Kernels:** `linux`, and `linux-lts` and `linux-zen` each as the only kernel.
- **twmx, i3, Sway, Hyprland:** after a tty1 login the desktop starts, Super+Return opens its terminal, and the test checks over the serial port that `kiln list` works and the window manager and its bar are running. Sway and Hyprland ran without a GPU, on QEMU's standard VGA.
- **XFCE, KDE Plasma, GNOME:** the install boots to LightDM, SDDM and GDM. Checked by screenshot; the test doesn't log in.
- **os-release:** after reinstalling the `filesystem` package, `/usr/lib/os-release` still says Kiln.

### By hand

- A user installed Kiln on a VM through the interactive menus, with ext4 and twmx. The install finished, the system booted, and logging in on tty1 started twmx.
- Manual partitioning: partitioning a VM disk in cfdisk (GPT, a 1 GiB EFI System partition, the rest Linux filesystem) and picking the partitions in the installer works.
- `kiln apply` and `kiln remove --purge` ran against real pacman in a test root. The purge removed what kiln had installed and kept a package installed by hand.
- The installer's checks caught a real bug once: a boot entry for a fallback initramfs that current Arch no longer builds. The installer reported failure instead of success, and the entry no longer exists.

## Written but not yet tried

- Installing on real hardware.
- Logging in to XFCE, KDE Plasma and GNOME.
- Setting a root password.
- `linux-hardened`, and several kernels at once.
- The installer's failure path under real faults, such as losing the network during `pacstrap`. Tests with mocked commands cover each stage failing.

## Known limits

- No Secure Boot support. Turn Secure Boot off in your firmware settings.
- The `[kiln]` repository is copied from the ISO and isn't signed. `kiln-update.timer` checks GitHub releases daily for newer Kiln packages.
- The installer doesn't set an X11 keyboard layout. On a non-US keyboard, run `sudo localectl set-x11-keymap <layout>` after installing.
- Kiln hasn't measured boot time yet.

## Next

1. Install on real hardware.
2. Host the `[kiln]` repository online, signed, so its packages update with `pacman -Syu`.
