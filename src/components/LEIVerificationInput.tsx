import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface LEIData {
  legalName: string;
  address: string;
  registrationId: string;
  entityStatus: string;
  leiCode: string;
  leiStatus: string;
  renewalDate: string;
  managingLou: string;
}

interface LEIVerificationInputProps {
  onSubmit: (lei: string, data: LEIData) => void;
}

export const LEIVerificationInput = ({ onSubmit }: LEIVerificationInputProps) => {
  const [lei, setLei] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifiedData, setVerifiedData] = useState<LEIData | null>(null);

  const handleVerify = async () => {
    if (lei.length !== 20) {
      setError("LEI must be exactly 20 characters");
      return;
    }

    setLoading(true);
    setError("");
    setVerifiedData(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('verify-lei', {
        body: { lei: lei.toUpperCase() }
      });

      if (functionError) throw functionError;

      if (data.success) {
        setVerifiedData(data.data);
      } else {
        setError(data.error || "Failed to verify LEI");
      }
    } catch (err) {
      console.error('Error verifying LEI:', err);
      setError("Failed to verify LEI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (verifiedData) {
      onSubmit(lei.toUpperCase(), verifiedData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={lei}
          onChange={(e) => {
            setLei(e.target.value.toUpperCase());
            setError("");
            setVerifiedData(null);
          }}
          placeholder="Enter 20-character LEI code"
          maxLength={20}
          className="flex-1"
          disabled={loading}
        />
        <Button 
          onClick={handleVerify} 
          disabled={loading || lei.length !== 20}
          variant="outline"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify'
          )}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {verifiedData && (
        <Card className="p-4 space-y-3 bg-primary/5 border-primary/20">
          <div className="flex items-center gap-2 text-primary font-medium">
            <CheckCircle2 className="h-5 w-5" />
            <span>LEI Verified Successfully</span>
          </div>
          
          <div className="grid gap-2 text-sm">
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <span className="font-medium">Legal Name:</span>
              <span>{verifiedData.legalName}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <span className="font-medium">LEI Code:</span>
              <span className="font-mono">{verifiedData.leiCode}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <span className="font-medium">Status:</span>
              <span className="inline-flex items-center gap-1">
                <span className={verifiedData.leiStatus === 'ISSUED' ? 'text-green-600' : ''}>
                  {verifiedData.leiStatus}
                </span>
              </span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <span className="font-medium">Entity Status:</span>
              <span>{verifiedData.entityStatus}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <span className="font-medium">Legal Address:</span>
              <span>{verifiedData.address}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <span className="font-medium">Registration ID:</span>
              <span>{verifiedData.registrationId}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <span className="font-medium">Renewal Until:</span>
              <span>{verifiedData.renewalDate}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-2">
              <span className="font-medium">Managing LOU:</span>
              <span>{verifiedData.managingLou}</span>
            </div>
          </div>

          <Button onClick={handleConfirm} className="w-full mt-4">
            Continue with this LEI
          </Button>
        </Card>
      )}
    </div>
  );
};
