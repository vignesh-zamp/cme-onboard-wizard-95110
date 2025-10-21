# CME Group Onboarding Flow Documentation

## Overview
This document outlines the complete conversational onboarding flow for CME Group platform registration. The flow is designed as an AI-assisted chatbot that guides users through entity registration, platform selection, and compliance setup.

---

## Step-by-Step Flow

### Step 1: Business Profile
**Type:** Single Select  
**Question:** "Welcome! To provide you with the best recommendation, I need to understand your business. What type of entity are you?"

**Options:**
- Proprietary Trading Firm
- Broker/Dealer
- Investment Fund/Asset Manager
- FinTech/Technology Provider
- Commercial Hedger
- Market Maker
- Individual/Retail Investor

**Help Text:** "This helps me understand your regulatory obligations and business model."

**Input Method:** Quick option buttons

---

### Step 2: Geographic Scope
**Type:** Multi-field Input  
**Question:** "What is your firm's primary jurisdiction and cross-border operations?"

**Input Fields:**
1. Primary Jurisdiction (text)
2. Cross-border Operations (text)

**Help Text:** "This helps determine applicable regulatory requirements and reporting obligations."

---

### Step 3: Trading Activities
**Type:** Multi-select  
**Question:** "What are your primary trading and operational activities? Select all that apply."

**Options:**
- Execute futures and options trades
- Clear trades through FCM
- Report block trades
- View real-time market data and pricing
- Execute OTC swaps
- Provide liquidity/market making
- Risk management and hedging

**Help Text:** "Understanding your activities helps me recommend the right platform and features."

**Input Method:** Checkbox selection

**Note:** If "Execute OTC swaps" is selected, `isSwapsSelected` flag is set to true, triggering conditional steps later.

---

### Step 4: Product Interests
**Type:** Multi-select  
**Question:** "Which market segments and products are you interested in? Select all that apply."

**Options:**
- Exchange-traded Futures
- Exchange-traded Options
- FX Products
- Energy Products
- Interest Rate Products
- OTC Interest Rate Swaps
- OTC FX Swaps
- OTC Commodity Swaps/Forwards

**Help Text:** "This helps determine which platform capabilities you'll need."

**Input Method:** Checkbox selection

---

### Step 5: Platform Recommendation
**Type:** Information Display + Select  
**Question:** "Based on your profile, here's my recommendation for the optimal platform setup:"

**Display:** AI-generated platform recommendation with:
- Recommended platform name
- Detailed reasoning (bullet points)
- Confidence level indicator

**Options:**
- Accept Recommendation
- I'd like to discuss alternatives

**Help Text:** "I've analyzed your needs and will explain why this setup is ideal for your firm."

**Input Method:** Quick option buttons

---

### Step 6: Entity Registration
**Type:** Multi-field Input  
**Question:** "Excellent! Now let's register your entity. Please provide your firm's details."

**Input Fields:**
1. Full Legal Name (text)
2. Jurisdiction of Incorporation (text)

**Help Text:** "This information will be validated against existing corporate registries in real-time."

**Validation:** Real-time corporate registry validation

---

### Step 7: FCM & IB Relationship
**Type:** Single Select  
**Question:** "Do you currently have a relationship with a Futures Commission Merchant (FCM) or Introducing Broker (IB)?"

**Options:**
- Yes, I have an existing FCM relationship
- Yes, I have an existing IB relationship
- No, I need assistance selecting one

**Help Text:** "I can provide a curated list of suitable partners based on your profile."

**Input Method:** Quick option buttons

---

### Step 8: ILA Agreement Review
**Type:** Boolean (Yes/No)  
**Question:** "To proceed, you'll need to review and accept the Information License Agreement (ILA) and Schedule 2b.

📄 Review Documents:
• [Information License Agreement (ILA)](https://www.cmegroup.com/market-data/files/information-license-agreement.pdf)
• [Schedule 2b - Professional Display Device Fees](https://www.cmegroup.com/market-data/files/schedule-2b.pdf)

Have you reviewed these documents and are you ready to proceed?"

**Help Text:** "Professional Display Device fees are assessed once access to real-time data is enabled. I can explain any complex clauses if needed."

**Input Method:** Quick option buttons (Yes/No)

**Documents:** Clickable hyperlinks provided inline

---

### Step 9: Entity Details
**Type:** Multi-field Input  
**Question:** "Please provide your complete entity information."

**Input Fields:**
1. Legal Name (text)
2. DBA (if applicable) (text)
3. Direct Parent (text)
4. Legal Ultimate Parent (text)

**Help Text:** "I can validate parent entity data against corporate registries to ensure accuracy."

**Validation:** Corporate registry validation for parent entities

---

### Step 10: Registered Address
**Type:** Address Input with Geospatial Validation  
**Question:** "Please provide your firm's registered office address. Note that P.O. Boxes are not acceptable."

**Input Method:** 
- Search box with Mapbox geocoding
- Interactive map display showing selected location
- Auto-complete suggestions as user types

**Help Text:** "I'll use geospatial validation to auto-complete and verify your address as you type."

**Validation:** 
- Geospatial validation
- P.O. Box rejection
- Real-time address verification

---

### Step 11: Billing Contacts
**Type:** Multi-field Input  
**Question:** "Please provide details for two billing contacts."

**Input Fields (Contact 1):**
1. Name (text)
2. Email (email)
3. Phone Number (tel)

**Input Fields (Contact 2):**
4. Name (text)
5. Email (email)
6. Phone Number (tel)

**Help Text:** "I'll send verification codes to validate these contacts."

**Validation:** Email and phone verification codes sent

---

### Step 12: Regulatory Status ⚠️ CONDITIONAL
**Type:** Single Select  
**Question:** "Based on your selected activities, I need to understand your regulatory status. Are you registered with the CFTC or another regulatory body?"

**Condition:** Only shown if `isSwapsSelected = true` (from Step 3)

**Options:**
- CFTC Registered - Swap Dealer (SD)
- CFTC Registered - Major Swap Participant (MSP)
- Non-SD/MSP Counterparty
- Not Applicable

**Help Text:** "This information is required for CFTC reporting compliance."

**Input Method:** Quick option buttons

---

### Step 13: LEI Verification ⚠️ CONDITIONAL
**Type:** Single-field Input  
**Question:** "Please provide your 20-character Legal Entity Identifier (LEI)."

**Condition:** Only shown if `isSwapsSelected = true` (from Step 3)

**Input Fields:**
1. LEI (text, 20 characters)

**Help Text:** "I'll verify your LEI against the global registry and auto-populate associated details like legal name and domicile."

**Validation:** 
- LEI format validation (20 characters)
- Global LEI registry lookup
- Auto-population of entity details from registry

---

### Step 14: Canada Reporting Obligations
**Type:** Boolean (Yes/No)  
**Question:** "Notwithstanding your entity's domicile, does your entity have reporting obligations to a province in Canada?"

**Help Text:** "This determines if Canadian provincial requirements apply to your operations."

**Input Method:** Quick option buttons (Yes/No)

**Note:** If Yes, sets `isCanadaEligible = true`, triggering Step 15

---

### Step 15: Canada Details ⚠️ CONDITIONAL
**Type:** Multi-field Input  
**Question:** "Please provide your Canadian reporting details."

**Condition:** Only shown if `isCanadaEligible = true` (from Step 14)

**Input Fields:**
1. Province(s) (text)
2. Canadian Tax ID (text)

**Help Text:** "Select all applicable provinces and territories. You can specify multiple provinces."

---

### Step 16: CME Account
**Type:** Single-field Input  
**Question:** "Do you have an existing CME Group User Account? Please provide the registered email address."

**Input Fields:**
1. Email Address (email)

**Help Text:** "If no account is found, I can create one for you right here without redirecting to another page."

**Validation:** 
- Email format validation
- CME account lookup
- Auto-account creation if not found

---

### Step 17: Verification Officers
**Type:** Multi-field Input  
**Question:** "Please provide details for two Verification Officers (VOs) who will oversee compliance."

**Input Fields (VO 1):**
1. Name (text)
2. Email (email)
3. Phone (tel)

**Input Fields (VO 2):**
4. Name (text)
5. Email (email)
6. Phone (tel)

**Help Text:** "I'll validate these VOs against our registry."

**Validation:** 
- VO registry validation
- Email and phone verification

---

### Step 18: User Registration
**Type:** Multi-field Input  
**Question:** "How many users would you like to register initially?"

**Input Fields:**
1. Active Users (number/text)
2. Passive Users (number/text)

**Help Text:** "Most firms start with 3-5 total users. You can add more users later at any time."

---

### Step 19: User Roles
**Type:** Multi-select  
**Question:** "Please assign roles to your users. Select all roles you'll need to configure."

**Options:**
- Trader
- Broker
- User Administrator
- Verification Officer
- Compliance Officer

**Help Text:** "Most firms assign one Admin and at least two Traders to start. I'll help you configure each user's specific role."

**Input Method:** Checkbox selection

---

### Step 20: Final Review
**Type:** Information Display + Confirmation  
**Question:** "Perfect! Let me provide a comprehensive summary of your registration for final confirmation."

**Display:** 
- Complete summary of all provided information
- Organized by category
- Review and edit capability

**Help Text:** "Please review all information carefully. Once confirmed, I'll submit your application to CME Group for processing."

**Input Method:** Confirmation button

---

## Conditional Logic Flow

### Swaps Conditional Path
```
Step 3: Trading Activities
  └─> If "Execute OTC swaps" selected
      └─> isSwapsSelected = true
          ├─> Step 12: Regulatory Status (shown)
          └─> Step 13: LEI Verification (shown)
```

### Canada Conditional Path
```
Step 14: Canada Reporting Obligations
  └─> If "Yes" selected
      └─> isCanadaEligible = true
          └─> Step 15: Canada Details (shown)
```

---

## Input Methods Summary

| Step | Input Type | UI Component |
|------|-----------|--------------|
| 1 | Single Select | Quick Options (buttons) |
| 2 | Multi-field | 2 text inputs |
| 3 | Multi-select | Checkboxes |
| 4 | Multi-select | Checkboxes |
| 5 | Display + Select | Recommendation card + buttons |
| 6 | Multi-field | 2 text inputs |
| 7 | Single Select | Quick Options (buttons) |
| 8 | Boolean | Quick Options (Yes/No) |
| 9 | Multi-field | 4 text inputs |
| 10 | Address | Map + geocoding search |
| 11 | Multi-field | 6 inputs (2 contacts × 3 fields) |
| 12* | Single Select | Quick Options (buttons) |
| 13* | Single-field | 1 text input (LEI) |
| 14 | Boolean | Quick Options (Yes/No) |
| 15* | Multi-field | 2 text inputs |
| 16 | Single-field | 1 email input |
| 17 | Multi-field | 6 inputs (2 VOs × 3 fields) |
| 18 | Multi-field | 2 text/number inputs |
| 19 | Multi-select | Checkboxes |
| 20 | Display + Confirm | Summary + confirmation button |

*Conditional step - only shown based on previous answers

---

## Validation & Integration Points

### Real-time Validations
- **Step 6 & 9:** Corporate registry lookup
- **Step 10:** Geospatial address validation via Mapbox
- **Step 11 & 17:** Email/phone verification codes
- **Step 13:** Global LEI registry validation
- **Step 16:** CME account lookup

### Data Integrations
- Corporate registries (company validation)
- Global LEI database
- Mapbox geocoding API
- CME Group user database
- Email/SMS verification services

---

## Platform Recommendation Logic (Step 5)

The AI analyzes answers from Steps 1-4 to generate:
1. **Platform Name:** e.g., "CME Direct" or "CME ClearPort"
2. **Reasoning:** 3-5 bullet points explaining why this platform fits
3. **Confidence Level:** High or Medium

**Factors Considered:**
- Entity type (Step 1)
- Geographic scope (Step 2)
- Trading activities (Step 3)
- Product interests (Step 4)

---

## State Management

### OnboardingState Interface
```typescript
{
  currentStep: number,
  totalSteps: number,
  firmName: string,
  answers: Record<string, any>,
  isSwapsSelected: boolean,
  isCanadaEligible: boolean
}
```

### Key State Flags
- **isSwapsSelected:** Triggers Steps 12-13
- **isCanadaEligible:** Triggers Step 15
- **firmName:** Populated from Step 6, used throughout

---

## Future Enhancement Opportunities

1. **Progress Save/Resume:** Allow users to save and return later
2. **Document Upload:** Add ability to upload incorporation docs at Step 6
3. **Live Chat Support:** Human override for complex scenarios
4. **Multi-language Support:** Translate flow for international users
5. **Mobile Optimization:** Enhanced mobile experience for address input
6. **Bulk User Upload:** CSV import for Step 18-19 (large organizations)

---

*Last Updated: 2025-10-21*
