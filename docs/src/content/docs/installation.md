---
title: Installation
description: Build the Kiln Linux ISO, boot it in QEMU or from USB, and install with kiln-install.
---

Kiln has no published ISO yet. You build one on an x86_64 Arch Linux machine. The build downloads about 500 MiB of packages and took under five minutes on the machine Kiln is developed on.

## Build the ISO

```sh
git clone https://github.com/kilnlinux/Kiln-Linux.git
cd Kiln-Linux
sudo pacman -S --needed archiso rust base-devel git
make test
make iso
```

`make iso` writes `out/kilnlinux-YYYY.MM.DD-x86_64.iso`. It runs as your user: archiso builds inside a user namespace, using the subordinate IDs that `useradd` gave your account in `/etc/subuid`. On the way it builds the `kiln` binary with cargo and the twmx package with makepkg. makepkg fetches twmx from GitHub, so the build needs network access.

If a build fails, the next `make iso` starts fresh. `make clean` removes everything the build created.

## Try it in QEMU

```sh
sudo pacman -S --needed qemu-desktop edk2-ovmf
make run          # the ISO on UEFI, with a blank 20 GiB disk at build/qemu/disk.qcow2
make run-bios     # the ISO on BIOS (live system only; the installer needs UEFI)
make run-disk     # boot the disk you installed to
```

QEMU uses KVM when your user can open `/dev/kvm`. To start over with a blank disk, delete `build/qemu`.

`make e2e` runs the whole test unattended: it boots the ISO, installs to a fresh disk, boots the result, logs in and saves screenshots to `build/e2e/`.

## Write it to a USB stick

The ISO is a hybrid image, so you can write it to a USB stick. Nobody has booted Kiln from USB on real hardware yet; please report how it goes. Find the stick with `lsblk`, then replace `/dev/sdX` below with it. This erases everything on the stick.

```sh
sudo dd if=out/kilnlinux-*.iso of=/dev/sdX bs=4M conv=fsync oflag=direct status=progress
```

## Install

Boot the ISO in UEFI mode. In your firmware's boot menu, pick the entry marked UEFI. The live system logs you in as root and prints a short welcome. Then run:

```sh
kiln-install
```

The installer opens on a main menu. Each line shows a setting and its current value. Pick lines in any order with the arrow keys and Enter, then choose Install.

| Item | What you set |
| --- | --- |
| Keyboard | the console keyboard layout; the installer loads it right away |
| Network | shows whether you're online. Ethernet connects by itself; for Wi-Fi it opens `iwctl` |
| Hostname | the computer's name; `kiln` by default |
| Locale | language and character set; `en_US.UTF-8` by default |
| Timezone | a region, then a city; `UTC` by default |
| Root | lock the root account (default) or give it a password |
| User account | your login name and password. You get sudo |
| Desktop | twmx (default), i3, Sway, Hyprland, XFCE, KDE Plasma, GNOME, or none. See [Desktops](../desktops/) |
| Extras | PipeWire audio, and developer tools (git, base-devel, gdb) |
| Disk | the target disk, how to partition it, and ext4 or btrfs |
| Boot loader | systemd-boot; the line only explains it |

### Disk

The disk list leaves out the USB stick or CD you booted from, and the installer refuses a disk smaller than 8 GiB or one with mounted filesystems. You then choose a scheme:

- **Erase the whole disk.** The installer creates a GPT table with a 1 GiB EFI system partition and gives the rest to the root filesystem.
- **Edit partitions with cfdisk.** You partition the disk yourself, then pick the EFI system partition and the root partition from a list. The installer formats root. For the EFI partition you choose: format it, or keep it to share with another system.

The EFI partition gets mounted at `/boot` and holds the kernel, so give it 512 MiB or more.

### Install

Install checks every setting first and names the first problem it finds, such as a missing user account or no network. Then it shows a summary. If you chose to erase a disk, you type the disk's name to confirm.

The installer then:

1. partitions and formats the disk;
2. installs `base`, `linux`, `linux-firmware` and your CPU's microcode with `pacstrap`;
3. adds Kiln's files, the `[kiln]` repository and the os-release hook;
4. sets the time zone, locale, keyboard and hostname, and turns on time sync;
5. applies the `core` profile, your desktop and your extras with `kiln apply`, and turns on NetworkManager and your desktop's login screen if it has one;
6. creates your user, sets up sudo, and locks root or sets its password;
7. installs systemd-boot and writes the boot entry;
8. checks the result: kernel, initramfs, boot loader, root UUID in the boot entry and fstab, the user, os-release and `kiln doctor`.

Output scrolls in a box and goes to `/tmp/kiln-install.log`. If any command fails, the installer stops, shows the end of the log and says Kiln Linux is not installed. It never reports success unless step 8 passes. The live system runs from RAM, so copy the log somewhere before you reboot.

### Unattended installs

`kiln-install --config FILE` skips the menus. FILE is a bash snippet that sets the same variables the menus set:

```sh
DISK=/dev/vda
SCHEME=auto            # auto erases DISK; manual uses ESP= and ROOT= as given
FS=ext4                # or btrfs
DESKTOP=twmx           # twmx i3 sway hyprland xfce plasma gnome none
EXTRAS=(audio)         # audio developer
HOSTNAME_NEW=kiln
USER_NAME=me
USER_PW='change me'
TIMEZONE=Europe/Berlin
LOCALE=en_US.UTF-8
KEYMAP=us
```

The file holds passwords in plain text, so delete it afterwards. The `make e2e` test uses this mode.

## After installing

Remove the install medium and reboot. Log in on tty1 with the user you created.

- **twmx, i3, Sway, Hyprland**: the desktop starts when you log in on tty1. If it doesn't, run `startx` (twmx, i3), `sway` or `Hyprland`.
- **XFCE, KDE Plasma, GNOME**: you log in on the graphical login screen.

Then:

```sh
nmtui                              # connect to Wi-Fi
sudo pacman -Syu                   # update
sudo localectl set-x11-keymap de   # X11 keyboard layout, if you don't use US
sudo kiln apply audio              # add PipeWire later, if you skipped it
```
