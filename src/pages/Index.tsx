import { useOnboarding } from "@/hooks/useOnboarding";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { QuickOptions } from "@/components/QuickOptions";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { useEffect, useRef } from "react";

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
  const showQuickOptions =
    currentMessage?.type === "agent" &&
    currentMessage.options &&
    !isProcessing;
  const showChatInput =
    (!currentMessage?.inputType || currentMessage?.inputType === "none") &&
    !isProcessing &&
    !showQuickOptions;

  return (
    <div className="min-h-screen flex bg-background w-full">
      <aside className="w-64 border-r border-border bg-card flex flex-col flex-shrink-0 fixed left-0 top-0 h-screen">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground mb-1">CME Onboarding</h2>
          <p className="text-sm text-muted-foreground">powered by Pace</p>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          <ProgressIndicator state={state} />
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 ml-64">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-12">
            <div className="space-y-8">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message}
                  onFormSubmit={
                    index === messages.length - 1 ? processUserMessage : undefined
                  }
                  isLatestMessage={index === messages.length - 1}
                  disabled={isProcessing}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {(showQuickOptions || showChatInput) && (
          <div className="border-t border-border bg-card">
            <div className="max-w-3xl mx-auto px-8 py-6">
              {showQuickOptions ? (
                <QuickOptions
                  options={currentMessage.options!}
                  onSelect={processUserMessage}
                />
              ) : (
                <ChatInput
                  onSend={processUserMessage}
                  disabled={isProcessing}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
