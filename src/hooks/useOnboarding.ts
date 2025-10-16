import { useState, useCallback } from "react";
import { OnboardingState, ChatMessage } from "@/types/onboarding";
import { onboardingSteps } from "@/data/onboardingSteps";
import { toast } from "sonner";

const TOTAL_STEPS = 19;

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
      content: "Welcome to CME Group's intelligent onboarding system. I'm here to guide you through the new firm registration process with real-time validation and personalized assistance.\n\nLet's begin by understanding your needs.",
      timestamp: new Date(),
    },
    {
      id: "step-1",
      type: "agent",
      content: onboardingSteps[0].question,
      timestamp: new Date(),
      options: onboardingSteps[0].options,
    },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);

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

      // Special handling for certain steps
      if (state.currentStep === 2 && !newState.firmName) {
        newState.firmName = content.split(',')[0] || content.substring(0, 50);
      }
      
      if (state.currentStep === 8) {
        const isSwaps = content.toLowerCase().includes('swap');
        newState.isSwapsSelected = isSwaps;
      }
      
      if (state.currentStep === 13) {
        newState.isCanadaEligible = content.toLowerCase().includes('yes');
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
            const agentMessage: ChatMessage = {
              id: `agent-${Date.now()}`,
              type: "agent",
              content: nextStepData.question + (nextStepData.helpText ? `\n\n💡 ${nextStepData.helpText}` : ''),
              timestamp: new Date(),
              options: nextStepData.options,
            };
            setMessages((prev) => [...prev, agentMessage]);
            setIsProcessing(false);
          }, 1500);
        } else {
          // All steps complete
          const completionMessage: ChatMessage = {
            id: `completion-${Date.now()}`,
            type: "agent",
            content: `🎉 Congratulations! Your firm registration for ${newState.firmName} is complete.\n\nI've validated all information and submitted your application to CME Group. You'll receive a confirmation email shortly with next steps.\n\nYour registration reference number is: REG-${Date.now().toString().slice(-8)}`,
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
  };
};
