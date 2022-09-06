import React from 'react';
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
    <div className={clsx(styles.feature, "col col-3")}>
      <div className={styles.top}>
        {icon ? <i className="material-icons">{icon}</i> : null}
        {image ? <img src={image} /> : null}
        <h3>{title}</h3>
      </div>
      <p>{description}</p>
    </div>
  );
}

const tabs = [{ value: "node", label: "Node" }, { value: "webpack", label: "Webpack" }, { value: "vite", label: "Vite" }];

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      description={siteConfig.tagline}>
      <div className="home">

        <header className={clsx(styles.header, "container")}>
          <img className={styles.badge} src="https://img.shields.io/npm/v/@injex/core?style=for-the-badge" />
          <div className="row">
            <div className="col col-6">
              <h2>Simple, Decorated, Pluggable dependency-injection framework for TypeScript applications</h2>
              <h3>Injex makes software architecture more easy & fun by creating a dependency tree between your application modules with a minimal API.</h3>
              <Link to="docs/introduction" className={styles.button}>Get Started</Link>
              <a href="https://github.com/uditalias/injex" className={clsx(styles.button, styles.outline)}>View Source</a>
            </div>
            <div className={clsx(styles.image, "col col-6")}>
              {/* <iframe width="100%" height="100%" src="https://www.youtube.com/embed/6j_ojtNB0iI?controls=0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> */}
              {/* <img src="img/undraw_developer_activity_bv83.svg" /> */}
              {/* <img src="img/undraw_Freelancer_re_irh4.svg" /> */}
              <img src="img/undraw_coding_6mjf.svg" />
              {/* <img src="img/undraw_programming_2svr.svg" /> */}
            </div>
          </div>
        </header>
        <main className="container">
          {/* <a className={styles.productHunt} href="https://www.producthunt.com/posts/injex-framework?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-injex-framework" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=269437&theme=dark" alt="Injex Framework - Dependency-Injection framework for TypeScript applications | Product Hunt" style={{ width: 250, height: 54, float: "right" }} width="250" height="54" /></a> */}
          <h2>The right way to write TypeScript applications</h2>
          <p>Use decorators to define, reuse, and link modules and dependencies together.</p>
          <div className={clsx(styles.features, "row")}>
            <Feature icon="flare" title="Simple" description="Define and reuse modules and dependencies." />
            <Feature icon="settings_input_component" title="Pluggable" description="Use or create plugins to manage dependencies." />
            <Feature icon="category" title="Organized" description="Better project code organization approach." />
            <Feature image="img/typescript.svg" title="For TypeScript" description="Power up your Node.JS or client-side TypeScript applications." />
          </div>
          <div className={clsx(styles.features, "row")}>
            <Feature icon="looks_one" title="Singleton" description="Create, inject, and reuse modules as singletons." />
            <Feature icon="build" title="Factories" description="Inject class factories to create module instances easily." />
            <Feature icon="account_tree" title="SOLID Principles" description="Get the tools to implement SOLID applications." />
            <Feature icon="code" title="Lazy Modules" description="Create lazy modules and take control of client-side code splitting." />
          </div>
        </main>
        <main className="container">
          <h2>The fastest way to get started</h2>
          <p>Quick installation of Injex core and Node.JS/Webpack/Vite runtime.</p>
          <div className="row">
            <div className={clsx(styles.desc, "col col-6")}>
              <p>Injex runtimes are consistent so that you wouldn't notice any change. Full Stack TypeScript development (server/client) at its best.</p>
              <ul>
                <li>Unopinionated</li>
                <li>Minimalist API</li>
                <li>Use decorators to play</li>
                <li>Flexible with plugins</li>
                <li>Small size footprint</li>
              </ul>
              <p>
                Checkout the <Link to="/docs/examples/">examples</Link> page for full examples and use cases.
              </p>
            </div>
            <div className={clsx(styles.code, "col col-6")}>
              <Tabs values={tabs} defaultValue="node">
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
                <TabItem value="vite">
                  <p>Install using npm or yarn</p>
                  <CodeBlock className="bash">
                    npm install --save @injex/core @injex/vite
                  </CodeBlock>
                  <h2></h2>
                  <p>Import and create Injex container.</p>
                  <CodeBlock>
                    {`import { Injex } from "@injex/vite";

Injex.create({
  glob: () => {
    return import.meta.glob('./**/*.ts', { eager: true });
  }
}).bootstrap();`}
                  </CodeBlock>
                </TabItem>
              </Tabs>
            </div>
          </div>
        </main>
        <main className={"container"}>
          <h2>Create and define modules using decorators</h2>
          <div className={styles.example}>
            <div className={styles.code}>
              <CodeBlock className="ts">
                {`import { define, singleton, inject, injectAlias, AliasMap } from "@injex/core";

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
              <p style={{ marginTop: 10 }}>Checkout the <Link to="/docs/basic-example">basic example</Link> for a working demo.</p>
            </div>
          </div>
        </main>
        <main className="container">
          <div className={styles.end}>
            <div className={styles.credits}>
              <img src="img/logo.svg" /> <i className="material-icons">add</i> <img src="img/typescript.svg" />
            </div>
            <h2>Injex changes the way you write TypeScript applications. Forever.</h2>
            <Link className={styles.button} to="/docs/introduction">Get Started</Link>
            <a href="https://github.com/uditalias/injex" className={clsx(styles.button, styles.outline)}>View Source</a>
          </div>
        </main>

      </div>
    </Layout>
  );
}

export default Home;
