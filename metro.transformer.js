const { transform } = require('@svgr/core');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const expoTransformer = require(config.transformer.babelTransformerPath);

module.exports.transform = async (transformOptions) => {
  const { filename, src } = transformOptions;
  const transformedSource = filename.toLowerCase().endsWith('.svg')
    ? await transform(
        src,
        {
          native: true,
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
          svgoConfig: {
            plugins: [
              {
                name: 'preset-default',
                params: { overrides: { removeViewBox: false, convertColors: false } },
              },
            ],
          },
        },
        { filePath: filename },
      )
    : src;

  return expoTransformer.transform({ ...transformOptions, src: transformedSource });
};
