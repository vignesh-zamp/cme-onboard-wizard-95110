import { useEffect, useRef } from "react";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { QuickOptions } from "@/components/QuickOptions";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Building2 } from "lucide-react";

const Index = () => {
  const { state, messages, isProcessing, processUserMessage } = useOnboarding();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const currentMessage = messages[messages.length - 1];
  const showQuickOptions = currentMessage?.type === 'agent' && currentMessage?.options && !isProcessing;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CME Group</h1>
              <p className="text-sm text-muted-foreground">Intelligent Onboarding System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <ProgressIndicator state={state} />

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                onFormSubmit={processUserMessage}
                isLatestMessage={index === messages.length - 1}
                disabled={isProcessing}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input Area - Only show quick options and fallback input */}
      <footer className="bg-card border-t border-border shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4">
          {showQuickOptions && currentMessage.options && (
            <QuickOptions
              options={currentMessage.options}
              onSelect={processUserMessage}
              disabled={isProcessing}
            />
          )}
          
          {/* Only show ChatInput when there's no inline form input */}
          {(!currentMessage?.inputType || currentMessage.inputType === "none") && (
            <ChatInput
              onSend={processUserMessage}
              disabled={isProcessing}
              placeholder={
                isProcessing 
                  ? "Processing your response..." 
                  : "Type your response or select an option above..."
              }
            />
          )}
          
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <p>
              For privacy information, see{" "}
              <a href="#" className="text-primary hover:underline">
                CME Group's Privacy Notice
              </a>
            </p>
            <p>
              Questions?{" "}
              <a href="mailto:insights@cmegroup.com" className="text-primary hover:underline">
                insights@cmegroup.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
