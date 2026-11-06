// Facts about Kiln Linux, copied from the distro repository (KilnLinuxArch). Update these when
// it changes; every page reads from here.

export const repo = 'https://github.com/kilnlinux/Kiln-Linux';

/** packages/kiln/Cargo.toml. */
export const kilnVersion = '0.1.0';

/** packages/kiln/src/cli.rs: commands and their help text. */
export const commands = [
  { name: 'list', help: 'Active profiles and the packages kiln manages' },
  { name: 'search <query>…', help: 'Search the official repositories (pacman -Ss)' },
  { name: 'profile list', help: 'All profiles kiln can find' },
  { name: 'profile show <profile>', help: 'A profile’s packages and whether they’re installed' },
  { name: 'profile create <name>', help: 'New empty profile in ~/.config/kiln/profiles' },
  { name: 'plan <profile>', help: 'What apply would change; changes nothing' },
  { name: 'apply <profile>', help: 'Install what the profile is missing, mark it active' },
  { name: 'remove <profile>', help: 'Mark a profile inactive (keeps its packages)' },
  { name: 'doctor', help: 'Check pacman, dependencies and profiles' },
  { name: 'export <name> [pkg…]', help: 'Write a profile from the given packages, or from all explicitly installed ones' },
];

/** profiles/*.toml. */
export const profiles = [
  { name: 'core', description: "Minimal command-line system", packages: ["networkmanager", "sudo", "nano", "less", "man-db", "fastfetch"] },
  { name: 'twmx', description: "twmx X11 desktop: xterm, dmenu, dunst", packages: ["twmx", "xorg-server", "xorg-xinit", "xorg-xrdb", "xorg-xsetroot", "xorg-xrandr", "xterm", "dmenu", "dunst", "ttf-dejavu"] },
  { name: 'i3', description: "i3 X11 tiling desktop: i3status, i3lock, xterm, dmenu, dunst", packages: ["i3-wm", "i3status", "i3lock", "xorg-server", "xorg-xinit", "xorg-xrdb", "xorg-xsetroot", "xorg-xrandr", "xterm", "dmenu", "dunst", "ttf-dejavu"] },
  { name: 'sway', description: "Sway Wayland desktop: foot, fuzzel, mako", packages: ["sway", "swaybg", "swaylock", "foot", "fuzzel", "mako", "ttf-dejavu"] },
  { name: 'hyprland', description: "Hyprland Wayland tiling desktop: kitty, wofi, mako", packages: ["hyprland", "xdg-desktop-portal-hyprland", "kitty", "wofi", "mako", "polkit", "ttf-dejavu"] },
  { name: 'xfce', description: "XFCE desktop environment (X11) with the LightDM login screen", packages: ["xfce4-session", "xfwm4", "xfce4-panel", "xfdesktop", "xfce4-settings", "xfce4-terminal", "thunar", "xorg-server", "lightdm", "lightdm-gtk-greeter", "ttf-dejavu"] },
  { name: 'plasma', description: "KDE Plasma desktop environment (Wayland) with the SDDM login screen", packages: ["plasma-desktop", "sddm", "konsole", "dolphin", "plasma-nm", "kscreen", "noto-fonts"] },
  { name: 'gnome', description: "GNOME desktop environment (Wayland) with the GDM login screen", packages: ["gnome-shell", "gdm", "gnome-control-center", "gnome-console", "nautilus", "xdg-desktop-portal-gnome"] },
  { name: 'developer', description: "Git, compilers, make, debugger", packages: ["git", "base-devel", "gdb"] },
  { name: 'audio', description: "PipeWire audio (PulseAudio and ALSA compatible)", packages: ["pipewire", "pipewire-pulse", "pipewire-alsa", "wireplumber"] },
];

/** Known limits, per README.md. */
export const missing = ['a hosted repository for [kiln] package updates (twmx updates per user from GitHub)', 'broader hardware testing'];


/** Link to a package on archlinux.org. */
export const archPackage = (name: string) => `https://archlinux.org/packages/?q=${encodeURIComponent(name)}`;
