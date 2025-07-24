import { importDirectory, cleanupSVG, parseColors, runSVGO, exportJSONPackage } from '@iconify/tools';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function bumpVersion() {
  const jsonDir = path.resolve(__dirname, 'json');
  execSync('npm version patch --no-git-tag-version', { cwd: jsonDir, stdio: 'inherit' });
  // 读取新 version
  const pkgPath = path.join(jsonDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  return pkg.version;
}

async function build() {
  const version = bumpVersion();

  const iconSet = await importDirectory('./output', {
    prefix: 'custom',
  });

  await iconSet.forEach(async (name) => {
    const svg = iconSet.toSVG(name);
    if (!svg) return;

    await cleanupSVG(svg);
    await parseColors(svg, { defaultColor: 'currentColor' });
    await runSVGO(svg);
    iconSet.fromSVG(name, svg);
  });

  await exportJSONPackage(iconSet, {
    target: './json',
    package: {
      name: 'jy-icons',
      version, // 用 bump 后的 version
      iconSet: true
    }
  });
}

build().catch(console.error);
