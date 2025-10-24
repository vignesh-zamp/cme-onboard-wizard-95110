import { useState, useCallback } from "react";
import { OnboardingState, ChatMessage } from "@/types/onboarding";
import { onboardingSteps } from "@/data/onboardingSteps";
import { toast } from "sonner";

const TOTAL_STEPS = 20; // Updated to 20 steps

interface PlatformRecommendation {
  platform: string;
  reasoning: string[];
  confidence: 'high' | 'medium';
}

export const useOnboarding = () => {
  const [state, setState] = useState<OnboardingState>({
    currentStep: 1,
    totalSteps: TOTAL_STEPS,
    firmName: "",
    answers: {},
    isSwapsSelected: false,
    isCanadaEligible: false,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "agent",
      content: "Welcome to CME Group's intelligent onboarding system. I'm here to guide you through the registration process with personalized recommendations and real-time validation.\n\nInstead of asking you to choose a platform upfront, I'll first learn about your business needs and then recommend the optimal setup for you.",
      timestamp: new Date(),
    },
    {
      id: "step-1",
      type: "agent",
      content: onboardingSteps[0].question + (onboardingSteps[0].helpText ? `\n\n💡 ${onboardingSteps[0].helpText}` : ''),
      timestamp: new Date(),
      options: onboardingSteps[0].options,
    },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [platformRecommendation, setPlatformRecommendation] = useState<PlatformRecommendation | null>(null);

  // AI logic to determine platform recommendation based on user answers
  const generatePlatformRecommendation = useCallback(
    (answers: Record<string, any>): PlatformRecommendation => {
      const entityType = answers.step_1?.toLowerCase() || '';
      const activities = answers.step_3?.toLowerCase() || '';
      const products = answers.step_4?.toLowerCase() || '';

      let platform = '';
      let reasoning: string[] = [];
      let confidence: 'high' | 'medium' = 'high';

      // Decision logic based on answers
      const hasOTCSwaps = products.includes('otc');
      const hasBlockTrade = activities.includes('block trade');
      const hasExecution = activities.includes('execute');
      const hasExchangeTraded = products.includes('exchange');

      if (hasOTCSwaps && hasExecution) {
        platform = 'CME Direct and CME ClearPort (Dual Path)';
        reasoning = [
          'Your OTC swaps activity requires ClearPort for reporting and clearing capabilities',
          'Exchange-traded execution needs are best served through CME Direct',
          'Dual access provides seamless integration between exchange-traded and OTC workflows',
          'This setup optimizes your operational efficiency across both product types'
        ];
      } else if (hasOTCSwaps || hasBlockTrade) {
        platform = 'CME ClearPort';
        reasoning = [
          'Your focus on OTC products and block trades aligns perfectly with ClearPort\'s strengths',
          'ClearPort provides specialized reporting and clearing for bilateral transactions',
          'This platform is optimized for post-trade processing workflows'
        ];
        confidence = 'high';
      } else if (hasExecution || hasExchangeTraded) {
        platform = 'CME Direct';
        reasoning = [
          'Your primary focus on exchange-traded execution is ideal for CME Direct',
          'CME Direct provides superior order entry and real-time market access',
          'This platform offers the lowest latency for futures and options trading',
          entityType.includes('market maker') ? 'Market makers benefit from Direct\'s advanced order types' : 'Optimized for your trading style'
        ];
      } else {
        platform = 'CME Direct';
        reasoning = [
          'CME Direct provides comprehensive market access for most trading activities',
          'You can easily add ClearPort capabilities later if needed',
          'This is the most common starting point for new firms'
        ];
        confidence = 'medium';
      }

      return { platform, reasoning, confidence };
    },
    []
  );


  const simulateValidation = useCallback(
    (step: number, value: string): Promise<ChatMessage['validation']> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Mock validation logic based on step
          switch (step) {
            case 2: // Entity Registration
              if (value.toLowerCase().includes("test")) {
                resolve({
                  status: "warning",
                  message: "⚠️ Duplicate Detection: A similar entity name exists. Would you like to resume a previous session?",
                });
              } else {
                resolve({
                  status: "success",
                  message: "✓ Entity name validated. Draft record created with Journey Token.",
                });
              }
              break;
            
            case 5: // ILA Validation
              resolve({
                status: "success",
                message: "✓ Document validated. All required signatures confirmed on ILA Schedule 2b.",
              });
              break;
            
            case 9: // Address Validation
              resolve({
                status: "success",
                message: "✓ Address verified via geospatial validation. Location confirmed.",
              });
              break;
            
            case 10: // Billing Contact
              resolve({
                status: "pending",
                message: "📧 Verification code sent to billing contact. Please confirm receipt.",
              });
              break;
            
            case 12: // LEI Verification
              if (value.length === 20) {
                resolve({
                  status: "success",
                  message: "✓ LEI verified via global registry. Legal name and domicile auto-populated.",
                });
              } else {
                resolve({
                  status: "error",
                  message: "✗ Invalid LEI format. Please provide a valid 20-character LEI.",
                });
              }
              break;
            
            case 15: // CME Account
              resolve({
                status: "success",
                message: "✓ CME Account found and linked to registration.",
              });
              break;
            
            case 16: // VO Validation
              resolve({
                status: "success",
                message: "✓ Verification Officers validated and properly mapped to your entity.",
              });
              break;
            
            default:
              resolve(undefined);
          }
        }, 1000);
      });
    },
    []
  );

  const processUserMessage = useCallback(
    async (content: string) => {
      setIsProcessing(true);

      // Add user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        type: "user",
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Process answer and update state
      const currentStepData = onboardingSteps[state.currentStep - 1];
      const validation = await simulateValidation(state.currentStep, content);

      // Add validation message if exists
      if (validation) {
        const validationMessage: ChatMessage = {
          id: `validation-${Date.now()}`,
          type: "system",
          content: "Processing your response...",
          timestamp: new Date(),
          validation,
        };
        setMessages((prev) => [...prev, validationMessage]);
      }

      // Update state based on step
      const newState = { ...state };
      newState.answers[`step_${state.currentStep}`] = content;

      // Check if we need to detect swaps selection (now in step 4)
      if (state.currentStep === 4) {
        const isSwaps = content.toLowerCase().includes('swap');
        newState.isSwapsSelected = isSwaps;
      }
      
      // Check Canada eligibility (now in step 14)
      if (state.currentStep === 14) {
        newState.isCanadaEligible = content.toLowerCase().includes('yes');
      }

      // Generate platform recommendation after step 4
      let currentRecommendation = platformRecommendation;
      if (state.currentStep === 4) {
        currentRecommendation = generatePlatformRecommendation(newState.answers);
        setPlatformRecommendation(currentRecommendation);
      }

      // Special handling for entity registration (now step 6)
      if (state.currentStep === 6 && !newState.firmName) {
        newState.firmName = content.split(',')[0] || content.substring(0, 50);
      }
      
      // Move to next step
      const nextStep = state.currentStep + 1;
      
      if (nextStep <= TOTAL_STEPS) {
        // Check if next step should be skipped due to conditional logic
        let targetStep = nextStep;
        while (targetStep <= TOTAL_STEPS) {
          const stepData = onboardingSteps[targetStep - 1];
          if (!stepData.conditional || stepData.conditional(newState)) {
            break;
          }
          targetStep++;
        }

        if (targetStep <= TOTAL_STEPS) {
          newState.currentStep = targetStep;
          
          setTimeout(() => {
            const nextStepData = onboardingSteps[targetStep - 1];
            
            // Determine input type based on step
            let inputType: "text" | "address" | "multifield" | "none" = "none";
            let inputFields: { name: string; placeholder: string; type?: "text" | "email" | "tel" }[] | undefined;
            let options: string[] | undefined = nextStepData.options;

            // For boolean type questions, convert to Yes/No options
            if (nextStepData.type === 'boolean') {
              options = ["Yes", "No"];
            }

            // Step 2: Geographic Scope - separate fields
            if (targetStep === 2) {
              inputType = "multifield";
              inputFields = [
                { name: "countryOfIncorporation", placeholder: "Country of Incorporation", type: "text" },
                { name: "crossBorderOperations", placeholder: "Cross-border Operations (if any)", type: "text" },
              ];
            }
            
            // Step 6: Entity Registration - separate fields
            if (targetStep === 6) {
              inputType = "multifield";
              inputFields = [
                { name: "legalName", placeholder: "Full Legal Name", type: "text" },
                { name: "jurisdiction", placeholder: "Jurisdiction of Incorporation", type: "text" },
              ];
            }
            
            // Step 9: Entity Details - separate fields for each component
            if (targetStep === 9) {
              inputType = "multifield";
              inputFields = [
                { name: "legalName", placeholder: "Legal Name", type: "text" },
                { name: "dba", placeholder: "DBA (if applicable)", type: "text" },
                { name: "directParent", placeholder: "Direct Parent", type: "text" },
                { name: "ultimateParent", placeholder: "Legal Ultimate Parent", type: "text" },
              ];
            }
            
            // Step 10: Address validation
            if (targetStep === 10) {
              inputType = "address";
            }
            
            // Step 11: Billing Contacts - multi-field
            if (targetStep === 11) {
              inputType = "multifield";
              inputFields = [
                { name: "contact1Name", placeholder: "Contact 1 Name", type: "text" },
                { name: "contact1Email", placeholder: "Contact 1 Email", type: "email" },
                { name: "contact1Phone", placeholder: "Contact 1 Phone", type: "tel" },
                { name: "contact2Name", placeholder: "Contact 2 Name", type: "text" },
                { name: "contact2Email", placeholder: "Contact 2 Email", type: "email" },
                { name: "contact2Phone", placeholder: "Contact 2 Phone", type: "tel" },
              ];
            }
            
            // Step 13: LEI - single field
            if (targetStep === 13) {
              inputType = "text";
              inputFields = [{ name: "lei", placeholder: "20-character LEI", type: "text" }];
            }
            
            // Step 15: Canada Details - separate fields
            if (targetStep === 15) {
              inputType = "multifield";
              inputFields = [
                { name: "provinces", placeholder: "Province(s) (e.g., Ontario, Quebec)", type: "text" },
                { name: "canadianTaxId", placeholder: "Canadian Tax ID", type: "text" },
              ];
            }
            
            // Step 16: CME Account - single field
            if (targetStep === 16) {
              inputType = "text";
              inputFields = [{ name: "email", placeholder: "your.email@company.com", type: "email" }];
            }
            
            // Step 17: Verification Officers - multi-field
            if (targetStep === 17) {
              inputType = "multifield";
              inputFields = [
                { name: "vo1Name", placeholder: "VO 1 Name", type: "text" },
                { name: "vo1Email", placeholder: "VO 1 Email", type: "email" },
                { name: "vo1Phone", placeholder: "VO 1 Phone", type: "tel" },
                { name: "vo2Name", placeholder: "VO 2 Name", type: "text" },
                { name: "vo2Email", placeholder: "VO 2 Email", type: "email" },
                { name: "vo2Phone", placeholder: "VO 2 Phone", type: "tel" },
              ];
            }
            
            // Step 18: User Registration - separate fields
            if (targetStep === 18) {
              inputType = "multifield";
              inputFields = [
                { name: "activeUsers", placeholder: "Number of Active Users", type: "text" },
                { name: "passiveUsers", placeholder: "Number of Passive Users", type: "text" },
              ];
            }

            // Special message for platform recommendation step (step 5)
            if (targetStep === 5 && currentRecommendation) {
              const recommendationMessage: ChatMessage = {
                id: `recommendation-${Date.now()}`,
                type: "agent",
                content: nextStepData.question + (nextStepData.helpText ? `\n\n💡 ${nextStepData.helpText}` : ''),
                timestamp: new Date(),
                options: nextStepData.options,
                recommendation: currentRecommendation,
                inputType: "none",
              };
              setMessages((prev) => [...prev, recommendationMessage]);
            } else {
              const agentMessage: ChatMessage = {
                id: `agent-${Date.now()}`,
                type: "agent",
                content: nextStepData.question + (nextStepData.helpText ? `\n\n💡 ${nextStepData.helpText}` : ''),
                timestamp: new Date(),
                options,
                inputType,
                inputFields,
              };
              setMessages((prev) => [...prev, agentMessage]);
            }
            setIsProcessing(false);
          }, 1500);
        } else {
          // All steps complete
          const completionMessage: ChatMessage = {
            id: `completion-${Date.now()}`,
            type: "agent",
            content: `🎉 Congratulations! Your firm registration for ${newState.firmName} is complete.\n\nPlatform: ${platformRecommendation?.platform || 'As selected'}\n\nI've validated all information and submitted your application to CME Group. You'll receive a confirmation email shortly with next steps.\n\nYour registration reference number is: REG-${Date.now().toString().slice(-8)}`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, completionMessage]);
          toast.success("Registration completed successfully!");
          setIsProcessing(false);
        }
      }

      setState(newState);
    },
    [state, simulateValidation]
  );

  return {
    state,
    messages,
    isProcessing,
    processUserMessage,
    platformRecommendation,
  };
};
