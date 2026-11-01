---
title: The .kpkg format
description: Reference for Kiln's package file format.
---

A `.kpkg` is a zstd-compressed tar. Its first two entries are:

1. `.KILN/meta.toml`: package metadata.
2. `.KILN/manifest`: every path in the package.

The payload follows, rooted at `/`.

Packages are named `<name>-<version>-<release>.<arch>.kpkg`, for example `zlib-1.3.1-1.x86_64.kpkg`.

## meta.toml

| Field | Type | Notes |
| --- | --- | --- |
| `name` | string | |
| `version` | string | |
| `release` | integer | |
| `arch` | string | Architecture it was built on |
| `summary` | string | Optional |
| `license` | string | Optional |
| `homepage` | string | Optional |
| `depends` | list of strings | Optional |
| `size` | integer | Installed size in bytes |

## manifest

One line per path:

```
<kind> <sha256 or -> <path>
```

`kind` is `f` (file), `d` (directory) or `l` (symlink). Files carry a sha256; directories and symlinks use `-`. Paths have no leading slash.
