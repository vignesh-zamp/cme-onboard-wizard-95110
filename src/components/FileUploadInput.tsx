import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileCheck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FileUploadInputProps {
  onFileUpload: (fileUrl: string) => void;
  label?: string;
  acceptedFileTypes?: string;
  bucketName?: string;
}

export const FileUploadInput = ({
  onFileUpload,
  label = "Upload Signed Document",
  acceptedFileTypes = ".pdf,.doc,.docx",
  bucketName = "signed-ila-documents",
}: FileUploadInputProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in to upload files");
        return;
      }

      // Create a unique file path
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload file. Please try again.");
        return;
      }

      const { data: publicData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      setUploadedFile(file.name);
      toast.success("✓ Signature verification completed", {
        description: "Your signed ILA document has been uploaded successfully.",
      });
      onFileUpload(publicData.publicUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={acceptedFileTypes}
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : uploadedFile ? (
            <FileCheck className="h-8 w-8 text-green-600" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">
            {uploadedFile ? uploadedFile : label}
          </span>
          {!uploadedFile && (
            <span className="text-xs text-muted-foreground">
              PDF, DOC, or DOCX (max 10MB)
            </span>
          )}
        </label>
      </div>

      {uploadedFile && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setUploadedFile(null);
            const input = document.getElementById(
              "file-upload"
            ) as HTMLInputElement;
            if (input) input.value = "";
          }}
          className="w-full"
        >
          Upload Different File
        </Button>
      )}
    </div>
  );
};
