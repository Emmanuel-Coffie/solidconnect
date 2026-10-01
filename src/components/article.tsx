import Link from "next/link";
import { articleContent } from "@/lib/article-content";
import { Icon } from "./icon";
import { LinkButton } from "./link-button";
export function ArticleBody({ slug }: { slug: string }) {
  const content = articleContent[slug];
  return (
    <div className="container section article-body-layout">
      <aside className="article-toc">
        <h3>In this guide</h3>
        {content.sections.map((s) => (
          <a key={s.id} href={`#${s.id}`}>
            {s.title}
          </a>
        ))}
        <Link href="/resources" className="text-link">
          All resources
        </Link>
      </aside>
      <article className="prose">
        <div className="notice">
          Solid Connect guide · General planning information. Examples are
          illustrative.
        </div>
        <p className="lead-copy">{content.intro}</p>
        {content.sections.map((s) => (
          <section id={s.id} key={s.id}>
            <h2>{s.title}</h2>
            {s.paragraphs.map((p) => (
              <p key={p.slice(0, 35)}>{p}</p>
            ))}
            {s.checklist && (
              <ul className="article-checklist">
                {s.checklist.map((item) => (
                  <li key={item}>
                    <Icon name="check" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <div className="panel" style={{ marginTop: 35 }}>
          <h3>Put the next step into motion.</h3>
          <p>
            Bring your questions and priorities to the first conversation. A
            clear brief helps the right people understand how they can help.
          </p>
          <LinkButton
            href={content.href}
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
          >
            {content.next}
          </LinkButton>
        </div>
      </article>
    </div>
  );
}
