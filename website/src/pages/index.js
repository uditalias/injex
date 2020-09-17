import React, { useState } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

function Feature({ title, description, icon, image }) {
  return (
    <div className={styles.feature}>
      {icon ? <i className="material-icons">{icon}</i> : null}
      {image ? <img src={image} /> : null}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

const tabs = [{ value: "node", label: "Node" }, { value: "webpack", label: "Webpack" }];

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  const [selectedValue, setSelectedValue] = useState("node");
  return (
    <Layout
      description={siteConfig.tagline}>
      <header className={clsx(styles.header, styles.container)}>
        <img src="https://badge.fury.io/js/injex.svg" /> <img src="https://travis-ci.org/uditalias/injex.svg?branch=master" />
        <div className={styles.inner}>
          <div>
            <h2>Simple, Decorated, Pluggable dependency-injection container for TypeScript applications</h2>
            <h3>Injex creates a dependency tree between your modules. Using TypeScript decorators you can define, reuse and inject modules into other modules as dependencies.</h3>
            <Link to="docs" className={styles.button}>Get Started</Link>
          </div>
          <div className={styles.image}>
            <img src="img/undraw_programming_2svr.svg" />
          </div>
        </div>
      </header>
      <main className={styles.container}>
        <h2>The right way to write TypeScript applications</h2>
        <p>Use decorators to define, reuse and link modules and dependencies together.</p>
        <div className={styles.features}>
          <Feature icon="flare" title="Simple" description="Simply define and reuse module and dependencies." />
          <Feature icon="settings_input_component" title="Pluggable" description="Use or create your own plugins to manage dependencies." />
          <Feature icon="category" title="Organized" description="Better project code organization approach." />
          <Feature image="img/typescript.svg" title="For TypeScript" description="Used to power your Node.JS or client side TypeScript applications." />
          <Feature icon="looks_one" title="Singleton" description="Create, inject and reuse singleton modules." />
          <Feature icon="build" title="Factories" description="Inject class factories to easily create module instances." />
          <Feature icon="account_tree" title="Inversion of control" description="Define aliases to inject IoC modules." />
          <Feature icon="code" title="Lazy Modules" description="Create lazy modules and take control of code-splitting." />
        </div>
      </main>
      <main className={styles.container}>
        <h2>Fastest way to get started</h2>
        <p>Quick installation of Injex core and Node.JS/Webpack runtime.</p>
        <div className={styles.example}>
          <div className={styles.desc}>
            <p>Injex runtimes are consistent so you would'nt notice any change. Full Stack TypeScript development (server/client) at its best.</p>
            <ul>
              <li>Unopinionated</li>
              <li>Minimalist API</li>
              <li>Use decorators to play</li>
              <li>Flexible with plugins</li>
              <li>Small size footprint</li>
            </ul>
            <p>
              Checkout the <Link to="/examples/">examples</Link> page for full examples and use cases.
            </p>
          </div>
          <div className={styles.code}>
            <Tabs values={tabs} defaultValue={selectedValue}>
              <TabItem value="node">
                <p>Install using npm or yarn</p>
                <CodeBlock className="bash">
                  npm install --save @injex/core @injex/node
                </CodeBlock>
                <h2></h2>
                <p>Import and create Injex container.</p>
                <CodeBlock>
                  {`import { Injex } from "@injex/node";

Injex.create({
  rootDirs: [
    __dirname
  ]
}).bootstrap();`}
                </CodeBlock>
              </TabItem>
              <TabItem value="webpack">
                <p>Install using npm or yarn</p>
                <CodeBlock className="bash">
                  npm install --save @injex/core @injex/webpack
              </CodeBlock>
                <h2></h2>
                <p>Import and create Injex container.</p>
                <CodeBlock>
                  {`import { Injex } from "@injex/webpack";

Injex.create({
  resolveContext: () => {
    return require.context(__dirname, true, /\.ts$/);
  }
}).bootstrap();`}
                </CodeBlock>
              </TabItem>
            </Tabs>
          </div>
        </div>
      </main>
      <main className={styles.container}>
        <h2>Create and define module using decorators</h2>
        <div className={styles.example}>
          <div className={styles.code}>
            <CodeBlock>
              {`import { define, singleton, inject, injectAlias } from "@injex/core";

@define()
@singleton()
export class MailService {

  @inject() private env: IEnvironment;
  @injectAlias("IMailProvider", "Type") private mailProviders: AliasMap<MailProviderType, IMailProvider>;

  public send(message: Mail) {
    const mailProvider = this.mailProviders[this.env.mailProvider];

    mailProvider.send(message);
  }
}`}
            </CodeBlock>
          </div>
        </div>
      </main>
      <main className={styles.container}>
        <div className={styles.end}>
          <h2>Injex changes the way you write TypeScript applications. for good.</h2>
          <Link className={styles.button} to="/docs/">Get Started</Link>
        </div>
      </main>
    </Layout>
  );
}

export default Home;
