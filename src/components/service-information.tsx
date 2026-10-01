"use client";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { serviceContent } from "@/lib/service-content";
import { Icon } from "./icon";
export function ServiceIntroduction({ slug }: { slug: string }) {
  const content = serviceContent[slug];
  return (
    <section className="service-introduction">
      <div className="container content-grid">
        <div>
          <div className="eyebrow">
            <span />
            The right connection makes a difference
          </div>
          <p className="lead-copy">{content.introduction}</p>
        </div>
        <aside className="audience-note">
          <h3>Who this is for</h3>
          <p>{content.audience}</p>
        </aside>
      </div>
    </section>
  );
}
export function ServiceInformation({
  slug,
  onEnquire,
}: {
  slug: string;
  onEnquire: () => void;
}) {
  const content = serviceContent[slug];
  return (
    <>
      <section className="section how-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span />
                What matters along the way
              </div>
              <h2>A stronger foundation for your next step.</h2>
            </div>
          </div>
          <div className="listing-grid">
            {content.outcomes.map((o) => (
              <div className="capability" key={o.title}>
                <Icon name="check" />
                <h3>{o.title}</h3>
                <p>{o.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span />
                How we work together
              </div>
              <h2>Clear steps. Shared expectations.</h2>
            </div>
          </div>
          <div className="steps">
            {content.process.map((p, i) => (
              <div key={p.title}>
                <span>0{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="enquiry-guide">
        <div className="container content-grid">
          <div>
            <div className="eyebrow">
              <span />
              Make the first conversation count
            </div>
            <h2>
              A few details help us
              <br />
              find the right direction.
            </h2>
            <p>
              Share what you know. If part of your plan is still taking shape,
              include the questions you would like to work through.
            </p>
            <Button variant="contained" color="secondary" onClick={onEnquire}>
              Start your enquiry
            </Button>
          </div>
          <div className="preparation-list">
            {content.preparation.map((p) => (
              <div key={p}>
                <Icon name="check" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container content-grid">
          <div>
            <div className="eyebrow">
              <span />A little more clarity
            </div>
            <h2>
              Before you take
              <br />
              the next step.
            </h2>
            <p style={{ marginTop: 18 }}>
              Useful answers to help you make an informed enquiry.
            </p>
          </div>
          <div className="faq-list service-faq">
            {content.faqs.map((f) => (
              <Accordion key={f.question}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  {f.question}
                </AccordionSummary>
                <AccordionDetails>
                  <p>{f.answer}</p>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
