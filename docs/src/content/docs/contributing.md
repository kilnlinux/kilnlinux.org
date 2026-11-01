---
title: Contributing
description: How to help build Kiln Linux.
---

Kiln is early, so there's room to shape it. Kiln's own code is MIT licensed; packages keep their upstream licenses.

## Good places to start

- **Recipes.** Add a package under `recipes/<name>/template`. See [Recipes](../recipes/).
- **Bootstrap review.** Toolchain versions follow LFS 12.2. Compare `bootstrap/config.sh` and the recorded checksums in `bootstrap/sources.sha256` against the current LFS book.
- **kiln.** Package signatures are not done yet. See [Package management](../package-management/).
- **Docs.** Pages marked *Not written yet* need content once the features exist.

## Getting set up

Clone [the source repository](https://github.com/kilnlinux/Kiln), then follow
[Development](../development/) to build the system. See [Package management](../package-management/)
to build and use kiln on the host.

Browse the [recipes and bootstrap scripts](https://github.com/kilnlinux/Kiln/tree/main),
check [existing issues](https://github.com/kilnlinux/Kiln/issues), or submit a
[pull request](https://github.com/kilnlinux/Kiln/pulls) with your change. Include the
commands you ran and their results.
