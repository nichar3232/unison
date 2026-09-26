/**
 * The Convert flow as a flat inline SVG (no gradients; one translucent tint for every node so it reads on light and dark).
 * Dots travel along each arrow to show what moves between the nodes (hidden with reduced motion).
 * Oracle · peg guard over ParityHook, user sends → ParityHook → user receives, LP inventory below.
 */
type Box = { x: number; y: number; w: number; title: string; sub: string };

const H = 56; // every box: 56px tall, two lines

function Node({ b }: { b: Box }) {
  return (
    <g className="cf-node">
      <rect x={b.x} y={b.y} width={b.w} height={H} rx={10} />
      <text x={b.x + b.w / 2} y={b.y + 23} textAnchor="middle" className="cf-title">
        {b.title}
      </text>
      <text x={b.x + b.w / 2} y={b.y + 42} textAnchor="middle" className="cf-sub">
        {b.sub}
      </text>
    </g>
  );
}
/** An arrow with two dots riding it, offset by half a cycle; `begin` staggers the arrows along the flow. */
function Arrow({ d, begin = 0, label, at }: { d: string; begin?: number; label?: string; at?: { x: number; y: number; anchor?: "start" | "middle" } }) {
  const dur = 2.4;
  return (
    <>
      <path className="cf-arrow" d={d} markerEnd="url(#cf-head)" />
      {label && at && (
        <text x={at.x} y={at.y} textAnchor={at.anchor ?? "middle"} className="cf-edge">
          {label}
        </text>
      )}
      {[0, dur / 2].map((offset) => (
        <circle key={offset} className="cf-dot" r={3.5}>
          <animateMotion dur={`${dur}s`} begin={`${begin + offset}s`} repeatCount="indefinite" path={d} />
        </circle>
      ))}
    </>
  );
}

export function ConvertFlow() {
  const W = 720;
  const top = 0;
  const oracle: Box = { x: 265, y: top + 24, w: 190, title: "Oracle · peg guard", sub: "Stops trade if gap > 50 bps" };
  const row2 = top + 124;
  const sends: Box = { x: 0, y: row2, w: 170, title: "User sends", sub: "100 mcbAAPL, issuer A" };
  const hook: Box = { x: 265, y: row2, w: 190, title: "ParityHook, in the v4 pool", sub: "Share for share, minus fee" };
  const receives: Box = { x: 550, y: row2, w: 170, title: "User receives", sub: "101.08 mAAPLx, issuer B" };
  const lp: Box = { x: 265, y: row2 + 100, w: 190, title: "LP inventory", sub: "Takes the other side, earns fee" };
  const height = lp.y + H + 2;
  const label = [
    "Oracle and peg guard stop the trade if the gap exceeds 50 bps.",
    "User sends 100 mcbAAPL (issuer A) to ParityHook in the v4 pool, which converts share for share minus fee;",
    "the user receives 101.08 mAAPLx (issuer B). LP inventory takes the other side and earns the fee.",
  ]
    .join(" ");
  return (
    <figure className="convert-flow">
      <svg viewBox={`0 0 ${W} ${height}`} role="img" aria-label={label}>
        <defs>
          <marker id="cf-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" className="cf-arrowhead" />
          </marker>
        </defs>
        <text x={W / 2} y={top + 13} textAnchor="middle" className="cf-caption">
          Exchange A price · Exchange B price feed only this
        </text>
        <Node b={oracle} />
        <Arrow d={`M${W / 2} ${oracle.y + H} L${W / 2} ${row2 - 1}`} begin={0} label="multipliers · peg check" at={{ x: W / 2 + 10, y: (oracle.y + H + row2) / 2 + 4, anchor: "start" }} />
        <Node b={sends} />
        <Arrow d={`M${sends.x + sends.w} ${row2 + H / 2} L${hook.x - 1} ${row2 + H / 2}`} begin={0.3} label="100 mcbAAPL" at={{ x: (sends.x + sends.w + hook.x) / 2, y: row2 + H / 2 - 8 }} />
        <Node b={hook} />
        <Arrow d={`M${hook.x + hook.w} ${row2 + H / 2} L${receives.x - 1} ${row2 + H / 2}`} begin={0.9} label="101.08 mAAPLx" at={{ x: (hook.x + hook.w + receives.x) / 2, y: row2 + H / 2 - 8 }} />
        <Node b={receives} />
        <Arrow d={`M${W / 2} ${row2 + H} L${W / 2} ${lp.y - 1}`} begin={0.9} label="fee · other side" at={{ x: W / 2 + 10, y: (row2 + H + lp.y) / 2 + 4, anchor: "start" }} />
        <Node b={lp} />
      </svg>
      <figcaption>Exchange prices never enter the conversion. Only the multipliers do.</figcaption>
    </figure>
  );
}
