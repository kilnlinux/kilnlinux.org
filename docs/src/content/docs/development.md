---
title: Development
description: Building Kiln Linux in the build container.
---

## Repository layout

| Path | What it is |
| --- | --- |
| `bootstrap/` | Scripts that build the cross toolchain and temporary tools |
| `recipes/<name>/template` | One recipe per package |
| `kiln/` | The package manager (Rust) |
| `branding/` | Logo marks (SVG) |
| `Containerfile` | Clean, fixed build host |

## Host requirements

Use an x86_64 Linux host with Git, Podman, Rust and Cargo, a C compiler, and the
static glibc development libraries needed to link kiln. Install the Rust
`x86_64-unknown-linux-gnu` target if your toolchain does not include it.
The image script also needs e2fsprogs, dosfstools, mtools, util-linux and QEMU
with its bundled OVMF firmware on the host.

On NixOS, enable Podman with `virtualisation.podman.enable = true;`.
The bootstrap compiler runs in a Debian stable container as an unprivileged user.
The host builds kiln and runs the Podman commands that enter Kiln and create its image.

## Get the source

Run on the host:

```sh
git clone https://github.com/kilnlinux/Kiln.git
cd Kiln
```

Run the remaining commands from this repository directory. If you have already
cloned it, use your existing checkout.

## Build kiln for the bootstrap

Run on the host. The bootstrap needs a static executable because Kiln does not
have Rust or the host's shared libraries at this stage. `04-enter.sh` copies the
executable from the target directory below into `rootfs/usr/bin/kiln`.

```sh
RUSTFLAGS="-C target-feature=+crt-static" cargo build --release --target x86_64-unknown-linux-gnu --manifest-path kiln/Cargo.toml
```

Keep Cargo's default target directory, `kiln/target`, for this command. If your
Cargo configuration overrides it, set `CARGO_TARGET_DIR="$PWD/kiln/target"`.

## Build the temporary system

Start the builder from the host:

```sh
podman build -t kiln-builder .
podman run --rm -it --userns=keep-id -v "$PWD":/kiln:Z kiln-builder
```

Inside the builder container:

```sh
./bootstrap/00-host-check.sh
./bootstrap/01-prepare.sh
./bootstrap/02-cross-toolchain.sh
./bootstrap/03-temp-tools.sh
exit
```

`--userns=keep-id` maps the container's build user to your host user so the files
it writes belong to you. `exit` returns you to the host; run the next commands there.

## Finish the bootstrap and build packages

Run on the host:

```sh
./bootstrap/04-enter.sh
./bootstrap/04-enter.sh bash -c 'cd /kiln && kiln build-all --force'
```

The first command runs `05-chroot-tools.sh` inside Kiln to finish the temporary
tools. The second builds and installs the recipes in `recipes/ORDER` inside Kiln.
`build-all` skips packages whose current versions are already installed, so you
can rerun it after a failure.

## Boot the test image

Run on the host:

```sh
./bootstrap/06-image.sh run
```

This creates `kiln.img` and boots it in QEMU using UEFI. Log in as root with the
password `kiln`. The test system uses runit and gets an address over DHCP.
There is no live ISO, desktop or BIOS boot support yet.

## Bootstrap scripts

| Script | Does |
| --- | --- |
| `00-host-check.sh` | Checks the build host has the tools the LFS book requires |
| `01-prepare.sh` | Creates `rootfs/` and downloads sources, recording or verifying checksums |
| `02-cross-toolchain.sh` | Builds the cross toolchain |
| `03-temp-tools.sh` | Builds the temporary tools |
| `04-enter.sh` | Runs commands inside Kiln through host Podman; runs `05-chroot-tools.sh` by default |
| `05-chroot-tools.sh` | Finishes temporary tools inside Kiln |
| `06-image.sh` | Creates a UEFI disk image; add `run` to boot it in QEMU |

The target triplet is `$(uname -m)-kiln-linux-gnu`. The root uses merged `/usr`:
`bin`, `lib` and `sbin` are symlinks into `usr/`.

## Toolchain versions

From `bootstrap/config.sh`, following LFS 12.2:

| Package | Version |
| --- | --- |
| binutils | 2.43.1 |
| GCC | 14.2.0 |
| glibc | 2.40 |
| Linux | 6.10.5 |
| GMP | 6.3.0 |
| MPFR | 4.2.1 |
| MPC | 1.3.1 |

binutils, GCC and glibc must be versions the book has tested together; update them together.
