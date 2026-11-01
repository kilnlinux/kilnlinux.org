/** The docs site (docs/ in this repo). In dev, the docs dev server that `npm run dev` starts. */
/** The project site. Absolute in production so links from search.kilnlinux.org go back to kilnlinux.org. */
export const SITE = import.meta.env.DEV ? '' : 'https://kilnlinux.org';

/** The package search page, served at search.kilnlinux.org/search. */
export const SEARCH = import.meta.env.DEV ? '/search' : 'https://search.kilnlinux.org/search';

export const DOCS = import.meta.env.DEV ? 'http://localhost:4322' : 'https://docs.kilnlinux.org';
