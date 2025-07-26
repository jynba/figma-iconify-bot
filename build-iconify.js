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

function bumpSvgVersion() {
  const svgDir = path.resolve(__dirname, 'svg');
  execSync('npm version patch --no-git-tag-version', { cwd: svgDir, stdio: 'inherit' });
  // 读取新 version
  const pkgPath = path.join(svgDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  return pkg.version;
}

function bumpVueVersion() {
  const vueDir = path.resolve(__dirname, 'vue');
  execSync('npm version patch --no-git-tag-version', { cwd: vueDir, stdio: 'inherit' });
  // 读取新 version
  const pkgPath = path.join(vueDir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  return pkg.version;
}

async function build() {
  const version = bumpVersion();
  const svgVersion = bumpSvgVersion();
  const vueVersion = bumpVueVersion();

  const iconSet = await importDirectory('./output', {
    prefix: 'custom',
  });

  // 确保svg文件夹存在
  const svgDir = path.join(__dirname, 'svg');
  if (!fs.existsSync(svgDir)) {
    fs.mkdirSync(svgDir, { recursive: true });
  }

  await iconSet.forEach(async (name) => {
    const svg = iconSet.toSVG(name);
    if (!svg) return;

    await cleanupSVG(svg);
    await parseColors(svg, { defaultColor: 'currentColor' });
    await runSVGO(svg);
    iconSet.fromSVG(name, svg);

    // 导出SVG文件到svg文件夹
    const svgContent = svg.toString();
    const svgFilePath = path.join(svgDir, `${name}.svg`);
    fs.writeFileSync(svgFilePath, svgContent);
  });

  await exportJSONPackage(iconSet, {
    target: './json',
    package: {
      name: '@mot-iron/iconify-json',
      version, // 用 bump 后的 version
      iconSet: true
    }
  });

  // 构建Vue包
  console.log('Building Vue package...');
  execSync('npm run build', { cwd: path.resolve(__dirname, 'vue'), stdio: 'inherit' });

  console.log(`Built JSON package version: ${version}`);
  console.log(`Built SVG package version: ${svgVersion}`);
  console.log(`Built Vue package version: ${vueVersion}`);
}

build().catch(console.error);
