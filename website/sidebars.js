module.exports = {
  root: {
    Injex: ['introduction', "getting-started", "basic-example"],
    Runtimes: ['runtimes-node', 'runtimes-webpack', 'runtimes-create'],
    Plugins: ['plugins', 'env-plugin', 'express-plugin'],
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
