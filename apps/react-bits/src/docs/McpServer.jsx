import { useEffect, useState } from 'react';
import DocsButtonBar from './DocsButtonBar';
import CodeBlock from './CodeBlock';
import claude from '../assets/icons/claude.svg';
import vscode from '../assets/icons/vscode.svg';
import cursor from '../assets/icons/cursor.svg';

const McpServer = () => {
  const [selectedMethod, setSelectedMethod] = useState('claude');

  const scrollToTop = () => window.scrollTo(0, 0);

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <section className="docs-section">
      <h3 className="docs-category-title">MCP Server</h3>

      <p className="docs-paragraph">
        <a style={{ textDecoration: 'underline' }} href="https://modelcontextprotocol.io/" target="_blank">
          Model Context Protocol (MCP)
        </a>{' '}
        is an open standard that enables AI assistants to securely connect to external data sources and tools.
      </p>

      <p className="docs-paragraph dim">
        React Bits encourages the use of the shadcn MCP server to browse, search, and install components using natural
        language.
      </p>

      <h3 className="docs-category-title">Quick Start</h3>

      <p className="docs-paragraph">
        Registries are configured in your project&apos;s <span className="docs-highlight">components.json</span> file,
        where you should first add the <span className="docs-highlight">@react-bits</span> registry:
      </p>
      <CodeBlock showLineNumbers={true}>{`{
  "registries": {
    "@react-bits": "https://reactbits.dev/r/{name}.json"
  }
}`}</CodeBlock>

      <p className="docs-paragraph dim">
        Then, from the options below, select your client & set up the shadcn MCP server.
      </p>

      <div className="installation-methods">
        <div
          className={`installation-method ${selectedMethod === 'claude' ? 'method-active' : ''}`}
          onClick={() => setSelectedMethod('claude')}
        >
          <img src={claude} alt="Claude Code Logo" style={{ width: '40px', height: '40px' }} />
          <h4 className="method-title">Claude Code</h4>
        </div>
        <div
          className={`installation-method ${selectedMethod === 'cursor' ? 'method-active' : ''}`}
          onClick={() => setSelectedMethod('cursor')}
        >
          <img src={cursor} alt="Cursor Logo" style={{ width: '40px', height: '40px' }} />
          <h4 className="method-title">Cursor</h4>
        </div>
        <div
          className={`installation-method ${selectedMethod === 'vscode' ? 'method-active' : ''}`}
          onClick={() => setSelectedMethod('vscode')}
        >
          <img src={vscode} alt="VS Code Logo" style={{ width: '40px', height: '40px' }} />
          <h4 className="method-title">VS Code</h4>
        </div>
      </div>

      {selectedMethod === 'claude' && (
        <>
          <p className="docs-paragraph short">Run this in your project:</p>
          <CodeBlock showLineNumbers={true}>{`npx shadcn@latest mcp init --client claude`}</CodeBlock>
          <p className="docs-paragraph">Restart Claude Code and try prompts like:</p>
          <ul className="docs-list">
            <li className="docs-list-item dim">Show me all the available backgrounds from the React Bits registry</li>
            <li className="docs-list-item dim">
              Add the Dither background from React Bits to the page, make it purple
            </li>
            <li className="docs-list-item dim">
              Add a new section which fades in on scroll using FadeContent from React Bits
            </li>
          </ul>
          <p className="docs-paragraph dim">Tip: Use /mcp in Claude Code to debug the MCP server.</p>
        </>
      )}

      {selectedMethod === 'cursor' && (
        <>
          <p className="docs-paragraph short">Run this in your project:</p>
          <CodeBlock showLineNumbers={true}>{`npx shadcn@latest mcp init --client cursor`}</CodeBlock>
          <p className="docs-paragraph">
            Then open Cursor Settings and enable the shadcn MCP server. Try prompts like:
          </p>
          <ul className="docs-list">
            <li className="docs-list-item dim">Show me all the available backgrounds from the React Bits registry</li>
            <li className="docs-list-item dim">
              Add the Dither background from React Bits to the page, make it purple
            </li>
            <li className="docs-list-item dim">
              Add a new section which fades in on scroll using FadeContent from React Bits
            </li>
          </ul>
        </>
      )}

      {selectedMethod === 'vscode' && (
        <>
          <p className="docs-paragraph short">Run this in your project:</p>
          <CodeBlock showLineNumbers={true}>{`npx shadcn@latest mcp init --client vscode`}</CodeBlock>
          <p className="docs-paragraph">
            Then open <span className="docs-highlight">.vscode/mcp.json</span> and click{' '}
            <span className="docs-highlight">Start</span> next to the shadcn server. Try prompts like:
          </p>
          <ul className="docs-list">
            <li className="docs-list-item dim">Show me all the available backgrounds from the React Bits registry</li>
            <li className="docs-list-item dim">
              Add the Dither background from React Bits to this page, make it purple
            </li>
            <li className="docs-list-item dim">
              Add a new section which fades in on scroll using FadeContent from React Bits
            </li>
          </ul>
        </>
      )}

      <h3 className="docs-category-title">Learn more</h3>

      <p className="docs-paragraph dim" style={{ marginBottom: '16px' }}>
        To learn more about using the shadcn MCP server, including manual setup for different clients, please visit the
        official documentation:
      </p>

      <a
        className="docs-paragraph"
        style={{ textDecoration: 'underline' }}
        href="https://ui.shadcn.com/docs/mcp"
        target="_blank"
      >
        ui.shadcn.com/docs/mcp
      </a>

      <DocsButtonBar
        next={{ label: 'Browse Components', route: '/get-started/index' }}
        previous={{ label: 'Installation', route: '/get-started/installation' }}
      />
    </section>
  );
};

export default McpServer;
