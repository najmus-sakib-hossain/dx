import { useEffect, useState } from 'react';
import DocsButtonBar from './DocsButtonBar';
import CodeBlock from './CodeBlock';
import { TbCopy, TbTerminal2 } from 'react-icons/tb';

import codeoptions from '../assets/common/code-options.webp';

const Installation = () => {
  const [selectedMethod, setSelectedMethod] = useState('manual');

  const scrollToTop = () => window.scrollTo(0, 0);

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <section className="docs-section">
      <h3 className="docs-category-title">Installation</h3>

      <p className="docs-paragraph dim">Using components is very straightforward, anyone can do it.</p>

      <h3 className="docs-category-title">Pick The Method</h3>

      <p className="docs-paragraph">
        You can keep it simple and copy code directly from the documentation, or you can use CLI commands to install
        components into your project.
      </p>

      <p className="docs-paragraph dim">Click the cards below to change your preferred method.</p>

      <div className="installation-methods">
        <div
          className={`installation-method ${selectedMethod === 'manual' ? 'method-active' : ''}`}
          onClick={() => setSelectedMethod('manual')}
        >
          <TbCopy style={{ fontSize: '50px' }} />
          <h4 className="method-title">Manual</h4>
        </div>

        <div
          className={`installation-method ${selectedMethod === 'cli' ? 'method-active' : ''}`}
          onClick={() => setSelectedMethod('cli')}
        >
          <TbTerminal2 style={{ fontSize: '50px' }} />
          <h4 className="method-title">CLI</h4>
        </div>
      </div>

      <h3 className="docs-category-title">Steps</h3>

      {selectedMethod === 'manual' && (
        <>
          <p className="docs-paragraph dim">Follow these steps to manually install components:</p>

          <h4 className="docs-category-subtitle">1. Pick a component</h4>

          <p className="docs-paragraph">
            Preview components and find something you like, then head to the{' '}
            <span className="docs-highlight">Code</span> tab.
          </p>

          <h4 className="docs-category-subtitle">2. Install dependencies</h4>

          <p className="docs-paragraph short">
            Components may use external libraries, don&apos;t forget to install them by selecting{' '}
            <span className="docs-highlight">Manual</span>, copying the command, and running it in your terminal.
          </p>

          <CodeBlock showLineNumbers={true}>npm install gsap</CodeBlock>

          <h4 className="docs-category-subtitle">3. Copy the code</h4>

          <p className="docs-paragraph short">
            The <span className="docs-highlight">Code</span> tab also contains all the code you need to copy - you can
            use the controls below to switch between technologies on the Code tab.
          </p>

          <div className="docs-code-options">
            <img src={codeoptions} className="code-options-img" />
          </div>

          <h4 className="docs-category-subtitle">4. Use the component</h4>
          <p className="docs-paragraph short">
            A basic usage example is provided for every component, and if you want to go into details, you can check all
            the available props on the <span className="docs-highlight">Preview</span> tab.
          </p>

          <CodeBlock showLineNumbers={true}>
            {`import SplitText from "./SplitText";

<SplitText
  text="Hello, you!"
  delay={100}
  duration={0.6}
/>`}
          </CodeBlock>
        </>
      )}

      {selectedMethod === 'cli' && (
        <>
          <p className="docs-paragraph dim">Use a one-time command to pull any component directly into your project.</p>

          <p className="docs-paragraph">
            React Bits supports two CLI installation methods:{' '}
            <a style={{ textDecoration: 'underline' }} href="https://ui.shadcn.com/" target="_blank">
              shadcn
            </a>{' '}
            and{' '}
            <a style={{ textDecoration: 'underline' }} href="https://jsrepo.dev/" target="_blank">
              jsrepo
            </a>
            . Pick whichever you prefer – they both fetch the same component source.
          </p>

          <h4 className="docs-category-subtitle">Installation</h4>
          <p className="docs-paragraph short">
            Below are example commands for the SplitText component. Replace placeholders to fit your stack.
          </p>

          <h4 className="docs-category-subtitle docs-highlight" style={{ marginTop: '1.25rem' }}>
            shadcn
          </h4>
          <p className="docs-paragraph short"></p>
          <CodeBlock>{`npx shadcn@latest add https://reactbits.dev/r/<Component>-<LANG>-<STYLE>`}</CodeBlock>
          <p className="docs-paragraph short">&lt;LANGUAGE&gt; + &lt;STYLE&gt; combinations:</p>
          <ul className="docs-list">
            <li className="docs-list-item">
              <span className="docs-highlight">JS-CSS</span> - JavaScript + Plain CSS
            </li>
            <li className="docs-list-item">
              <span className="docs-highlight">JS-TW</span> - JavaScript + Tailwind
            </li>
            <li className="docs-list-item">
              <span className="docs-highlight">TS-CSS</span> - TypeScript + Plain CSS
            </li>
            <li className="docs-list-item">
              <span className="docs-highlight">TS-TW</span> - TypeScript + Tailwind
            </li>
          </ul>

          <h4 className="docs-category-subtitle docs-highlight" style={{ marginTop: '1.25rem' }}>
            jsrepo
          </h4>
          <p className="docs-paragraph short"></p>
          <CodeBlock>{`npx jsrepo@latest add https://reactbits.dev/r/<Component>-<LANG>-<STYLE>`}</CodeBlock>
          <p className="docs-paragraph short">&lt;VARIANT&gt; options:</p>
          <ul className="docs-list">
            <li className="docs-list-item">
              <span className="docs-highlight">default</span> - JavaScript + Plain CSS
            </li>
            <li className="docs-list-item">
              <span className="docs-highlight">tailwind</span> - JavaScript + Tailwind
            </li>
            <li className="docs-list-item">
              <span className="docs-highlight">ts/default</span> - TypeScript + Plain CSS
            </li>
            <li className="docs-list-item">
              <span className="docs-highlight">ts/tailwind</span> - TypeScript + Tailwind
            </li>
          </ul>

          <p className="docs-paragraph dim" style={{ marginTop: '1rem' }}>
            Tip: You can run these with other package managers (pnpm, yarn, bun) - just swap the prefix (e.g.{' '}
            <code>pnpm dlx</code> or <code>yarn</code> instead of <code>npx</code>).
          </p>
        </>
      )}

      <h4 className="docs-category-subtitle">That&apos;s all!</h4>

      <p className="docs-paragraph">
        From here on, it&apos;s all about how you integrate the component into your project. The code is yours to play
        around with - modify styling, functionalities, anything goes!
      </p>

      <DocsButtonBar
        next={{ label: 'Mcp Server', route: '/get-started/mcp' }}
        previous={{ label: 'Introduction', route: '/get-started/introduction' }}
      />
    </section>
  );
};

export default Installation;
