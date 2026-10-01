export const articleContent: Record<
  string,
  {
    intro: string;
    sections: {
      id: string;
      title: string;
      paragraphs: string[];
      checklist?: string[];
    }[];
    next: string;
    href: string;
  }
> = {
  "hiring-for-lasting-fit": {
    intro:
      "A CV is a useful starting point. It tells you where a candidate has worked and what they have studied. It cannot, on its own, tell you how that person will approach the work your team actually needs done. A clearer hiring process begins with the role, then uses consistent conversations to understand the person.",
    sections: [
      {
        id: "role",
        title: "Describe the work before describing the person",
        paragraphs: [
          "Start with the problem the new hire will help solve. Is the team missing a specialist skill? Are customers waiting too long for a response? Has the business outgrown an informal process? These questions turn a familiar job title into a useful role brief.",
          "Write down the responsibilities the person will own and what a successful first few months could look like. Separate the skills needed on day one from skills that can be developed with support. An unnecessarily long list of requirements can make the role harder to understand.",
        ],
        checklist: [
          "The main responsibilities and expected outcomes",
          "Essential skills, with a reason for each requirement",
          "Location, working pattern, and employment type",
          "A salary range or a clear point for discussing compensation",
        ],
      },
      {
        id: "evidence",
        title: "Look for relevant evidence",
        paragraphs: [
          "Ask candidates to talk through examples of comparable work. What was the situation? What did they do? What changed as a result? Follow-up questions are often more useful than asking someone whether they are a good communicator or a team player.",
          "When a practical exercise is appropriate, keep it relevant, proportionate, and consistent across candidates. Explain what you are assessing and how much time the exercise should take. Avoid asking for substantial unpaid work that the business could use commercially.",
        ],
      },
      {
        id: "expectations",
        title: "Make expectations a two-way conversation",
        paragraphs: [
          "The employer is assessing the candidate, but the candidate is also assessing the role. Explain the team structure, how decisions are made, the level of support available, and the parts of the job that may be challenging.",
          "Give candidates room to describe the environment in which they do their best work. Look for alignment with the actual role, rather than similarity to the people already on the team. Different backgrounds and working styles can add strength when responsibilities and communication are clear.",
        ],
      },
      {
        id: "process",
        title: "Keep the selection process understandable",
        paragraphs: [
          "Before interviews begin, agree on the main assessment criteria and who will make the decision. Use a shared evaluation structure so that feedback stays connected to the role rather than becoming a collection of impressions.",
          "Tell candidates what happens next. A clear process includes the expected stages, who they will meet, any work sample or assessment, and how updates will be communicated. If the timetable changes, let people know.",
        ],
      },
      {
        id: "onboarding",
        title: "Think beyond the offer",
        paragraphs: [
          "A hiring decision is the beginning of a working relationship. Prepare the practical details that help the person start well: access to tools, introductions, a clear first assignment, and a regular opportunity to ask questions.",
          "The same role brief that guided recruitment can help structure early check-ins. Revisit responsibilities and expectations as both sides learn more about the work. A strong connection needs attention after the contract is signed.",
        ],
      },
    ],
    next: "Explore recruitment support",
    href: "/services/recruitment",
  },
  "planning-your-first-shipment": {
    intro:
      "An international shipment involves more than booking space on a vessel or aircraft. The goods need to be described accurately, the route needs to fit the delivery window, and each handover needs a clear owner. You can make the first conversation with a logistics provider much more useful by organizing a few essential details.",
    sections: [
      {
        id: "cargo",
        title: "Begin with the cargo, not just the destination",
        paragraphs: [
          "A useful shipment brief explains what is moving, how much there is, and how it is packed. Include the number of packages or pallets, their dimensions, total weight, and whether the goods need special handling. Estimates can start a conversation, but final pricing and booking may require confirmed measurements.",
          "Tell the provider about fragile contents, temperature requirements, oversized items, or anything that could affect transport eligibility or handling. Do not assume that a product which is easy to sell is also straightforward to ship.",
        ],
        checklist: [
          "A clear product description and quantity",
          "Package count, dimensions, and weight",
          "Collection address and destination contact",
          "Special handling or storage requirements",
        ],
      },
      {
        id: "route",
        title: "Compare the complete journey",
        paragraphs: [
          "The route begins before the port or airport and ends after arrival. Ask whether the proposed service includes collection, origin handling, main transport, destination handling, clearance coordination, and final delivery.",
          "A faster transport mode does not automatically mean a faster overall shipment if collection, paperwork, or onward delivery is not ready. Discuss the required arrival window and ask the provider to explain the assumptions behind the proposed timetable.",
        ],
      },
      {
        id: "documents",
        title: "Agree who prepares each document",
        paragraphs: [
          "Your provider should help identify the information needed for the particular goods and route. Commercial invoices, packing lists, origin documents, permits, and other paperwork may be relevant, depending on the shipment. Requirements vary, so treat a generic checklist as a starting point rather than a final answer.",
          "Assign an owner to each required document and agree when it must be available. Make sure names, quantities, descriptions, and addresses are consistent across the information you supply. Route-specific customs and regulatory requirements should be confirmed with the appropriate qualified provider or authority.",
        ],
      },
      {
        id: "quote",
        title: "Read the quotation as a scope of work",
        paragraphs: [
          "A price is only useful when you know what it covers. Ask the provider to identify included services, excluded costs, the currency, the validity period, and the assumptions used to prepare the quote.",
          "Discuss how changes will be handled if the measured volume differs from your estimate, the collection date moves, or additional storage becomes necessary. The goal is to understand the possible changes before the goods are in transit.",
        ],
      },
      {
        id: "handover",
        title: "Prepare for collection and delivery",
        paragraphs: [
          "Confirm that the goods will be ready, packed appropriately, and accessible at collection. Share practical details such as loading access, opening hours, site restrictions, and the person who can authorize the handover.",
          "At the destination, make sure the receiving party knows what to expect. Keep the reference number and agreed contact channel available. Ask which milestones will be reported and who to contact if a planned handover needs attention.",
        ],
      },
    ],
    next: "Plan your shipment",
    href: "/services/logistics",
  },
  "finding-your-next-workspace": {
    intro:
      "A workspace affects how your team collaborates, how customers experience the business, and how easily everyday work gets done. Before you compare attractive photographs or headline rental prices, define what the space needs to support. That brief makes viewings more productive and trade-offs easier to discuss.",
    sections: [
      {
        id: "needs",
        title: "Map the way your business uses space",
        paragraphs: [
          "Think about a normal working day. How many people are present at the same time? Which activities need quiet? Where do customers, deliveries, or visitors arrive? Do you need meeting rooms, storage, workshop space, or reliable access outside standard office hours?",
          "Plan for the business you operate now, with a realistic view of the next stage. A large space may offer room to grow, but unused space also creates costs and management responsibilities.",
        ],
        checklist: [
          "Typical occupancy and team working patterns",
          "Meeting, storage, reception, and specialist areas",
          "Access for staff, customers, deliveries, and visitors",
          "Essential connectivity, power, and building facilities",
        ],
      },
      {
        id: "location",
        title: "Consider the journey as well as the address",
        paragraphs: [
          "Location is more than a recognizable neighborhood. Consider transport links, parking, delivery access, nearby services, and how staff and customers will reach the property.",
          "Visit at a time that reflects how you expect to use the space. Traffic, noise, access, and the activity around a building can look different from a quiet weekend viewing. Ask the agent or owner about practical restrictions that may affect your business.",
        ],
      },
      {
        id: "costs",
        title: "Build a complete cost picture",
        paragraphs: [
          "The advertised price is one part of the decision. Ask which costs are included and which remain your responsibility, including utilities, service charges, maintenance, fit-out, connectivity, security, and any required deposits.",
          "Keep assumptions visible when comparing properties. One location may include facilities that another requires you to arrange independently. Confirm the details with the provider and seek appropriate professional advice before entering a binding agreement.",
        ],
      },
      {
        id: "viewing",
        title: "Use the viewing to test your brief",
        paragraphs: [
          "Take your requirements with you and work through them in the actual space. Check the layout, natural light, ventilation, accessibility, condition, storage, and the facilities your team will use. Ask permission before taking detailed photographs or measurements.",
          "Record unanswered questions while they are fresh. A consistent checklist helps you compare several properties without allowing one memorable feature to dominate the decision.",
        ],
      },
      {
        id: "handover",
        title: "Understand what happens after you choose",
        paragraphs: [
          "Discuss availability, any preparation or repairs, responsibility for fit-out, and the proposed handover date. Ask who manages the building and how maintenance requests are handled after occupancy.",
          "Before committing, arrange the relevant checks on the property, provider authority, and agreement. Solid Connect can help start the connection; transaction-specific legal, financial, and technical advice should come from the appropriate qualified professionals.",
        ],
      },
    ],
    next: "Explore property opportunities",
    href: "/marketplace/properties",
  },
};
