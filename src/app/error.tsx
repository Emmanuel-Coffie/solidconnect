"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container section empty-state">
      <h1>We couldn’t load this page.</h1>
      <p style={{ margin: "20px 0" }}>
        Your saved information is still there. Please try again.
      </p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
