export type ServiceContent = {
  introduction: string;
  audience: string;
  capabilities: string[];
  outcomes: { title: string; text: string }[];
  process: { title: string; text: string }[];
  preparation: string[];
  faqs: { question: string; answer: string }[];
};
export const serviceContent: Record<string, ServiceContent> = {
  recruitment: {
    introduction:
      "A successful hire brings more than the right skills. It brings the right approach, shared expectations, and room to grow. Solid Connect helps employers and candidates find that fit across technical, business, and specialist roles.",
    audience:
      "For employers building dependable teams, professionals exploring their next role, and businesses that need a more focused recruitment process.",
    capabilities: [
      "Source candidates for leadership, technical, business, and specialist positions. Begin with the responsibilities of the role, the experience required, and the results the new hire will own.",
      "Assess capability, relevant experience, and alignment with the team’s working environment. A focused shortlist helps employers spend interview time on the strongest potential matches.",
      "Coordinate hiring needs across a growing team, from role briefs and candidate conversations to interview planning and placement support.",
      "Help job seekers discover relevant openings, understand requirements, submit an application, and follow its progress from their personal dashboard.",
    ],
    outcomes: [
      {
        title: "Quality over volume",
        text: "A smaller, relevant shortlist is more useful than a stack of applications with no context.",
      },
      {
        title: "Network-driven search",
        text: "Connect through active professional relationships as well as advertised opportunities.",
      },
      {
        title: "Built for retention",
        text: "Consider skills, culture, expectations, and growth together, so the connection has a stronger foundation.",
      },
    ],
    process: [
      {
        title: "Define the role",
        text: "Share the responsibilities, skills, location, salary range, and hiring priorities.",
      },
      {
        title: "Build the shortlist",
        text: "Review suitable candidates and agree on the interview process.",
      },
      {
        title: "Find the fit",
        text: "Discuss experience, expectations, and practical working arrangements.",
      },
      {
        title: "Start the next chapter",
        text: "Confirm the offer and plan the handover into the new team.",
      },
    ],
    preparation: [
      "A clear role description and essential skills",
      "Location and on-site, hybrid, or remote arrangements",
      "Employment type and indicative salary range",
      "Preferred start date and interview availability",
    ],
    faqs: [
      {
        question: "Can I use Solid Connect as a job seeker?",
        answer:
          "Yes. Browse Jobs in the marketplace, open a role to review its requirements, and sign in to apply. Your applications and follow-up conversations appear in your dashboard.",
      },
      {
        question: "What should an employer include in a vacancy?",
        answer:
          "Include the job title, responsibilities, essential experience, location, employment type, salary range where available, and how the selection process will work. Clear information helps candidates assess the opportunity.",
      },
      {
        question: "Can I track applicants?",
        answer:
          "Business users can review applications to their own listings and update their status. Applicants can see the resulting progress in their account.",
      },
    ],
  },
  artisans: {
    introduction:
      "Good craftsmanship deserves the right opportunity. Solid Connect helps independent makers and skilled tradespeople connect with customers who value thoughtful work, clear project briefs, and realistic budgets.",
    audience:
      "For homeowners commissioning something personal, businesses sourcing specialist work, and independent makers looking for projects that suit their craft.",
    capabilities: [
      "Connect with craftspeople for bespoke tables, cabinetry, shelving, and other furniture. Discuss materials, dimensions, finish, installation, and the intended use of the piece.",
      "Find skilled tradespeople for electrical, plumbing, metalwork, construction, and related project needs. Clarify the worksite, scope, and any qualifications needed before agreeing to proceed.",
      "Explore makers working with textiles, leather, ceramics, and jewellery. Share your design direction, quantities, and preferred materials to begin a useful conversation.",
      "Turn an idea into a practical commission by agreeing on the design, materials, production stages, delivery arrangements, and how changes will be handled.",
    ],
    outcomes: [
      {
        title: "The right project match",
        text: "Find a maker whose specialty and approach suit the work you have in mind.",
      },
      {
        title: "Clear expectations",
        text: "Discuss scope, materials, budget, and timing before work begins.",
      },
      {
        title: "Respect for the craft",
        text: "Build a direct relationship around the quality and care the project needs.",
      },
    ],
    process: [
      {
        title: "Share your idea",
        text: "Describe the item or service, with dimensions and references if available.",
      },
      {
        title: "Meet the maker",
        text: "Explore the maker’s experience and discuss your requirements.",
      },
      {
        title: "Agree the details",
        text: "Confirm the quote, milestones, delivery, and payment arrangements.",
      },
      {
        title: "Bring it to life",
        text: "Keep the conversation open as the project moves toward completion.",
      },
    ],
    preparation: [
      "A description of the work and its intended use",
      "Measurements, quantities, or reference images",
      "Your preferred materials and finish",
      "An indicative budget and desired completion date",
    ],
    faqs: [
      {
        question: "Which crafts and trades are supported?",
        answer:
          "The service covers woodwork, metalwork, leather, ceramics, textiles, jewellery, electrical work, plumbing, construction, and other independent skilled trades.",
      },
      {
        question: "Can I request a custom piece?",
        answer:
          "Yes. Open a relevant artisan listing and send an enquiry with your design idea, dimensions, materials, budget, and timeline. The provider can follow up through the conversation in your dashboard.",
      },
      {
        question: "Is the displayed price the final project cost?",
        answer:
          "A starting price is an indication only. Custom work needs an agreed scope and a provider quotation. Demo listing prices are illustrative and are not commercial offers.",
      },
    ],
  },
  logistics: {
    introduction:
      "A supply chain is only as strong as the connections between its stages. Solid Connect brings road, air, and sea freight, storage, fulfilment, and last-mile delivery into one coordinated conversation.",
    audience:
      "For businesses moving stock, importers arranging cargo, growing retailers fulfilling orders, and customers planning a shipment that needs careful coordination.",
    capabilities: [
      "Coordinate domestic and international freight by road, air, or sea. Discuss carrier options, collection, documentation, customs coordination, and the delivery handover for your route.",
      "Plan storage, stock handling, inventory management, order processing, and fulfilment around the volume and frequency your business needs.",
      "Arrange the final journey from a hub or warehouse to a store, business, or customer. Confirm delivery windows, handling needs, and the information required at the destination.",
      "Review your current logistics process to identify avoidable handovers, unreliable lead times, capacity gaps, and opportunities to improve cost visibility.",
    ],
    outcomes: [
      {
        title: "Visibility at every handover",
        text: "Know which party is responsible for collection, documentation, transit, and delivery.",
      },
      {
        title: "Options that fit the cargo",
        text: "Choose arrangements based on volume, urgency, handling needs, and the destination.",
      },
      {
        title: "Clear accountability",
        text: "Agree the scope of support and the point of contact before the shipment starts.",
      },
    ],
    process: [
      {
        title: "Describe the shipment",
        text: "Provide the route, goods, weight, volume, and required dates.",
      },
      {
        title: "Review the options",
        text: "Compare transport modes, handling requirements, and the proposed scope.",
      },
      {
        title: "Confirm and prepare",
        text: "Agree the quote and prepare packing, collection, and documentation.",
      },
      {
        title: "Follow the journey",
        text: "Use the shipment reference to check milestones and follow up on delivery.",
      },
    ],
    preparation: [
      "Collection and delivery locations, including contact details",
      "Description, quantity, weight, and dimensions of the goods",
      "Any fragile, temperature-sensitive, or special handling needs",
      "Preferred transport mode and required delivery window",
    ],
    faqs: [
      {
        question: "Can you help with both local and international shipments?",
        answer:
          "The service scope includes domestic and international freight by road, air, and sea, alongside storage, fulfilment, and last-mile delivery. Availability and the final quote depend on the route and cargo.",
      },
      {
        question: "What affects a logistics quotation?",
        answer:
          "The origin, destination, transport mode, chargeable weight or volume, handling needs, storage requirements, and delivery schedule all affect the proposed cost. Include as much detail as possible in your request.",
      },
      {
        question: "Is the tracking map live?",
        answer:
          "The current MVP provides shipment milestones and a labelled example route. The demonstration is not connected to live fleet GPS or a carrier tracking system.",
      },
    ],
  },
  "real-estate": {
    introduction:
      "The right property should fit both your immediate needs and your longer-term plans. Solid Connect connects buyers, sellers, investors, landlords, and tenants with property opportunities and practical support through the process.",
    audience:
      "For people finding a home, businesses choosing their next workspace, property owners seeking tenants, and investors comparing opportunities.",
    capabilities: [
      "Explore residential, commercial, and investment properties. Clarify the brief, compare suitable opportunities, arrange conversations, and discuss the next steps with the relevant agent or owner.",
      "Connect landlords with potential tenants and help customers identify spaces that suit their needs. Discuss screening, commercial terms, handover, and occupancy expectations.",
      "Discuss ongoing support for rent collection, maintenance coordination, tenant communication, and the everyday work involved in managing a property.",
      "Bring together location, pricing, use, and portfolio considerations to make property conversations more informed. Specialist legal, title, and financial checks should be arranged separately where required.",
    ],
    outcomes: [
      {
        title: "Start with the right brief",
        text: "Location, budget, space, and intended use guide the search.",
      },
      {
        title: "Understand the full picture",
        text: "Ask about recurring costs, maintenance, availability, and practical access.",
      },
      {
        title: "Keep decisions clear",
        text: "Confirm terms and complete the appropriate checks before making a commitment.",
      },
    ],
    process: [
      {
        title: "Set your priorities",
        text: "Choose your budget, preferred areas, property type, and essential features.",
      },
      {
        title: "Explore and compare",
        text: "Review listing details and shortlist spaces that meet your needs.",
      },
      {
        title: "Arrange a viewing",
        text: "Meet the agent or owner, ask questions, and inspect the property.",
      },
      {
        title: "Agree the next steps",
        text: "Confirm documentation, professional checks, terms, and handover arrangements.",
      },
    ],
    preparation: [
      "Your preferred area and buying, renting, or commercial purpose",
      "Budget and expected ongoing costs",
      "Space, bedroom, parking, and furnishing requirements",
      "Moving date and availability for viewings",
    ],
    faqs: [
      {
        question: "Can I list a property that I own?",
        answer:
          "Yes. Create an account, choose Post a listing, select Properties, and provide the location, price, description, and image. The listing is reviewed before it appears publicly.",
      },
      {
        question: "How do I arrange a viewing?",
        answer:
          "Open a property listing and choose Schedule a viewing. Include your preferred date and time so the provider can respond with availability.",
      },
      {
        question: "What should I confirm before committing?",
        answer:
          "Ask about availability, total costs, the identity and authority of the provider, maintenance responsibilities, and the documents relevant to the transaction. Obtain qualified advice for title, contract, tax, or investment questions.",
      },
    ],
  },
  distribution: {
    introduction:
      "Getting products into the right hands takes more than transport. Solid Connect helps connect manufacturers, suppliers, distributors, and retailers through practical procurement and distribution arrangements.",
    audience:
      "For manufacturers expanding their channels, retailers restocking essential products, and businesses sourcing supplies in meaningful quantities.",
    capabilities: [
      "Source and coordinate bulk supply across FMCG, electronics, building materials, and industrial goods. Discuss product specifications, quantities, availability, warehousing, and fulfilment.",
      "Explore distributor and retailer relationships that fit the product and market. Clarify partner expectations, service areas, onboarding needs, and the support required to keep the channel active.",
      "Coordinate store replenishment or direct-to-customer fulfilment, including delivery arrangements, order documentation, and the agreed handling of returns.",
      "Review stock movement, demand patterns, reorder timing, and storage needs. A practical planning conversation can help identify where inventory is moving too slowly or supply is becoming unreliable.",
    ],
    outcomes: [
      {
        title: "A clearer route to market",
        text: "Connect the supplier, channel, and delivery plan around the customer you need to reach.",
      },
      {
        title: "Practical procurement",
        text: "Compare specifications, minimum order quantities, lead times, and terms together.",
      },
      {
        title: "Better stock conversations",
        text: "Plan replenishment around real needs rather than last-minute shortages.",
      },
    ],
    process: [
      {
        title: "Share the requirement",
        text: "Specify the product, quality requirements, quantities, and destination.",
      },
      {
        title: "Find the supply fit",
        text: "Discuss suitable suppliers, stock availability, and minimum order quantities.",
      },
      {
        title: "Agree a quotation",
        text: "Confirm product specifications, payment terms, delivery, and lead times.",
      },
      {
        title: "Coordinate fulfilment",
        text: "Track the agreed supply process and plan the next replenishment.",
      },
    ],
    preparation: [
      "Product name, category, specifications, or an approved equivalent",
      "Order quantity and expected repeat frequency",
      "Delivery location and required date",
      "Any packaging, certification, or procurement requirements",
    ],
    faqs: [
      {
        question: "Can I place a bulk order through the marketplace?",
        answer:
          "The MVP is designed for B2B enquiries and quotations. Use a product listing to describe your order, then agree availability, specifications, price, and delivery with the supplier.",
      },
      {
        question: "What does minimum order quantity mean?",
        answer:
          "It is the smallest quantity the supplier is prepared to supply under the listed arrangement. Quantities and prices should be confirmed in a quotation, especially for demonstration listings.",
      },
      {
        question: "Which product categories can I enquire about?",
        answer:
          "The company profile covers FMCG, electronics, building materials, and industrial products. You can also describe agricultural goods, machinery, or another business supply requirement for assessment.",
      },
    ],
  },
  "sales-marketing": {
    introduction:
      "Growth works better when the message, the sales process, and the follow-up agree. Solid Connect focuses on helping businesses connect with the right audience and build a more consistent path from interest to conversation.",
    audience:
      "For B2B and B2C businesses clarifying their offer, launching a campaign, improving lead quality, or strengthening the handover between marketing and sales.",
    capabilities: [
      "Shape audience targeting and demand-generation activity around your ideal customer. Discuss relevant channels, the offer, lead qualification, and how enquiries will be followed up.",
      "Develop outbound approaches, sales materials, follow-up sequences, and team guidance. Make the next action clear for both the sales team and the prospective customer.",
      "Align your website, content, campaigns, and social presence around a consistent value proposition. Begin with what the customer needs to understand and why the offer matters.",
      "Review CRM setup, reporting, lead handover, and operating processes so marketing and sales can work from a clearer shared view of activity and outcomes.",
    ],
    outcomes: [
      {
        title: "A clearer commercial goal",
        text: "Define the audience and outcome before choosing the channel or campaign.",
      },
      {
        title: "Connected execution",
        text: "Bring messaging, demand generation, and follow-up into the same plan.",
      },
      {
        title: "Useful measurement",
        text: "Agree meaningful measures such as qualified conversations and sales progress, without promising a guaranteed result.",
      },
    ],
    process: [
      {
        title: "Understand the business",
        text: "Explain your offer, customers, market, and current sales process.",
      },
      {
        title: "Set the objectives",
        text: "Choose the outcomes that matter and the obstacles to address first.",
      },
      {
        title: "Shape the approach",
        text: "Agree the service scope, channels, budget, timing, and measurement plan.",
      },
      {
        title: "Review and improve",
        text: "Use the results to refine the message, activity, and follow-up process.",
      },
    ],
    preparation: [
      "Your business, offer, and target customer",
      "The main commercial challenge and desired outcome",
      "Current channels, website, or campaign activity",
      "Budget range, timeline, and available internal resources",
    ],
    faqs: [
      {
        question: "Do I need a marketing plan before getting in touch?",
        answer:
          "No. Start with your business, customers, and the challenge you want to solve. The initial conversation can help clarify priorities before a detailed scope is agreed.",
      },
      {
        question: "Can you help with sales as well as marketing?",
        answer:
          "Yes. The service scope includes lead generation, sales enablement, outbound activity, brand positioning, digital marketing, and revenue operations.",
      },
      {
        question: "Are leads or revenue guaranteed?",
        answer:
          "No specific result should be assumed from the website. Objectives, deliverables, measurement, and responsibilities need to be agreed for the individual engagement.",
      },
    ],
  },
  "import-export": {
    introduction:
      "International trade depends on several parties getting the details right. Solid Connect helps manufacturers, suppliers, and buyers coordinate sourcing, shipping, documentation, and customs support across a planned trade journey.",
    audience:
      "For businesses sourcing from international suppliers, manufacturers exploring export opportunities, and buyers who need support coordinating a cross-border order.",
    capabilities: [
      "Identify potential manufacturers and suppliers, discuss specifications and minimum order quantities, and coordinate the checks and commercial conversations required for your purchase.",
      "Bring together collection, air or sea freight, insurance discussions, and delivery arrangements. Clarify which parts of the journey are included in the proposed scope.",
      "Coordinate the customs and regulatory information needed for the route and goods. Product classification, permits, duties, and other requirements need route-specific assessment.",
      "Support the preparation and coordination of trade documents such as invoices, packing lists, certificates of origin, and other documents relevant to the shipment.",
    ],
    outcomes: [
      {
        title: "A coordinated trade journey",
        text: "Connect sourcing, shipment preparation, transport, and delivery planning.",
      },
      {
        title: "Visibility of responsibilities",
        text: "Understand who handles documentation, shipping, clearance, and each handover.",
      },
      {
        title: "Fewer assumptions",
        text: "Confirm specifications, quantity, terms, and required checks before committing to a supplier.",
      },
    ],
    process: [
      {
        title: "Define the trade request",
        text: "Describe the goods, origin, destination, quantity, and intended timing.",
      },
      {
        title: "Assess the route",
        text: "Review supplier options, shipping needs, and required documentation.",
      },
      {
        title: "Agree the quotation",
        text: "Confirm scope, responsibilities, itemized costs, and preparation steps.",
      },
      {
        title: "Coordinate the shipment",
        text: "Follow documentation, transit, customs, and the delivery handover.",
      },
    ],
    preparation: [
      "Whether you are importing or exporting",
      "Origin and destination countries",
      "Product specification, quantity, weight, and volume",
      "Supplier information, desired delivery date, and available documents",
    ],
    faqs: [
      {
        question: "Can you help me find a supplier?",
        answer:
          "Sourcing and supplier vetting are part of the service scope. Include the product specification, quantity, quality expectations, and target destination in your request.",
      },
      {
        question: "Can you quote before all shipping details are final?",
        answer:
          "You can start an enquiry with estimated information. A final quotation will need the relevant product, quantity, route, handling, and documentation details to be confirmed.",
      },
      {
        question: "Are customs duties included in the displayed prices?",
        answer:
          "Demo listing prices are illustrative. Duties, taxes, permits, shipping, and other costs must be discussed and itemized in a route-specific quotation. Ask the provider to explain what is included and excluded.",
      },
    ],
  },
};
