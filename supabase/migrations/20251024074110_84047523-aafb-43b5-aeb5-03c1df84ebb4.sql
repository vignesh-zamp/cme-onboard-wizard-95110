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