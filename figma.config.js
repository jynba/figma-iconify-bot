// @ts-check

import outputComponentsAsSvg from '@figma-export/output-components-as-svg'
import transformSvgWithSvgo from '@figma-export/transform-svg-with-svgo'


/** @type { import('@figma-export/types').ComponentsCommandOptions } */
const componentOptions = {
  fileId: process.env.FILE_ID || '',
  // version: 'xxx123456', // optional - file's version history is only supported on paid Figma plans
  // ids: ['54:22'], // optional - Export only specified node IDs (the `onlyFromPages` option is always ignored when set)
  // onlyFromPages: ['icons'],
  transformers: [
    transformSvgWithSvgo({
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
            }
          }
        },
        {
          name: 'removeDimensions'
        }
      ]
    })
  ],
  outputters: [
    outputComponentsAsSvg({
      output: './output'
    })
  ]
}

/** @type { import('@figma-export/types').FigmaExportRC } */
export default {
  commands: [
    ['components', componentOptions]
  ]
}