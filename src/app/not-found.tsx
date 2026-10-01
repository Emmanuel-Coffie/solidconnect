import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container section empty-state">
      <div className="eyebrow">404 · Connection not found</div>
      <h1>Let’s get you back on track.</h1>
      <p style={{ margin: "20px 0" }}>
        This page may have moved, or the address may be incomplete.
      </p>
      <Link className="text-link" href="/">
        Back to home
      </Link>
    </div>
  );
}
