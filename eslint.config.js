// eslint.config.js
import antfu from '@antfu/eslint-config';

export default antfu({
  ignores: ['src/components/ui*'],
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
  formatters: {
    css: true,
    html: true,
  },
});
