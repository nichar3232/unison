import { StrictMode, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { ConvertFlow } from "./ConvertFlow";
import { Grain, Nav } from "./chrome";
import { Halftone } from "./Halftone";
import { mcpDemo } from "./mcp";
import { OnePrice } from "./OnePrice";
import { MCP_URL } from "../verify";
import "../theme.css";
import "./landing.css";

// The landing page is a slide deck: every top-level section snaps (landing.css, html.deck). Developers is not.
document.documentElement.classList.add("deck");
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

function Landing() {
  const hero = useRef<HTMLElement>(null);
  // Every load starts at the hero: no restored scroll position. A #link (e.g. /#tech from /developers) still jumps to
  // its slide once it exists, then the hash is dropped so the next reload starts at the top again.
  const landed = useRef(false);
  useEffect(() => {
    if (landed.current) return; // once per page load (StrictMode runs effects twice in dev)
    landed.current = true;
    const target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    if (target) {
      target.scrollIntoView();
      history.replaceState(null, "", location.pathname + location.search);
    } else scrollTo(0, 0);
  }, []);
  return (
    <>
      <section className="hero" id="product" ref={hero}>
        <Grain />
        <div className="rules" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <Halftone host={hero} />
        <Nav />
        <div className="hero-copy">
          <h1>Unison</h1>
          <p>
            One share is one share. Unison converts tokenized stocks across
            issuers at NAV parity, as a Uniswap v4 hook.
          </p>
          <div className="ctas">
            <a className="launch" href="/app">
              Move your shares
            </a>
            <a className="ghost" href="#tech">
              See it onchain →
            </a>
          </div>
        </div>
      </section>

      <OnePrice />

      <section className="black flow-sec" id="how-it-works" aria-labelledby="flow-h">
        <h2 id="flow-h">How it works</h2>
        <ConvertFlow />
      </section>

      <Tech />
    </>
  );
}

/** The last slide: the technical essentials in a few lines, and the way into the app. */
function Tech() {
  return (
    <section className="black tech" id="tech" aria-labelledby="tech-h">
      <h2 id="tech-h">Under the hood</h2>
      <ul className="tech-list">
        <li>
          <strong>Uniswap v4 hook.</strong> ParityHook fills each swap at NAV parity from its own ERC-6909 inventory (
          <code className="mono">beforeSwapReturnDelta</code>). One hook serves the AAPL, NVDA and TSLA pools on Unichain Sepolia.
        </li>
        <li>
          <strong>Fees.</strong> 2 bps base, plus a skew fee only on trades that make inventory more lopsided, all to the LP. A 50 bps peg
          guard stops trades when the pool drifts from parity.
        </li>
        <li>
          <strong>Dark Cross.</strong> Sealed commit-reveal batches cross at the oracle midpoint for 1 bp; any residual settles through the
          same hook in one unlock.
        </li>
        <li>
          <strong>Send.</strong> Confidential share payments on Sui (Seal + Walrus); the recipient withdraws into any issuer&rsquo;s wrapper.
        </li>
        <li>
          <strong>Agents.</strong> An MCP server at <code className="mono">{MCP_URL}</code> lets Claude read pools, quote and convert
          {mcpDemo && (
            <>
              {" "}
              — a recorded run converted 50 AAPL on its own (
              <a className="mono" href={mcpDemo.explorer} target="_blank" rel="noreferrer" title={mcpDemo.tx}>
                {mcpDemo.tx.slice(0, 10)}…{mcpDemo.tx.slice(-6)} ↗
              </a>
              )
            </>
          )}
          .
        </li>
      </ul>
      <div className="tech-ctas">
        <a className="launch" href="/app">
          Launch app
        </a>
      </div>
    </section>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Landing />
  </StrictMode>,
);
