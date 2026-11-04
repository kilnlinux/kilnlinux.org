---
title: Desktops
description: The seven desktops the installer offers, twmx keys, and switching desktops later.
---

Each desktop is a kiln profile: a list of packages in `/usr/share/kiln/profiles/<name>.toml`. The installer applies the one you pick on top of `core`. You can add another later with `sudo kiln apply <name>`, and several can sit side by side.

| Desktop | Profile | Session | Starts with | Kiln's own config |
| --- | --- | --- | --- | --- |
| **twmx** (default) | `twmx` | X11, tiling | a login on tty1 | colors, xterm, dmenu, dunst |
| i3 | `i3` | X11, tiling | a login on tty1 | xterm and dunst; i3 uses its package defaults |
| Sway | `sway` | Wayland, tiling | a login on tty1 | sway, foot, fuzzel, mako |
| Hyprland | `hyprland` | Wayland, tiling | a login on tty1 | none; package defaults |
| XFCE | `xfce` | X11 | the LightDM login screen | none |
| KDE Plasma | `plasma` | Wayland | the SDDM login screen | none |
| GNOME | `gnome` | Wayland | the GDM login screen | none |

Kiln keeps the desktop profiles small. GNOME, for example, gets the shell, GDM, Settings, Console and Files, without GNOME's full app collection. `kiln profile show <name>` lists any profile's packages.

## twmx

[twmx](https://github.com/arcbaseproject/twmx) is a tiling window manager in one C file, grown out of TinyWM. It has no bar, no compositor and no runtime config file: its settings live in a C header compiled into the binary. Kiln builds twmx from a pinned commit with its own `config.h`, which sets the brick border color and themes dmenu.

On Kiln, the twmx session starts from `~/.xinitrc`, which loads `~/.Xresources` for xterm's colors and font, sets a dark background, starts dunst for notifications, and runs twmx.

| Keys | Action |
| --- | --- |
| Super+Return | open xterm |
| Super+d | open dmenu, the launcher |
| Super+q | close the window |
| Super+j, Super+k | focus the next or previous window |
| Super+Shift+j, Super+Shift+k | move the window down or up the stack |
| Super+Shift+Return | swap the window with the master |
| Super+h, Super+l | shrink or grow the master area |
| Super+i, Super+o | one more or one fewer window in the master area |
| Super+t, Super+m, Super+Shift+f | tiled, monocle or floating layout |
| Super+space | float or tile the window |
| Super+f | fullscreen |
| Super+1 to 9 | go to a workspace |
| Super+Shift+1 to 9 | send the window to a workspace |
| Super+Tab | back to the previous workspace |
| Super+comma, Super+period | focus the previous or next monitor |
| Super+Shift+q | quit twmx |
| Super+drag, Super+right-drag | move or resize a window with the mouse |

To change a key or color, edit `packages/twmx/config.h` in the Kiln repository and rebuild the ISO, or build twmx yourself from its repository.

## Sway

Kiln's Sway config uses the same dark-and-brick colors: Super+Return opens foot, Super+d opens fuzzel, Super+q closes a window, Super+Escape locks the screen and Super+Shift+e exits. The config is in `~/.config/sway/config`; `man 5 sway` documents the syntax. In QEMU, Sway may need software rendering: `WLR_RENDERER=pixman sway`.

## i3 and Hyprland

Kiln ships no config for these two, so you start with the defaults from their packages. Hyprland's default config opens kitty on Super+Q and wofi on Super+R, and the profile installs both.

## Starting the desktop

Window managers have no login screen. For twmx, i3, Sway and Hyprland the installer adds these lines to the new user's `~/.bash_profile` (here for twmx and i3):

```sh
# Kiln Linux: start the desktop when logging in on tty1.
if [ -z "$DISPLAY" ] && [ -z "$WAYLAND_DISPLAY" ] && [ "$(tty)" = /dev/tty1 ]; then
    exec startx
fi
```

The other consoles (Ctrl+Alt+F2 and up) stay plain text. Delete the lines to boot to a console instead.

Running `twmx` or `i3` by itself on a console fails with `cannot open display`. Both need an X server, and `startx` starts one and then runs `~/.xinitrc`.

## Switching desktops later

Apply the new profile, change how it starts, then remove the old one. From twmx to Sway:

```sh
sudo kiln apply sway
sed -i 's/exec startx/exec sway/' ~/.bash_profile
sudo kiln remove twmx --purge
```

From twmx to GNOME, which has a login screen:

```sh
sudo kiln apply gnome
sudo systemctl enable gdm
# delete the "Kiln Linux: start the desktop" lines from ~/.bash_profile
sudo kiln remove twmx --purge
```

`--purge` uninstalls only the packages kiln installed for that profile and that no other active profile lists. Skip it to keep the old desktop installed. kiln never enables or disables services, so the `systemctl` step stays with you.

Sway's config files land in `/etc/skel` on every install, so new users get them whichever desktop the installer set up. An existing user copies them with `cp -rn /etc/skel/.config/. ~/.config/`.
