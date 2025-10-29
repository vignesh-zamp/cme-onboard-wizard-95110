import React from "react";
import { ChatMessage as ChatMessageType } from "@/types/onboarding";
import { CheckCircle2, AlertCircle, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlatformRecommendation } from "@/components/PlatformRecommendation";
import { FormInput } from "./FormInput";
import { AddressInput } from "./AddressInput";
import { MultiFieldInput } from "./MultiFieldInput";
import { SelectInput } from "./SelectInput";
import { CountryDropdownInput } from "./CountryDropdownInput";
import { EntityRegistrationInput } from "./EntityRegistrationInput";
import { FileUploadInput } from "./FileUploadInput";
import paceLogo from "@/assets/pace-logo.png";

interface ChatMessageProps {
  message: ChatMessageType;
  onFormSubmit?: (value: string | Record<string, string>) => void;
  isLatestMessage?: boolean;
  disabled?: boolean;
  onBack?: () => void;
}

export const ChatMessage = ({ 
  message, 
  onFormSubmit, 
  isLatestMessage = false,
  disabled = false,
  onBack
}: ChatMessageProps) => {
  const isAgent = message.type === 'agent';
  const isSystem = message.type === 'system';

  const ValidationIcon = {
    success: CheckCircle2,
    error: AlertCircle,
    pending: Clock,
    warning: AlertTriangle,
  };

  const handleFormSubmit = (value: string | Record<string, string>) => {
    if (onFormSubmit) {
      // Convert object values to readable string format
      if (typeof value === 'object') {
        const formatted = Object.entries(value)
          .map(([key, val]) => {
            // Convert camelCase to readable format
            const readableKey = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase())
              .trim();
            return `${readableKey}: ${val}`;
          })
          .join('\n');
        onFormSubmit(formatted);
      } else {
        onFormSubmit(value);
      }
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isAgent || isSystem ? "items-start" : "items-end"
      )}
    >
      {isAgent && (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-sm overflow-hidden">
              <img src={paceLogo} alt="Pace" className="w-10 h-10 object-contain" />
            </div>
          </div>
          <span className="text-sm font-medium text-foreground">
            Pace
          </span>
        </div>
      )}

      <div
        className={cn(
          "flex flex-col gap-2 max-w-2xl w-full",
          isAgent && "pl-[60px]",
          !isAgent && !isSystem && "items-end"
        )}
      >

        <div
          className={cn(
            "rounded-2xl px-5 py-4",
            isAgent && "bg-card text-card-foreground shadow-sm",
            isSystem && "bg-yellow-50 border border-yellow-200 text-yellow-900",
            !isAgent && !isSystem && "bg-muted text-foreground whitespace-pre-line"
          )}
        >
          {(() => {
            // Split content by lightbulb emoji to separate main question from insight
            const parts = message.content.split(/💡\s*/);
            const mainContent = parts[0];
            const insightText = parts.length > 1 ? parts.slice(1).join('💡 ') : null;
            
            return (
              <>
                <div 
                  className="text-base leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:hover:opacity-80 whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: mainContent }}
                />
                {insightText && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground italic">
                      <span className="text-base">💡</span>
                      <span className="leading-relaxed">{insightText}</span>
                    </div>
                  </div>
                )}
              </>
            );
          })()}


          {message.recommendation && (
            <div className="mt-4 pt-4 border-t border-border">
              <PlatformRecommendation recommendation={message.recommendation} />
            </div>
          )}

          {/* Inline form inputs for latest agent message */}
          {message.type === "agent" && isLatestMessage && onFormSubmit && (
            <>
              {message.inputType === "text" && (
                <FormInput 
                  onSubmit={handleFormSubmit} 
                  disabled={disabled}
                  placeholder={message.inputFields?.[0]?.placeholder || "Type your answer..."}
                  onBack={onBack}
                  showBackButton={message.showBackButton}
                />
              )}
              {message.inputType === "address" && (
                <AddressInput 
                  onSubmit={handleFormSubmit} 
                  disabled={disabled}
                />
              )}
              {message.inputType === "multifield" && message.inputFields && (
                <MultiFieldInput 
                  fields={message.inputFields as { name: string; placeholder: string; type?: "text" | "email" | "tel" }[]} 
                  onSubmit={handleFormSubmit} 
                  disabled={disabled}
                />
              )}
              {message.inputType === "select" && message.selectOptions && (
                <SelectInput 
                  options={message.selectOptions}
                  onSubmit={handleFormSubmit} 
                  disabled={disabled}
                  placeholder="Select an option..."
                />
              )}
              {message.inputType === "country-dropdown" && (
                <CountryDropdownInput 
                  onSubmit={(values) => handleFormSubmit(`Country: ${values.country}, Cross-Border Operations: ${values.crossBorder}`)}
                  disabled={disabled}
                />
              )}
              {message.inputType === "entity-registration" && (
                <EntityRegistrationInput 
                  onSubmit={(values) => handleFormSubmit(`Legal Name: ${values.legalName}, Jurisdiction: ${values.jurisdiction}`)}
                  disabled={disabled}
                />
              )}
              {message.inputType === "file-upload" && message.fileUploadConfig && (
                <div className="mt-4">
                  <FileUploadInput
                    onFileUpload={(fileUrl) => handleFormSubmit(`SIGNED_ILA_UPLOADED::${fileUrl}`)}
                    label={message.fileUploadConfig.label}
                    acceptedFileTypes={message.fileUploadConfig.acceptedTypes}
                    bucketName={message.fileUploadConfig.bucketName}
                  />
                </div>
              )}
            </>
          )}

          {message.validation && (
            <div
              className={cn(
                "mt-4 pt-4 border-t flex items-start gap-2",
                message.validation.status === 'success' && "border-green-200 text-green-800",
                message.validation.status === 'error' && "border-red-200 text-red-800",
                message.validation.status === 'warning' && "border-yellow-200 text-yellow-800",
                message.validation.status === 'pending' && "border-blue-200 text-blue-800"
              )}
            >
              {message.validation.status && ValidationIcon[message.validation.status] && (
                <div className="flex-shrink-0 mt-0.5">
                  {React.createElement(ValidationIcon[message.validation.status], {
                    className: "w-4 h-4",
                  })}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {message.validation.message}
                </p>
                {message.validation.details && (
                  <p className="text-sm mt-1 opacity-80">
                    {message.validation.details}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {message.timestamp && (
          <span className="text-xs text-muted-foreground px-1">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        )}
      </div>
    </div>
  );
};
