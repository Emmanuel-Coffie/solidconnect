export const services = [
  {
    slug: "recruitment",
    name: "Recruitment",
    headline: "Connecting talent with opportunity.",
    description: "Find and hire the people who move your business forward.",
    image: "photo-1653566031535-bcf33e1c2893",
    icon: "people",
    color: "#1668e8",
    category: "Jobs",
    cta: "Find talent",
    capabilities: [
      "Executive & specialist search",
      "Candidate screening",
      "Team recruitment",
      "Career opportunities",
    ],
  },
  {
    slug: "artisans",
    name: "Artisans & Makers",
    headline: "Real craftsmanship. Real opportunities.",
    description: "Connect skilled hands with people who value their craft.",
    image: "photo-1504148455328-c376907d081c",
    icon: "handyman",
    color: "#ff681c",
    category: "Artisans",
    cta: "Request a project",
    capabilities: [
      "Woodwork & furniture",
      "Electrical & plumbing",
      "Textiles & leather",
      "Custom commissions",
    ],
  },
  {
    slug: "logistics",
    name: "Logistics",
    headline: "Get your goods where they need to be.",
    description: "Freight, fulfilment and delivery. Connected from end to end.",
    image: "photo-1578575437130-527eed3abbec",
    icon: "shipping",
    color: "#008b83",
    category: "Logistics",
    cta: "Request a quote",
    capabilities: [
      "Freight forwarding",
      "Warehousing & fulfilment",
      "Last-mile delivery",
      "Supply chain consulting",
    ],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    headline: "Properties for every goal.",
    description: "Discover a place to live, work, or build your next chapter.",
    image: "photo-1600607687920-4e2a09cf159d",
    icon: "home",
    color: "#7757d6",
    category: "Properties",
    cta: "Schedule a viewing",
    capabilities: [
      "Sales & acquisitions",
      "Leasing & tenant placement",
      "Property management",
      "Market advisory",
    ],
  },
  {
    slug: "distribution",
    name: "Distribution",
    headline: "A stronger link to your market.",
    description: "Reliable supply networks that keep your business moving.",
    image: "photo-1586528116311-ad8dd3c8310d",
    icon: "inventory",
    color: "#e14d45",
    category: "Products",
    cta: "Request supply",
    capabilities: [
      "Wholesale & bulk distribution",
      "Channel development",
      "Retail fulfilment",
      "Inventory & demand planning",
    ],
  },
  {
    slug: "sales-marketing",
    name: "Sales & Marketing",
    headline: "Strategies to grow your brand.",
    description: "Turn your next big ambition into measurable business growth.",
    image: "photo-1573167101669-476636b96cea",
    icon: "chart",
    color: "#b98500",
    category: "Business Services",
    cta: "Get a strategy call",
    capabilities: [
      "Lead generation",
      "Sales enablement",
      "Digital marketing & positioning",
      "Revenue operations",
    ],
  },
  {
    slug: "import-export",
    name: "Import & Export",
    headline: "Trade globally. Connect locally.",
    description:
      "Take your business across borders with a partner by your side.",
    image: "photo-1494412519320-aa613dfb7738",
    icon: "globe",
    color: "#1668e8",
    category: "Products",
    cta: "Request a trade quote",
    capabilities: [
      "Sourcing & supplier vetting",
      "International logistics",
      "Customs clearance",
      "Trade documentation",
    ],
  },
] as const;
export type Category =
  | "Jobs"
  | "Artisans"
  | "Properties"
  | "Products"
  | "Logistics"
  | "Business Services";
export type Listing = {
  id: string;
  title: string;
  category: Category;
  location: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  provider: string;
  ownerId: string;
  status: "published" | "pending" | "rejected" | "suspended";
  featured: boolean;
  verified: boolean;
  createdAt: string;
  details: Record<string, string>;
  demo?: boolean;
};
export const photo = (id: string, _width = 900) => {
  void _width;
  if (id === "photo-1504148455328-c376907d081c") return "/images/artisan.png";
  if (id.startsWith("https://res.cloudinary.com/")) return id;
  return id.startsWith("/") ? id : `/images/${id}.jpg`;
};
const base = {
  ownerId: "demo-business",
  status: "published" as const,
  featured: true,
  verified: true,
  createdAt: "2026-09-25T09:00:00Z",
  demo: true,
};
export const seedListings: Listing[] = [
  {
    ...base,
    id: "modern-villa",
    title: "A new perspective on city living",
    category: "Properties",
    location: "East Legon, Accra",
    price: 4500,
    unit: "/ month",
    image: "photo-1600607687920-4e2a09cf159d",
    provider: "Accra Living",
    description:
      "A bright, contemporary three-bedroom residence with a private garden, generous living spaces and convenient access to the city. Arrange a viewing to explore the space.",
    details: {
      Bedrooms: "3",
      Bathrooms: "3",
      Area: "220 m²",
      Type: "Rent",
      Furnished: "Yes",
    },
  },
  {
    ...base,
    id: "custom-furniture",
    title: "Furniture made for your space",
    category: "Artisans",
    location: "Osu, Accra",
    price: 850,
    unit: "starting from",
    image: "photo-1504148455328-c376907d081c",
    provider: "Kofi Mensah Studio",
    description:
      "Thoughtfully crafted furniture, made to order in locally sourced hardwood. Share your dimensions, inspiration and budget to start a conversation.",
    details: {
      Specialty: "Woodwork",
      Experience: "8 years",
      Availability: "Open for projects",
    },
  },
  {
    ...base,
    id: "freight",
    title: "Your cargo. Connected to the world.",
    category: "Logistics",
    location: "Tema, Ghana",
    price: 0,
    unit: "Request a quote",
    image: "photo-1578575437130-527eed3abbec",
    provider: "Coastline Freight",
    description:
      "Sea freight coordination from Tema to international destinations, including documentation and door-to-port handling. Pricing depends on weight, volume and route.",
    details: {
      Mode: "Sea freight",
      Origin: "Tema",
      Destination: "International",
    },
  },
  {
    ...base,
    id: "frontend-developer",
    title: "Frontend Developer",
    category: "Jobs",
    location: "Accra, Ghana",
    price: 8000,
    unit: "/ month",
    image: "photo-1653566031535-bcf33e1c2893",
    provider: "Meridian Digital",
    description:
      "Build accessible digital products with a collaborative team. We are looking for React and TypeScript experience, a thoughtful approach to UI, and a strong sense of ownership.",
    details: {
      Type: "Full-time",
      Experience: "Mid-level",
      Workplace: "Hybrid",
      Industry: "Technology",
    },
  },
  {
    ...base,
    id: "building-materials",
    title: "Build with a reliable supply partner",
    category: "Products",
    location: "Kumasi, Ghana",
    price: 95,
    unit: "/ bag",
    image: "photo-1586528116311-ad8dd3c8310d",
    provider: "Asante Building Supply",
    description:
      "Bulk building materials for commercial and residential projects. Enquire about availability, delivery schedules and quantity-based pricing.",
    details: {
      Category: "Building materials",
      "Minimum order": "100 bags",
      Delivery: "Nationwide",
    },
  },
  {
    ...base,
    id: "brand-strategy",
    title: "Give your next chapter a clear direction",
    category: "Business Services",
    location: "Accra, Ghana",
    price: 1200,
    unit: "starting from",
    image: "photo-1573167101669-476636b96cea",
    provider: "Forward Studio",
    description:
      "A practical brand strategy consultation for growing businesses. Align your positioning, audience, messaging and next campaign.",
    details: {
      Service: "Brand strategy",
      Format: "Online or in person",
      Duration: "90 minutes",
    },
  },
  {
    ...base,
    id: "office-space",
    title: "Room for your business to grow",
    category: "Properties",
    location: "Airport City, Accra",
    price: 6500,
    unit: "/ month",
    image: "photo-1497366754035-f200968a6e72",
    provider: "Accra Living",
    description:
      "Flexible commercial office space with natural light, shared meeting rooms and parking. Book a viewing to discuss your team’s needs.",
    details: { Type: "Commercial", Area: "160 m²", Parking: "Available" },
  },
  {
    ...base,
    id: "operations-manager",
    title: "Operations Manager",
    category: "Jobs",
    location: "Tema, Ghana",
    price: 10000,
    unit: "/ month",
    image: "photo-1494412519320-aa613dfb7738",
    provider: "Coastline Freight",
    description:
      "Lead a growing logistics operations team. Coordinate suppliers, monitor service performance and improve everyday processes.",
    details: {
      Type: "Full-time",
      Experience: "Senior",
      Workplace: "On-site",
      Industry: "Logistics",
    },
  },
];
export const plans = [
  {
    id: "starter",
    name: "Starter",
    monthly: 0,
    yearly: 0,
    description: "Make your first connection.",
    features: [
      "Create your profile",
      "Explore the marketplace",
      "Save opportunities",
      "Send enquiries",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    monthly: 99,
    yearly: 950,
    description: "Create more room to grow.",
    features: [
      "Everything in Starter",
      "Featured listing credit",
      "Business profile",
      "Priority enquiry support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: 0,
    yearly: 0,
    description: "A partnership built around you.",
    features: [
      "Dedicated account support",
      "Team onboarding",
      "Custom service packages",
      "Consolidated reporting",
    ],
  },
];
export const articles = [
  {
    slug: "hiring-for-lasting-fit",
    category: "Recruitment",
    title: "Look beyond the CV. Hire for lasting fit.",
    summary: "A practical starting point for your next great hire.",
    image: services[0].image,
  },
  {
    slug: "planning-your-first-shipment",
    category: "Logistics",
    title: "Your first international shipment, explained.",
    summary: "The questions to ask before your goods leave the warehouse.",
    image: services[2].image,
  },
  {
    slug: "finding-your-next-workspace",
    category: "Real Estate",
    title: "A workspace that works for your business.",
    summary:
      "Consider your team, your customers, and your next stage of growth.",
    image: services[3].image,
  },
];
export const money = (value: number) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(value);
