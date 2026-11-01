// Snapshot recipe metadata from the distro repo into src/data/recipes.json.
// Reads the committed tree (HEAD), so work in progress in the distro repo is left out.
// Usage: node scripts/recipes.mjs ~/Desktop/KilnLinux
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const repo = process.argv[2];
if (!repo) throw new Error('pass the path to the Kiln Linux repository');
const git = (...args) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8' });

const fields = ['name', 'version', 'release', 'summary', 'license', 'homepage'];
// Recipes imported from void-packages (tools/void-import) use Void's field names.
const voidFields = { name: 'pkgname', release: 'revision', summary: 'short_desc' };
const recipes = git('ls-tree', '--name-only', 'HEAD', 'recipes/')
  .split('\n')
  .filter((p) => p && git('ls-tree', '--name-only', 'HEAD', `${p}/`).includes(`${p}/template`))
  .map((p) => ({ name: p.slice('recipes/'.length) }))
  .map((d) => {
    const text = git('show', `HEAD:recipes/${d.name}/template`);
    const r = {};
    for (const f of fields) {
      const m = text.match(new RegExp(`^(?:${f}|${voidFields[f] ?? f})=(?:"([^"]*)"|'([^']*)'|(\\S*))`, 'm'));
      if (m) r[f] = m[1] ?? m[2] ?? m[3];
    }
    if (r.name !== d.name || !r.version) throw new Error(`recipes/${d.name}/template: missing name or version`);
    return r;
  })
  .sort((a, b) => a.name.localeCompare(b.name));

writeFileSync('src/data/recipes.json', JSON.stringify(recipes, null, 2) + '\n');
console.log(`${recipes.length} recipes`);
