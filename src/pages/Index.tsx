import { useOnboarding } from "@/hooks/useOnboarding";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { QuickOptions } from "@/components/QuickOptions";
import { useEffect, useRef } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

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
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex bg-background w-full">
        <AppSidebar state={state} />

        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border bg-card flex items-center px-4 lg:hidden">
            <SidebarTrigger />
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
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
              <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6">
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
    </SidebarProvider>
  );
};

export default Index;
