module.exports = {
  root: {
    Injex: ['introduction', "getting-started", "basic-example"],
    Runtimes: ['runtimes-node', 'runtimes-webpack', 'runtimes-create'],
    Plugins: ['plugins', 'env-plugin', 'express-plugin'],
    "API Reference": [
      'container',
      {
        'Core Decorators': ['define', 'singleton', 'bootstrap', 'alias', 'lazy', 'inject', 'injectAlias', 'init']
      },
      'enums',
    ],
    Examples: [
      "examples-node",
      "examples-webpack",
      "examples-express"
    ]
  }
};
