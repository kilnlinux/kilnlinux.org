---
title: Recipes
description: How Kiln packages are defined.
---

A recipe is a directory, `recipes/<name>/`, holding a shell file called `template`. It sets variables and can define functions.

```sh
# Compression library used by almost everything.
name=zlib
version=1.3.1
release=1
summary="Compression library implementing the deflate method"
license=Zlib
homepage=https://zlib.net
source="https://zlib.net/fossils/zlib-${version}.tar.gz"
sha256=9a93b2b7dfdac77ceba5a558a580e74667dd6fede4585b91eefb60f03b72df23

build() {
  ./configure --prefix=/usr
  make -j"$JOBS"
}

package() {
  make DESTDIR="$destdir" install
  rm -f "$destdir/usr/lib/libz.a"
}
```

## Variables

| Variable | Required | Notes |
| --- | --- | --- |
| `name`, `version`, `release` | yes | `release` must be a number |
| `source` | yes | URL of the source tarball |
| `sha256` | yes | Checked before unpacking |
| `summary`, `license`, `homepage` | no | |
| `depends` | no | Bash array of package names |

## Functions

`build` and `package` run inside the unpacked source directory. If a recipe doesn't define them, the defaults are:

```sh
build()   { ./configure --prefix=/usr && make -j"$JOBS"; }
package() { make DESTDIR="$destdir" install; }
```

`package` must install into `$destdir`. `$JOBS` defaults to `nproc`.

## What `kiln build` does

1. Downloads `source` into `sources/` beside `recipes/`, unless it's already there.
2. Checks it against `sha256`.
3. Unpacks it under `build/<name>/`, then runs `build` and `package`.
4. Packs `$destdir` into `packages/<name>-<version>-<release>.<arch>.kpkg`.
