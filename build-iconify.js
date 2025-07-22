import { importDirectory, cleanupSVG, parseColors, runSVGO, exportJSONPackage } from '@iconify/tools';
async function build() {
  const iconSet = await importDirectory('./output/icons', {
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
      version: '1.0.0',
      iconSet: true
    }
  });
}

build().catch(console.error);
