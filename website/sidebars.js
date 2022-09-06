module.exports = {
  root: {
    Injex: ['introduction', 'getting-started', 'basic-example', 'examples'],
    Runtimes: ['runtimes-node', 'runtimes-webpack', 'runtimes-vite', 'runtimes-create'],
    Plugins: ['plugins', 'env-plugin', 'express-plugin', 'react-plugin'],
    'API Reference': [
      'container',
      'lifecycle',
      {
        'Core Decorators': ['define', 'singleton', 'bootstrap', 'alias', 'lazy', 'inject', 'injectFactory', 'injectAlias', 'injectParam', 'init', 'ready']
      },
      'enums',
    ]
  }
};
