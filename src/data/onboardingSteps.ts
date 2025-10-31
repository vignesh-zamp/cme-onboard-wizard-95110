import { Step } from "@/types/onboarding";

export const onboardingSteps: Step[] = [
  {
    id: 1,
    title: "Business Profile",
    question: "Welcome! To provide you with the best recommendation, I need to understand your business. What type of entity are you?",
    type: "select",
    options: [
      "Proprietary Trading Firm",
      "Broker/Dealer",
      "Investment Fund/Asset Manager",
      "FinTech/Technology Provider",
      "Commercial Hedger",
      "Market Maker",
      "Individual/Retail Investor"
    ],
    helpText: "This helps me understand your regulatory obligations and business model."
  },
  {
    id: 2,
    title: "Geographic Scope",
    question: "What is your firm's primary jurisdiction and cross-border operations?",
    type: "country-dropdown",
    helpText: "This helps determine applicable regulatory requirements and reporting obligations."
  },
  {
    id: 3,
    title: "Trading Activities",
    question: "What are your primary trading and operational activities? Select all that apply.",
    type: "multiselect",
    options: [
      "Execute futures and options trades",
      "Clear trades through FCM",
      "Report block trades",
      "View real-time market data and pricing",
      "Execute OTC swaps",
      "Provide liquidity/market making",
      "Risk management and hedging"
    ],
    helpText: "Understanding your activities helps me recommend the right platform and features."
  },
  {
    id: 4,
    title: "Product Interests",
    question: "Which market segments and products are you interested in? Select all that apply.",
    type: "multiselect",
    options: [
      "Exchange-traded Futures",
      "Exchange-traded Options",
      "FX Products",
      "Energy Products",
      "Interest Rate Products",
      "OTC Interest Rate Swaps",
      "OTC FX Swaps",
      "OTC Commodity Swaps/Forwards"
    ],
    helpText: "This helps determine which platform capabilities you'll need."
  },
  {
    id: 5,
    title: "Platform Recommendation",
    question: "Based on your profile, here's my recommendation for the optimal platform setup:",
    type: "select",
    options: [
      "Accept Recommendation",
      "I'd like to discuss alternatives"
    ],
    helpText: "I've analyzed your needs and will explain why this setup is ideal for your firm."
  },
  {
    id: 6,
    title: "Entity Registration",
    question: "Excellent! Now let's register your entity. Please provide your firm's full legal name and jurisdiction of incorporation.",
    type: "entity-registration",
    helpText: "This information will be validated against existing corporate registries in real-time."
  },
  {
    id: 7,
    title: "FCM & IB Relationship",
    question: "Do you currently have a relationship with a Futures Commission Merchant (FCM) or Introducing Broker (IB)?",
    type: "select",
    options: [
      "Yes, I have an existing FCM relationship",
      "Yes, I have an existing IB relationship",
      "No, I need assistance selecting one"
    ],
    helpText: "I can provide a curated list of suitable partners based on your profile."
  },
  {
    id: 8,
    title: "ILA Agreement",
    question: "To proceed, you'll need to review and accept the Information License Agreement (ILA) and Schedule 2b.\n\n📄 Review Documents:\n• <a href=\"https://www.cmegroup.com/market-data/files/information-license-agreement.pdf\" target=\"_blank\" rel=\"noopener noreferrer\">Information License Agreement (ILA)</a>\n• <a href=\"https://www.cmegroup.com/market-data/files/schedule-2b.pdf\" target=\"_blank\" rel=\"noopener noreferrer\">Schedule 2b - Professional Display Device Fees</a>\n\nHave you reviewed these documents and are you ready to proceed?",
    type: "boolean",
    helpText: "Professional Display Device fees are assessed once access to real-time data is enabled. I can explain any complex clauses if needed."
  },
  {
    id: 9,
    title: "Entity Details",
    question: "Please provide your complete entity information including legal name, DBA (if applicable), direct parent, and legal ultimate parent.",
    type: "multifield",
    inputFields: [
      { name: "legalName", placeholder: "Legal Entity Name", type: "text" },
      { name: "dba", placeholder: "DBA (if applicable)", type: "text" },
      { name: "directParent", placeholder: "Direct Parent Entity", type: "text" },
      { name: "legalUltimateParent", placeholder: "Legal Ultimate Parent", type: "text" }
    ],
    helpText: "I can validate parent entity data against corporate registries to ensure accuracy."
  },
  {
    id: 10,
    title: "LEI Validation",
    question: "Please provide your 20-character Legal Entity Identifier (LEI) for verification.",
    type: "text",
    helpText: "I'll verify your LEI against the global registry and display your company information."
  },
  {
    id: 11,
    title: "Registered Address",
    question: "Please provide your firm's registered office address. Note that P.O. Boxes are not acceptable.",
    type: "text",
    helpText: "I'll use geospatial validation to auto-complete and verify your address as you type."
  },
  {
    id: 12,
    title: "Billing Contacts",
    question: "Please provide details for two billing contacts. For each contact, provide: Name, Email, Phone Number.",
    type: "text",
    helpText: "Format: Name1, Email1, Phone1 | Name2, Email2, Phone2. I'll send verification codes to validate these contacts."
  },
  {
    id: 13,
    title: "Regulatory Status",
    question: "Based on your selected activities, I need to understand your regulatory status. Are you registered with the CFTC or another regulatory body?",
    type: "select",
    options: [
      "CFTC Registered - Swap Dealer (SD)",
      "CFTC Registered - Major Swap Participant (MSP)",
      "Non-SD/MSP Counterparty",
      "Not Applicable"
    ],
    conditional: (state) => state.isSwapsSelected,
    helpText: "This information is required for CFTC reporting compliance."
  },
  {
    id: 14,
    title: "LEI Verification",
    question: "Please provide your 20-character Legal Entity Identifier (LEI).",
    type: "text",
    conditional: (state) => state.isSwapsSelected,
    helpText: "I'll verify your LEI against the global registry and auto-populate associated details like legal name and domicile."
  },
  {
    id: 15,
    title: "Canada Reporting Obligations",
    question: "Notwithstanding your entity's domicile, does your entity have reporting obligations to a province in Canada?",
    type: "boolean",
    helpText: "This determines if Canadian provincial requirements apply to your operations."
  },
  {
    id: 16,
    title: "Canada Details",
    question: "Please specify which Canadian province(s) you have obligations in and provide your Canadian Tax ID.",
    type: "text",
    conditional: (state) => state.isCanadaEligible,
    helpText: "Select all applicable provinces and territories. You can specify multiple provinces."
  },
  {
    id: 17,
    title: "CME Account",
    question: "Do you have an existing CME Group User Account? Please provide the registered email address.",
    type: "text",
    helpText: "If no account is found, I can create one for you right here without redirecting to another page."
  },
  {
    id: 18,
    title: "Verification Officers",
    question: "Please provide details for two Verification Officers (VOs) who will oversee compliance. For each: Name, Email, Phone.",
    type: "text",
    helpText: "Format: Name1, Email1, Phone1 | Name2, Email2, Phone2. I'll validate these VOs against our registry."
  },
  {
    id: 19,
    title: "User Registration",
    question: "How many users would you like to register initially? Please specify the number of Active users (immediate login) and Passive users (notifications only).",
    type: "text",
    helpText: "Most firms start with 3-5 total users. You can add more users later at any time."
  },
  {
    id: 20,
    title: "User Roles",
    question: "Please assign roles to your users. Select all roles you'll need to configure.",
    type: "multiselect",
    options: [
      "Trader",
      "Broker", 
      "User Administrator",
      "Verification Officer",
      "Compliance Officer"
    ],
    helpText: "Most firms assign one Admin and at least two Traders to start. I'll help you configure each user's specific role."
  },
  {
    id: 21,
    title: "Final Review",
    question: "Perfect! Let me provide a comprehensive summary of your registration for final confirmation.",
    type: "text",
    helpText: "Please review all information carefully. Once confirmed, I'll submit your application to CME Group for processing."
  }
];
