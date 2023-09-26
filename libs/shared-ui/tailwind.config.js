const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const withMT = require('@material-tailwind/react/utils/withMT');
/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  presets: [require('../../tailwind-workspace-preset.ts')],
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});
