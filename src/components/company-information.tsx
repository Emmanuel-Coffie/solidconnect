import Link from "next/link";
import { Icon } from "./icon";
export function WhyConnect() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span />
              Why Solid Connect
            </div>
            <h2>More than an introduction.</h2>
            <p>
              A useful connection brings clarity, shared expectations, and a
              practical way forward.
            </p>
          </div>
        </div>
        <div className="listing-grid information-grid">
          {[
            [
              "check",
              "Reliability comes first",
              "A clear scope, an agreed process, and visible responsibilities give each connection a stronger foundation. We focus on the work that needs to happen after the introduction.",
            ],
            [
              "people",
              "People behind the opportunity",
              "Discuss the experience, needs, and expectations of the people involved. A role, project, or partnership should make sense for both sides.",
            ],
            [
              "inventory",
              "Seven services, one conversation",
              "A business challenge rarely stays in one category. Connect recruitment, logistics, property, supply, marketing, and trade around the outcome you are working toward.",
            ],
            [
              "chart",
              "Room to grow together",
              "Begin with a specific need and develop the relationship as your priorities change. Long-term partnerships are central to the company’s approach.",
            ],
            [
              "globe",
              "Local needs, wider possibilities",
              "Bring a Ghanaian business brief to a network designed to support both local requirements and international opportunities. Confirm coverage for your particular route or project.",
            ],
            [
              "home",
              "A clearer place to keep track",
              "Save opportunities, record enquiries, follow applications, and keep conversations in your account. Your dashboard gives the next step a place to live.",
            ],
          ].map(([icon, title, text]) => (
            <div className="capability" key={title}>
              <Icon name={icon} />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export function AboutNetwork() {
  return (
    <>
      <section className="section">
        <div className="container content-grid">
          <div>
            <div className="eyebrow">
              <span />
              The thinking behind Solid Connect
            </div>
            <h2>
              When the pieces connect,
              <br />
              progress becomes possible.
            </h2>
            <p className="lead-copy" style={{ marginTop: 24 }}>
              Finding the right person, supplier, workspace, or route can be
              difficult when every part of the process sits in a different
              place.
            </p>
            <p style={{ marginTop: 20 }}>
              Solid Connect brings these needs into a shared ecosystem. The
              company profile describes a focus on eliminating weak links
              between people, teams, and systems — through clearer
              communication, dependable processes, and partnership networks.
            </p>
            <p style={{ marginTop: 20 }}>
              That idea connects the seven services. Recruitment supports the
              team. Artisans bring specialist skill. Property creates a place to
              operate. Distribution, logistics, and trade move goods. Sales and
              marketing connect the offer with the people who need it.
            </p>
          </div>
          <div className="panel">
            <h3>Built around real business needs</h3>
            <div className="record-list" style={{ marginTop: 24 }}>
              {[
                [
                  "Starting something new",
                  "Find specialist support, explore a location, and begin building the network around your idea.",
                  "/services",
                ],
                [
                  "Strengthening what works",
                  "Connect with talent, supply partners, and practical services that support your everyday operations.",
                  "/marketplace",
                ],
                [
                  "Reaching the next market",
                  "Bring sourcing, distribution, logistics, and commercial planning into a more connected conversation.",
                  "/services/import-export",
                ],
              ].map(([title, text, href]) => (
                <div key={title}>
                  <h4>{title}</h4>
                  <p style={{ fontSize: 14, margin: "8px 0" }}>{text}</p>
                  <Link className="text-link" href={href}>
                    Explore the possibilities <Icon name="arrow" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="enquiry-guide">
        <div className="container content-grid">
          <div>
            <div className="eyebrow">
              <span />
              From the first conversation
            </div>
            <h2>
              What working together
              <br />
              should look like.
            </h2>
          </div>
          <div className="preparation-list">
            {[
              "A shared understanding of the need before a solution is proposed.",
              "Clear deliverables, responsibilities, and commercial terms for the specific engagement.",
              "A practical communication channel for questions, changes, and next steps.",
              "A relationship built for continuity, with learning carried into the next project.",
            ].map((t) => (
              <div key={t}>
                <Icon name="check" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
