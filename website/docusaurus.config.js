module.exports = {
  title: 'Injex',
  tagline: 'Simple, Decorated, Pluggable dependency-injection framework for TypeScript applications',
  stylesheets: [
    "https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;700&display=swap",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
  ],
  url: 'https://injex.netlify.com',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  favicon: 'img/favicon.png',
  organizationName: 'uditalias', // Usually your GitHub org/user name.
  projectName: 'injex', // Usually your repo name.
  themeConfig: {
    algolia: {
      apiKey: 'apiKey',
      indexName: 'injex',
      searchParameters: {}, // Optional (if provided by Algolia)
    },
    image: "img/poster.png",
    announcementBar: {
      id: 'supportus',
      content:
        '⭐️ If you like Injex, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/uditalias/injex">GitHub</a>! ⭐️',
    },
    prism: {
      defaultLanguage: "typescript",
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula')
    },
    navbar: {
      title: 'Injex',
      hideOnScroll: false,
      logo: {
        alt: 'Injex - Dependency Injection Framework',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/introduction', activeBaseRegex: '(/introduction|getting-started|basic-example)', label: 'Docs', position: 'right',
        },
        { to: 'docs/runtimes/node', activeBaseRegex: '/runtimes/', label: 'Runtimes', position: 'right' },
        { to: 'docs/plugins/', label: 'Plugins', position: 'right' },
        { to: 'docs/examples/', label: 'Examples', position: 'right' },
        {
          href: 'https://github.com/uditalias/injex',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs/introduction',
            },
            {
              label: 'Getting Started',
              to: '/docs/getting-started',
            }
          ]
        },
        {
          title: 'Guides & Tutorials',
          items: [
            {
              label: 'Basic Usage',
              to: 'docs/basic-example',
            },
            {
              label: 'Examples & Use Cases',
              to: 'docs/examples',
            },
            {
              label: 'Create a Runtime',
              to: 'docs/runtimes/create-runtime',
            },
            {
              label: 'Plugins Concept',
              to: 'docs/plugins',
            }
          ]
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/uditalias/injex',
            },
            {
              label: '@uditalias',
              href: 'https://twitter.com/uditalias',
            }, {
              html: `<a href="https://www.netlify.com" target="_blank"><img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify"></a>`
            }
          ]
        }
      ],
      logo: {
        alt: 'Injex Logo',
        src: 'img/logo.svg',
        href: 'https://www.injex.dev',
      },
      copyright: `Copyright © ${new Date().getFullYear()} Injex`,
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          remarkPlugins: [require('./src/plugins/remark-npm2yarn')],
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/uditalias/injex/edit/master/website/',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
