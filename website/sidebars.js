module.exports = {
  root: {
    Injex: ['introduction', "getting-started", "basic-example"],
    Runtimes: ['runtimes-node', 'runtimes-webpack', 'runtimes-create'],
    Plugins: ['plugins', 'express-plugin', 'env-plugin', 'plugins-create'],
    "API Reference": [
      'container',
      'enums',
      {
        'Core Decorators': ['define', 'singleton', 'bootstrap', 'alias', 'lazy', 'inject', 'injectAlias', 'init']
      }
    ],
    Examples: [
      "examples-node",
      "examples-webpack",
      "examples-express"
    ]
  }
};
