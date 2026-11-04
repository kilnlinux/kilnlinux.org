---
title: Package management
description: Using pacman and kiln profiles on Kiln Linux.
---

Kiln has two package tools with separate jobs. pacman installs, upgrades and removes packages, the same as on Arch. kiln keeps named lists of packages, called profiles, and asks pacman to bring the system in line with them.

## pacman

```sh
sudo pacman -Syu              # update everything; do this often
sudo pacman -S htop           # install
sudo pacman -Rs htop          # remove, with dependencies nothing else needs
pacman -Ss editor             # search
pacman -Qe                    # packages you asked for by name
```

Update with `-Syu`. Arch supports full upgrades only, so `-Sy` on its own can leave you with mismatched libraries. The Arch wiki's [pacman page](https://wiki.archlinux.org/title/Pacman) covers the rest.

## kiln

A profile is a TOML file with a name, a description and a list of packages. kiln compares the list with what pacman reports as installed, then runs pacman to install what's missing. pacman keeps its own database, its own lock and its own confirmation prompt; kiln reads from pacman and never edits pacman's files.

```sh
kiln profile list                   # profiles kiln can find (* = active)
kiln profile show twmx              # a profile's packages and whether each is installed
kiln plan developer                 # what apply would do; changes nothing
sudo kiln apply developer           # install what's missing, mark the profile active
kiln list                           # active profiles and the packages kiln installed for them
sudo kiln remove developer          # mark inactive and keep the packages
sudo kiln remove developer --purge  # also uninstall what kiln installed for it
kiln doctor                         # check pacman, dependencies and profiles
kiln search sway                    # pacman -Ss
kiln export mine                    # profile from every package you asked for by name (pacman -Qqe)
kiln export tools git ripgrep       # profile from a list you give
```

`apply` and `remove` need root and accept `--dry-run` (`-n`) and `--yes` (`-y`, which passes `--noconfirm` to pacman). Without `--yes` they refuse to run when stdin isn't a terminal, so a script can't confirm a change by accident. A second `apply` of a satisfied profile does nothing.

kiln doesn't run `pacman -Sy`. If `apply` reports a package missing from the repositories, update with `sudo pacman -Syu` and try again.

## Profiles Kiln ships

| Profile | Packages |
| --- | --- |
| `core` | networkmanager, sudo, nano, less, man-db, fastfetch |
| `twmx` | twmx, xorg-server, xorg-xinit, xorg-xrdb, xorg-xsetroot, xorg-xrandr, xterm, dmenu, dunst, ttf-dejavu |
| `i3` | i3-wm, i3status, i3lock, the same X11 packages, xterm, dmenu, dunst, ttf-dejavu |
| `sway` | sway, swaybg, swaylock, foot, fuzzel, mako, ttf-dejavu |
| `hyprland` | hyprland, xdg-desktop-portal-hyprland, kitty, wofi, mako, polkit, ttf-dejavu |
| `xfce` | xfce4-session, xfwm4, xfce4-panel, xfdesktop, xfce4-settings, xfce4-terminal, thunar, xorg-server, lightdm, lightdm-gtk-greeter, ttf-dejavu |
| `plasma` | plasma-desktop, sddm, konsole, dolphin, plasma-nm, kscreen, noto-fonts |
| `gnome` | gnome-shell, gdm, gnome-control-center, gnome-console, nautilus, xdg-desktop-portal-gnome |
| `developer` | git, base-devel, gdb |
| `audio` | pipewire, pipewire-pulse, pipewire-alsa, wireplumber |

The installer applies `core`, your desktop, then your extras. [Desktops](../desktops/) explains how to switch desktops later.

## Writing a profile

`kiln profile create dev` writes `~/.config/kiln/profiles/dev.toml`:

```toml
[profile]
name = "dev"                  # must match the file name
description = "My editor and build tools"

[packages]
official = [                  # package names from the repositories in pacman.conf
    "git",
    "neovim",
]
```

kiln checks every profile when it loads it:

- `name` uses lowercase letters, digits, `-` and `_`, and matches the file name.
- Package names follow pacman's rules and appear once.
- Unknown keys are errors, so a typo like `[pakages]` stops with an error.
- If a package isn't in any repository, `apply` stops before it changes anything.

`official` covers every repository in `/etc/pacman.conf`: Arch's, plus `[kiln]`, the local repository that holds twmx. kiln doesn't install from the AUR.

kiln looks for `<name>.toml` in `~/.config/kiln/profiles`, then `/etc/kiln/profiles`, then `/usr/share/kiln/profiles`, and uses the first it finds. Your copy of a shipped profile overrides Kiln's. Under `sudo`, `~` means your home, the one you ran sudo from. An argument containing `/` or ending in `.toml` is a path to a file.

## What `remove --purge` removes

kiln records which packages it installed for each profile. A package that was already on the system when you applied the profile never gets recorded. `--purge` then uninstalls a package only if:

1. kiln installed it for this profile,
2. no other active profile installed it or lists it, and
3. it is still installed.

kiln shows the list, then pacman removes the packages with `-R` and asks you to confirm. Their dependencies stay installed, since another active profile may need them; `pacman -Qdtq` lists the ones nothing needs. If another package still depends on one of the profile's packages, pacman refuses the whole removal, and kiln leaves the profile active.

When a profile goes inactive, kiln hands any package it installed that another active profile lists over to that profile, so a later purge of the other profile can still remove it.

One case to watch: if kiln installed a package for a profile and you later started using it on its own, kiln still counts it as the profile's. Keep it by listing it in another profile, or answer "n" at pacman's prompt.

## State

kiln keeps its records in `/var/lib/kiln/state.toml`. On the twmx test install it read:

```toml
[profiles.core]
managed = ["fastfetch", "less", "man-db", "nano", "networkmanager", "sudo"]

[profiles.twmx]
managed = ["dmenu", "dunst", "ttf-dejavu", "twmx", "xorg-server", "xorg-xinit", "xorg-xrandr", "xorg-xrdb", "xorg-xsetroot", "xterm"]
```

kiln writes the file only after pacman succeeds, and replaces it in one atomic rename. If you delete it, kiln forgets which profiles are active; your installed packages stay as they are. kiln has no rollback beyond what pacman offers, which is an all-or-nothing transaction.
