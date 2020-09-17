module.exports = {
  title: 'Injex',
  tagline: 'Simple, Decorated, Pluggable dependency-injection container for TypeScript applications',
  stylesheets: [
    "https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;700&display=swap",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
  ],
  url: 'https://injex.netlify.com',
  baseUrl: '/website/',
  onBrokenLinks: 'warn',
  favicon: 'img/favicon.png',
  organizationName: 'uditalias', // Usually your GitHub org/user name.
  projectName: 'injex', // Usually your repo name.
  themeConfig: {
    prism: {
      defaultLanguage: "typescript",
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/nightOwl')
    },
    navbar: {
      title: 'injex',
      hideOnScroll: true,
      logo: {
        alt: '',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'right',
        },
        { to: 'plugins/', label: 'Plugins', position: 'right' },
        { to: 'runtimes/', label: 'Runtimes', position: 'right' },
        { to: 'examples/', label: 'Examples', position: 'right' },
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
              label: 'Style Guide',
              to: 'docs/',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            // {
            //   label: 'Blog',
            //   to: 'blog',
            // },
            {
              label: 'GitHub',
              href: 'https://github.com/uditalias/injex',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Udi Talias.`,
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
