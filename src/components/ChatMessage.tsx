import React from "react";
import { ChatMessage as ChatMessageType } from "@/types/onboarding";
import { CheckCircle2, AlertCircle, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlatformRecommendation } from "@/components/PlatformRecommendation";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAgent = message.type === 'agent';
  const isSystem = message.type === 'system';

  const ValidationIcon = {
    success: CheckCircle2,
    error: AlertCircle,
    pending: Clock,
    warning: AlertTriangle,
  };

  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isAgent || isSystem ? "justify-start" : "justify-end"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3 shadow-sm",
          isAgent && "bg-card border border-border",
          isSystem && "bg-muted border border-border",
          !isAgent && !isSystem && "bg-primary text-primary-foreground"
        )}
      >
        {isAgent && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
              AI
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              CME Onboarding Advisor
            </span>
          </div>
        )}
        
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>

        {message.recommendation && (
          <div className="mt-4">
            <PlatformRecommendation recommendation={message.recommendation} />
          </div>
        )}

        {message.validation && (
          <div
            className={cn(
              "mt-3 flex items-start gap-2 p-2 rounded-md text-sm",
              message.validation.status === 'success' && "bg-success/10 text-success",
              message.validation.status === 'error' && "bg-destructive/10 text-destructive",
              message.validation.status === 'warning' && "bg-warning/10 text-warning",
              message.validation.status === 'pending' && "bg-muted text-muted-foreground"
            )}
          >
            {message.validation.status && ValidationIcon[message.validation.status] && (
              <>
                {React.createElement(ValidationIcon[message.validation.status], {
                  className: "w-4 h-4 mt-0.5 flex-shrink-0",
                })}
              </>
            )}
            <span className="flex-1">{message.validation.message}</span>
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-2">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};
