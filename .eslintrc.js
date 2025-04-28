module.exports = {
  env: { browser: true },
  rules: {
    'consistent-return': 'off',
    'react/prop-types': 'off',
    'no-console': 'off',
    'no-unused-vars': 'off',
    'indent': [{ 'comments': 'off' }],
  },
  extends: ['airbnb-base', 'plugin:react/recommended'],
};
