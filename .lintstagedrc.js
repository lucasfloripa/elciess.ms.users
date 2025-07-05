module.exports = {
  '*.{ts, json}': [
    'npm run format'
  ],
  '*.{ts, js}': [
    'npm run lint:fix',
    'npm run lint'
  ]
};