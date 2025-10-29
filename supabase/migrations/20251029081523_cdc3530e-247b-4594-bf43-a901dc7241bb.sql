-- Create storage bucket for signed ILA documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('signed-ila-documents', 'signed-ila-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for signed-ila-documents bucket
CREATE POLICY "Users can upload their own signed ILA documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'signed-ila-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own signed ILA documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'signed-ila-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);