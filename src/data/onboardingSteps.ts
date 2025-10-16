import { Step } from "@/types/onboarding";

export const onboardingSteps: Step[] = [
  {
    id: 1,
    title: "Platform Selection",
    question: "To help guide you through the registration process, I need to understand your trading needs. What type of entity are you looking to register, and which platform are you interested in?",
    type: "select",
    options: [
      "CME Direct and CME ClearPort",
      "CME Direct Only",
      "CME ClearPort Only"
    ],
    helpText: "Based on your selection, I'll recommend the optimal path for your firm's needs."
  },
  {
    id: 2,
    title: "Entity Registration",
    question: "Let's begin by registering your entity. Please provide your firm's full legal name and jurisdiction of incorporation.",
    type: "text",
    helpText: "This information will be validated against existing records in real-time."
  },
  {
    id: 3,
    title: "Functionality Requirements",
    question: "What functionality will you need enabled? Please select all that apply to your business operations.",
    type: "multiselect",
    options: [
      "CME futures and options trade execution",
      "ClearPort block trade reporting",
      "Viewing market pricing",
      "Real-time market data",
      "Post-trade reporting"
    ],
    helpText: "I'll validate these selections against eligibility requirements and suggest any dependencies."
  },
  {
    id: 4,
    title: "FCM & IB Selection",
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
    id: 5,
    title: "ILA Agreement",
    question: "To proceed, you'll need to review and accept the Information License Agreement (ILA) and Schedule 2b. Have you reviewed these documents?",
    type: "boolean",
    helpText: "Professional Display Device fees are assessed once access to real-time data is enabled. I can explain any complex clauses if needed."
  },
  {
    id: 6,
    title: "Entity Details",
    question: "Please provide your complete entity information including legal name, DBA (if applicable), and parent company details.",
    type: "text",
    helpText: "I can validate parent entity data against corporate registries to expedite KYC review."
  },
  {
    id: 7,
    title: "Entity Type",
    question: "How would you classify your firm's primary business activity?",
    type: "select",
    options: [
      "Proprietary Trader",
      "Broker/Dealer",
      "Investment Fund/Asset Manager",
      "FinTech/Technology Provider",
      "Commercial Hedger",
      "Market Maker"
    ],
    helpText: "This helps us understand your regulatory obligations and platform requirements."
  },
  {
    id: 8,
    title: "Market Segments",
    question: "Which market segments will your firm be active in? Select all that apply.",
    type: "multiselect",
    options: [
      "Futures",
      "Options",
      "FX Products",
      "Energy Products",
      "OTC Interest Rate Swaps",
      "OTC FX Swaps",
      "OTC Commodity Swaps/Forwards"
    ],
    helpText: "Selecting swaps products will trigger additional regulatory compliance steps."
  },
  {
    id: 9,
    title: "Registered Address",
    question: "Please provide your firm's registered office address. Note that P.O. Boxes are not acceptable.",
    type: "text",
    helpText: "I'll use geospatial validation to auto-complete and verify your address."
  },
  {
    id: 10,
    title: "Billing Contacts",
    question: "Please provide details for two billing contacts (Name, Email, Phone Number).",
    type: "text",
    helpText: "I'll send a verification code to validate these contacts in real-time."
  },
  {
    id: 11,
    title: "Regulatory Status",
    question: "Based on your swaps activity, I need to understand your regulatory status. Are you registered with the CFTC or another regulatory body?",
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
    id: 12,
    title: "LEI Verification",
    question: "Please provide your 20-character Legal Entity Identifier (LEI).",
    type: "text",
    conditional: (state) => state.isSwapsSelected,
    helpText: "I'll verify your LEI against the global registry and auto-populate associated details."
  },
  {
    id: 13,
    title: "Canada Reporting Obligations",
    question: "Notwithstanding your entity's domicile, does your entity have reporting obligations to a province in Canada?",
    type: "boolean",
    helpText: "This determines if Canadian provincial requirements apply to your operations."
  },
  {
    id: 14,
    title: "Canada Details",
    question: "Please specify which Canadian province(s) you have obligations in and provide your Canadian Tax ID.",
    type: "text",
    conditional: (state) => state.isCanadaEligible,
    helpText: "Select all applicable provinces and territories."
  },
  {
    id: 15,
    title: "CME Account",
    question: "Do you have an existing CME Group User Account? Please provide the registered email.",
    type: "text",
    helpText: "If no account is found, I can create one for you right here without redirecting."
  },
  {
    id: 16,
    title: "Verification Officers",
    question: "Please provide details for two Verification Officers (VOs) who will oversee compliance.",
    type: "text",
    helpText: "I'll validate these VOs against our registry and resolve any entity mapping issues."
  },
  {
    id: 17,
    title: "User Registration",
    question: "How many users would you like to register initially? Please indicate whether they'll be Active (immediate login) or Passive (notifications only).",
    type: "text",
    helpText: "Most firms start with 3-5 users. You can add more later."
  },
  {
    id: 18,
    title: "User Roles",
    question: "Please assign roles to your users. Available roles include Trader, Broker, User Administrator, and Verification Officer.",
    type: "multiselect",
    options: [
      "Trader",
      "Broker", 
      "User Administrator",
      "Verification Officer",
      "Compliance Officer"
    ],
    helpText: "Most firms assign one Admin and at least two Traders to start."
  },
  {
    id: 19,
    title: "Final Review",
    question: "Let me summarize your registration details for final confirmation. Please review the information carefully.",
    type: "text",
    helpText: "Once confirmed, I'll submit your application to CME Group for processing."
  }
];
