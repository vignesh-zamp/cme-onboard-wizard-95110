
-- Migration: 20251024074107
-- Create storage bucket for knowledge base files
INSERT INTO storage.buckets (id, name, public)
VALUES ('knowledge-base', 'knowledge-base', false);

-- Allow authenticated users to read KB files
CREATE POLICY "Allow authenticated users to read KB files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'knowledge-base');

-- Allow only service role to upload/manage KB files (admin only)
CREATE POLICY "Only service role can manage KB files"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'knowledge-base');

-- Migration: 20251027103058
-- Enable uploads to knowledge-base bucket
CREATE POLICY "Allow uploads to knowledge-base bucket"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'knowledge-base');

-- Allow reading from knowledge-base bucket
CREATE POLICY "Allow reading from knowledge-base bucket"
ON storage.objects
FOR SELECT
USING (bucket_id = 'knowledge-base');

-- Allow updates to knowledge-base bucket
CREATE POLICY "Allow updates to knowledge-base bucket"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'knowledge-base')
WITH CHECK (bucket_id = 'knowledge-base');

-- Allow deletes from knowledge-base bucket
CREATE POLICY "Allow deletes from knowledge-base bucket"
ON storage.objects
FOR DELETE
USING (bucket_id = 'knowledge-base');

-- Migration: 20251029081522
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
