import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const KB_CONTENT = `# CME Group Onboarding Process - Complete Field Guide

## Overview
This document provides detailed information about the CME Group intelligent onboarding system, including field explanations, validation rules, and process flow.

---

## Onboarding Steps

### Step 1: Business Profile - Entity Type Selection

**Question:** "What type of entity are you?"

**Purpose:** Determines regulatory obligations and business model classification.

**Available Options:**
- **Proprietary Trading Firm**: Firms trading with their own capital
- **Broker/Dealer**: Entities executing trades for clients
- **Investment Fund/Asset Manager**: Organizations managing investment portfolios
- **FinTech/Technology Provider**: Technology companies providing trading infrastructure
- **Commercial Hedger**: Companies hedging commercial price risk
- **Market Maker**: Firms providing liquidity by quoting both buy and sell prices
- **Individual/Retail Investor**: Individual traders

**Why We Ask:** Understanding your entity type helps determine appropriate platform recommendations, regulatory requirements, and reporting obligations.

---

### Step 2: Geographic Scope

**Question:** "What is your firm's primary jurisdiction and cross-border operations?"

**Required Fields:**
- **Primary Jurisdiction (Country of Incorporation)**: The country where your firm is legally registered and incorporated. Select from a comprehensive dropdown list of countries.
- **Cross-Border Operations**: Indicates if your firm operates across international borders
  - **Yes**: Your firm conducts business in multiple countries
  - **No**: Operations are limited to your primary jurisdiction
  - **N/A**: Not applicable to your business model

**Purpose:** Determines applicable regulatory requirements and international reporting obligations. Different jurisdictions have varying compliance requirements.

**Validation:** Both fields are required. Country must be selected from the dropdown, and cross-border status must be specified.

---

### Step 3: Trading Activities

**Question:** "What are your primary trading and operational activities?"

**Multiple Selection Options:**
- **Execute futures and options trades**: Direct trading of exchange-listed derivatives
- **Clear trades through FCM**: Using Futures Commission Merchant clearing services
- **Report block trades**: Large privately negotiated trades reported to the exchange
- **View real-time market data and pricing**: Access to live market information feeds
- **Execute OTC swaps**: Over-the-counter swap transactions
- **Provide liquidity/market making**: Continuously quoting buy and sell prices
- **Risk management and hedging**: Using derivatives to manage price exposure

**Why We Ask:** Your selected activities directly influence which platform (CME Direct, ClearPort, or both) will be recommended. Different activities require different capabilities and access levels.

**Impact on Platform Selection:**
- OTC swaps → Requires ClearPort capabilities
- Block trades → ClearPort optimized
- Exchange execution → CME Direct recommended
- Combined activities → Dual platform access may be suggested

---

### Step 4: Product Interests

**Question:** "Which market segments and products are you interested in?"

**Multiple Selection Options:**
- **Exchange-traded Futures**: Standardized futures contracts traded on CME exchanges
- **Exchange-traded Options**: Options on futures contracts
- **FX Products**: Foreign exchange derivatives
- **Energy Products**: Crude oil, natural gas, and refined products
- **Interest Rate Products**: Treasury futures and eurodollar products
- **OTC Interest Rate Swaps**: Bilateral interest rate swap agreements
- **OTC FX Swaps**: Over-the-counter foreign exchange swaps
- **OTC Commodity Swaps/Forwards**: Bilateral commodity derivative agreements

**Purpose:** Helps refine platform recommendations and ensure you have access to the right market data and clearing capabilities.

**Note:** OTC product selection triggers additional regulatory questions in later steps (LEI requirement, CFTC registration status).

---

### Step 5: Platform Recommendation

**Question:** "Based on your profile, here's my recommendation for the optimal platform setup"

**System Generates Recommendation Based On:**
- Entity type (Step 1)
- Trading activities (Step 3)
- Product interests (Step 4)

**Possible Recommendations:**

1. **CME Direct**
   - Best for: Exchange-traded execution, futures and options trading
   - Features: Lowest latency, advanced order types, real-time market access
   - Typical users: Prop traders, retail investors, market makers

2. **CME ClearPort**
   - Best for: OTC products, block trades, bilateral transactions
   - Features: Specialized reporting, post-trade clearing, flexible workflows
   - Typical users: Commercial hedgers, swap dealers, bilateral traders

3. **CME Direct + ClearPort (Dual Path)**
   - Best for: Firms needing both exchange and OTC capabilities
   - Features: Seamless integration between platforms, comprehensive access
   - Typical users: Large trading firms, asset managers, diversified operations

**Available Responses:**
- "Accept Recommendation" → Proceed with suggested platform
- "I'd like to discuss alternatives" → Triggers platform discussion

---

### Step 6: Entity Registration

**Question:** "Please provide your firm's full legal name and jurisdiction of incorporation"

**Required Fields:**
- **Full Legal Name**: Complete registered business name as it appears on incorporation documents
  - Must match official corporate registry records
  - Include all legal suffixes (LLC, Inc., Ltd., etc.)
  - Example: "Acme Trading Partners LLC"

- **Jurisdiction of Incorporation**: Country where the entity is legally registered
  - Select from comprehensive country dropdown
  - Must match corporate registry records
  - Will be validated against public registries

**Validation:** Real-time validation against corporate registries. System checks if entity exists and matches provided information.

**Common Issues:**
- Using DBA (Doing Business As) name instead of legal name
- Omitting legal suffixes
- Incorrect jurisdiction selection

---

### Step 7: FCM & IB Relationship

**Question:** "Do you currently have a relationship with a Futures Commission Merchant (FCM) or Introducing Broker (IB)?"

**Field Definitions:**
- **FCM (Futures Commission Merchant)**: A firm that solicits or accepts orders to buy or sell futures contracts and accepts money or other assets from customers to support such orders
- **IB (Introducing Broker)**: A firm that solicits or accepts orders but does not accept money, securities, or property from customers

**Available Options:**
- **Yes, I have an existing FCM relationship**: You already work with an FCM for clearing
- **Yes, I have an existing IB relationship**: You work with an IB for order introduction
- **No, I need assistance selecting one**: System will provide curated list of suitable partners

**Why We Ask:** CME Group requires all participants to have proper clearing relationships. If you don't have one, we can recommend appropriate partners based on your profile.

**Next Steps Based on Response:**
- Existing relationships → Verify FCM/IB details in later steps
- Need assistance → Receive list of qualified partners matching your profile and jurisdiction

---

### Step 8: ILA Agreement Review

**Question:** Review and accept required agreements

**Required Documents:**
- **Information License Agreement (ILA)**: Governs use of CME Group market data
- **Schedule 2b**: Defines Professional Display Device fees and requirements

**Key Terms to Understand:**

**Professional Display Device:**
- Any device used to display real-time market data for professional trading purposes
- Fees are assessed per device once data access is enabled
- Different fee tiers based on data packages

**Data Usage Rights:**
- Real-time vs. delayed data specifications
- Redistribution restrictions
- Display limitations

**Acceptance Required:** Must review documents and confirm readiness to proceed.

**Common Questions:**
- "When do fees start?" → Fees begin when real-time data access is activated
- "Can I share data with colleagues?" → Subject to redistribution terms in ILA
- "What if I only need delayed data?" → Different fee structure applies

---

### Step 9: Entity Details

**Question:** "Please provide complete entity information"

**Required Fields:**

1. **Legal Name**: Full registered business name
   - Must exactly match incorporation documents
   - Include all legal entity designators

2. **DBA (Doing Business As)**: Trade name if different from legal name
   - Optional field
   - Used if your firm operates under a different brand name
   - Example: Legal name "XYZ Holdings Inc.", DBA "XYZ Capital"

3. **Direct Parent**: Immediate parent company
   - Entity that directly owns or controls your firm
   - Use "None" if no parent company
   - Must provide legal name of parent

4. **Legal Ultimate Parent**: Highest-level controlling entity
   - Top of the ownership chain
   - May be same as Direct Parent
   - Critical for regulatory reporting and compliance

**Purpose:** Establishes complete ownership structure for regulatory compliance and Know Your Customer (KYC) requirements.

**Validation:** Parent entity information validated against corporate registries where available.

---

### Step 10: Registered Address

**Question:** "Please provide your firm's registered office address"

**Requirements:**
- **Complete street address required**
- **P.O. Boxes are NOT acceptable**
- Must be a physical location where official correspondence can be delivered

**Address Components:**
- Street number and name
- Suite/Floor/Unit (if applicable)
- City
- State/Province
- Postal/ZIP code
- Country

**Validation Features:**
- **Geospatial validation**: Address verified against mapping services
- **Auto-complete**: System suggests addresses as you type
- **Format checking**: Ensures proper address structure

**Why Physical Address Required:** Regulatory requirements mandate a physical location for service of process and official communications.

---

### Step 11: Billing Contacts

**Question:** "Please provide details for two billing contacts"

**Required Information Per Contact:**

**Contact 1:**
- **Name**: Full name of primary billing contact
- **Email**: Valid email address for billing communications
- **Phone Number**: Direct contact number (with country code for international)

**Contact 2:**
- **Name**: Full name of secondary billing contact
- **Email**: Different from Contact 1's email
- **Phone Number**: Direct contact number

**Purpose:** 
- Receive invoices and billing statements
- Handle payment inquiries
- Resolve billing disputes
- Ensure business continuity with backup contact

**Validation:**
- Verification codes sent to provided email addresses
- Phone numbers checked for valid format
- Both contacts must be unique individuals

**Best Practices:**
- Use dedicated billing department contacts
- Ensure contacts have payment authorization
- Provide individuals with day-to-day availability

---

### Step 12: Regulatory Status (Conditional)

**Triggered When:** OTC swaps selected in Product Interests (Step 4)

**Question:** "What is your CFTC regulatory status?"

**Available Options:**

1. **CFTC Registered - Swap Dealer (SD)**
   - Entity registered with CFTC as a Swap Dealer
   - Subject to heightened regulatory requirements
   - Must maintain minimum capital requirements

2. **CFTC Registered - Major Swap Participant (MSP)**
   - Entity whose swap positions create substantial counterparty exposure
   - Subject to capital and margin requirements
   - Different reporting obligations than SDs

3. **Non-SD/MSP Counterparty**
   - Engages in swap transactions but not registered as SD or MSP
   - May be "Financial Entity" or "Non-Financial Entity"
   - Different reporting and margin requirements

4. **Not Applicable**
   - Entity does not engage in activities requiring CFTC registration
   - May be non-US entity or exempt from registration

**Why We Ask:** CFTC registration status determines:
- Reporting requirements to swap data repositories
- Margin and capital requirements
- Documentation and disclosure obligations
- Transaction execution requirements

---

### Step 13: LEI Verification (Conditional)

**Triggered When:** OTC swaps selected in Product Interests (Step 4)

**Question:** "Please provide your 20-character Legal Entity Identifier (LEI)"

**What is an LEI?**
- 20-character alphanumeric code
- Globally unique identifier for legal entities
- Required for all swap market participants under CFTC rules
- Format: XXXXXXXXXXXXXXXXXXXX (4 characters + 2 characters + 14 characters)

**Example:** 529900T8BM49AURSDO55

**How to Get an LEI:**
- Obtain from any Local Operating Unit (LOU)
- Typical cost: $50-200 annually
- Processing time: 1-5 business days
- Must be renewed annually

**Validation:**
- System verifies LEI against GLEIF (Global Legal Entity Identifier Foundation) database
- Auto-populates associated details:
  - Registered legal name
  - Domicile country
  - Entity status
  - Registration date

**Common Issues:**
- Expired LEI (must be renewed annually)
- LEI registered to parent company instead of trading entity
- Typos in 20-character code

---

### Step 14: Canada Reporting Obligations

**Question:** "Does your entity have reporting obligations to a province in Canada?"

**Background:**
Canadian provincial securities commissions have separate derivative reporting requirements regardless of where your entity is domiciled.

**When to Answer "Yes":**
- Your entity trades with Canadian counterparties
- You have operations or offices in Canada
- Provincial regulations require you to report
- You are registered with any Canadian provincial regulator

**When to Answer "No":**
- No Canadian trading activities
- No Canadian counterparties
- No provincial registration or obligations

**Available Options:**
- **Yes**: Triggers Step 15 for province and tax ID details
- **No**: Skips Canadian-specific information collection

**Impact:** Determines if additional provincial reporting setup is required.

---

### Step 15: Canada Details (Conditional)

**Triggered When:** "Yes" selected in Step 14

**Question:** "Please specify which Canadian province(s) and provide your Canadian Tax ID"

**Required Fields:**

1. **Canadian Province(s)**
   - Select all provinces where you have reporting obligations
   - Common selections:
     - Ontario (OSC - Ontario Securities Commission)
     - Quebec (AMF - Autorité des marchés financiers)
     - Alberta (ASC - Alberta Securities Commission)
     - British Columbia (BCSC)
   - Multiple provinces can be selected
   - Format: Comma-separated list

2. **Canadian Tax ID**
   - Business Number (BN) issued by Canada Revenue Agency
   - 9-digit format: XXXXXXXXX
   - Required for any Canadian tax reporting
   - Different from federal tax ID

**Purpose:**
- Enable proper provincial reporting
- Comply with local regulatory requirements
- Set up correct data flows to provincial regulators

**Validation:** Tax ID format checked, province selections validated.

---

### Step 16: CME Account Verification

**Question:** "Do you have an existing CME Group User Account? Please provide the registered email address"

**Stub Emails for Testing:**
- vivaan@zamp.ai
- prabhu@zamp.ai

**Field Requirements:**
- Valid email format
- Must be unique (not already in use by another active registration)

**Validation Process:**
1. System checks if email exists in CME user database
2. If found: Links existing account to new entity registration
3. If not found: Error message displayed: "✗ No CME Group user account found for this email address"
4. User must re-enter correct email or create new account

**Account Creation Option:**
If no account exists, system can create one immediately without redirecting to external pages.

**Why We Ask:** Streamlines the registration process by linking to existing user credentials and preferences.

**Common Issues:**
- Using personal email instead of corporate email
- Typos in email address
- Multiple people sharing one email account (not recommended)

---

### Step 17: Verification Officers

**Question:** "Please provide details for two Verification Officers (VOs)"

**What are Verification Officers?**
Verification Officers are designated individuals responsible for:
- Overseeing compliance with CME Group rules
- Verifying accuracy of registration information
- Serving as points of contact for regulatory inquiries
- Approving user access and permissions

**Required Information Per VO:**

**Verification Officer 1:**
- **Name**: Full legal name
- **Email**: Corporate email address
- **Phone**: Direct contact number with extension if applicable

**Verification Officer 2:**
- **Name**: Full legal name (different from VO1)
- **Email**: Corporate email address (different from VO1)
- **Phone**: Direct contact number

**Requirements:**
- Must be full-time employees
- Must have authority to verify compliance
- Typically senior management or compliance officers
- Should have knowledge of firm's trading activities

**Validation:**
- VOs validated against CME registry
- Verification codes may be sent to provided emails
- Phone numbers checked for proper format

**Best Practices:**
- Designate compliance or risk management personnel
- Ensure VOs have necessary authority
- Keep VO information updated

---

### Step 18: User Registration

**Question:** "How many users would you like to register initially?"

**User Types:**

1. **Active Users**
   - Full system access with immediate login capability
   - Can execute trades, view data, manage orders
   - Require individual credentials and permissions
   - Count toward user license limits

2. **Passive Users**
   - Receive notifications and alerts only
   - Read-only access or no direct system access
   - Typically back-office, compliance, or management
   - Lower or no licensing fees

**Required Fields:**
- **Number of Active Users**: Integer (typically 1-50 for initial setup)
- **Number of Passive Users**: Integer (0-100 common range)

**Typical Starting Points:**
- Small firms: 3-5 active users
- Medium firms: 5-15 active users
- Large firms: 15+ active users

**Note:** Additional users can be added later at any time through the user management portal.

**Considerations:**
- Each active user requires training
- Active users need proper role assignments
- Consider backup users for business continuity

---

### Step 19: User Roles

**Question:** "Please assign roles to your users"

**Available Roles:**

1. **Trader**
   - Execute trades and manage orders
   - View real-time market data
   - Access trading interfaces and tools
   - Cannot modify system settings
   - Most common role for front-office users

2. **Broker**
   - Intermediate trades on behalf of clients
   - Extended order management capabilities
   - Client account access
   - Compliance and documentation requirements
   - Requires additional registration in some jurisdictions

3. **User Administrator**
   - Manage user accounts and permissions
   - Add/remove users
   - Assign and modify roles
   - Configure system settings
   - Critical for ongoing user management
   - Recommend: At least 1-2 per firm

4. **Verification Officer**
   - Compliance oversight role
   - Review and approve user activities
   - Access to audit trails and reports
   - Regulatory liaison responsibilities
   - Should match VOs designated in Step 17

5. **Compliance Officer**
   - Monitor trading for rule violations
   - Generate compliance reports
   - Configure risk limits and controls
   - Interface with regulatory systems
   - Access to all transaction data

**Multiple Selection:** Select all roles your firm will need to configure

**Best Practice Role Distribution:**
- Every firm needs at least one User Administrator
- Most firms assign 1-3 Traders initially
- Always designate Verification Officers (minimum 2)
- Compliance Officer recommended for regulated entities
- Broker role only if providing intermediation services

**Next Steps:** After role selection, you'll configure specific users with assigned roles in the user management interface.

---

### Step 20: Final Review

**Question:** "Please review all information for final confirmation"

**Review Summary Includes:**
- Entity details and registration information
- Platform selection and reasoning
- Contact information (billing and VOs)
- Regulatory status and identifiers (LEI if applicable)
- User count and role configuration
- Address and jurisdiction details

**Final Confirmation:**
- Review all information carefully
- Confirm accuracy of all fields
- Understand that submission initiates processing
- Application submitted to CME Group for review

**What Happens Next:**
1. Application submitted to CME Group operations
2. Registration reference number generated (format: REG-XXXXXXXX)
3. Confirmation email sent to all contacts
4. CME operations reviews application (typically 2-5 business days)
5. Additional documentation may be requested
6. Account credentials provided upon approval
7. Training and onboarding materials sent

**Typical Processing Timeline:**
- Initial review: 1-2 business days
- Documentation collection: 2-3 days (if needed)
- Final approval: 1-2 business days
- Total: 3-7 business days on average

**Communication:**
- Confirmation email sent immediately
- Status updates via email
- Questions directed to registration team
- Final approval notification includes next steps

---

## Common Questions and Troubleshooting

### Q: Why is my email not being accepted in Step 16?
**A:** The system only accepts stub test emails (vivaan@zamp.ai, prabhu@zamp.ai) for validation. If you enter a different email, you'll receive an error message and need to re-enter using one of the approved test emails.

### Q: What if I don't have an LEI?
**A:** You'll need to obtain one from a Local Operating Unit (LOU) before completing the registration if you selected OTC swaps. The process typically takes 1-5 business days and costs $50-200 annually.

### Q: Can I change my platform selection later?
**A:** Yes, you can add additional platform access (e.g., add ClearPort to existing CME Direct access) after initial registration through the account management portal.

### Q: How do I know which parent entity to list?
**A:** Use your corporate organizational chart. Direct Parent is the entity that directly owns your firm. Ultimate Parent is the top of the ownership chain. If your firm has no parent, enter "None."

### Q: What's the difference between Active and Passive users?
**A:** Active users can log in and execute trades. Passive users only receive notifications and alerts. Active users typically require licensing fees, while passive users may not.

### Q: Do I need to complete all fields even if marked optional?
**A:** Complete all required fields (marked with asterisk or validated). Optional fields like DBA can be skipped if not applicable, but providing complete information speeds up the approval process.

### Q: What if my firm operates in multiple countries?
**A:** Select your primary country of incorporation in Step 2, then indicate "Yes" for cross-border operations. Additional jurisdictional details can be provided in the entity details section.

### Q: How long does the entire onboarding process take?
**A:** The form itself takes 15-30 minutes to complete. After submission, CME Group review and approval typically takes 3-7 business days.

---

## Validation Rules Summary

| Step | Field | Validation Rule |
|------|-------|----------------|
| 2 | Country | Must select from dropdown |
| 2 | Cross-Border | Must select Yes/No/N/A |
| 6 | Legal Name | Required, min 2 characters |
| 6 | Jurisdiction | Must select from dropdown |
| 10 | Address | No P.O. Boxes, geospatial verification |
| 11 | Billing Emails | Valid email format, must be unique |
| 11 | Phone Numbers | Valid phone number format |
| 13 | LEI | Exactly 20 alphanumeric characters |
| 15 | Canadian Tax ID | 9-digit format |
| 16 | Email | Must be vivaan@zamp.ai or prabhu@zamp.ai |
| 17 | VO Emails | Valid format, different from each other |
| 18 | User Counts | Positive integers |

---

## Technical Notes

- All form submissions are validated in real-time
- Address verification uses geospatial APIs
- LEI verification connects to GLEIF database
- Entity validation checks corporate registries
- Email verification sends confirmation codes
- System maintains audit trail of all submissions

---

## Support Contacts

For questions during the onboarding process:
- **Technical Issues**: Contact system support
- **Regulatory Questions**: Consult with your compliance team
- **Platform Selection**: Platform advisors available
- **Account Status**: Registration operations team

---

*Last Updated: 2025*
*Document Version: 1.0*`;

export const UploadKB = () => {
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const uploadToKB = async () => {
    setStatus("uploading");
    setMessage("Uploading knowledge base file...");

    try {
      // Convert the content to a Blob
      const blob = new Blob([KB_CONTENT], { type: 'text/markdown' });
      const file = new File([blob], 'CME_Onboarding_Knowledge_Base.md', { type: 'text/markdown' });

      // Upload to knowledge-base bucket
      const { error: uploadError } = await supabase.storage
        .from('knowledge-base')
        .upload('CME_Onboarding_Knowledge_Base.md', file, {
          cacheControl: '3600',
          upsert: true // Overwrite if exists
        });

      if (uploadError) {
        throw uploadError;
      }

      setStatus("success");
      setMessage("Knowledge base file uploaded successfully! The KB Chat Widget can now use this documentation.");
      
      toast({
        title: "Success!",
        description: "CME Onboarding Knowledge Base uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading KB file:', error);
      setStatus("error");
      setMessage(`Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload knowledge base file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-6 w-6" />
              Upload Knowledge Base
            </CardTitle>
            <CardDescription>
              Upload the CME Onboarding documentation to the knowledge-base storage bucket.
              This will enable the KB Chat Widget to answer questions about the onboarding process.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">File Details:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• File Name: CME_Onboarding_Knowledge_Base.md</li>
                <li>• Size: ~27 KB</li>
                <li>• Content: Complete CME onboarding process documentation</li>
                <li>• Includes: All 20 steps, field definitions, validation rules, FAQs</li>
              </ul>
            </div>

            {status === "idle" && (
              <Button
                onClick={uploadToKB}
                size="lg"
                className="w-full"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Knowledge Base File
              </Button>
            )}

            {status === "uploading" && (
              <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <span className="text-blue-600 dark:text-blue-400">{message}</span>
              </div>
            )}

            {status === "success" && (
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-green-600 dark:text-green-400 font-medium">{message}</p>
                  <p className="text-sm text-green-600/80 dark:text-green-400/80 mt-1">
                    You can now test the KB Chat Widget by clicking the chat icon in the bottom right corner.
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-600 dark:text-red-400">{message}</p>
                  <Button
                    onClick={uploadToKB}
                    variant="outline"
                    size="sm"
                    className="mt-3"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
